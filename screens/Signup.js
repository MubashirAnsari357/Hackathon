import { View, Text, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { db } from '../Config';
import { doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Toast from 'react-native-toast-message'

const Signup = ({navigation}) => {
    // const navigation = useNavigation();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("");
    const auth = getAuth();

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if(user){
            console.log("signed in User", user.email)
            navigation.replace("Home")
        }
      })
    }, [])
    
    // const [users ,setUsers] = useState("")

    const signUp = () => {
        createUserWithEmailAndPassword(auth, email, pass)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                if(user){
                    const addUser = async ()=>{
                        await setDoc(doc(db, "users", user.uid), {
                            name: name,
                            email: email,
                            pass: pass
                          });
                          
                    }
                    addUser()
                    
                }
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
                            <Text className='font-bold text-3xl text-black text-center'>Create an account</Text>
                            <View className='flex-row my-2 text-center justify-center'>
                                <Text className='text-xl'> Or </Text>
                                <TouchableOpacity onPress={() => { navigation.navigate("Login") }}><Text className='text-orange-500 text-xl'>Sign-in</Text></TouchableOpacity>
                            </View>
                            <View className='-space-y-px rounded-md shadow-sm'>
                                <TextInput
                                    className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500'
                                    onChangeText={(text) => setName(text)}
                                    defaultValue={name}
                                    placeholder="Name"
                                />
                                <TextInput
                                    className='relative block w-full appearance-none rounded-none border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500'
                                    onChangeText={(text) => setEmail(text)}
                                    defaultValue={email}
                                    placeholder="Email address"
                                />
                                <TextInput
                                    className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500'
                                    onChangeText={(text) => setPass(text)}
                                    defaultValue={pass}
                                    placeholder="Password"
                                    secureTextEntry
                                />
                            </View>
                            <View className='items-center justify-between'>
                            </View>
                            <View>
                                <TouchableOpacity onPress={signUp} className='w-full justify-center rounded-md border border-transparent bg-orange-600  text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'><Text className='text-center text-white py-2 px-4 text-xl font-medium'>Signup</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    )
}

export default Signup