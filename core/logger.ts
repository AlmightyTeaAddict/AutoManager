import * as errors from "./errors.ts";

export type State = {
        logs: Log[];
};

export type Log =
        | { type: "error"; error: errors.GeneralError }
        | { type: "info"; message: string; source: string };

export function formatLog(log: Log): string {
        if (log.type === "error") {
                return `error: ${errors.generalErrorToMessage(log.error)}`;
        }
        if (log.type === "info") {
                return `info: ${log.source}: ${log.message}`;
        }
        throw new Error("Invalid log type");
}

export function addLog(state: State, log: Log) {
        state.logs.push(log);
        console.log(formatLog(log));
}
