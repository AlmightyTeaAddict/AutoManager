import { api, http, prompts, scheduler, logger, errors } from "auto-manager";
import { sayHiScript } from "./scripts/sayHi.ts";
import { scheduleScript } from "./scripts/schedule.ts";
import { askNameScript } from "./scripts/askName.ts";

const schedulerState: scheduler.State = { tick: 0, schedule: [] };
const loggerState: logger.State = { logs: [] };
const promptState: prompts.State = {
        promptQueue: [],
        nextPromptQueueItemId: 0,
};

scheduler.schedule(schedulerState, "schedule", 1);

function tick() {
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
                        askNameScript(promptState);
                        continue;
                }
                const userError: errors.UserError = {
                        code: "scheduled_script_does_not_exist",
                        name: scriptName,
                };
                logger.addErrorLog(loggerState, { module: "user", userError });
        }
}

async function responder(req: http.Req): Promise<http.Res> {
        if (api.isUsingApi(req)) {
                return await api.responder(req, {
                        prompts: promptState,
                        scheduler: schedulerState,
                });
        }

        return {
                body: "{}",
                status: 404,
                contentType: "application/json",
        };
}

setInterval(tick, 1000);
http.start("http://localhost:8000", responder);
