import openDatabase from "./database/database";
/*import {Database} from "sqlite";

let database: Database;
(async function() {
	database = await openDatabase();
})();*/

const database = openDatabase();

export default database;
