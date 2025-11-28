import { type State, logger, scheduler } from "auto-manager";

export function scheduleScript(state: State) {
        logger.addLog(state, {
                type: "info",
                message: "Scheduled more things!!",
                source: "schedule script",
        });
        scheduler.schedule(state, "say-hi", state.tick + 1);
        scheduler.schedule(state, "say-hi", state.tick + 2);
        scheduler.schedule(state, "say-hi", state.tick + 3);
        scheduler.schedule(state, "ask-name", state.tick + 4);
        scheduler.schedule(state, "unnamed", state.tick + 5);
        scheduler.schedule(state, "schedule", state.tick + 5);
}
