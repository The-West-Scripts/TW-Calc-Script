import { TheWestWindow } from '../../@types/the-west';

export interface HiddenTasksWindow extends TheWestWindow {
    hidTasks?: Record<number, any>;
}

/**
 * Path the original game so job list get items returns hidden items.
 * @param window
 */
export function jobListMonkeyPatch(window: TheWestWindow): void {
    const { $ } = window;
    // TODO: move this to repository or host in on tw-calc.net
    $.getScript('https://tomrobert.safe-ws.de/hidTasks.js');
    jobListDropsItemPatch(window);
    jobListGetJobsIdsByItemIdPatch(window);
}

function jobListDropsItemPatch(window: HiddenTasksWindow): void {
    const { JobList } = window;
    const originalFn = JobList.dropsItem;
    JobList.dropsItem = function (itemId: number) {
        return (window.hidTasks && !!window.hidTasks[itemId / 1000]) || originalFn.apply(this, [itemId]);
    };
}

function jobListGetJobsIdsByItemIdPatch(window: HiddenTasksWindow): void {
    const { JobList, ItemManager } = window;
    const originalFn = JobList.getJobsIdsByItemId;
    JobList.getJobsIdsByItemId = function (itemId: number) {
        const hidItemTasks = window['hidTasks'] && window['hidTasks'][itemId / 1000];
        if (hidItemTasks && ItemManager.get(itemId).spec_type != 'mapdrop') {
            const jobs: Array<number> = [];
            // Nod idea how it is working, need to reverse engineer that later (and fix the structure of hidItems)
            for (const jobId in hidItemTasks) {
                if (hidItemTasks.hasOwnProperty(jobId) && Number(jobId) <= 205) {
                    jobs.push(Number(jobId));
                }
            }
            return jobs;
        }
        return originalFn.apply(this, [itemId]);
    };
}
