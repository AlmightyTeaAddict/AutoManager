import * as scheduler from "auto-manager-scheduler";

const schedulerState: scheduler.State = { tick: 0, schedule: [], logs: [] };

schedulerState.schedule.push({
        scriptName: "schedule",
        tick: 1,
        done: false,
});

setInterval(() => {
        const scriptsToRun = scheduler.tick(schedulerState);
        console.log(scriptsToRun);
}, 1000);
