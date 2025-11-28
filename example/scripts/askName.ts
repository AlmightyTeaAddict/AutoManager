import { prompts } from "auto-manager";

export async function askNameScript(promptState: prompts.State): Promise<void> {
        const prompt = "ask-name";
        const name = await prompts.addPrompt(promptState, prompt);
}
