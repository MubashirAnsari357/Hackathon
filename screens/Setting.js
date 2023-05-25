import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ArchiveBoxIcon, ArrowLeftOnRectangleIcon, ArrowPathIcon, ArrowRightIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'
import { signOut, getAuth } from 'firebase/auth'
import Toast from 'react-native-toast-message'

const Setting = ({navigation}) => {
    const stackNav = useNavigation()

    const [logUser, setLogUser] = useState(null)
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
      setLogUser(user)
    }, [])
    

    const logOut = () => {

        Alert.alert(
            "Log-Out",
            "Are you sure you want to logout?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: () => {
                        signOut(auth).then(() => {
                            Toast.show({
                                type: 'success',
                                text1: 'You logged out!',
                                visibilityTime: 2000
                            })
                        }).catch((error) => {
                            Toast.show({
                                type: 'error',
                                text1: error.message,
                                visibilityTime: 2000
                            })
                        });
                        setLogUser(null)
                        navigation.navigate("Login")
                    }
                }
            ]
        );
    }

    return (
        <View className='items-center my-2 p-1'>
            <View className='space-y-1'>
                <TouchableOpacity onPress={() => stackNav.navigate("ReviewDonate")} className='flex-row w-full p-4 space-x-2 items-center bg-white border border-slate-200'>
                    <ArchiveBoxIcon color='black' size={20} />
                    <Text className='flex-1 font-semibold'>Your Donations</Text>
                    <ArrowRightIcon color='black' size={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => stackNav.navigate("ChangePassword")} className='flex-row w-full p-4 space-x-2 items-center bg-white border border-slate-200'>
                    <ArrowPathIcon color='black' size={20} />
                    <Text className='flex-1 font-semibold'>Change Password</Text>
                    <ArrowRightIcon color='black' size={20} />
                </TouchableOpacity>
                {logUser && <TouchableOpacity onPress={logOut} className='flex-row w-full p-4 space-x-2 items-center bg-white border border-slate-200'>
                    <ArrowLeftOnRectangleIcon color='black' size={20} />
                    <Text className='flex-1 font-semibold'>Logout</Text>
                    <ArrowRightIcon color='black' size={20} />
                </TouchableOpacity>}

            </View>
        </View>
    )
}

export default Setting