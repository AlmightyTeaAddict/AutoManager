import type { Env } from "../scripts.ts";
import { addLog } from "../logs.ts";

export function scheduleScript(env: Env) {
	addLog(env.logs, {
		type: "info",
		message: "Scheduled more things!!",
		tick: env.tick,
		source: "schedule script",
	});
        env.schedule.push({
                scriptName: "say-hi",
                tick: env.tick + 1,
                done: false,
        });
        env.schedule.push({
                scriptName: "say-hi",
                tick: env.tick + 2,
                done: false,
        });
        env.schedule.push({
                scriptName: "say-hi",
                tick: env.tick + 3,
                done: false,
        });
        env.schedule.push({
                scriptName: "say-hi",
                tick: env.tick + 4,
                done: false,
        });
        env.schedule.push({
                scriptName: "unnamed",
                tick: env.tick + 5,
                done: false,
        });
        env.schedule.push({
                scriptName: "schedule",
                tick: env.tick + 5,
                done: false,
        });
}
