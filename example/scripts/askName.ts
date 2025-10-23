import * as ui from "auto-manager-ui";

export async function askNameScript(uiState: ui.State): Promise<void> {
        const prompt = "ask-name";
        const name = await ui.addPrompt(uiState, prompt);
}
