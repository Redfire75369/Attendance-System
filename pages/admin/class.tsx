/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {GetServerSideProps} from "next";
import getUser from "../../src/auth";
import {redirectToHome} from "../../src/constants";
import {classesAll} from "../../src/database/read/classes";
import {AttendanceUser, Class} from "../../src/interfaces";
import {useEffect, useRef, useState} from "react";
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
import Layout from "../../components/Layout";
import Header from "../../components/Header";
import {isValidId} from "../../src/utils";
import {ChevronDownIcon} from "@chakra-ui/icons";

type Props = {
	classes: Class[],
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

	const classes = await classesAll();

	return {
		props: {
			classes,
			user
		}
	};
}

function ClassEditor({classes, user}: Props) {
	const [classIndex, setClassIndex] = useState(-1);
	const [class_, setClass] = useState<Class | null>(null);

	const [option, setOption] = useState(Option.NONE);

	const {isOpen, onOpen, onClose} = useDisclosure();
	const cancelRef = useRef<FocusableElement | null>(null);

	useEffect(function () {
		setClass(classes[classIndex]);
	}, [classIndex]);

	async function modifyClass() {
		if (class_ !== null && isValidId(class_.class_id) && class_.class_name !== "" && isValidId(class_.level_id)) {
			if (option === Option.ADD || option === Option.EDIT) {
				const res = await fetch(`/api/class/${class_.class_id}`, {
					method: "PUT",
					headers: new Headers({
						"Content-Type": "application/json"
					}),
					credentials: "same-origin",
					body: JSON.stringify({
						class: class_
					})
				});

				if (res.status === 200) {
					window.location.reload();
				}
			} else if (option === Option.DELETE) {
				const res = await fetch(`/api/class/${class_.class_id}`, {
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

	return (
		<Layout>
			<VStack justify="start">
				<Header user={user}/>
				<HStack>
					<Button colorScheme="cyan" onClick={function() {
						setOption(Option.ADD);
						setClass({
							class_id: -1,
							class_name: "",
							level_id: -1
						});
					}}>Add New Class</Button>
					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon/>} colorScheme="cyan">Select Class to Edit</MenuButton>
						<MenuList>
							{
								classes.map(function(class_, index) {
									return (
										<MenuItem onClick={function() {
											setOption(Option.EDIT);
											setClassIndex(index);
										}} key={class_.class_id}>{class_.class_name}</MenuItem>
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
										<Th>Class ID</Th>
										<Th>Class Name</Th>
										<Th>Level ID</Th>
									</Tr>
								</Thead>
								<Tbody>
									<Tr>
										<Td>
											{option === Option.ADD ? (
												<Input onChange={function(e) {
													const id = parseInt(e.target.value);

													if (class_ !== null && (id >= 0 || isNaN(id))) {
														setClass({
															...class_,
															class_id: id
														})
													}
												}} value={isValidId(class_?.class_id) ? class_?.class_id : ""} colorScheme="cyan"/>
											) : (
												<Input value={isValidId(class_?.class_id) ? class_?.class_id : ""} isReadOnly/>
											)}
										</Td>
										<Td>
											<Input onChange={function (e) {
												if (class_ !== null) {
													setClass({
														...class_,
														class_name: e.target.value
													})
												}
											}} value={class_?.class_name ?? ""} colorScheme="cyan"/>
										</Td>
										<Td>
											<Input onChange={function (e) {
												const id = parseInt(e.target.value);

												if (class_ !== null && (id >= 0 || isNaN(id))) {
													setClass({
														...class_,
														level_id: id
													})
												}
											}} value={isValidId(class_?.level_id) ? class_?.level_id : ""} colorScheme="cyan"/>
										</Td>
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
								}}>Delete Class</Button>
							) : <></>}
						</HStack>
					</>
				) : <></>}
			</VStack>

			<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Edit Class
						</AlertDialogHeader>

						<AlertDialogBody>
							{option === Option.ADD ? <Text>Are you sure? This addition can't be undone afterwards</Text>
								: option === Option.EDIT ? <Text>Are you sure? This edit can't be undone afterwards</Text>
									: option === Option.DELETE ? <Text>Are you sure? This deletion can't be undone afterwards</Text>
										: <></>
							}

							{option !== Option.NONE ? (
								<>
									<Text>Class ID: {class_?.class_id ?? ""}</Text>
									<Text>Class Name: {class_?.class_name ?? ""}</Text>
									<Text>Level: {class_?.level_id ?? ""}</Text>
								</>
							) : <></>}
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button colorScheme="red" onClick={onClose}>
								Cancel
							</Button>
							<Button colorScheme="blue" onClick={modifyClass} ml={3}>
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

export default ClassEditor;
