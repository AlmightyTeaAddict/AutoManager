import * as scheduler from "auto-manager-scheduler";

export function sayHiScript(state: scheduler.State) {
        scheduler.addLog(state.logs, {
                type: "info",
                message: "Haiiiiiiii :33",
                tick: state.tick,
                source: "say-hi script",
        });
}
