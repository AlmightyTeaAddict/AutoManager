import { logger, scheduler } from "auto-manager";

export function scheduleScript(
        schedulerState: scheduler.State,
        loggerState: logger.State,
) {
        logger.addLog(loggerState, {
                type: "info",
                message: "Scheduled more things!!",
                source: "schedule script",
        });
        scheduler.schedule(schedulerState, "say-hi", schedulerState.tick + 1);
        scheduler.schedule(schedulerState, "say-hi", schedulerState.tick + 2);
        scheduler.schedule(schedulerState, "say-hi", schedulerState.tick + 3);
        scheduler.schedule(schedulerState, "ask-name", schedulerState.tick + 4);
        scheduler.schedule(schedulerState, "unnamed", schedulerState.tick + 5);
        scheduler.schedule(schedulerState, "schedule", schedulerState.tick + 5);
}
