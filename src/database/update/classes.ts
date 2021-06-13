import supabase from "../../server";

async function updateClass(class_id: number, name: string, level_id: number): Promise<boolean> {
	try {
		const {data, error} = await supabase
			.from("classes")
			.upsert({
				class_id,
				name,
				level_id
			});

		if (error || !data) {
			throw error || new Error("No Data");
		}
		return true;
	} catch (error) {
		console.warn(error);
		return false
	}
}

export {
	updateClass
};
