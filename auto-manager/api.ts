import * as http from "./http.ts";
import * as prompts from "./prompts.ts";
import * as scheduler from "./scheduler.ts";
import * as result from "./result.ts";
import * as utils from "./utils.ts";

export function isUsingApi(req: http.Req): boolean {
        return http.matchPathSegment("api", 0, req);
}

export type States = { prompts: prompts.State; scheduler: scheduler.State };

export async function responder(
        req: http.Req,
        states: States,
): Promise<http.Res> {
        if (http.matchPathSegment("prompt", 1, req)) {
                return promptResponder(req, states.prompts);
        }

        if (http.matchPathSegment("schedule", 1, req)) {
                return scheduleResponder(req, states.scheduler);
        }

        return {
                body: "{}",
                status: 404,
                contentType: "application/json",
        };
}

async function promptResponder(
        req: http.Req,
        promptState: prompts.State,
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
                await prompts.handlePromptResponse(promptState, id, req.body);
                return {
                        body: "{}",
                        status: 200,
                        contentType: "application/json",
                };
        }

        if (req.method === "GET") {
                const body = JSON.stringify(
                        promptState.promptQueue.map(({ name, id }) => ({
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
        req: http.Req,
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
