export type State = {
        promptQueue: Array<PromptQueueItem>;
};

type PromptQueueItem = {
        name: string;
        resolve: (data: string) => void;
};

export function addPrompt(state: State, name: string): Promise<string> {
        return new Promise((resolve) => {
                state.promptQueue.push({ name, resolve });
        });
}
