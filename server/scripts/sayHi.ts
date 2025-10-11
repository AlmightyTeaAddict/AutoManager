import type { Env } from "../scripts.ts";
import { addLog } from "../logs.ts";

export function sayHiScript(env: Env) {
        addLog(env.logs, {
                type: "info",
                message: "Haiiiiiiii :33",
                tick: env.tick,
                source: "say-hi script",
        });
}
