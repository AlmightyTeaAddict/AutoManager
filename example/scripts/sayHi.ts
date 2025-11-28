import { logger, scheduler } from "auto-manager";

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
