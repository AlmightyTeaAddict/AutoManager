import {
        createServer as nodeCreateServer,
        type IncomingMessage as NodeReq,
} from "node:http";
import { result, errors } from "auto-manager-core";

export type Method = "GET" | "POST" | "PUT" | "DELETE";
export type Req = {
        path: string[];
        method: Method;
        body: string;
};
export type Res = {
        body: string;
        status: number;
};

export function start(clientOrigin: string, responder: (req: Req) => Promise<Res>) {
        const server = nodeCreateServer(async (nodeReq, nodeRes) => {
                const reqResult = await nodeReqToNiceReq(nodeReq);
                if (!reqResult.isOk) {
                        // TODO: Better error
                        nodeRes.statusCode = 400;
			nodeRes.setHeader("Access-Control-Allow-Origin", clientOrigin);
                        nodeRes.end();
                        return;
                }
                const req = reqResult.data;
                const res = await responder(req);
                nodeRes.statusCode = res.status;
                nodeRes.end(res.body);
        });
        server.listen(8080);
}

async function nodeReqToNiceReq(
        nodeReq: NodeReq,
): Promise<result.Result<Req, errors.ServerError>> {
        const path = parsePath(nodeReq.url ?? "/");
        const methodResult = getMethod(nodeReq.method ?? "");
        if (!methodResult.isOk) {
                return { isOk: false, error: methodResult.error };
        }
        const method = methodResult.data;
        const bodyResult = await getBody(nodeReq);
        if (!bodyResult.isOk) {
                return { isOk: false, error: bodyResult.error };
        }
        const body = bodyResult.data;
        const req: Req = { body, path, method };
        return { isOk: true, data: req };
}

function parsePath(pathString: string): string[] {
        if (pathString[0] === "/") {
                pathString = pathString.substring(1);
        }
        if (pathString[pathString.length - 1] === "/") {
                pathString = pathString.substring(0, pathString.length - 1);
        }
        return pathString.split("/");
}

function getMethod(method: string): result.Result<Method, errors.ServerError> {
        if (method === "GET") {
                return { isOk: true, data: "GET" };
        }
        if (method === "POST") {
                return { isOk: true, data: "POST" };
        }
        if (method === "PUT") {
                return { isOk: true, data: "PUT" };
        }
        if (method === "DELETE") {
                return { isOk: true, data: "DELETE" };
        }

        const error: errors.ServerError = {
                code: "requested_method_not_allowed",
                method,
        };
        return { isOk: false, error };
}

async function getBody(
        nodeReq: NodeReq,
): Promise<result.Result<string, errors.ServerError>> {
        // TODO: There may be an error here if the promise resolves but the event handlers
        // stick around.
        return new Promise((resolve) => {
                let body = "";
                nodeReq.on("data", (chunk) => {
                        body += chunk;
                });
                nodeReq.on("error", () => {
                        const error: errors.ServerError = {
                                code: "request_invalid",
                        };
                        resolve({ isOk: false, error });
                });
                nodeReq.on("end", () => {
                        if (!nodeReq.complete) {
                                const error: errors.ServerError = {
                                        code: "connection_terminated",
                                };
                                resolve({ isOk: false, error });
                                return;
                        }
                        resolve({ isOk: true, data: body });
                });
        });
}

export function matchPathSegmentAndMethod(
        method: Method,
        pathSegment: string,
        pathSegmentI: number,
        req: Req,
): boolean {
        if (req.method !== method) {
                return false;
        }
        if (req.path[pathSegmentI] !== pathSegment) {
                return false;
        }
        return true;
}

export function matchPathSegment(
        pathSegment: string,
        pathSegmentI: number,
        req: Req,
): boolean {
        if (req.path[pathSegmentI] !== pathSegment) {
                return false;
        }
        return true;
}

export function extractPathSegment(
        i: number,
        req: Req,
): result.Result<string, {}> {
        const segment = req.path[i];
        if (segment === undefined) {
                return { isOk: false, error: {} };
        }
        return { isOk: true, data: segment };
}
