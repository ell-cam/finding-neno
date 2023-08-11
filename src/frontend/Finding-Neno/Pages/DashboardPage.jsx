import {useNavigation} from '@react-navigation/native';
import { Box, Modal, Center, Image, useToast, ScrollView, View, Heading, VStack, HStack, FormControl, Input, Link, Button, Text, Alert, Pressable, Icon, KeyboardAvoidingView} from "native-base";
import {Dimensions} from 'react-native';
import { Color } from "../components/atomic/Theme";
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import store from '../store/store';
import { validDateTime, validateCoordinates } from "./validation"
import { useSelector, useDispatch } from "react-redux";

const DashboardPage = () => {
	const {IP, PORT} = useSelector((state) => state.api)
  const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

  const windowWidth = Dimensions.get('window').width; 
  const navigation = useNavigation();
  const toast = useToast();
  const isFocused = useIsFocused();

  // TODO: change report structure to be an array of dictionaries? Refer to mock data that is commented out for desired structure
  const [reports, setReports] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sightingDateTime, setSightingDateTime] = useState(new Date());
  const [sightingData, setSightingData] = useState({authorId: USER_ID, lastLocation: '', description: ''});
  const [reportSightingBtnDisabled, setReportSightingBtnDisabled] = useState(false);
  const [sightingFormErrors, setSightingFormErrors] = useState({});
  const [sightingImage, setSightingImage] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const formatDatetime = (datetime) => {
		const hours = datetime.getHours().toString().padStart(2, '0');
		const minutes = datetime.getMinutes().toString().padStart(2, '0');
		const day = datetime.getDate().toString().padStart(2, '0');
		const month = (datetime.getMonth() + 1).toString().padStart(2, '0');
		const year = datetime.getFullYear().toString();

		return `${hours}:${minutes} ${day}/${month}/${year}`
	}

  const handlePress = (report) => {
    setModalVisible(!modalVisible);
    setSightingData({ ...sightingData, 
      missing_report_id: report[0], 
      animal: report[7], 
      breed: report[8],
      image_url: null, 
      dateTime: formatDatetime(sightingDateTime),
      dateTimeOfCreation: formatDatetime(new Date()),
    })
  };

  const handleConfirm = () => {
    setModalVisible(false);
    toast.show({
      description: "Owner has been alerted of your sighting!",
      placement: "top"
    })
  };

    console.log(reports);

    useEffect(() => {
      if (isFocused) {
        fetchAllReports();
      }
    }, [isFocused]);
    
    // TODO: replace this image with the actual image from DB ? 
    const image = "https://wallpaperaccess.com/full/317501.jpg";
    //
    //   const mocks = [{ownerName: 'Sashenka', petName:'Piggy', species: 'Dog', breed: 'Shiba', isActive: true, lastLocation: 'Clayton, Victoria', lastDateTime: '12th May, 12:45pm', petImage: "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae6267a83abd8cc753f9ee819-lq"},
    //               ]

    const petImage = "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae6267a83abd8cc753f9ee819-lq"

    // validation
    const validateDetails = (formData) => {
      // Validates details. If details are valid, send formData object to onCreateReportPress.
      foundErrors = {};
  
      if (!formData.lastLocation || formData.lastLocation == "") {
        foundErrors = { ...foundErrors, lastLocation: 'Last known location is required e.g. 24.212, -54.122' }
      } else if (!validateCoordinates(formData.lastLocation)) {
        foundErrors = { ...foundErrors, lastLocation: 'Location coordinates is invalid e.g. 24.212, -54.122' }
      }
  
      if (formData.description.length > 500) {
        foundErrors = { ...foundErrors, description: 'Must not exceed 500 characters' }
      }
  
      setSightingFormErrors(foundErrors);
      return Object.keys(foundErrors).length === 0;
    }

    // photo upload
    const handleChoosePhoto = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled) {
          setSightingImage(result.assets[0].uri.toString());
          setSightingData({ ...sightingData, image_url: result.assets[0].uri.toString() });
        }
      }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setSightingImage(result.assets[0].uri.toString());
        setSightingData({ ...sightingData, image_url: result.assets[0].uri.toString() });
      }
    }
  };

  // date picker 
  var maximumDate;
	const openPicker = () => {
		maximumDate = new Date();
		setShowPicker(true);
	};

  const closePicker = () => {
		setShowPicker(false);
	}

  const handleDatetimeConfirm = (datetime) => {
		setSightingDateTime(datetime);
		setSightingData({ ...sightingData, dateTime: formatDatetime(datetime) });
		closePicker();
	}

    // API calls 
    const fetchAllReports = async () => {
      try {
        const response = await fetch(`${IP}:${PORT}/get_missing_reports`);
        const data = await response.json();
        setReports(data[0]);
      } catch (error) {
        console.error(error);
      }
    };

    const handleAddSighting = async () => {
      setReportSightingBtnDisabled(true);
      let isValid = validateDetails(sightingData);

      if (isValid) {
        const url = `${IP}:${PORT}/insert_new_sighting`;

        await fetch(url, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(sightingData),
        })
        .then((res) => {
          if (res.status == 201) {
            toast.show({
              description: "Your sighting has been added, and the owner has been alerted",
              placement: "top"
            })
            setReportSightingBtnDisabled(false);
            setModalVisible(false);
          }
        })
        .catch((error) => alert(error));
      }
    }

    return (
        <ScrollView style={{backgroundColor: 'white'}}>

          {/* REPORT SIGHTING MODAL */}
          <Modal avoidKeyboard isOpen={modalVisible} onClose={setModalVisible} >
        <Modal.Content >
          <Modal.CloseButton />
          <Modal.Header>Sighting details</Modal.Header>
          <Modal.Body>
          <FormControl.Label>Photo</FormControl.Label>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {sightingImage && <Image source={{ uri: sightingImage }} style={{ width: 100, height: 100 }} alt='pet sighting image'/>}
            </View>

            <Button variant="ghost" onPress={handleChoosePhoto}>
                Choose From Library
            </Button>
            <Button variant="ghost" onPress={handleTakePhoto}>
                Take Photo
            </Button>
            <ScrollView>
              {/* form details */}
              <FormControl >
                <FormControl.Label>Date and Time of Sighting</FormControl.Label>
                    <Button onPress={openPicker}>{`${sightingDateTime.getHours().toString().padStart(2, '0')}:${sightingDateTime.getMinutes().toString().padStart(2, '0')} ${sightingDateTime.toDateString()}`}</Button>
                        <DateTimePickerModal date={sightingDateTime} isVisible={showPicker} mode="datetime" locale="en_GB" maximumDate={new Date()} themeVariant="light" display="inline"
                        onConfirm={(datetime) => handleDatetimeConfirm(datetime)} onCancel={closePicker} />
              </FormControl>

              <FormControl isInvalid={'lastLocation' in sightingFormErrors}>
                  <FormControl.Label>Location of Sighting</FormControl.Label>
                  <Input onChangeText={value => setSightingData({ ...sightingData, lastLocation: value })} placeholder="long (-180 to 180), lat (-90 to 90)" />
                  {'lastLocation' in sightingFormErrors && <FormControl.ErrorMessage>{sightingFormErrors.lastLocation}</FormControl.ErrorMessage>}
              </FormControl>

              <FormControl isInvalid={'description' in sightingFormErrors}>
                  <FormControl.Label>Description (Additional Info)</FormControl.Label>
                  <Input onChangeText={value => setSightingData({ ...sightingData, description: value })} />
                  {'description' in sightingFormErrors && <FormControl.ErrorMessage>{sightingFormErrors.description}</FormControl.ErrorMessage>}
              </FormControl>

            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setModalVisible(false);
            }}>
                Cancel
              </Button>
              <Button bgColor={Color.NENO_BLUE} 
                disabled={reportSightingBtnDisabled} opacity={!reportSightingBtnDisabled ? 1 : 0.6}
                onPress={() => handleAddSighting()}
              >
                Report sighting 
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>


          {/* REPORTS */}
              {reports && reports.map((report, index) => (
               <View key={index} alignContent="center" paddingBottom={30}>
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
                       {report[10]}
                     </Heading>
                     </VStack>
                     <Box width={70}></Box>
                 </HStack>
           
                 <Box height={5}></Box>
                 <Image 
                         alignSelf="center" width={windowWidth} height={125} borderRadius={5}
                         source={{
                           uri: petImage
                         }} 
                         alt="Pet Image" 
                     /> 
                 <Box height={2}></Box>
                 <HStack>
                   <Heading size = "md">
                   {report[6]}
                   </Heading>
                 </HStack>
                 <HStack justifyContent="flex-start" space={10}>
                   <VStack>
                     <Heading size = "sm" color="#B8B8B8">
                       Pet Type
                     </Heading>
                     <Text fontSize="sm">
                     {report[7]}
                     </Text>
                   </VStack>
           
                   <VStack>
                     <Heading size = "sm" color="#B8B8B8">
                       Breed
                     </Heading>
                     <Text fontSize="sm">
                     {report[8]}
                     </Text>
                   </VStack>
                 </HStack>
                 
                 <VStack>
                     <Heading size = "sm" color="#B8B8B8">
                       Description
                     </Heading>
                     <Text fontSize="sm">
                     {report[2]}
                     </Text>
                 </VStack>
           
                 <HStack justifyContent="space-between">
                 <Heading size = "sm">
                       Last Seen Time
                     </Heading>
                     <Text fontSize="sm">
                     {report[1]}
                     </Text>
                 </HStack>
                 
                 <HStack justifyContent="space-between">
                 <Heading size = "sm">
                       Last Known Location
                     </Heading>
                     <Text fontSize="sm">
                       Longitude: 
                     {report[3]}
                     , 
                     Latitude:
                     {report[4]}
                     </Text>
                     
                 </HStack>
                 <VStack>
                 <Button mt="2" bgColor={Color.NENO_BLUE} onPress={() => handlePress(report)}>
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