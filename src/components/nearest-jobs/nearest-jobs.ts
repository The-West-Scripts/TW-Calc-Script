import { CatchErrors } from '../error-tracker/catch-errors';
import { Component } from '../component.types';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { Job, JobViewWindowXHRResponse, MapAjaxResponse, TheWestWindow } from '../../@types/the-west';
import { jobListMonkeyPatch } from './job-list-patch';
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
        this.bar = new NearestJobsBar(this, window, settings, language, this.errorTracker);
        this.list = new NearestJobsList(this, window, language, this.errorTracker);
    }

    @CatchErrors('NearestJobs.init')
    init(): void {
        // monkey patch job list
        jobListMonkeyPatch(this.window);
        // the nearest job bar is hidden
        if (this.settings.get(SettingNumber.NearestJobsBar) === 4) {
            return;
        }
        // fetch the map at the initialization
        this.getMinimap();
    }

    @CatchErrors('NearestJobs.openNearestJobWindowByProductId')
    openNearestJobWindowByProductId(itemId: number): void {
        this.getMinimap(map => {
            this.errorTracker.execute(() => {
                this.logger.log(`finding the best nearby job for item = ${itemId}`);
                const { JobList, MessageError } = this.window;
                const lastPosition = getPlayerLastPosition(this.window);
                if (!lastPosition) {
                    return MessageError("Unable to get player's latest position!");
                }
                // get job is for that item
                const jobIds = JobList.getJobsIdsByItemId(itemId);
                // based on that job ids get data of those jobs nearest to the player
                const jobPromiseList: Array<Promise<JobViewWindowXHRResponse>> = [];
                jobIds
                    .map(jobId => JobList.getJobById(jobId))
                    .forEach(job => {
                        const nearestJob = findNearestJob(job, lastPosition, map);
                        if (!nearestJob) {
                            return;
                        }
                        jobPromiseList.push(this.getJobWindow(job.id, { x: nearestJob.x, y: nearestJob.y }));
                    });
                if (!jobPromiseList.length) {
                    throw new Error('Unable to find nearby jobs!');
                }
                const jobs = Promise.all(jobPromiseList);
                jobs.then(jobViews => {
                    this.logger.log(`found nearby job views for item = ${itemId}`, jobViews);
                    this.errorTracker.execute(() => {
                        let bestLuck = -Infinity;
                        let bestJobIndex = -1;
                        // find job with best luck for that item
                        jobViews.forEach((jobView, index) => {
                            const luck = getJobProductLuck(jobView, itemId);
                            // the item id is not optainable from the job, this case should not happen
                            if (luck === false) {
                                return;
                            }
                            if (luck > bestLuck) {
                                bestLuck = luck;
                                bestJobIndex = index;
                            }
                        });
                        // finally open the window!
                        const bestJobView = jobViews[bestJobIndex];
                        this.logger.log(`found best job for item = ${itemId}`, bestJobView);
                        this.addTaskOrShowJobWindow(bestJobView.id, { type: 'window' });
                    });
                });
            });
        });
    }

    /**
     * Fetch minimap data if not fetched already.
     * @param callback to call when the data are fetched
     * @param showUserMessage
     */
    @CatchErrors('NearestJobs.getMinimap')
    getMinimap(callback?: (map: MapAjaxResponse) => void, showUserMessage = false): void {
        if (typeof this.map !== 'undefined') {
            return callback?.(this.map);
        }

        if (showUserMessage) {
            new this.window.UserMessage(this.language.getTranslation(143), 'success').show();
        }

        this.window.Ajax.get<MapAjaxResponse>('map', 'get_minimap', {}, (data): void => {
            if (data.error) {
                return new this.window.UserMessage('Unable to fetch the map!').show();
            }
            this.map = data;
            callback?.(data);
        });
    }

    @CatchErrors('NearestJobs.startNearestJob')
    startNearestJob(jobId: number): void {
        this.start(jobId, 3600);
    }

    search(jobId: number): void {
        this.addTaskOrShowJobWindow(jobId, {
            type: 'window',
        });
    }

    /**
     * Start a job.
     * @param jobId
     * @param duration in seconds
     */
    start(jobId: number, duration: number): void {
        this.addTaskOrShowJobWindow(jobId, {
            type: 'startJob',
            duration: duration,
        });
    }

    getJobWindow(jobId: number, coordinates: { x: number; y: number }): Promise<JobViewWindowXHRResponse> {
        return new Promise(resolve => {
            this.window.Ajax.remoteCallMode<JobViewWindowXHRResponse>(
                'job',
                'job',
                { jobId, x: coordinates.x, y: coordinates.y },
                jobView => {
                    resolve(jobView);
                },
            );
        });
    }

    addTaskOrShowJobWindow(jobId: number, taskType: { type: 'startJob'; duration: number } | { type: 'window' }): void {
        this.getMinimap(map => {
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

function getJobProductLuck(job: JobViewWindowXHRResponse, productId: number): number | false {
    const jobDurations = job.durations[2]; // 2 = is one-hour job chance
    const jobProduct = jobDurations.items.find(item => item.itemid === productId);
    if (!jobProduct) {
        return false;
    }
    return jobProduct.prop + jobProduct.probBonus;
}
