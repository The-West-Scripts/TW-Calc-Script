export function zip<A, B>(a: Array<A>, b: Array<B>, callback: (a: A, b: B) => void): void {
    if (a.length !== b.length) {
        throw new Error('Cannot zip two arrays of different length!');
    }
    for (let i = 0; i < a.length; i++) {
        callback(a[i], b[i]);
    }
}
