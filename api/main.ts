import * as server from "auto-manager-server";
import * as ui from "auto-manager-ui";
import * as scheduler from "auto-manager-scheduler";
import { result, utils } from "auto-manager-core";

export function isUsingApi(req: server.Req): boolean {
        return server.matchPathSegment("api", 0, req);
}

export type States = { ui: ui.State; scheduler: scheduler.State };

export async function responder(
        req: server.Req,
        states: States,
): Promise<server.Res> {
        if (server.matchPathSegment("prompt", 1, req)) {
                return promptResponder(req, states.ui);
        }

        if (server.matchPathSegment("schedule", 1, req)) {
                return scheduleResponder(req, states.scheduler);
        }

        return {
                body: "{}",
                status: 404,
                contentType: "application/json",
        };
}

async function promptResponder(
        req: server.Req,
        uiState: ui.State,
): Promise<server.Res> {
        if (req.method === "DELETE") {
                const idStringResult = server.extractPathSegment(2, req);
                const idResult = result.bind(idStringResult, utils.parseInt);
                if (!idResult.isOk) {
                        return {
                                body: "{}",
                                status: 404,
                                contentType: "application/json",
                        };
                }
                const id = idResult.data;
                await ui.handlePromptResponse(uiState, id, req.body);
                return {
                        body: "{}",
                        status: 200,
                        contentType: "application/json",
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
                        contentType: "application/json",
                };
        }

        return {
                body: "{}",
                status: 404,
                contentType: "application/json",
        };
}

async function scheduleResponder(
        req: server.Req,
        schedulerState: scheduler.State,
) {
        if (req.method === "GET") {
                const body = JSON.stringify(schedulerState.schedule);
                return {
                        body,
                        status: 200,
                        contentType: "application/json",
                };
        }

        return {
                body: "{}",
                status: 404,
                contentType: "application/json",
        };
}
