import { pickScript } from "./scripts.ts";
import type { ScriptName, Env } from "./scripts.ts";
import type { Logs } from "./logs.ts";

export type ScheduleItem = {
        scriptName: ScriptName;
        tick: number;
        done: boolean;
};

export type Schedule = ScheduleItem[];

export function tick(env: Env) {
	for (const item of env.schedule) {
		if (item.tick !== env.tick) {
			continue;
		}
		item.done = true;
		pickScript(item.scriptName, env);
	}
	env.schedule.filter(x => x.done === false);
	env.tick++;
}

