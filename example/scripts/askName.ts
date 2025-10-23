import * as ui from "auto-manager-ui";

export function askNameScript(uiState: ui.State) {
        const prompt = "ask-name";
        ui.addPrompt(uiState, prompt);
}
