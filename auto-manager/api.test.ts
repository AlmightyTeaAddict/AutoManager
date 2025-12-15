import * as api from "./api.ts";
import * as http from "./http.ts";
import * as prompts from "./prompts.ts";
import * as time from "./time.ts";
import { setupState } from "./state.ts";

describe("isUsingApi", () => {
        test("false for empty path", () => {
                const req: http.Req = {
                        path: [],
                        method: "GET",
                        body: "",
                };
                expect(api.isUsingApi(req)).toBeFalsy();
        });
        test("false for /anything", () => {
                const req: http.Req = {
                        path: ["anything"],
                        method: "GET",
                        body: "",
                };
                expect(api.isUsingApi(req)).toBeFalsy();
        });
        test("true for empty /api/", () => {
                const req: http.Req = {
                        path: ["api"],
                        method: "GET",
                        body: "",
                };
                expect(api.isUsingApi(req)).toBeTruthy();
        });
        test("true for empty /api/anything", () => {
                const req: http.Req = {
                        path: ["api", "anything"],
                        method: "GET",
                        body: "",
                };
                expect(api.isUsingApi(req)).toBeTruthy();
        });
});

describe("responder", () => {
        const state = setupState();
        test("Handles /api/prompt requests", async () => {
                const req: http.Req = {
                        path: ["api", "prompt"],
                        method: "GET",
                        body: "",
                };
                const res = await api.promptResponder(state, req);
                expect(res.status).toStrictEqual(200);
                expect(res.body).toStrictEqual("[]");
                expect(res.contentType).toStrictEqual("application/json");
        });
        test("Handles /api/schedule requests", async () => {
                const req: http.Req = {
                        path: ["api", "schedule"],
                        method: "GET",
                        body: "",
                };
                const res = await api.scheduleResponder(state, req);
                expect(res.status).toStrictEqual(200);
                expect(res.body).toStrictEqual("[]");
                expect(res.contentType).toStrictEqual("application/json");
        });
        test("Handles /api/time-block requests", async () => {
                const req: http.Req = {
                        path: ["api", "time-block"],
                        method: "GET",
                        body: "",
                };
                const res = await api.scheduleResponder(state, req);
                expect(res.status).toStrictEqual(200);
                expect(res.body).toStrictEqual("[]");
                expect(res.contentType).toStrictEqual("application/json");
        });
        test("Handles invalid requests", async () => {
                const req: http.Req = {
                        path: ["api", "invalid"],
                        method: "GET",
                        body: "",
                };
                const res = await api.responder(state, req);
                expect(res.body).toStrictEqual("{}");
                expect(res.status).toStrictEqual(404);
                expect(res.contentType).toStrictEqual("application/json");
        });
});

describe("promptResponder", () => {
        const state = setupState();
        state.promptQueue = [];
        const promptDonePromise = prompts.addPrompt(state, "test_prompt");
        const promptQueueAsJson = JSON.stringify(state.promptQueue);
        test("Handles GET request", async () => {
                const req: http.Req = {
                        path: ["api", "prompt"],
                        method: "GET",
                        body: "",
                };
                const res = await api.promptResponder(state, req);
                expect(res.status).toStrictEqual(200);
                expect(res.body).toStrictEqual(promptQueueAsJson);
                expect(res.contentType).toStrictEqual("application/json");
        });
        test("Handles DELETE request", async () => {
                const req: http.Req = {
                        path: ["api", "prompt", "0"],
                        method: "DELETE",
                        body: "data",
                };
                const res = await api.promptResponder(state, req);
                expect(res.status).toStrictEqual(200);
                expect(res.body).toStrictEqual("{}");
                expect(res.contentType).toStrictEqual("application/json");
                expect(state.promptQueue.length).toStrictEqual(0);
                expect(promptDonePromise).resolves.toStrictEqual("data");
        });
        test("Handles DELETE request to an invalid prompt id", async () => {
                const req: http.Req = {
                        path: ["api", "prompt", "bad_id"],
                        method: "DELETE",
                        body: "",
                };
                const res = await api.promptResponder(state, req);
                expect(res.status).toStrictEqual(404);
                expect(res.body).toStrictEqual("{}");
                expect(res.contentType).toStrictEqual("application/json");
        });
        test("Handles invalid methods", async () => {
                const req: http.Req = {
                        path: ["api", "prompt"],
                        method: "POST",
                        body: "",
                };
                const res = await api.promptResponder(state, req);
                expect(res.status).toStrictEqual(405);
                expect(res.body).toStrictEqual("{}");
                expect(res.contentType).toStrictEqual("application/json");
        });
});

describe("scheduleResponder", () => {
        const state = setupState();
        state.schedule = [
                { scriptName: "", activation: { type: "tick", tick: 0 } },
        ];
        const scheduleAsJson = JSON.stringify(state.schedule);
        test("Handles GET request", async () => {
                const req: http.Req = {
                        path: ["api", "schedule"],
                        method: "GET",
                        body: "",
                };
                const res = await api.scheduleResponder(state, req);
                expect(res.status).toStrictEqual(200);
                expect(res.body).toStrictEqual(scheduleAsJson);
                expect(res.contentType).toStrictEqual("application/json");
        });
        test("Handles invalid methods", async () => {
                const req: http.Req = {
                        path: ["api", "schedule"],
                        method: "POST",
                        body: "",
                };
                const res = await api.scheduleResponder(state, req);
                expect(res.status).toStrictEqual(405);
                expect(res.body).toStrictEqual("{}");
                expect(res.contentType).toStrictEqual("application/json");
        });
});

describe("timeBlockResponder", () => {
        const state = setupState();
        time.requestTimeBlock(state, { start: 0, duration: 10 });
        const timeBlocksAsJson = JSON.stringify(state.timeBlocks);
        test("Handles GET request", async () => {
                const req: http.Req = {
                        path: ["api", "time-block"],
                        method: "GET",
                        body: "",
                };
                const res = await api.timeBlockResponder(state, req);
                expect(res.status).toStrictEqual(200);
                expect(res.contentType).toStrictEqual("application/json");
                expect(res.body).toStrictEqual(timeBlocksAsJson);
        });
        test("Handles invalid methods", async () => {
                const req: http.Req = {
                        path: ["api", "time-block"],
                        method: "POST",
                        body: "",
                };
                const res = await api.timeBlockResponder(state, req);
                expect(res.status).toStrictEqual(405);
                expect(res.contentType).toStrictEqual("application/json");
                expect(res.body).toStrictEqual("{}");
        });
});
