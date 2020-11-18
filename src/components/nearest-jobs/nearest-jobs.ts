import { CatchErrors } from '../error-tracker/catch-errors';
import { Component } from '../component.types';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { Job, MapAjaxResponse, TheWestWindow } from '../../@types/the-west';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { NearestJobsBar } from './nearest-jobs-bar';
import { NearestJobsBarPosition } from './nearest-jobs.types';
import { NearestJobsDialog } from './nearest-jobs-dialog';
import { NearestJobsList } from './nearest-jobs-list';
import { SettingNumber } from '../settings/settings.types';
import { Settings } from '../settings/settings';
import { Storage } from '../storage/storage';
import { StorageKey } from '../storage/storage.types';

@singleton()
export class NearestJobs implements Component {
    public readonly dialog: NearestJobsDialog;
    public readonly bar: NearestJobsBar;
    public readonly list: NearestJobsList;

    private map?: MapAjaxResponse;
    private onJobListChangeCallbacks: Array<(jobList: Array<number>) => void> = [];

    constructor(
        @inject('window') private window: TheWestWindow,
        private readonly settings: Settings,
        private readonly storage: Storage,
        private readonly logger: Logger,
        private readonly language: Language,
        public readonly errorTracker: ErrorTracker,
    ) {
        this.dialog = new NearestJobsDialog(this, window, language, this.logger);
        this.bar = new NearestJobsBar(this, window, settings);
        this.list = new NearestJobsList(this, window, language);
    }

    @CatchErrors('Birthday.init')
    init(): void {
        // nearest job bar is hidden
        if (this.settings.get(SettingNumber.NearestJobsBar) === 4) {
            return;
        }
        // fetch the map at the initialization
        this.getMap();
    }

    search(jobId: number): void {
        this.addTask(jobId, {
            type: 'window',
        });
    }

    start(jobId: number, duration: number): void {
        this.addTask(jobId, {
            type: 'startJob',
            duration: duration,
        });
    }

    addTask(jobId: number, taskType: { type: 'startJob'; duration: number } | { type: 'window' }): void {
        this.getMap(map => {
            const jobPosition = this.find(jobId, map);
            if (!jobPosition) {
                this.logger.error('Unable to find the nearest job!', jobId, map, jobPosition);
                return this.window.MessageError('Unable to find the nearest job!');
            }

            if (taskType && taskType.type === 'startJob') {
                const taskJob = new this.window.TaskJob(jobId, jobPosition.x, jobPosition.y, taskType.duration);
                return this.window.TaskQueue.add(taskJob);
            }

            return this.window.JobWindow.open(jobId, jobPosition.x, jobPosition.y);
        });
    }

    onJobListChange(callback: (jobList: Array<number>) => void): void {
        this.onJobListChangeCallbacks.push(callback);
    }

    reset(): void {
        this.storage.remove(StorageKey.jobList);
        this.onJobListChangeCallbacks.forEach(callback => callback([]));
    }

    isInJobList(jobId: number): boolean {
        return this.getJobList().indexOf(jobId) !== -1;
    }

    getJobList(): Array<number> {
        if (!this.storage.has(StorageKey.jobList)) {
            return [];
        }
        return this.storage.getString(StorageKey.jobList).split(',').map(Number);
    }

    setJobList(jobList: Array<number>): void {
        this.logger.log('saving nearest job list...', jobList);
        if (jobList.length) {
            this.storage.setString(StorageKey.jobList, jobList.join(','));
        } else {
            this.storage.remove(StorageKey.jobList);
        }
        this.onJobListChangeCallbacks.forEach(callback => callback(jobList));
    }

    getJobPopup(jobId: number): string {
        const job = this.window.JobList.getJobById(jobId);
        try {
            if (this.window.ItemManager.isLoaded()) {
                return this.window.Map.PopupHandler.getJobPopup(job);
            }
        } catch (_) {
            // pass
        }
        return this.window.JobList.getJobById(jobId).name;
    }

    find(jobId: number, map: MapAjaxResponse): { x: number; y: number; distance: number } | null {
        const lastPosition = getPlayerLastPosition(this.window);
        if (!lastPosition) {
            return null;
        }
        return findNearestJob(this.window.JobList.getJobById(jobId), lastPosition, map);
    }

    isPosition(position: 'up' | 'down' | 'right'): boolean {
        const settings = this.settings.get(SettingNumber.NearestJobsBar);
        if (position === 'down') {
            return settings === NearestJobsBarPosition.down || settings === NearestJobsBarPosition.downTransparent;
        } else if (position === 'up') {
            return settings === NearestJobsBarPosition.up;
        }
        return settings === NearestJobsBarPosition.right;
    }

    private getMap(cb?: (map: MapAjaxResponse) => void, showUserMessage = false): void {
        if (typeof this.map !== 'undefined') {
            return cb?.(this.map);
        }

        if (showUserMessage) {
            new this.window.UserMessage(this.language.getTranslation(143), 'success').show();
        }

        this.window.Ajax.get<MapAjaxResponse>('map', 'get_minimap', {}, (data): void => {
            if (data.error) {
                return new this.window.UserMessage('Unable to fetch the map!').show();
            }
            this.map = data;
            cb?.(data);
        });
    }
}

function getPlayerLastPosition(window: TheWestWindow): { x: number; y: number } | null {
    const { position } = window.Character;
    const { queue } = window.TaskQueue;

    return queue.reduce<{ x: number; y: number } | null>(
        (lastPosition, task) => {
            const wayData = task.wayData;
            if (wayData.x && wayData.y) {
                return { x: wayData.x, y: wayData.y };
            }
            return lastPosition;
        },
        { x: position.x, y: position.y },
    );
}

function findNearestJob(
    job: Job,
    lastPosition: { x: number; y: number },
    map: MapAjaxResponse,
): { x: number; y: number; distance: number } | null {
    const jobGroup = map.job_groups[job.groupid];
    if (!jobGroup) {
        return null;
    }
    const jobs: Array<{ x: number; y: number; distance: number }> = [];

    for (let o = 0; o < jobGroup.length; o++) {
        const a = jobGroup[o][0] - lastPosition[0];
        const b = jobGroup[o][1] - lastPosition[1];
        const distance = Math.sqrt(a * a + b * b);
        jobs.push({
            distance,
            x: jobGroup[o][0],
            y: jobGroup[o][1],
        });
    }

    jobs.sort((e, t) => {
        return e.distance > t.distance ? 1 : -1;
    });

    return jobs[0];
}
