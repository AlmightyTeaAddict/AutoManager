export type State = {
        promptQueue: string[];
};

export function addPrompt(state: State, prompt: string) {
        state.promptQueue.push(prompt);
}
