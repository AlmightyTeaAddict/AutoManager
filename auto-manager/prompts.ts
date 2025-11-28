export type State = {
        nextPromptQueueItemId: number;
        promptQueue: Array<PromptQueueItem>;
};

type PromptQueueItem = {
        name: string;
        resolve: (data: string) => void;
        id: number;
};

export function addPrompt(state: State, name: string): Promise<string> {
        return new Promise((resolve) => {
                const id = state.nextPromptQueueItemId;
                state.nextPromptQueueItemId++;
                state.promptQueue.push({ name, resolve, id });
        });
}

export function handlePromptResponse(state: State, id: number, body: string) {
        // TODO: JSON decode the body and error if it fails
        for (const [i, promptQueueItem] of state.promptQueue.entries()) {
                if (promptQueueItem.id !== id) {
                        continue;
                }
                state.promptQueue.splice(i, 1);
                promptQueueItem.resolve(body);
                return;
        }
        // TODO: Error here for when the id doesnt exist
}
