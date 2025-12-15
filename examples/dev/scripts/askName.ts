import { type State, prompts } from "auto-manager";

export async function askNameScript(state: State): Promise<void> {
        const prompt = "ask-name";
        const name = await prompts.addPrompt(state, prompt);
}
