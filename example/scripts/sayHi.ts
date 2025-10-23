import { logger } from "auto-manager-core";
import * as scheduler from "auto-manager-scheduler";

export function sayHiScript(
        schedulerState: scheduler.State,
        loggerState: logger.State,
) {
        const info: logger.Log = {
                type: "info",
                message: "Haiiiiiiii :33",
                source: "say-hi script",
        };
        logger.addLog(loggerState, info);
}
