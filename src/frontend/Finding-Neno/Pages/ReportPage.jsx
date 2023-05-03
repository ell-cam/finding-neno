import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import Dropdown from './Dropdown';

import { Color } from "../components/atomic/Theme";
import { useState } from "react";
import { IP, PORT } from "@env";

const ReportPage = () => {
    const navigation = useNavigation();

    const [missingPet, setMissingPet] = useState('')
    const options = ['Option 1', 'Add Pet'];
    const handleSelectOption = (option) => setMissingPet(option);

    const [lastSeen, setLastSeen] = useState('')
    const [lastLocation, setLastLocation] = useState('')


    return (
        <ScrollView>
        <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={250}>
        <View style={{ padding: 16 }}></View>

        <Text style={{ marginBottom: 8, fontSize: 16 }}>Choose Pet:</Text>
        <View>
        <Dropdown
            options={options}
            selectedOption={missingPet}
            onSelect={handleSelectOption}
        />
        </View>

        </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default ReportPage;