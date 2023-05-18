import { useNavigation  } from '@react-navigation/native';
import { Box, Image, Heading, HStack, VStack, Button, Text, ScrollView, Link} from "native-base";
import {Dimensions} from 'react-native';
import { Color } from "../components/atomic/Theme";
import { IP, PORT } from "@env";
import { useEffect, useState } from 'react';


export default function ProfilePage({ navigation: { navigate}}) {
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;

    {/. Call a get user function ./}
    const ownerId = "1"
    const accessToken = "Fake Token"

    const [pets, setPets] = useState([]);
    // Set up an empty pet object here
    const [myPet, setMyPet] = useState({
      name: '',
      image_url: '',
      animal: '',
      breed: '',
      description: '',
      owner_id: null,
    });

    useEffect(() => {
      const fetchOwnerPets = async () => {
        try {
          const response = await fetch(`${IP}:${PORT}/get_owner_pets/${ownerId}`);
          const data = await response.json();
          setPets(data);
        } catch (error) {
          console.error(error);
        }
      }

      fetchOwnerPets();

    }, []);



  
    const name = "Human Being";
    const email = "sample@student.monash.edu";
    const phone = "0412 345 678";

    //const myPet = {name: 'Fluffy', image_url: 'file:///var/mobile/Containers/Data/Application/0665E6EF-36E6-4CFB-B1A3-CEE4BEE897F3/Library/Caches/ExponentExperienceData/%2540anonymous%252FFinding-Neno-cdca0d8b-37fc-4634-a173-5d0d16008b8f/ImagePicker/C1B3D22E-AB20-4864-A113-3989CCDCC0A8.jpg', animal: 'bird', breed: 'Per', description: 'A fluffy cat', owner_id: 1};
  

    return (
      <ScrollView>
      <Box alignItems="center" justifyContent="center">        
        <Box 
          alignSelf="center"
          _text={{
            alignSelf:"center",
            justifyContent:"center",
            fontSize: "lg",
            fontWeight: "medium",
            color: "warmGray.50",
            letterSpacing: "lg"
          }} 
          bg={Color.NENO_BLUE}
          width={windowWidth}
          height={windowHeight/8}
        >
        <Box height={3}/>
        <HStack>
          <Box width={8}/>
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
          <Box width={9}/>
          <Heading alignSelf="center" size="lg" fontWeight="600" color="warmGray.200" _dark={{color: "coolGray.600",}} >
            {name}
          </Heading>
        </HStack>
      </Box>


      <VStack>
        <HStack mt="6" justifyContent="space-between">
          <Heading fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}} pr={windowWidth/3.5}>
            USER DETAILS
          </Heading>
          <Text pl={windowWidth/3.5}>
          </Text>
        </HStack>

        <Box h="2"></Box>
          
        <Box bg = "gray.200" px="2" py="1" borderRadius="md"> 
        <HStack mt="2" justifyContent="space-between">
          <Heading fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}}>
            Email
          </Heading>
          <Text fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}}>
            {email}
          </Text>
        </HStack>
        </Box> 
        
        <Box h="2"></Box>

        <Box bg = "gray.200" px="2" py="1" borderRadius="md">   
        <HStack mt="2" justifyContent="space-between">
          <Heading fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}}>
            Phone
          </Heading>
          <Text fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}}>
            {phone}
          </Text>
        </HStack>
        </Box> 
        
      </VStack>
        
      <Box height={1}/>

      <VStack>
        <HStack mt="6" justifyContent="space-between" alignItems="center">
          <Heading fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}} pr={windowWidth/3.5}>
            PETS     
          </Heading>
          <Button pl={windowWidth/3} variant="link">
            Edit
          </Button>
        </HStack>
        
        <Box width={windowWidth - 60} height={100} bg={Color.NENO_BLUE}/>
        <Box height={1}/>
        <Box width={windowWidth - 60} height={100} bg={Color.NENO_BLUE}/>
        <Box height={1}/>
        <Box width={windowWidth - 60} height={100} bg={Color.NENO_BLUE}/>
        <Box height={1}/>
        <Box width={windowWidth - 60} height={100} bg={Color.NENO_BLUE}/>
        <Box height={1}/>

      </VStack>
      
      <Box h="4"></Box>

      <Button
        onPress={() => navigate('New Pet Page', {pet: myPet, ownerId: ownerId, accessToken: accessToken})} 
        width={windowWidth - 100}
        height="40px"
      >
        Add New Pet
      </Button> 
           
    </Box>
    </ScrollView>                        
    )
}