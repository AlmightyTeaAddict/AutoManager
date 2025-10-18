import * as scheduler from "auto-manager-scheduler";

const schedulerState: scheduler.State = { tick: 0, schedule: [], logs: [] };

setInterval(() => {
        scheduler.tick(schedulerState);
}, 1000);

schedulerState.schedule.push({
        scriptName: "schedule",
        tick: 1,
        done: false,
});
