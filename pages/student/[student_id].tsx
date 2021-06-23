/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Button, Center, Checkbox, HStack, Input, Table, Tbody, Td, Text, Thead, Tr, VStack} from "@chakra-ui/react";
import {GetServerSideProps} from "next";
import {useRouter} from "next/router";
import React, {ChangeEvent, useRef, useState} from "react";

import {Attendance, AttendanceUser, Student} from "../../src/interfaces";

import Layout from "../../components/Layout";
import DatesHeader from "../../components/DatesHeader";

import {getStudentAttendanceOnDates} from "../../src/attendance";
import {redirectToHome} from "../../src/constants";
import {studentById} from "../../src/database/read/students";
import {classNameById} from "../../src/database/read/classes";
import {getISODate} from "../../src/date";
import {getDaysInRange, parseDateRangeInQuery} from "../../src/date_range";
import {assembleRedirect} from "../../src/utils";
import getUser from "../../src/auth";
import Header from "../../components/Header";

type Props = {
	attendance: Attendance,
	className: string,
	student: Student,
	user: AttendanceUser
};

export const getServerSideProps: GetServerSideProps = async function({params, query, req}) {
	const user = await getUser(req);
	if (!user) {
		return redirectToHome;
	}

	const id = params?.student_id as string;
	const student = await studentById(id);

	if (!student) {
		return assembleRedirect("/students");
	}

	const className = await classNameById(student.class_id);

	const dates = getDaysInRange(7, parseDateRangeInQuery(query));
	const attendance = await getStudentAttendanceOnDates(id, dates);

	return {
		props: {
			attendance,
			className,
			student,
			user
		}
	};
}

function StudentAttendance({attendance, className, student, user}: Props) {
	const dates = Object.keys(attendance).map(d => new Date(d));
	const present = dates.reduce(function(prev, date) {
		return prev + (attendance[date.toString()] ? 1 : 0);
	}, 0);

	const router = useRouter();
	const [data, setData] = useState<Attendance>(attendance);

	const modifications = useRef<Attendance>({});
	const startRef = useRef<HTMLInputElement>(null);
	const endRef = useRef<HTMLInputElement>(null);

	async function updateDates() {
		const start = startRef.current?.value;
		const end = endRef.current?.value;
		if (start && end) {
			await router.push(`/student/${student.student_id}?start=${start}&end=${end}`);
		}
	}

	async function updateAttendance() {
		await fetch(`/api/student/${student.student_id}/attendance`, {
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
		<Layout title={`Student Attendance (${student.student_id})`}>
			<VStack align="center" justify="start">
				<Header user={user}/>
				<HStack justify="center" spacing={3}>
					<Text>From:</Text>
					<Input type="date" ref={startRef} defaultValue={getISODate(dates[0])} size="sm"/>
					<Text>To:</Text>
					<Input type="date" ref={endRef} defaultValue={getISODate(dates[dates.length - 1])} size="sm"/>
					<Button onClick={updateDates} colorScheme="cyan">Dates</Button>
				</HStack>
				<Text>
					Student ID: {student.student_id}<br/>
					Name: {student.student_name}<br/>
					Class: {className}<br/>
					Total Attendance: {dates.length} ({present} Present)
				</Text>
				<Table size="sm">
					<Thead>
						<Tr>
							<DatesHeader dates={dates}/>
						</Tr>
					</Thead>
					<Tbody>
						<Tr>
							{dates.map((date) => {
								function handleChange(event: ChangeEvent<HTMLInputElement>) {
									modifications.current[date.toString()] = event.target.checked;
									setData({
										...data,
										[date.toString()]: event.target.checked
									});
								}

								return data[date.toString()] ? (
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
					</Tbody>
				</Table>
				<Button onClick={updateAttendance} colorScheme="blue" size="sm">Submit</Button>
			</VStack>
		</Layout>
	);
}

export default StudentAttendance;
