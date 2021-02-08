import {idToClass} from "../../src/api/attendance";
import {attendanceIdsAll} from "../../src/api/database/all";
import studentById from "../../src/api/database/by_id";
import {recordsAllByStudent} from "../../src/api/database/records";
import {StudentAttendance} from "../../interfaces";
import Layout from "../../components/Layout";
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType} from "next";

export const getStaticPaths: GetStaticPaths  = async function() {
	const ids = await attendanceIdsAll();
	const paths = ids.map((id) => `/students/${id}`);
	console.log(paths);

	return {
		paths,
		fallback: false
	};
}

export const getStaticProps: GetStaticProps = async function(context) {
	let {params} =  context;
	const studentData = await studentById(params.student_id);
	const records = await recordsAllByStudent(params.student_id);
	let attendance: { [date: string]: boolean } = {};

	if (records !== null) {
		records.forEach((v) => {
			attendance[v.date.toString()] = v.attendance;
		});
	}

	return {
		props: {
			student: studentData,
			attendance: attendance
		},
		revalidate: 20
	};
}

function DataLabel({attendance}: { attendance: { [date: string]: boolean } }) {
	const dates = Object.keys(attendance);
	return (
		<tr>
			<td>ID</td>
			<td>Name</td>
			<td>Class</td>
			<td>Total</td>
			{dates.map((date) => {
				return <td key={date}>{date}</td>;
			})}
		</tr>
	);
}

function StudentData({student, attendance}: {student: StudentAttendance, attendance: { [date: string]: boolean } }) {
	const dates = Object.keys(attendance);
	return (
		<tr>
			<form action={`/api/students/${student.family_id + student.identifier}`}>
				<td>{student.family_id + student.identifier}</td>
				<td>{student.name}</td>
				<td>{idToClass[student.class_id]}</td>
				<td>{dates.length}</td>
				{dates.map((date) => {
					return attendance[date] ? (
						<td key={date.toString()}>
							<input type="checkbox" checked name={date.toString()}/>
						</td>
					) : (
						<td key={date.toString()}>
							<input type="checkbox" name={date.toString()}/>
						</td>
					);
				})}
				<td key="submit">
					<button id={student.family_id + student.identifier}>Submit</button>
				</td>
			</form>
		</tr>
	);
}

export default function StudentAttendanceTable({student, attendance}: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<Layout title="Student Attendance">
			<table>
				<DataLabel attendance={attendance}/>
				<StudentData student={student} attendance={attendance}/>
			</table>
		</Layout>
	);
}

export {
	DataLabel,
	StudentData
};
