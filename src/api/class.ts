import studentById from "./database/by_id";
import {idToClass} from "./attendance";
import database from "./server";
import {studentIdsClassByClassId} from "./database/by_class_id";

async function updateClassSingle(id: string, new_class_id: number) {
	const student = await studentById(id);
	if (student === null) {
		return;
	}

	if (idToClass[new_class_id] !== undefined) {
		await (await database).run(`UPDATE attendance
   			SET class_id = '${new_class_id}'
   			WHERE id = '${id}'`);
	}
}

async function updateClassMultiple(ids: string[], new_class_id: number) {
	if (idToClass[new_class_id] !== undefined) {
		for (const id of ids) {
			await updateClassSingle(id, new_class_id);
		}
	}
}

async function updateClassClass(class_id: number, new_class_id: number) {
	if (idToClass[class_id] !== undefined && idToClass[new_class_id] !== undefined) {
		let ids = await studentIdsClassByClassId(class_id);

		for (const id of ids) {
			await updateClassSingle(id, new_class_id);
		}
	}
}

export {
	updateClassSingle,
	updateClassMultiple,
	updateClassClass
};
