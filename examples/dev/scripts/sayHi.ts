import { type State, logger } from "auto-manager";

export function sayHiScript(state: State) {
        logger.addLog(state, {
                type: "info",
                message: "Haiiiiiiii :33",
                source: "say-hi script",
        });
}
