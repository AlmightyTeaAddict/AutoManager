import type { State } from "../schedule.ts";
import { addLog } from "../logs.ts";

export function sayHiScript(state: State) {
        addLog(state.logs, {
                type: "info",
                message: "Haiiiiiiii :33",
                tick: state.tick,
                source: "say-hi script",
        });
}
