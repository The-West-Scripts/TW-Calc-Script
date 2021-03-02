import { CatchErrors } from '../error-tracker/catch-errors';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { Job, TheWestWindow } from '../../@types/the-west';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { NearestJobs } from './nearest-jobs';
import { NearestJobsBarPosition } from './nearest-jobs.types';
import { SettingNumber } from '../settings/settings.types';
import { Settings } from '../settings/settings';

const plusIcon =
    'iVBORw0KGgoAAAANSUhEUgAAAEMAAABDCAMAAADwFEhBAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAL9UExURQAAAAMAAAcEAwUCAgUCAgMAAAQBAQMAAAMAAAMAAAMAAAUCAQMBAAMAAAQBAQUCAgQBAAMAAAQBAQMAAAYDAgYDAgMAAAMAAAMAAHZcU2VPRREMCINgXbaimCogG2ZJRk88MiAXFB4TDjMnIg0IBSIZFBUNCEU3KDgqHyMbElNBOWpRTDoqJUg4MVRAOTYnGkouG6KBc2NCJs+2n3RiT2hVSiUdGDMjGlNBJS4iFzYmF6qUjoRpWishHFxJPnBcUF1GM62Me452YKqTf0o4N15LPkk5MMi0pIdvXWNQSEIyIyAbGKOMcL6biZh3bIdwZMyslHpgK4RuXk48M72Mg39YUb2Mhc2mkmtlVFtHPg4KCGxVSqaZfKOWeJ+SdaSYeZ+WdaaZeGmQK46CaGyUMHCYNHScOXegPHukQUdBNGWMKHJoUlZ8F5yPci8mHmddTFF2EIl+ZUk3LnCFOExDN6WYe1FJO4J1XmuAM1FBODw1LHxyW1+HImN4KlpDPUQ+MJK9W11VRFlQQY++TqCTd3huWFE8N4CqR6OWdVRNPkM1LUM4LzgwKDkrKGxkUIZ8YqmZfJmMbpyPdZmPcpGFajUpJUIvLCkgGoN4YYu2UXxnWLWbf5OJbGFYR1lJQF9FQmlUTHZjUYJrXIWvS2V6LFuBHJh+aU8wHUs9NlM/P29aUTwpHW5URCEbFY9taZaJbnVrVpaMbk5GOH90XUAzK0k5NUItIV9MRYx+ZXxaWlA6M1w8JoFnUI64V4iyUE5zDUtwC5XAX0drBpl/dWVbR0s2NFtCNG1OSbWfiIlhYYJpY6GWd5mMclQ6LD4vKUw4KXVQTo50XnRWUWFKOI92bYlxYTglFp2DbqaIeHWGPaLQaFN2FWuUK52SdGJSR4xoXnRaSXViTHttW5Z2ZH6JSWlPPn9eTqaObn1hWGBLP4tqUrKXdoZuZnFNL5yEd1BwEmFbR0Q+NJ+MgMWkhZF9cqDNZp+PdWZCQYx7VMq9tr2sq2WMJ5aFWKaWgoOFTKjYpjkAAABcdFJOUwAiPEgoGi4GFA6RjJc0cEJofE5iV6Bcg3b+/bX+/Fr+nt7Qeqvtwa3itPHZ7dvE7PX5/fXav5Py3MfV/vWn3avv3e/xJBBMyi6X8PbzpRrMafaBefz8Yu0GcHz06vg14gAACfJJREFUWMOdmAdUWlkaxyMg2MXeSzTV9N4nPZPMzuzstC3nvPeAvG0sAoEoBNzgwiCDIBpR0VjRbOwVe9lqd2KJJZp1E9PLpJepu3vO3vd4gCmmzN+j5/Dw/s7/++53v3vvmzfvlaKZNe/Haf/BA786tGHZsvUbwj8JpTo4vjXolwc/fjdk+/bOzur7nePVawKiVkaS3g7z05+9u+7T70MmqzsHjNX9/QPgNzh4fKXbm7vBCHeufrptqnLi7kDY6EhwdWtYWNjAturgdyLfjLL/57vX5eT05YT8MHXpfy3G0da7wY/Hy1TdAZ3lA63VyyIpgPIaxMEPfpHzJOcOoPxwdSxGmlmVyZMm5hsMurLWsrKCkZnPVnrav9rK/o93P7l55785T24WK6SZvKT4eDabHcNma6UZkuay7u6yb7/t37WR+ior+z5YVzx5s+/mncfxVUlgeEyMySRKTBSJRCaTKV7aaCyQhYX1hi0mzW1l3841ndn3+76f0vKkj9gmU6JCntfV1cXnd+XlKRQiE7u0tbd1ZGQ8ZKe7vcPLIfvC9/YH3yqeGuBJ49kmkULelZxcmxAHlJDA4STz5QqRRNXbP2qcPLOYbPdSCC18z9StW+WTbB5O4CfXxmUJUIEARVvQlpSsuDgOn69IlIzO3EBzchaTXgoJ3ZMzdWugWIqZSExOSckSCATpdfq0um/S0upyc2tyc9HaZLnCdKnjbMfN7eGuAPI8gvLhur6pmWodyIQoLzkdghiQUq9PTb2AcBFEjyAQrlq+XD42dr1jcn0k1f752aEdCumbLASIeLaIH2ceADG4EAQjagSBYeIJlADSUjR+O3vN+tAXIOS9xWfTs7XS+JhEvhiyCmYyIBbL9hlCQVoKz/Z8dXbNYndQsrMRDhtyisUTJlAUiQ85AtsQJQtmMoEP64MagZjDr7x6/Ubf+sjnUhL6/neFRYU84OIhR1xjGXDt8L9xHb5mZSDpaD1HXlxZCYyQn4nGYUPfd5cLpVqQTk4WmmYZcP7rf+H6+s+xlkdfKlNRMefypcrKq+9EkiizjBx4f9vVQmMSWyRPjhOkKq2MfxCyMRgXuLmCuOSOmZ7egB2es4zQdhaPFxkbQCRdCYIzaUwr40+EbAwmDMJJiSucaTMErKC724zY7+koLMpOYpvkHDF6hoswiAFHX2QwYITLTRdzZoy6gignb2CEsBG69/LliXxtjCK5HtXb5gA6/xdCVsYJCHyt1KP1o/2ytsAgOskyNQ6Htk0UFUnjTXkccTooTKYlmKMnCeEMRAkrEWymkVS0PqBfVta6wplMJRiUD0Me378rjVHw69EzShiyOjn6V0I4QwmzzPUGw3UoJ7igOyBqqberOau0A7tDQkIGpDFyMK96JsyC1Qwz5ugpQmYfMIPBYMJqBGbqcxMCRlTNUVt8iazSPtn+9GmnUSt6mJCSewHYuHaU0PSpL3CdenAMfDoG/oBiA/+A6NPFASMGSf4SOgjGEW8cgeXNtx/FJ/Lj0DQYZkCnT35u1skvCFkefH4aZBWEA+vR7BGDULHcHwsGMBxXGpvLLyaxFcliNA1kjBH9+zkVDZYwkwkzuWjRZ20aodDDl2QHEkJzXDYaWF6UxJbXptTo1TATjv7dnIpWI0w1DKvT0rNv9A4KhX5eeEJoDssKVLJyKVvOScnlwiwWHP3bORXNwGoEioVrsmfutRt0znQywQhWCWVJ7DxQ5zA2/dO/mVPToEqB0lIF2QE9g+2Dzm54hdAcNrS2CVU6wGhJ1QMf0PSv59Q0CJXFYDERQflE0+Da96yM8N4ClTCDnVebUgcyymROH55TR1gsBraa4KzCoqHh9lVWRmRUQYEwI15eK6jhwqBpTf/nD3PpCFgJIFokLeFSduWl4SVWRugKmaxRJwWx1CHQiRPQtWOEHvyR0APLk2vga/ADK2svXW+v3BVhyakjaaVKotLoFJysXKw+rO2DcdzCOG7pBkqQdLD6kbrkQklTxapFfkQLcbQLl6hkqqRE0Em/gWc1ccbx04SsDBjfZ1gwKqhsaqqYv8DDyx1f/Y72oYGqUmMjmy9GU2d1D8CIJmRlgDXLwEpV3NLTNLxpkYu/uU5BQlzf6RHK8jVdCVitq1/JAJsepIbP1BdW8M6tXuDs5mnuZDQHu/Ch6zJhgwgUO8KEZzGOELIxECYLhuGss8KqqqqtLn5eZKKjgmCiAo0ajRb0oFQk9pWMXGzjTL3SwcusWL3UCQvFzKA5UBf3CDVJUlGCoE45Ox9/I2RjxMKgpWYVA0b7Zh9rKHgw3sslGp1G01WffmE24++EbAyQED1aNHGvqWLtUicPL9vm4GjvulQjbDDkS2oFqTZG7Pl/Ejpve8hlIuKnbSUlH2E2LO0UN0LxXlJapmmTJCags3IKFg/W+hixsyY8Ny2u8waPV/IRZoNs26NowIhzqXBIZyhViOvTrXureRoYLLUNgrZcKQ64Pty+eouLM2iEdrZNGxghbxkbztAJJfLhtYQTJoSVEyh+tXXjg1o4/LMdPWurzm31wWxQZ51AgBGq1+YeIU+olcQ3DYrxlQEaBcQyH4FYFiOVeZMdTSXtVasWuPi5ec62gU8NaeMSjUaok+Rrz5nk/JQzCOg1EAPb19QwC/kSp1zm3C8ea+/4amEQiMTXnfLMGQYzQt7xXv5wQ2lp4yOwW6WkYsWEME+w4BMnQG9jqhlK7pXsq5Xtmbx7u4Jc8EieO5BhafXcseTi7QZtfkFZMz+uDmHFwhhFjXcdGEoXF01kD1WUVGUuwRB0zxdPl1g03htXjGkamwcLWu9e4cS1pHOxg1gsaBncmpQrhYGVbWMlFSX31u9wcfKje5NePKDSHB0oGIQdI2oLEzZ3jgfUczhXsrJSBFniBA7faLwly+SdKzm3eusCgHDzJr3sImOGeAQtv63TZBhUpeXZF/NFFy8ay8ubVY0yia5k7RBYaAsX+WCBvByBpwRA6C5bFxq6DTJJo0SiEuXLCkZl3brMzCZeRcnw4KoIYMIZ5IJEsX/5HQaHeHp5LIhYrgoskDVrSxt1PE1zRqYus6KJ11SxKSLIBcTh7+VJmvtGBsKxcyX7uvn5LJq/XCUbbBzSasoMGTxd0+pNCzdvWeCCm/AlgxmZ+yaFQajAipuHU1DE/FUZQ5puFa+q6icL50cEgTwAgpuvJ4lq98p7IY3mYE9xdff2wrxEzF+4SWtoAIT5i4J8nJz9/N28PN1dKfavu58CKxjF05fu7+Hs5OLigwkPwp/uixNefzkFVjAKlUQGZvw9/JydQAh+HsCCN5lExQlvctW2UIAZLzrdzc2NTvcCFkAe7N/izo9T7ChUV3d3MiZ3kiuV8lYEgoJh7CgUKpVKodhhgLd/fWHGWPRjAM+8hXndm5j/Axq+Sjd4ZUOgAAAAAElFTkSuQmCC';

export class NearestJobsBar {
    constructor(
        private readonly nearestJobs: NearestJobs,
        private readonly window: TheWestWindow,
        private readonly settings: Settings,
        private readonly language: Language,
        private readonly logger: Logger,
        public readonly errorTracker: ErrorTracker,
    ) {}

    @CatchErrors('NearestJobsBar.appendTo')
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

        const bar = $(`<div style="width: 510px; height: 61px; margin: 4px auto 4px auto; text-align: left;"></div>`);

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
            if (!job) {
                return this.logger.warn(`There is a job saved in the job list which does not exist! (jobId: ${jobId})`);
            }

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

        const plusDiv = $(
            `<div class="job tw-calc-job" style="position: relative !important; display: inline-block !important; margin-top: 5px; margin-bottom: 2px" title="${this.language.getTranslation(
                150,
            )}"><div class="featured"></div><img src="data:image/png;data:;base64,${plusIcon}" class="job_icon" /></div>`,
        );
        plusDiv.on('click', () => {
            this.nearestJobs.dialog.open();
        });
        scrollPane.appendContent(plusDiv);

        bar.append(scrollPane.getMainDiv());

        return bar;
    }

    private getJobStartBtn(job: Job, className: string, duration: number): JQuery {
        const jobStartBtn = this.window.$(
            `<div class="instantwork-${className}" title="${formatDuration(duration)} - ${job.name}"></div>`,
        );
        jobStartBtn.on('click', () => {
            this.nearestJobs.start(job.id, duration);
        });
        return jobStartBtn;
    }
}

function formatDuration(duration: number): string {
    if (duration < 60) {
        return `${duration}s`;
    } else if (duration < 3600) {
        if (duration % 60) {
            return `${Math.floor(duration / 60)}m ${formatDuration(duration % 60)}`;
        }
        return `${Math.floor(duration / 60)}m`;
    } else {
        if (duration % 3600) {
            return `${Math.floor(duration / 3600)}h ${formatDuration(duration % 3600)}`;
        }
        return `${Math.floor(duration / 3600)}h`;
    }
}
