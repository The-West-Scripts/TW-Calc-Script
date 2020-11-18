import { ErrorTracker } from './error-tracker/error-tracker';

export interface Component {
    errorTracker: ErrorTracker;
    init(cb?: () => void): any;
}
