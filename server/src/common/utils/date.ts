import dayjs from "dayjs";

type Unit = "year" | "month" | "day" | "hour" | "minute" | "second" | "week";

export function getValidity(value: number, unit: Unit): Date {
  return dayjs().add(value, unit).toDate();
}
