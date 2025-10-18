import * as scheduler from "auto-manager-scheduler";

export function scheduleScript(state: scheduler.State) {
        scheduler.addLog(state.logs, {
                type: "info",
                message: "Scheduled more things!!",
                tick: state.tick,
                source: "schedule script",
        });
        state.schedule.push({
                scriptName: "say-hi",
                tick: state.tick + 1,
                done: false,
        });
        state.schedule.push({
                scriptName: "say-hi",
                tick: state.tick + 2,
                done: false,
        });
        state.schedule.push({
                scriptName: "say-hi",
                tick: state.tick + 3,
                done: false,
        });
        state.schedule.push({
                scriptName: "say-hi",
                tick: state.tick + 4,
                done: false,
        });
        state.schedule.push({
                scriptName: "unnamed",
                tick: state.tick + 5,
                done: false,
        });
        state.schedule.push({
                scriptName: "schedule",
                tick: state.tick + 5,
                done: false,
        });
}
