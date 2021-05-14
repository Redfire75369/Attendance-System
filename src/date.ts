function getFullDate(date: Date, includesYear: number = 0): string {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	switch (includesYear) {
		case 0: {
			return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}`;
		}
		case 1: {
			return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${date.getFullYear() % 100}`;
		}
		case 2: {
			return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${date.getFullYear()}`;
		}
		default: {
			return "";
		}
	}
}

function getISODate(date: Date): string {
	const day = date.getUTCDate();
	const month = date.getMonth() + 1;
	return `${date.getUTCFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
}

//export default getDate;
export {
	//getAmericanDateFormat,
	getFullDate,
	getISODate
};
