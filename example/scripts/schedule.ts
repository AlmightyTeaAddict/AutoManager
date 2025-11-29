import { type State, logger, scheduler } from "auto-manager";

export function scheduleScript(state: State) {
        logger.addLog(state, {
                type: "info",
                message: "Scheduled more things!!",
                source: "schedule script",
        });
        scheduler.schedule(state, "say-hi", { type: "tick", tick: 1 });
        scheduler.schedule(state, "say-hi", { type: "tick", tick: 2 });
        scheduler.schedule(state, "say-hi", { type: "tick", tick: 3 });
        scheduler.schedule(state, "ask-name", { type: "tick", tick: 4 });
        scheduler.schedule(state, "unnamed", { type: "tick", tick: 5 });
        scheduler.schedule(state, "schedule", { type: "tick", tick: 5 });
}
