import type { Schedule } from "./schedule.ts";
import { scheduleScript } from "./scripts/schedule.ts";
import { sayHiScript } from "./scripts/sayHi.ts";
import type { Logs } from "./logs.ts";
import { addLog } from "./logs.ts";

export type ScriptName = "say-hi" | "schedule" | "unnamed";

export type Env = {
        schedule: Schedule;
        tick: number;
        logs: Logs;
};

export function pickScript(scriptName: ScriptName, env: Env) {
        if (scriptName === "schedule") {
                scheduleScript(env);
                return;
        }
        if (scriptName === "say-hi") {
                sayHiScript(env);
                return;
        }
        addLog(env.logs, {
                type: "error",
                message: `The scheduled script "${scriptName}" doesn't exist!`,
                tick: env.tick,
                source: "pickScript",
        });
}
