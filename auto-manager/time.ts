import type { State } from "./state.ts";

export type TimeBlock = {
	start: number,
	duration: number,
};

export function requestTimeBlock(state: State, block: TimeBlock): boolean {
	let i = 0;
	for (const comparingBlock of state.timeBlocks) {
		if (comparingBlock.start < block.start) {
			i++;
			continue;
		}
		if (comparingBlock.start <= block.start + block.duration) {
			return false;
		}
	}
	state.timeBlocks.splice(i, 0, block);
	return true;
}

export function deleteFinishedTimeBlocks(state: State, now: number) {
	state.timeBlocks.filter(block => block.start + block.duration < now);
}

