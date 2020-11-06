import { Language } from '../language/language';
import { NearestJobs } from './nearest-jobs';
import { TheWestWindow } from '../../@types/the-west';

export class NearestJobsList {
    constructor(private nearestJobs: NearestJobs, private window: TheWestWindow, private language: Language) {}

    appendTo(element: JQuery.ClickEvent<HTMLElement>): void {
        const selectBox = new this.window.west.gui.Selectbox()
            .setHeader(this.language.getTranslation(152))
            .setWidth(275);
        selectBox.divMain.find('.arrow').remove();

        // add edit list item
        selectBox.addItem(0, this.language.getTranslation(150));

        const jobList = this.nearestJobs.getJobList();
        jobList.forEach(jobId => {
            selectBox.addItem(jobId, this.window.JobList.getJobById(jobId).name);
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
