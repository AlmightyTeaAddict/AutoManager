import { pickScript } from "./scripts.ts";
import type { ScriptName } from "./scripts.ts";
import type { Logs } from "./logs.ts";

export type State = {
        schedule: Schedule;
        tick: number;
        logs: Logs;
};

export type ScheduleItem = {
        scriptName: ScriptName;
        tick: number;
        done: boolean;
};

export type Schedule = ScheduleItem[];

export function tick(state: State) {
        for (const item of state.schedule) {
                if (item.tick !== state.tick) {
                        continue;
                }
                item.done = true;
                pickScript(item.scriptName, state);
        }
        state.schedule.filter((x) => x.done === false);
        state.tick++;
}
