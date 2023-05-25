import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';

import { HomeIcon } from 'react-native-heroicons/outline'
import Home from '../screens/Home';
import Donate from '../screens/Donate';


const Navigation = () => {

    return (
        <View className='bottom-2 sticky'>
            <Text >Navigation</Text>
        </View>
    );
}

export default Navigation