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
