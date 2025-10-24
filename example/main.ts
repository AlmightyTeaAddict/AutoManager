import { logger, errors } from "auto-manager-core";
import * as scheduler from "auto-manager-scheduler";
import * as ui from "auto-manager-ui";
import * as server from "auto-manager-server";
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
                        askNameScript(uiState);
                        continue;
                }
                const userError: errors.UserError = {
                        code: "scheduled_script_does_not_exist",
                        name: scriptName,
                };
                logger.addLog(loggerState, {
                        type: "error",
                        error: { module: "user", userError },
                });
        }
}

async function responder(req: server.Req): Promise<server.Res> {
        if (req.path[0] === "prompt" && req.method === "POST") {
                const idString = req.path[1];
                if (idString === undefined) {
                        return {
                                body: "{}",
                                status: 404,
                        };
                }
                const id = parseInt(idString);
                if (isNaN(id)) {
                        return {
                                body: "{}",
                                status: 404,
                        };
                }
                await ui.handlePromptResponse(uiState, id, req.body);
                return {
                        body: "{}",
                        status: 200,
                };
        }
        return {
                body: "{}",
                status: 404,
        };
}

setInterval(tick, 1000);
server.start(responder);
