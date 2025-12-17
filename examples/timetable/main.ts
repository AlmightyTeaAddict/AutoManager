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
function timetableWeekScript(now: time.DateTime) {
        const mondayStart = time.toStartOfDay(now);
        const periodLengthMs = 30 * 60 * 60 * 1000;
        for (let i = 0; i < 5; i++) {
                const period1 = time.addHumanUnits(mondayStart, {
                        year: 0,
                        month: 0,
                        date: i,
                        hr: 9,
                        min: 0,
                        s: 0,
                        ms: 0,
                });
                const period2 = time.addHumanUnits(mondayStart, {
                        year: 0,
                        month: 0,
                        date: i,
                        hr: 11,
                        min: 30,
                        s: 0,
                        ms: 0,
                });
                const period3 = time.addHumanUnits(mondayStart, {
                        year: 0,
                        month: 0,
                        date: i,
                        hr: 13,
                        min: 45,
                        s: 0,
                        ms: 0,
                });
                time.requestTimeBlock(state, {
                        start: period1,
                        duration: periodLengthMs,
                });
                time.requestTimeBlock(state, {
                        start: period2,
                        duration: periodLengthMs,
                });
                time.requestTimeBlock(state, {
                        start: period3,
                        duration: periodLengthMs,
                });
        }
}

function tick() {
        const now = time.now();
        time.deleteFinishedTimeBlocks(state, now);
        const scriptsToRun = scheduler.tick(state, now);
        for (const scriptToRun of scriptsToRun) {
                if (scriptToRun === "timetable-week") {
                        timetableWeekScript(now);
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
