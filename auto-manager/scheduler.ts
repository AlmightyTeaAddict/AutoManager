import type { State } from "./state.ts";

export type Activation = { type: "tick", tick: number } | { type: "time", time: number };

export type ScheduleItem = {
        scriptName: string;
	activation: Activation,
        done: boolean;
};

export type Schedule = ScheduleItem[];

export function tick(state: State, now: number): string[] {
        let scriptsToRun: string[] = [];
        for (const item of state.schedule) {
		if (item.activation.type === "tick" && item.activation.tick > state.tick) {
			continue;
		}
		if (item.activation.type === "time" && item.activation.time > now) {
			continue;
		}
                item.done = true;
                scriptsToRun.push(item.scriptName);
        }
        state.schedule.filter((x) => x.done === false);
        state.tick++;
        return scriptsToRun;
}

export function schedule(state: State, scriptName: string, activation: Activation) {
	state.schedule.push({
		scriptName,
		activation,
		done: false,
	});
}
