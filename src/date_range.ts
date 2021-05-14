import {addDays, isValid, startOfDay, startOfToday, subWeeks} from "date-fns";
import {ParsedUrlQuery} from "querystring";

function getDaysInRange(day: number, [start, end]: [Date, Date]): Date[] {
	const first = startOfDay(start);
	first.setUTCDate(start.getUTCDate() - start.getUTCDay() + day);

	const last = startOfDay(end);
	last.setUTCDate(end.getUTCDate() - end.getUTCDay() + day % 7);

	let dates: Date[] = [];
	for (let date = first; date <= last; date = addDays(date, 7)) {
		dates.push(date);
	}
	return dates;
}

function getDaysInYear(day: number, year: number): Date[] {
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
