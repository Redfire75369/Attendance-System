import {addWeeks, isValid, startOfDay, startOfToday, subWeeks} from "date-fns";
import {ParsedUrlQuery} from "querystring";
import {Day, nextDay, prevDay} from "./day";

function getDaysInRange(day: Day, [start, end]: [Date, Date]): Date[] {
	const first = nextDay(day, start);
	const last = prevDay(day, end);

	let dates: Date[] = [];
	for (let date = first; date <= last; date = addWeeks(date, 1)) {
		dates.push(date);
	}
	return dates;
}

function getDaysInYear(day: Day, year: number): Date[] {
	return getDaysInRange(day, [new Date(`${year}-01-01`), new Date(`${year}-12-31`)]);
}

function parseDateRangeInQuery(query: ParsedUrlQuery): [Date, Date] {
	const start = isValid(new Date(query.start as string)) ? startOfDay(new Date(query.start as string)) : subWeeks(startOfToday(), 4);
	const end = isValid(new Date(query.end as string)) ? startOfDay(new Date(query.end as string)) : startOfToday();

	return [start, end];
}

export {
	getDaysInRange,
	getDaysInYear,
	parseDateRangeInQuery
};
