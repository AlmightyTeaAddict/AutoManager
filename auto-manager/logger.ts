import * as errors from "./errors.ts";
import * as utils from "./utils.ts";

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
        return utils.never();
}

export function addLog(state: State, log: Log) {
        state.logs.push(log);
        console.log(formatLog(log));
}

export function addErrorLog(state: State, error: errors.GeneralError) {
	addLog(state, { type: "error", error });
}
