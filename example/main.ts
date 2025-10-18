import { startLoop } from "auto-manager-server";

const env = startLoop();

env.schedule.push({
	scriptName: "schedule",
	tick: 1,
	done: false,
});

