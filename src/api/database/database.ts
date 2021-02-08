import sqlite3 from "sqlite3";
import {open} from "sqlite";

export default async function openDatabase() {
	return await open({
		filename: "C:\\Users\\Afzal/Desktop\\attendance\\databases\\attendance.db",
		driver: sqlite3.cached.Database
	});
}
