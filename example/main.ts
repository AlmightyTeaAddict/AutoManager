import {
        api,
        http,
        scheduler,
        logger,
        errors,
        setupState,
        time,
} from "auto-manager";
import { sayHiScript } from "./scripts/sayHi.ts";
import { scheduleScript } from "./scripts/schedule.ts";
import { askNameScript } from "./scripts/askName.ts";

const state = setupState();

scheduler.schedule(state, "schedule", { type: "tick", tick: 1 });

function tick() {
        const now = Date.now();
        time.deleteFinishedTimeBlocks(state, now);
        const scriptsToRun = scheduler.tick(state, now);
        for (const scriptName of scriptsToRun) {
                if (scriptName === "say-hi") {
                        sayHiScript(state);
                        continue;
                }
                if (scriptName === "schedule") {
                        scheduleScript(state);
                        continue;
                }
                if (scriptName === "ask-name") {
                        askNameScript(state);
                        continue;
                }
                const userError: errors.UserError = {
                        code: "scheduled_script_does_not_exist",
                        name: scriptName,
                };
                logger.addErrorLog(state, { module: "user", userError });
        }
}

async function responder(req: http.Req): Promise<http.Res> {
        if (api.isUsingApi(req)) {
                return await api.responder(state, req);
        }

        return {
                body: "{}",
                status: 404,
                contentType: "application/json",
        };
}

setInterval(tick, 1000);
http.start("http://localhost:8000", responder);
