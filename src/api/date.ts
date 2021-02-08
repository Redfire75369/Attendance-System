// @flow
function getAmericanDateFormat(date: string): string {
	let dateParts = date.split("/");
	[dateParts[0], dateParts[1]] = [dateParts[1], dateParts[0]];

	return dateParts.join("/");
}

function getDate(date: string): Date {
	return new Date(getAmericanDateFormat(date));
}

function getFullDate(date: Date): string {
	const day = date.getUTCDate();
	const month = date.getUTCMonth();
	return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${date.getUTCFullYear()}`
}

export default getDate;
export {getAmericanDateFormat, getFullDate};
