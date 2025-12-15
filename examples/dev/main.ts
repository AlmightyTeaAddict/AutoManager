/*
 * The "dev" example:
 * This example config is here for quick testing while programming. It changes all the time.
 *
 * If you're using this while changing auto-manager: you need to first build auto-manager, then
 * build the dev-example, then restart the dev-example for changes to take effect.
 *
 * If you're using this while changing web-dash: you should start dev-example and leave it running.
 * Use the dev script in web-dash and open Main.elm in elm-reactor for the ui. The server _will_
 * expose the web-dash in /dash, but it only updates when the whole elm app is rebuilt so don't use
 * it.
 */

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

        if (http.matchPathSegment("dash", 0, req)) {
                return await http.staticFile("../../web-dash/build", req);
        }

        return {
                body: "{}",
                status: 404,
                contentType: "application/json",
        };
}

setInterval(tick, 1000);
http.start("http://localhost:8000", responder);
