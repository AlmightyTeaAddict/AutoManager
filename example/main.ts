import { startLoop } from "auto-manager-scheduler";

const env = startLoop();

env.schedule.push({
	scriptName: "schedule",
	tick: 1,
	done: false,
});

