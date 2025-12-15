import type { State } from "./state.ts";
import * as utils from "./utils.ts";

export type Activation =
        | { type: "tick"; tick: number }
        | { type: "time"; time: number };

export type ScheduleItem = {
        scriptName: string;
        activation: Activation;
};

export type Schedule = ScheduleItem[];

export function tick(state: State, now: number): string[] {
        let scriptsToRun: string[] = [];
        state.schedule = state.schedule.filter((item) => {
                if (shouldRunItem(state, now, item)) {
                        scriptsToRun.push(item.scriptName);
                        return false;
                }
                return true;
        });
        state.tick++;
        return scriptsToRun;
}

function shouldRunItem(state: State, now: number, item: ScheduleItem): boolean {
        if (item.activation.type === "tick") {
                return state.tick >= item.activation.tick;
        }

        if (item.activation.type === "time") {
                return now >= item.activation.time;
        }

        return utils.never();
}

export function schedule(
        state: State,
        scriptName: string,
        activation: Activation,
) {
        state.schedule.push({
                scriptName,
                activation,
        });
}
