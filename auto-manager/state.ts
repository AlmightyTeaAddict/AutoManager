import * as scheduler from "./scheduler.ts";
import * as logger from "./logger.ts";
import * as prompts from "./prompts.ts";
import * as time from "./time.ts";

export type State = {
	tick: number,
	schedule: scheduler.Schedule,
	logs: logger.Log[],
	promptQueue: prompts.PromptQueueItem[],
	nextPromptQueueItemId: number,
	timeBlocks: time.TimeBlock[],
};

export function setupState(): State {
	return {
		tick: 0,
		schedule: [],
		logs: [],
		promptQueue: [],
		nextPromptQueueItemId: 0,
		timeBlocks: [],
	};
}

