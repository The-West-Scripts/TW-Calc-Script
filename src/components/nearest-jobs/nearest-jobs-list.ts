import { CatchErrors } from '../error-tracker/catch-errors';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { NearestJobs } from './nearest-jobs';
import { TheWestWindow } from '../../@types/the-west';

export class NearestJobsList {
    constructor(
        private readonly nearestJobs: NearestJobs,
        private readonly window: TheWestWindow,
        private readonly language: Language,
        private readonly logger: Logger,
        public readonly errorTracker: ErrorTracker,
    ) {}

    @CatchErrors('NearestJobsList.appendTo')
    appendTo(element: JQuery.ClickEvent<HTMLElement>): void {
        const selectBox = new this.window.west.gui.Selectbox()
            .setHeader(this.language.getTranslation(152))
            .setWidth(275);
        selectBox.divMain.find('.arrow').remove();

        // add edit list item
        selectBox.addItem(0, this.language.getTranslation(150));

        const jobList = this.nearestJobs.getJobList();
        jobList.forEach(jobId => {
            const job = this.window.JobList.getJobById(jobId);
            if (!job) {
                this.logger.warn(`There is a job saved in the job list which does not exist! (jobId: ${jobId})`);
                return;
            }
            selectBox.addItem(jobId, job.name);
        });

        selectBox.addListener(id => {
            if (id) {
                this.nearestJobs.search(id);
            } else {
                this.nearestJobs.dialog.open();
            }
        });

        selectBox.show(element);
    }
}
