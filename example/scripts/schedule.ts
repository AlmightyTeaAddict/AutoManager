import { logger } from "auto-manager-core";
import * as scheduler from "auto-manager-scheduler";

export function scheduleScript(
        schedulerState: scheduler.State,
        loggerState: logger.State,
) {
        logger.addLog(loggerState, {
                type: "info",
                message: "Scheduled more things!!",
                tick: schedulerState.tick,
                source: "schedule script",
        });
        schedulerState.schedule.push({
                scriptName: "say-hi",
                tick: schedulerState.tick + 1,
                done: false,
        });
        schedulerState.schedule.push({
                scriptName: "say-hi",
                tick: schedulerState.tick + 2,
                done: false,
        });
        schedulerState.schedule.push({
                scriptName: "say-hi",
                tick: schedulerState.tick + 3,
                done: false,
        });
        schedulerState.schedule.push({
                scriptName: "say-hi",
                tick: schedulerState.tick + 4,
                done: false,
        });
        schedulerState.schedule.push({
                scriptName: "unnamed",
                tick: schedulerState.tick + 5,
                done: false,
        });
        schedulerState.schedule.push({
                scriptName: "schedule",
                tick: schedulerState.tick + 5,
                done: false,
        });
}
