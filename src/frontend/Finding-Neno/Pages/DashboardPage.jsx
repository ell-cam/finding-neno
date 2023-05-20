import {useNavigation} from '@react-navigation/native';
import { Box, Modal, Center, Image, useToast, ScrollView, View, Heading, VStack, HStack, FormControl, Input, Link, Button, Text, Alert, Pressable, Icon, KeyboardAvoidingView} from "native-base";
import {Dimensions} from 'react-native';
import { Color } from "../components/atomic/Theme";
import { useState } from "react";

const DashboardPage = () => {
  const windowWidth = Dimensions.get('window').width; 
  const navigation = useNavigation();
  const toast = useToast();

  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(!modalVisible);
  };

  const handleConfirm = () => {
    setModalVisible(false);
    toast.show({
      description: "Owner has been alerted of your sighting!",
      placement: "top"
    })
  };

  // TODO: replace mock data with real data 
  const image = "https://wallpaperaccess.com/full/317501.jpg";
  const mocks = [{ownerName: 'Sashenka', petName:'Piggy', species: 'Dog', breed: 'Shiba', isActive: true, lastLocation: 'Clayton, Victoria', lastDateTime: '12th May, 12:45pm'},
                  {ownerName: 'Sash', petName:'Bunny', species: 'Rabbit', breed: 'RabbitBreed', isActive: true, lastLocation: 'Melbourne, Victoria', lastDateTime: '15th May, 1:45pm'},
                  {ownerName: 'Ana', petName:'Noni', species: 'Cat', breed: 'House cat', isActive: true, lastLocation: 'Melbourne, Victoria', lastDateTime: '15th May, 1:45pm'},
                  {ownerName: 'Alina', petName:'Liza', species: 'Dog', breed: 'Yorkshire Terrier', isActive: true, lastLocation: 'Berwick, Victoria', lastDateTime: '11th May, 11:00pm'},
                  {ownerName: 'Jason', petName:'Yoyo', species: 'Bird', breed: 'Parrot', isActive: true, lastLocation: 'Glen Waverley, Victoria', lastDateTime: '11th May, 1:00pm'}
              ]
  const description = "cute and fluffy"

    return (
        <ScrollView style={{backgroundColor: 'white'}}>

          {/* REPORT SIGHTING MODAL */}
          <Modal isOpen={modalVisible} onClose={setModalVisible} >
        <Modal.Content maxH="212">
          <Modal.CloseButton />
          <Modal.Header>Confirm sighting</Modal.Header>
          <Modal.Body>
            <ScrollView>
              <Text>
                Please confirm that you have made a sighting of this pet before we alert the owner.
              </Text>
            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setModalVisible(false);
            }}>
                Cancel
              </Button>
              <Button bgColor={Color.NENO_BLUE} onPress={() => handleConfirm()}>
                Confirm 
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>


            {mocks.map(({ownerName, petName, species, breed, isActive, lastLocation, lastDateTime}) => (
               <View alignContent="center" paddingBottom={30}>
               <Box bg="#F5F5F5" borderRadius={15} padding={5} >
                 <HStack alignItems="center">
                     <Image 
                         alignSelf="center" size={36} borderRadius={18} 
                         source={{
                           uri: image
                         }} 
                         alt="User Image" 
                     /> 
                     <Box width={2}></Box>
                     <VStack>
                     <Heading size = "sm">
                       {ownerName}
                     </Heading>
                     {/* <Text style={{ color: 'black' }} fontSize="xs">{isHidden ? userPhoneHidden : userPhone}</Text> */}
                     </VStack>
                     <Box width={70}></Box>
                     {/* <Button onPress={toggleVisibility}>
                     <Text>Show/Hide</Text>
                     </Button> */}
                 </HStack>
           
                 <Box height={5}></Box>
                 <Image 
                         alignSelf="center" width={windowWidth} height={125} borderRadius={5}
                         source={{
                           uri: image
                         }} 
                         alt="Pet Image" 
                     /> 
                 <Box height={2}></Box>
                 <HStack>
                   <Heading size = "md">
                       {petName}
                   </Heading>
                 </HStack>
                 <HStack justifyContent="flex-start" space={10}>
                   <VStack>
                     <Heading size = "sm" color="#B8B8B8">
                       Pet Type
                     </Heading>
                     <Text fontSize="sm">
                         {species}
                     </Text>
                   </VStack>
           
                   <VStack>
                     <Heading size = "sm" color="#B8B8B8">
                       Breed
                     </Heading>
                     <Text fontSize="sm">
                         {breed}
                     </Text>
                   </VStack>
                 </HStack>
                 
                 <VStack>
                     <Heading size = "sm" color="#B8B8B8">
                       Description
                     </Heading>
                     <Text fontSize="sm">
                       {description}
                         {/* {petDesc} */}
                     </Text>
                 </VStack>
           
                 <HStack justifyContent="space-between">
                 <Heading size = "sm">
                       Last Seen Time
                     </Heading>
                     <Text fontSize="sm">
                         {lastDateTime}
                     </Text>
                 </HStack>
                 
                 <HStack justifyContent="space-between">
                 <Heading size = "sm">
                       Last Known Location
                     </Heading>
                     <Text fontSize="sm">
                         {lastLocation}
                     </Text>
                     
                 </HStack>
                 <VStack>
                 <Button mt="2" bgColor={Color.NENO_BLUE} onPress={() => handlePress()}>
                    Report a sighting
                  </Button>
                 </VStack>
                 
                 
               </Box>
               </View>
            ))}
        </ScrollView>
    );
}

export default DashboardPage;