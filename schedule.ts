import { pickScript } from "./scripts.ts";
import type { ScriptName, Env } from "./scripts.ts";
import type { Logs } from "./logs.ts";

export type ScheduleItem = {
        scriptName: ScriptName;
        tick: number;
        done: boolean;
};

export type Schedule = ScheduleItem[];

export function loop() {
        let schedule: Schedule = [
                { scriptName: "schedule", tick: 0, done: false },
        ];
        let logs: Logs = [];
        let tick = 0;
        setInterval(() => {
                const env: Env = { tick, schedule, logs };
                for (const item of schedule) {
                        if (item.tick !== tick) {
                                continue;
                        }
                        item.done = true;
                        pickScript(item.scriptName, env);
                }
                schedule.filter((x) => x.done === false);
                tick++;
        }, 1000);
}
