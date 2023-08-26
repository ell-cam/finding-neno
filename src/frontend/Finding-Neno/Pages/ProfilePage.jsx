import { useNavigation } from '@react-navigation/native';
import { Box, Image, Heading, HStack, VStack, Button, Text, ScrollView, Link } from "native-base";
import { Dimensions } from 'react-native';
import { Color } from "../components/atomic/Theme";
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import PetCard from "../components/PetCard";
import { Checkbox } from 'native-base';
import { DeleteIcon } from "native-base";

import { useSelector, useDispatch } from "react-redux";
import store from '../store/store';
import pet, { selectPet } from '../store/pet';

export default function ProfilePage({ navigation: { navigate } }) {
	const navigation = useNavigation();

	const { IP, PORT } = useSelector((state) => state.api)
	const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

	const isFocused = useIsFocused();
	const dispatch = useDispatch();

	const myPet = {
		name: '',
		image_url: '',
		animal: '',
		breed: '',
		description: '',
		owner_id: USER_ID,
	};
	dispatch(selectPet(myPet));
	console.log(store.getState());

	const [pets, setPets] = useState([]);
	const [user, setUser] = useState([]);
	const [editMode, setEditMode] = useState(false);
	const [selectedPets, setSelectedPets] = useState([]);
	const [selectedPetCount, setSelectedPetCount] = useState(0);

	useEffect(() => {
		if (isFocused) {
			fetchOwnerPets();
			fetchProfileInfo();
		}
	}, [isFocused]);

	const fetchOwnerPets = async () => {
		try {
			const url = `${IP}:${PORT}/get_owner_pets/${USER_ID}`;
			const response = await fetch(url, {
				headers: {
					method: "GET",
					'Authorization': `Bearer ${ACCESS_TOKEN}`
				}
			});

			if (!response.ok) {
				throw new Error('Request failed with status ' + response.status);
			}
			const pets = await response.json();
			setPets(pets);
			//const petTuples = data.map( (pet) => [pet["name"], pet["id"]]);

			//setDropdownOptions(petTuples)
		} catch (error) {
			console.log("error in profile page")
			console.log(error);
		}
	}

	// Retrieve Profile Information
	const fetchProfileInfo = async () => {
		try {
			const url = `${IP}:${PORT}/retrieve_profile/${USER_ID}`;
			const response = await fetch(url, {
				headers: {
					method: "GET",
					'Authorization': `Bearer ${ACCESS_TOKEN}`
				}
			});

			if (!response.ok) {
				throw new Error('Request failed with status ' + response.status);
			}
			const profile_info = await response.json();
			setUser(profile_info);
			console.log(user)
		} catch (error) {
			console.log("error in profile page")
			console.log(error);
		}
	}

	const deleteSelectedPets = () => {
		// Implement logic to delete selected pets here
		// ...

		// After deletion, clear the selectedPets array
		setSelectedPets([]);
		setSelectedPetCount(0);
	}


	const windowWidth = Dimensions.get('window').width;
	const windowHeight = Dimensions.get('window').height;


	// TODO: Replace with actual data
	const name = user.name;
	const email = user.email;
	const phone = user.phone;

	//const myPet = {name: 'Fluffy', image_url: 'file:///var/mobile/Containers/Data/Application/0665E6EF-36E6-4CFB-B1A3-CEE4BEE897F3/Library/Caches/ExponentExperienceData/%2540anonymous%252FFinding-Neno-cdca0d8b-37fc-4634-a173-5d0d16008b8f/ImagePicker/C1B3D22E-AB20-4864-A113-3989CCDCC0A8.jpg', animal: 'bird', breed: 'Per', description: 'A fluffy cat', owner_id: 1};

	const petCards = () => {
		if (pets.length > 0) {
		  return (
			<VStack>
			  {pets.map((pet, index) => (
				<Box
				  key={index}
				  width={editMode ? '72%' : '80%'}
				  paddingHorizontal={editMode ? 3 : 0}
				  marginBottom={editMode ? 4 : 0}
				  position="relative" // To enable absolute positioning of the edit icon
				>
				  <HStack width="100%">
					{editMode && (
					  <VStack
						alignItems="center"
						justifyContent="center"
						width={3}
						marginEnd={10}
					  >
						<Checkbox
							isChecked={selectedPets.includes(pet.id)}
							onChange={(isChecked) => {
								if (isChecked) {
								// If the checkbox is checked, add the pet to the selectedPets array
								setSelectedPets((prevSelectedPets) => [...prevSelectedPets, pet.id]);
								} else {
								// If the checkbox is unchecked, remove the pet from the selectedPets array
								setSelectedPets((prevSelectedPets) => prevSelectedPets.filter((id) => id !== pet.id));
								}
							}}
							aria-label={`Select ${pet.name}`}
							marginEnd={20}
						></Checkbox>
					  </VStack>
					)}
					<VStack width="100%">
					  {/* Pet Card Content */}
					  <PetCard color={Color.NENO_BLUE} height={150} pet={pet} />
					</VStack>
				  </HStack>
				  {editMode && (
					<Button
					  // Adjust the position and styling of the edit icon as needed
					  position="absolute"
					  bottom={5}
					  right={2}
					  size="sm"
					  bg="transparent"
					  onPress={() => {
						// Handle the edit action here
						// Navigate to the edit page or perform edit logic
					  }}
					>
					  <Image size={19.5} alt="Edit" source={require('../assets/edit-icon.webp')} />
					</Button>
				  )}
				</Box>
			  ))}
			</VStack>
		  );
		} else {
		  return <></>;
		}
	  };
	  

	return (
		<ScrollView>
			<Box alignItems="center" justifyContent="center">
				<Box
					alignSelf="center"
					_text={{
						alignSelf: "center",
						justifyContent: "center",
						fontSize: "lg",
						fontWeight: "medium",
						color: "warmGray.50",
						letterSpacing: "lg"
					}}
					bg={Color.NENO_BLUE}
					width={windowWidth}
					height={windowHeight / 8}
				>
					<Box height={3} />
					<HStack>
						<Box width={8} />
						<Box
							bg="#FFFFFF"
							height={76}
							width={76}
							borderRadius={38}
							alignSelf="center"
							alignItems="center"
							justifyContent="center"
						>
							<Image
								alignSelf="center" size={70} borderRadius={35}
								source={{
									uri: "https://wallpaperaccess.com/full/317501.jpg"
								}}
								alt="Alternate Text"
							/>
						</Box>
						<Box width={9} />
						<Heading alignSelf="center" size="lg" fontWeight="600" color="warmGray.200" _dark={{ color: "coolGray.600", }} >
							{name}
						</Heading>
					</HStack>
				</Box>


				<VStack>
					<HStack mt="6" justifyContent="space-between">
						<Heading fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200", }} pr={windowWidth / 3.5}>
							USER DETAILS
						</Heading>
						<Text pl={windowWidth / 3.5}>
						</Text>
					</HStack>

					<Box h="2"></Box>

					<Box bg="gray.200" px="2" py="1" borderRadius="md">
						<HStack mt="2" justifyContent="space-between">
							<Heading fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200", }}>
								Email
							</Heading>
							<Text fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200", }}>
								{email}
							</Text>
						</HStack>
					</Box>

					<Box h="2"></Box>

					<Box bg="gray.200" px="2" py="1" borderRadius="md">
						<HStack mt="2" justifyContent="space-between">
							<Heading fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200", }}>
								Phone
							</Heading>
							<Text fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200", }}>
								{phone}
							</Text>
						</HStack>
					</Box>

				</VStack>

				<Box height={1} />



				<VStack>
						<HStack mt="6" justifyContent="space-between" alignItems="center">
							<Heading fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200" }} pr={windowWidth / 3.5}>
							PETS
							</Heading>

							{editMode ? (
								<HStack alignItems="center">
								<Button
									size="sm"
									marginTop={4}
									onPress={deleteSelectedPets}
									bg="transparent" // Make the button transparent
								>
									<DeleteIcon color="#FF0000" /> {/* Change the color of DeleteIcon */}
								</Button>
								<Text marginLeft={-2}>{selectedPetCount}</Text>
								<Button
									size="sm"
									onPress={() => {
									setEditMode(false);
									setSelectedPetCount(0);
									}}
									variant="link"
									paddingLeft={6}
								>
									Done
								</Button>
							</HStack>
							) : (
							<Button
								pl={windowWidth / 3}
								variant="link"
								onPress={() => setEditMode(true)}
							>
								Edit
							</Button>
							)}
						</HStack>

					<Button
						onPress={() => {
						navigate('New Pet Page');
						}}
						width={windowWidth - 80}
						height="40px"
					>
						Add New Pet
					</Button>
					<Box h="4"></Box>
					</VStack>

					{petCards()}

			</Box>
		</ScrollView>
	)
}