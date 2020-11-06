import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { NearestJobs } from './nearest-jobs';
import { TheWestWindow } from '../../@types/the-west';

export class NearestJobsDialog {
    constructor(
        private readonly nearestJobs: NearestJobs,
        private readonly window: TheWestWindow,
        private readonly language: Language,
        private readonly logger: Logger,
    ) {}

    open(): void {
        this.logger.log('opening nearest jobs dialog...');
        const dialogDiv = this.window.$(`<div></div>`);
        const jobsDiv = this.window.$(`<div style="width: 615px; height: 325px"></div>`);
        dialogDiv.append(jobsDiv);

        new this.window.west.gui.Dialog(this.language.getTranslation(152), dialogDiv)
            .addButton(this.language.getTranslation(149), () => {
                // show reset confirm dialog
                new this.window.west.gui.Dialog(this.language.getTranslation(148), this.language.getTranslation(146))
                    .addButton(this.language.getTranslation(149), () => this.nearestJobs.reset())
                    .addButton(this.language.getTranslation(92), () => undefined)
                    .show();
            })
            .addButton(this.language.getTranslation(147), () => undefined)
            .show();

        const scrollPane = new this.window.west.gui.Scrollpane();

        this.window.JobList.getSortedJobs('id').forEach(job => {
            const inList = this.nearestJobs.isInJobList(job.id);
            const jobDiv = this.window.$(
                `<div class="job tw-calc-job" style="position: relative !important; display: inline-block !important; opacity: ${
                    inList ? 1 : 0.5
                }"></div>`,
            );
            jobDiv.attr('title', this.nearestJobs.getJobPopup(job.id));
            jobDiv.attr('data-job-id', job.id);
            jobDiv.on('click', () => this.add(job.id, jobDiv));
            jobDiv.append(`<img alt="${job.name}" src="/images/jobs/${job.shortname}.png" class="job_icon" /></div>`);

            scrollPane.appendContent(jobDiv);
        });

        jobsDiv.append(scrollPane.getMainDiv());

        const textField = new this.window.west.gui.Textfield()
            .setId('TWCalc_NearestJobDialog_Search')
            .setWidth(600)
            .setPlaceholder(this.language.getTranslation(151))
            .getMainDiv();

        $(dialogDiv).append($(`<div style="margin: 4px 0"></div>`).append(textField));

        $(textField).on('keyup', el => {
            const query = ((el.target && $(el.target).val()) || '').toString();
            this.search(jobsDiv, query);
        });
    }

    private add(jobId: number, el: JQuery): void {
        this.logger.log('add new job to list...', jobId);
        const data = this.nearestJobs.getJobList();
        const isSelected = Number(el.css('opacity')) === 1;

        if (isSelected) {
            data.splice(data.indexOf(jobId), 1);
            el.css('opacity', '0.5');
        } else if (data.indexOf(jobId) === -1) {
            data.push(jobId);
            el.css('opacity', '1');
        }

        this.nearestJobs.setJobList(data);
    }

    private search(jobsDiv: JQuery, query: string | undefined): void {
        this.logger.log('filtering by query...', query);
        const jobElements = $('.job', jobsDiv);
        jobElements.hide();

        const jobs = this.window.JobList.getSortedJobs('id');
        jobs.forEach(job => {
            if (query && job.name.toLowerCase().search(query.toLowerCase()) == -1) {
                return;
            }
            $(`.job[data-job-id=${job.id}]`, jobsDiv).show();
        });
    }
}
