import * as utils from "./utils.ts";

export type GeneralError =
        | { module: "user"; userError: UserError }
        | { module: "server"; serverError: ServerError };

export function generalErrorToMessage(e: GeneralError): string {
        if (e.module === "user") {
                return `user: ${userErrorToMessage(e.userError)}`;
        }
        if (e.module === "server") {
                return `server: ${serverErrorToMessage(e.serverError)}`;
        }
        return utils.never();
}

export type UserError = {
        code: "scheduled_script_does_not_exist";
        name: string;
};

export function userErrorToMessage(e: UserError): string {
        if (e.code === "scheduled_script_does_not_exist") {
                return `A script named "${e.name}" was scheduled to run now but it doesn't exist.`;
        }
        return utils.never();
}

export type ServerError =
        | {
                  code: "requested_method_not_allowed";
                  method: string;
          }
        | {
                  code: "request_invalid";
          }
        | {
                  code: "connection_terminated";
          };

export function serverErrorToMessage(e: ServerError): string {
        if (e.code === "requested_method_not_allowed") {
                return `The server received a request using the "${e.method}" method, which is not allowed.`;
        }
        if (e.code === "request_invalid") {
                return `The server received a request with invalid syntax.`;
        }
        if (e.code === "connection_terminated") {
                return `The server's connection was terminated before it received the full requset body.`;
        }
        return utils.never();
}
