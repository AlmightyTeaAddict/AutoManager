import * as scheduler from "auto-manager-scheduler";

const env: scheduler.Env = { tick: 0, schedule: [], logs: [] };

setInterval(
	() => {
		scheduler.tick(env);
	},
	1000,
);

env.schedule.push({
	scriptName: "schedule",
	tick: 1,
	done: false,
});

