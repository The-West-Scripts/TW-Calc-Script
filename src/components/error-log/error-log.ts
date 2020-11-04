import { singleton } from 'tsyringe';

@singleton()
export class ErrorLog {
    open(): void {}
}
