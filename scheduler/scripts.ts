import type { Schedule, State } from "./schedule.ts";
import { scheduleScript } from "./scripts/schedule.ts";
import { sayHiScript } from "./scripts/sayHi.ts";
import type { Logs } from "./logs.ts";
import { addLog } from "./logs.ts";

export type ScriptName = "say-hi" | "schedule" | "unnamed";

export function pickScript(scriptName: ScriptName, state: State) {
        if (scriptName === "schedule") {
                scheduleScript(state);
                return;
        }
        if (scriptName === "say-hi") {
                sayHiScript(state);
                return;
        }
        addLog(state.logs, {
                type: "error",
                message: `The scheduled script "${scriptName}" doesn't exist!`,
                tick: state.tick,
                source: "pickScript",
        });
}
