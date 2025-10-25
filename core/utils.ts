import * as result from "./result.ts";

export function never(): never {
        throw new Error("This should never happen");
}

export function parseInt(s: string): result.Result<number, {}> {
        const n = globalThis.parseInt(s);
        if (isNaN(n)) {
                return { isOk: false, error: {} };
        }
        return { isOk: true, data: n };
}
