import * as scheduler from "auto-manager-scheduler";
import { sayHiScript } from "./scripts/sayHi.ts";
import { scheduleScript } from "./scripts/schedule.ts";

const schedulerState: scheduler.State = { tick: 0, schedule: [], logs: [] };

schedulerState.schedule.push({
        scriptName: "schedule",
        tick: 1,
        done: false,
});

setInterval(() => {
        const scriptsToRun = scheduler.tick(schedulerState);
        for (const scriptName of scriptsToRun) {
                if (scriptName === "say-hi") {
                        sayHiScript(schedulerState);
                        continue;
                }
                if (scriptName === "schedule") {
                        scheduleScript(schedulerState);
                        continue;
                }
                scheduler.addLog(schedulerState.logs, {
                        type: "error",
                        message: `The scheduled script "${scriptName}" doesn't exist!`,
                        tick: schedulerState.tick,
                        source: "tick",
                });
        }
}, 1000);
