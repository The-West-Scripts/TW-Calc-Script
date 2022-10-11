/**
 * Invisible error is tracked by the error tracked, but the error notification is not shown.
 */
export class InvisibleError extends Error {
    constructor(private readonly fromError: Error) {
        super(fromError.message);
    }

    get stack(): string | undefined {
        return this.fromError.stack;
    }

    static of(fromError: Error): InvisibleError {
        return new InvisibleError(fromError);
    }
}
