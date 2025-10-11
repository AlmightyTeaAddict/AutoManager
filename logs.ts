export type Logs = Log[];
export type Log = {
        type: "error" | "info";
        message: string;
        tick: number;
        source: string;
};

export function formatLog(log: Log): string {
        return `${log.type}: ${log.source}: ${log.message}`;
}

export function addLog(logs: Logs, log: Log) {
        logs.push(log);
        console.log(formatLog(log));
}
