import * as server from "auto-manager-server";
import * as ui from "auto-manager-ui";
import { result, utils } from "auto-manager-core";

export function isUsingApi(req: server.Req): boolean {
        return server.matchPathSegment("api", 0, req);
}

export type States = { ui: ui.State };

export async function responder(
        req: server.Req,
        states: States,
): Promise<server.Res> {
        if (server.matchPathSegment("prompt", 1, req)) {
                return promptResponder(req, states.ui);
        }

        return {
                body: "{}",
                status: 404,
        };
}

async function promptResponder(
        req: server.Req,
        uiState: ui.State,
): Promise<server.Res> {
        if (req.method === "POST") {
                const idStringResult = server.extractPathSegment(2, req);
                const idResult = result.bind(idStringResult, utils.parseInt);
                if (!idResult.isOk) {
                        return {
                                body: "{}",
                                status: 404,
                        };
                }
                const id = idResult.data;
                await ui.handlePromptResponse(uiState, id, req.body);
                return {
                        body: "{}",
                        status: 200,
                };
        }

        if (req.method === "GET") {
                const body = JSON.stringify(
                        uiState.promptQueue.map(({ name, id }) => ({
                                name,
                                id,
                        })),
                );
                return {
                        body,
                        status: 200,
                };
        }

        return {
                body: "{}",
                status: 404,
        };
}
