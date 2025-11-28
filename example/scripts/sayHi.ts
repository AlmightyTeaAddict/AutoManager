import { logger, scheduler } from "auto-manager";

export function sayHiScript(
        schedulerState: scheduler.State,
        loggerState: logger.State,
) {
        logger.addLog(loggerState, {
                type: "info",
                message: "Haiiiiiiii :33",
                source: "say-hi script",
        });
}
