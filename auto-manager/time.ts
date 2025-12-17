import type { State } from "./state.ts";

export type Month =
        | "JAN"
        | "FEB"
        | "MAR"
        | "APR"
        | "MAY"
        | "JUN"
        | "JUL"
        | "AUG"
        | "SEP"
        | "OCT"
        | "NOV"
        | "DEC";
export const numbersToMonths: Month[] = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
];
export type Day = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
export const numbersToDays: Day[] = [
        "SUN",
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
];

export type HumanDateTime = {
        year: number;
        month: Month;
        date: number;
        hr: number;
        min: number;
        s: number;
        ms: number;

        day: Day;
        zoneOffset: number;
};

export type TimeAddition = {
        year: number;
        month: number;
        date: number;
        hr: number;
        min: number;
        s: number;
        ms: number;
};

export type DateTime = number;

export function now(): DateTime {
        return Date.now();
}

export function toStartOfDay(a: DateTime): DateTime {
        const dateTime = new Date(a);
        dateTime.setHours(0);
        dateTime.setMinutes(0);
        dateTime.setSeconds(0);
        dateTime.setMilliseconds(0);
        return dateTime.getTime();
}

export function addHumanUnits(a: DateTime, b: TimeAddition): DateTime {
        const dateTime = new Date(a);
        dateTime.setFullYear(dateTime.getFullYear() + b.year);
        dateTime.setMonth(dateTime.getMonth() + b.month);
        dateTime.setDate(dateTime.getDate() + b.date);
        dateTime.setHours(dateTime.getHours() + b.hr);
        dateTime.setMinutes(dateTime.getMinutes() + b.min);
        dateTime.setSeconds(dateTime.getSeconds() + b.s);
        dateTime.setMilliseconds(dateTime.getMilliseconds() + b.ms);
        return dateTime.getTime();
}

export function toHuman(dateTime: DateTime): HumanDateTime {
        const date = new Date(dateTime);
        const month = numbersToMonths[date.getMonth()] ?? "JAN";
        const day = numbersToDays[date.getDay()] ?? "MON";
        return {
                year: date.getFullYear(),
                month,
                date: date.getDate(),
                hr: date.getHours(),
                min: date.getMinutes(),
                s: date.getSeconds(),
                ms: date.getMilliseconds(),

                day,
                zoneOffset: date.getTimezoneOffset(),
        };
}

export function fromHuman(human: HumanDateTime): DateTime {
        const date = new Date();
        date.setFullYear(human.year);
        const month = numbersToMonths.indexOf(human.month);
        date.setMonth(month);
        date.setDate(human.date);
        date.setHours(human.hr);
        date.setMinutes(human.min);
        date.setSeconds(human.s);
        date.setMilliseconds(human.ms);
        return date.getTime();
}

export type TimeBlock = {
        start: number;
        duration: number;
};

export function requestTimeBlock(state: State, block: TimeBlock): boolean {
        let i = 0;
        for (const comparingBlock of state.timeBlocks) {
                if (comparingBlock.start < block.start) {
                        i++;
                        continue;
                }
                if (comparingBlock.start <= block.start + block.duration) {
                        return false;
                }
        }
        state.timeBlocks.splice(i, 0, block);
        return true;
}

export function deleteFinishedTimeBlocks(state: State, now: number) {
        state.timeBlocks = state.timeBlocks.filter(
                (block) => block.start + block.duration < now,
        );
}
