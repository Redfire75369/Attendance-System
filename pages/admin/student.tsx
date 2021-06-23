/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Layout from "../../components/Layout";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	HStack,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure,
	VStack
} from "@chakra-ui/react";
import {FocusableElement} from "@chakra-ui/utils";
import {GetServerSideProps} from "next";
import getUser from "../../src/auth";
import {redirectToHome} from "../../src/constants";
import {AttendanceUser, Class, StudentWithClassName} from "../../src/interfaces";
import Header from "../../components/Header";
import {useEffect, useRef, useState} from "react";
import {studentsWithClassNamesAll} from "../../src/database/read/students";
import {classesAll} from "../../src/database/read/classes";
import {isValidId} from "../../src/utils";
import {ChevronDownIcon} from "@chakra-ui/icons";

type Props = {
	classes: Class[],
	students: StudentWithClassName[],
	user: AttendanceUser
};

enum Option {
	NONE = 0,
	ADD = 1,
	EDIT = 2,
	DELETE = 3
}

export const getServerSideProps: GetServerSideProps = async function ({req}) {
	const user = await getUser(req);
	if (!user || !user.permissions.admin) {
		return redirectToHome;
	}

	const students = await studentsWithClassNamesAll();
	const classes = await classesAll();

	return {
		props: {
			classes,
			students,
			user
		}
	};
}

function StudentEditor({classes, students, user}: Props) {
	const [studentIndex, setStudentIndex] = useState(-1);
	const [student, setStudent] = useState<StudentWithClassName | null>(null);

	const [option, setOption] = useState(Option.NONE);

	const {isOpen, onOpen, onClose} = useDisclosure();
	const cancelRef = useRef<FocusableElement | null>(null);

	useEffect(function () {
		setStudent(students[studentIndex]);
	}, [studentIndex]);

	// TODO: Prevent editing an existing student if adding a new student
	// TODO: Display errors to user
	async function modifyStudent() {
		if (student !== null && student.student_id !== "" && student.student_name !== "" && isValidId(student.class_id)) {
			if (option === Option.ADD || option === Option.EDIT) {
				const res = await fetch(`/api/student/${student.student_id}`, {
					method: "PUT",
					headers: new Headers({
						"Content-Type": "application/json"
					}),
					credentials: "same-origin",
					body: JSON.stringify({student})
				});

				if (res.status === 200) {
					window.location.reload();
				}
			} else if (option === Option.DELETE) {
				const res = await fetch(`/api/student/${student.student_id}`, {
					method: "DELETE",
					headers: new Headers(),
					credentials: "same-origin"
				});

				if (res.status === 200) {
					window.location.reload();
				}
				setOption(Option.EDIT);
			}
		}

		onClose();
	}

	function ClassSelector() {
		function setClass(index: number) {
			if (student !== null) {
				setStudent({
					...student,
					class_id: classes[index].class_id,
					class: {
						class_name: classes[index].class_name
					}
				});
			}
		}

		return (
			<Td>
				<HStack>
					<Text>{student?.class?.class_name ?? ""}</Text>
					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon/>} colorScheme="cyan">Class</MenuButton>
						<MenuList>
							{
								classes.map(function(class_, index) {
									return (
										<MenuItem onClick={() => setClass(index)} key={class_.class_id}>{class_.class_name}</MenuItem>
									);
								})
							}
						</MenuList>
					</Menu>
				</HStack>
			</Td>
		);
	}

	return (
		<Layout>
			<VStack justify="start">
				<Header user={user}/>
				<HStack>
					<Button colorScheme="cyan" onClick={function() {
						setOption(Option.ADD);
						setStudent({
							student_id: "",
							student_name: "",
							class_id: -1,
							class: {
								class_name: ""
							}
						});
					}}>Add New Student</Button>
					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon/>} colorScheme="cyan">Select Student to Edit</MenuButton>
						<MenuList>
							{
								students.map(function(student, index) {
									return (
										<MenuItem onClick={function() {
											setOption(Option.EDIT);
											setStudentIndex(index);
										}} key={student.student_id}>{student.student_name}</MenuItem>
									);
								})
							}
						</MenuList>
					</Menu>
				</HStack>
				{option !== Option.NONE ? (
					<>
						<HStack>
							<Table>
								<Thead>
									<Tr>
										<Th>Student ID</Th>
										<Th>Name</Th>
										<Th>Class Name</Th>
									</Tr>
								</Thead>
								<Tbody>
									<Tr>
										<Td>
											{option === Option.ADD ? (
												<Input onChange={function(e) {
													if (student !== null) {
														setStudent({
															...student,
															student_id: e.target.value
														})
													}
												}} value={student?.student_id ?? ""} colorScheme="cyan"/>
											) : (
												<Input value={student?.student_id ?? ""} isReadOnly/>
											)}
										</Td>
										<Td>
											<Input onChange={function (e) {
												if (student !== null) {
													setStudent({
														...student,
														student_name: e.target.value
													})
												}
											}} value={student?.student_name ?? ""} colorScheme="cyan"/>
										</Td>
										<ClassSelector/>
									</Tr>
								</Tbody>
							</Table>
						</HStack>
						<HStack>
							<Button onClick={onOpen}>Submit Changes</Button>
							{option === Option.EDIT || option === Option.DELETE ? (
								<Button onClick={function() {
									setOption(Option.DELETE);
									onOpen();
								}}>Delete Student</Button>
							) : <></>}
						</HStack>
					</>
				) : <></>}
			</VStack>

			<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">{option === Option.ADD ? "Add Student" : option === Option.EDIT ? "Edit Student" : "Delete Student"}</AlertDialogHeader>

						<AlertDialogBody>
							{option === Option.ADD ? <Text>Are you sure? This addition can't be undone afterwards</Text>
								: option === Option.EDIT ? <Text>Are you sure? This edit can't be undone afterwards</Text>
									: option === Option.DELETE ? <Text>Are you sure? This deletion can't be undone afterwards</Text>
										: <></>
							}

							{option !== Option.NONE ? (
								<>
									<Text>Student ID: {student?.student_id ?? ""}</Text>
									<Text>Student Name: {student?.student_name ?? ""}</Text>
									<Text>Class Name: {student?.class?.class_name ?? ""}</Text>
								</>
							) : <></>}
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button colorScheme="red" onClick={onClose}>
								Cancel
							</Button>
							<Button colorScheme="blue" onClick={modifyStudent} ml={3}>
								{option === Option.ADD ? "Confirm Addition"
									: option === Option.EDIT ? "Confirm Edits"
										: option === Option.DELETE ? "Confirm Deletion"
											: ""}
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</Layout>
	);
}

export default StudentEditor;
