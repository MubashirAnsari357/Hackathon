import { View, Text, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { db } from '../Config';
import { doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, updatePassword } from "firebase/auth";
import Toast from 'react-native-toast-message'

const ChangePassword = ({ navigation }) => {
  // const navigation = useNavigation();
  const [opass, setOpass] = useState("")
  const [npass, setNpass] = useState("")
  const [cpass, setCpass] = useState("");

  const getUser = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      Toast.show({
        type: 'info',
        text1: 'Please Login first to Donate!',
        visibilityTime: 2000
      })
      navigation.replace("Login")
    }

  }

  useEffect(() => {
    getUser();
  }, [])

  const updatePass = async () => {
    if (npass == cpass) {
      const auth = getAuth();
      const user = auth.currentUser;
      console.log(user.password)
      const newPassword = npass;
      updatePassword(user, newPassword).then(() => {
        Toast.show({
          type: 'success',
          text1: 'Password updated successfully!',
          visibilityTime: 2000
        })
      }).catch((error) => {
        Toast.show({
          type: 'error',
          text1: error.message,
          visibilityTime: 2000
        })
      });
    }
  }

  // const [users ,setUsers] = useState("")


  return (
    <SafeAreaView>
      {/* <Header /> */}
      <View className='flex-1 mt-32'>
        <KeyboardAvoidingView>
          <View className='items-center justify-center py-12 px-4'>
            <View className='w-full max-w-md space-y-6'>
              <Text className='font-bold text-3xl text-black text-center'>Change Password</Text>
              <View className='-space-y-px rounded-md shadow-sm'>
                <TextInput
                  className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                  onChangeText={(text) => setOpass(text)}
                  defaultValue={opass}
                  placeholder="Old Password"
                  secureTextEntry
                />
                <TextInput
                  className='relative block w-full appearance-none rounded-none border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                  onChangeText={(text) => setNpass(text)}
                  defaultValue={npass}
                  placeholder="New Password"
                  secureTextEntry
                />
                <TextInput
                  className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                  onChangeText={(text) => setCpass(text)}
                  defaultValue={cpass}
                  placeholder="Confirm Password"
                  secureTextEntry
                />
              </View>
              <View className='items-center justify-between'>
              </View>
              <View>
                <TouchableOpacity onPress={updatePass} className='w-full justify-center rounded-md border border-transparent bg-blue-600  text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'><Text className='text-center text-white py-2 px-4 text-xl font-medium'>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default ChangePassword