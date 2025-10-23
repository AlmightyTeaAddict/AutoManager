import { logger } from "auto-manager-core";
import * as scheduler from "auto-manager-scheduler";
import * as ui from "auto-manager-ui";
import { sayHiScript } from "./scripts/sayHi.ts";
import { scheduleScript } from "./scripts/schedule.ts";
import { askNameScript } from "./scripts/askName.ts";

const schedulerState: scheduler.State = { tick: 0, schedule: [] };
const loggerState: logger.State = { logs: [] };
const uiState: ui.State = { promptQueue: [], nextPromptQueueItemId: 0 };

schedulerState.schedule.push({
        scriptName: "schedule",
        tick: 1,
        done: false,
});

setInterval(() => {
        const scriptsToRun = scheduler.tick(schedulerState);
        for (const scriptName of scriptsToRun) {
                if (scriptName === "say-hi") {
                        sayHiScript(schedulerState, loggerState);
                        continue;
                }
                if (scriptName === "schedule") {
                        scheduleScript(schedulerState, loggerState);
                        continue;
                }
                if (scriptName === "ask-name") {
                        askNameScript(uiState);
                        continue;
                }
                logger.addLog(loggerState, {
                        type: "error",
                        message: `The scheduled script "${scriptName}" doesn't exist!`,
                        tick: schedulerState.tick,
                        source: "tick",
                });
        }
}, 1000);
