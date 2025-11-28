import { logger, scheduler } from "auto-manager";

export function scheduleScript(
        schedulerState: scheduler.State,
        loggerState: logger.State,
) {
        const info: logger.Log = {
                type: "info",
                message: "Scheduled more things!!",
                source: "schedule script",
        };
        logger.addLog(loggerState, info);
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
                scriptName: "ask-name",
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
