import type { State } from "./state.ts";
import * as http from "./http.ts";
import * as prompts from "./prompts.ts";
import * as result from "./result.ts";
import * as utils from "./utils.ts";

export function isUsingApi(req: http.Req): boolean {
        return http.matchPathSegment("api", 0, req);
}

export async function responder(
        state: State,
        req: http.Req,
): Promise<http.Res> {
        if (http.matchPathSegment("prompt", 1, req)) {
                return promptResponder(state, req);
        }

        if (http.matchPathSegment("schedule", 1, req)) {
                return scheduleResponder(state, req);
        }

        return {
                body: "{}",
                status: 404,
                contentType: "application/json",
        };
}

async function promptResponder(
        state: State,
        req: http.Req,
): Promise<http.Res> {
        if (req.method === "DELETE") {
                const idStringResult = http.extractPathSegment(2, req);
                const idResult = result.bind(idStringResult, utils.parseInt);
                if (!idResult.isOk) {
                        return {
                                body: "{}",
                                status: 404,
                                contentType: "application/json",
                        };
                }
                const id = idResult.data;
                await prompts.handlePromptResponse(state, id, req.body);
                return {
                        body: "{}",
                        status: 200,
                        contentType: "application/json",
                };
        }

        if (req.method === "GET") {
                const body = JSON.stringify(
                        state.promptQueue.map(({ name, id }) => ({
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
        state: State,
        req: http.Req,
) {
        if (req.method === "GET") {
                const body = JSON.stringify(state.schedule);
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
