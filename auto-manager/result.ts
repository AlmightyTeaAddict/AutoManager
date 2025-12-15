export type Result<A, E> = { isOk: true; data: A } | { isOk: false; error: E };

export function fromTryCatch<A, E>(
        f: () => A,
        mapE: (e: unknown) => E,
): Result<A, E> {
        try {
                const data = f();
                return { isOk: true, data };
        } catch (thrownError) {
                const mappedError = mapE(thrownError);
                return { isOk: false, error: mappedError };
        }
}

export function map<A, B, E>(r: Result<A, E>, f: (a: A) => B): Result<B, E> {
        if (!r.isOk) {
                return r;
        }
        return { isOk: true, data: f(r.data) };
}

export function bind<A, B, E>(
        r: Result<A, E>,
        f: (a: A) => Result<B, E>,
): Result<B, E> {
        if (!r.isOk) {
                return r;
        }
        return f(r.data);
}
