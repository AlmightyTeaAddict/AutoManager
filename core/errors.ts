export type GeneralError = { module: "user"; userError: UserError };

export function generalErrorToMessage(e: GeneralError): string {
        if (e.module === "user") {
                return `user: ${userErrorToMessage(e.userError)}`;
        }
        throw new Error("Invalid module");
}

export type UserError = {
        code: "scheduled_script_does_not_exist";
        name: string;
};

export function userErrorToMessage(e: UserError): string {
        if (e.code === "scheduled_script_does_not_exist") {
                return `A script named "${e.name}" was scheduled to run now but it doesn't exist.`;
        }
        throw new Error("Invalid code");
}
