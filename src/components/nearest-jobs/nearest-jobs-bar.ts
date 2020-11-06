import { Job, TheWestWindow } from '../../@types/the-west';
import { NearestJobs } from './nearest-jobs';
import { NearestJobsBarPosition } from './nearest-jobs.types';
import { SettingNumber } from '../settings/settings.types';
import { Settings } from '../settings/settings';

export class NearestJobsBar {
    constructor(private nearestJobs: NearestJobs, private window: TheWestWindow, private settings: Settings) {}

    appendTo(element: JQuery): void {
        let mainDiv = this.getMainDiv();
        element.append(mainDiv);

        this.nearestJobs.onJobListChange(() => {
            // remove old div
            mainDiv.remove();
            // replace it with new one
            mainDiv = this.getMainDiv();
            // append it to content
            element.append(mainDiv);
        });
    }

    private getMainDiv(): JQuery {
        const scrollPane = new this.window.west.gui.Scrollpane();
        scrollPane.verticalBar.hide();

        const bar = $(
            `<div style="width: 510px; height: 61px; margin-left: auto; margin-right: auto; text-align: left;"></div>`,
        );

        if (this.settings.get(SettingNumber.NearestJobsBar) === NearestJobsBarPosition.down) {
            bar.css({
                background: 'rgba(29, 28, 28, 0.8)',
                border: '1px solid rgb(100, 100, 100)',
                'border-radius': '2px',
                'box-shadow': 'rgb(0, 0, 0) 0px 0px 1px 1px',
                'padding-left': '5px',
            });
        }

        const list = this.nearestJobs.getJobList();
        list.forEach(jobId => {
            const job = this.window.JobList.getJobById(jobId);

            const jobDiv = this.window.$(
                `<div class="job tw-calc-job" style="position: relative !important; display: inline-block !important; margin-top: 5px; margin-bottom: 2px;"></div>`,
            );
            const jobOverlay = this.window.$(`<div class="featured"></div>`);
            jobOverlay.attr('title', this.nearestJobs.getJobPopup(jobId));
            jobOverlay.on('click', () => {
                this.nearestJobs.search(jobId);
            });
            jobDiv.append(jobOverlay);

            if (this.window.Premium.hasBonus('automation')) {
                jobDiv.append(this.getJobStartBtn(job, 'short', 15));
                jobDiv.append(this.getJobStartBtn(job, 'middle', 600));
                jobDiv.append(this.getJobStartBtn(job, 'long', 3600));
            }

            jobDiv.append(`<img alt="${job.name}" src="/images/jobs/${job.shortname}.png" class="job_icon" /></div>`);
            scrollPane.appendContent(jobDiv);
        });

        bar.append(scrollPane.getMainDiv());

        return bar;
    }

    private getJobStartBtn(job: Job, className: string, duration: number): JQuery {
        const jobStartBtn = $(`<div class="instantwork-${className}" title="15s - ${job.name}"></div>`);
        jobStartBtn.on('click', () => {
            this.nearestJobs.start(job.id, duration);
        });
        return jobStartBtn;
    }
}
