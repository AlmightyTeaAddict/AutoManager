import { logger } from "auto-manager-core";
import * as scheduler from "auto-manager-scheduler";

export function sayHiScript(
        schedulerState: scheduler.State,
        loggerState: logger.State,
) {
        logger.addLog(loggerState, {
                type: "info",
                message: "Haiiiiiiii :33",
                tick: schedulerState.tick,
                source: "say-hi script",
        });
}
