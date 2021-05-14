import {addDays, startOfDay} from "date-fns";

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

export {
	getDaysInRange,
	getDaysInYear
};
