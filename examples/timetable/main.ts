import {
        scheduler,
        setupState,
        http,
        time,
        api,
        errors,
        logger,
} from "auto-manager";

const state = setupState();
scheduler.schedule(state, "timetable-week", { type: "time", time: 1 });

const timetable = [
        ["cs", "maths", "maths"],
        ["maths", "physics", "cs"],
        ["physics", "maths", "free"],
        ["physics", "maths", "maths"],
        ["maths", "cs", "physics"],
];

/*
 * This script is called at the start of Monday. It requests TimeBlocks for the entire week's
 * timetable.
 */
function timetableWeekScript() {
        for (const day of timetable) {
                for (const period of day) {
                        // TODO
                }
        }
}

function tick() {
        const now = Date.now();
        time.deleteFinishedTimeBlocks(state, now);
        const scriptsToRun = scheduler.tick(state, now);
        for (const scriptToRun of scriptsToRun) {
                if (scriptToRun === "timetable-week") {
                        timetableWeekScript();
                        continue;
                }
                const userError: errors.UserError = {
                        code: "scheduled_script_does_not_exist",
                        name: scriptToRun,
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
