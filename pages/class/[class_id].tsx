/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Button, Center, Checkbox, HStack, Input, Table, Tbody, Td, Text, Th, Thead, Tr, VStack} from "@chakra-ui/react";
import {GetServerSideProps} from "next";
import {useRouter} from "next/router";
import React, {ChangeEvent, useRef, useState} from "react";

import {Attendance, Class, Student} from "../../src/interfaces";

import DatesHeader from "../../components/DatesHeader";
import Layout from "../../components/Layout";

import {getStudentAttendanceOnDates} from "../../src/attendance";
import {redirectToHome} from "../../src/constants";
import {classById} from "../../src/database/read/classes";
import {studentsAllByClassId} from "../../src/database/read/students";
import {getISODate} from "../../src/date";
import {getDaysInRange, parseDateRangeInQuery} from "../../src/date_range";
import {assembleRedirect} from "../../src/utils";
import getUser from "../../src/auth";

type Props = {
	attendances: Attendance[],
	class_: Class,
	students: Student[]
};

export const getServerSideProps: GetServerSideProps = async function({params, query, req}) {
	const user = await getUser(req);
	if (!user) {
		return redirectToHome;
	}

	const id = parseInt(params?.class_id as string);
	const class_ = await classById(id);

	if (!class_) {
		return assembleRedirect("/classes");
	}

	const students = await studentsAllByClassId(id);

	const dates = getDaysInRange(7, parseDateRangeInQuery(query));
	const attendances = await Promise.all(students.map(async function(student) {
		return await getStudentAttendanceOnDates(student.student_id, dates);
	}));

	return {
		props: {
			attendances,
			class_,
			students
		}
	}
}

function ClassAttendance({attendances, class_, students}: Props) {
	const dates = Object.keys(attendances[0]).map(d => new Date(d));

	const router = useRouter();
	const [data, setData] = useState(attendances);

	const modifications = useRef<{[key: string]: Attendance}>({});
	const startRef = useRef<HTMLInputElement>(null);
	const endRef = useRef<HTMLInputElement>(null);

	async function updateDates() {
		const start = startRef.current?.value;
		const end = endRef.current?.value;
		if (start && end) {
			await router.push(`/class/${class_.class_id}?start=${start}&end=${end}`);
		}
	}

	async function updateAttendance() {
		await fetch(`/api/class/${class_.class_id}`, {
			method: "PUT",
			headers: new Headers({
				"Content-Type": "application/json"
			}),
			credentials: "same-origin",
			body: JSON.stringify(modifications.current)
		});
		window.location.reload();
	}

	return (
		<Layout title={`Class Attendance (${class_.class_id})`}>
			<VStack align="center" justify="start">
				<HStack justify="center" spacing={3}>
					<Text>From:</Text>
					<Input type="date" ref={startRef} defaultValue={getISODate(dates[0])} size="sm"/>
					<Text>To:</Text>
					<Input type="date" ref={endRef} defaultValue={getISODate(dates[dates.length - 1])} size="sm"/>
					<Button onClick={updateDates} colorScheme="cyan">Dates</Button>
				</HStack>
				<Text>
					Class ID: {class_.class_id}<br/>
					Name: {class_.class_name}<br/>
					Level ID: {class_.level_id}<br/>
					Students: {students.length}
				</Text>
				<Table size="sm">
					<Thead>
						<Tr>
							<Th><Center>Student ID</Center></Th>
							<Th><Center>Name</Center></Th>
							<DatesHeader dates={dates}/>
						</Tr>
					</Thead>
					<Tbody>
						{data.map((attendance, index) => {
							let student = students[index];

							return (
								<Tr key={student.student_id}>
									<Td><Center>{student.student_id}</Center></Td>
									<Td><Center>{student.student_name}</Center></Td>
									{dates.map((date) => {
										function handleChange(event: ChangeEvent<HTMLInputElement>) {
											if (!modifications.current[student.student_id]) {
												modifications.current[student.student_id] = {};
											}
											modifications.current[student.student_id][date.toString()] = event.target.checked;

											const newData = [...data];
											newData[index][date.toString()] = event.target.checked;
											setData(newData);
										}

										return attendance[date.toString()] ? (
											<Td key={date.toString()}>
												<Center>
													<Checkbox defaultChecked onChange={handleChange} colorScheme="blue"/>
												</Center>
											</Td>
										) : (
											<Td key={date.toString()}>
												<Center>
													<Checkbox onChange={handleChange} colorScheme="blue"/>
												</Center>
											</Td>
										);
									})}
								</Tr>
							);
						})}
					</Tbody>
				</Table>
				<Button onClick={updateAttendance} colorScheme="blue" size="sm">Submit</Button>
			</VStack>
		</Layout>
	);
}

export default ClassAttendance;
