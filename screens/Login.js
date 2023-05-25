import { View, Text, SafeAreaView, StatusBar, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useLayoutEffect , useEffect, useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { db } from '../Config';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import Toast from 'react-native-toast-message'

const Login = ({navigation}) => {

    // const navigation = useNavigation()
    const [email , setEmail] = useState("");
    const [pass , setPassword] = useState("");
    const auth = getAuth()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          if(user){
            Toast.show({
                type: 'success',
                text1: 'Login successful!',
                visibilityTime: 2000
              })
              navigation.navigate("Home")

          }
        })
      }, [])


    const signIn = () => {
        console.log("im pressed")
        signInWithEmailAndPassword(auth, email, pass)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user.email)
                // ...
            })
            .catch((error) => {
                Toast.show({
                    type: 'error',
                    text1: error.message,
                    visibilityTime: 2000
                  })
            });

        
    }

    return (
        <SafeAreaView>
            {/* <Header /> */}
            <View className='flex-1 mt-20'>
                <KeyboardAvoidingView>
                    <View className='items-center justify-center py-12 px-4'>
                        <View className='w-full max-w-md space-y-6'>
                            <Text className='font-bold text-3xl text-black text-center'>Sign in to your account</Text>
                            <View className='flex-row my-2 text-center justify-center'>
                                <Text className='text-xl'> Or </Text>
                                <TouchableOpacity onPress={()=> {navigation.navigate("Signup")}}><Text className='text-orange-500 text-xl'>Sign-up</Text></TouchableOpacity>
                            </View>
                            <View className='-space-y-px rounded-md shadow-sm'>
                                <TextInput
                                    className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500'
                                    onChangeText={(text) => setEmail(text)}
                                    defaultValue={email}
                                    placeholder="Email"
                                />
                                <TextInput
                                    className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500'
                                    onChangeText={(text) => setPassword(text)}
                                    value={pass}
                                    placeholder="Password"
                                    secureTextEntry
                                />
                            </View>
                            <View className='items-center justify-between'>
                                <View className='text-sm'>
                                    <TouchableOpacity><Text className='font-medium text-orange-600'>
                                        Forgot your password?</Text></TouchableOpacity>
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity onPress={signIn} className='w-full justify-center rounded-md border border-transparent bg-orange-600  text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'><Text className='text-center text-white py-2 px-4 text-xl font-medium'>Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    )
}

export default Login