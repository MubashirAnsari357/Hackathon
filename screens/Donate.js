import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../Config";
import { db } from "../Config";
import { doc, addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Toast from 'react-native-toast-message'
import { getAuth } from "firebase/auth";
import SelectDropdown from 'react-native-select-dropdown'
import { HomeIcon } from "react-native-heroicons/outline";


const Donate = ({ navigation }) => {
  // states
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Select Category");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [user, setUser] = useState(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const focus = useIsFocused();

  const dropdownRef = useRef({});


  const categories = ["Select Category","Clothes", "Toys", "Books", "Furniture"]

  const getUser = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUser(user);
      const docRef = query(collection(db, "users"), where("email", "==", user.email));
      const docSnap = await getDocs(docRef);
      docSnap.forEach((doc) => {
        const { email, name } = doc.data()
        // doc.data() is never undefined for query doc snapshots
        setName(name)
        setEmail(email)
      });
    }
    else {
      Toast.show({
        type: 'info',
        text1: 'Please Login first to Donate!',
        visibilityTime: 2000
      })
      navigation.navigate("Login")
    }
  }

  useEffect(() => {
    if (focus == true) {
      getUser()
    }
  }, [focus])



  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,

      aspect: [3, 4],
      quality: 0.5,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  //how the image will be addressed inside the storage
  const UploadItem = async () => {
    if(!image){
      Toast.show({
        type: 'error',
        text1: 'Please select image',
        visibilityTime: 2000
      })
      return
    }
    if (category=='Select Category') {
      Toast.show({
        type: 'error',
        text1: 'Please select Category!',
        visibilityTime: 2000
      })
      return
    }
    if (title.length < 3) {
      Toast.show({
        type: 'error',
        text1: 'Title should be more than 3 character!',
        visibilityTime: 2000
      })
      return
    }
    if (description.length <= 5) {
      Toast.show({
        type: 'error',
        text1: 'Description should be more than 5 character!',
        visibilityTime: 2000
      })
      return
    }
    if (phone.length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Please Enter valid 10 digit phone number!',
        visibilityTime: 2000
      })
      return
    }
    if (whatsapp.length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Please Enter valid 10 digit whatsapp number!',
        visibilityTime: 2000
      })
      return
    }
    const randomId = doc(collection(db, "temp")).id
    const storageRef = ref(storage, `products/${randomId}.png`);
    const img = await fetch(image);
    const bytes = await img.blob();

    await uploadBytes(storageRef, bytes); //upload images
    const imageUrl = await getDownloadURL(storageRef)
    console.log(imageUrl)
    const res = await addDoc(collection(db, "products"), {
      photoURL: imageUrl,
      itemName: title,
      itemCategory: category,
      itemDescription: description,
      userPhone: phone,
      userWhatsapp: whatsapp,
      userEmail: email,
      userName: name,
      itemStatus: "available"
    });
    if (res) {
      Toast.show({
        type: 'success',
        text1: 'Item uploaded successfully',
        visibilityTime: 2000
      })
      dropdownRef.current.reset()
      setImage(null)
      setTitle("")
      setDescription("")
      setPhone("")
      setWhatsapp("")
    }
    else {
      Toast.show({
        type: 'error',
        text1: 'Some error occured!',
        visibilityTime: 2000
      })
    }
  }

  return (
    <>
      <ScrollView contentContainerStyle={{ paddingBottom: 350 }} className="">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 "
        >
          <View className="">
            {/* <Text className="text-center mt-8 font-bold text-3xl text-orange-500">
              Add Details
            </Text> */}
            <View className="mx-auto mt-10">
              {image && (
                <Image
                  source={{ uri: image }}
                  className="h-56 w-44 rounded-xl"
                />
              )}
              {!image && (
                <Image
                  source={{ uri: image }}
                  className="h-56 w-44 rounded-xl bg-gray-200"
                />
              )}
            </View>
            <View className="p-4 justify-center mx-auto">
              <TouchableOpacity
                onPress={() => pickImage()}
                className="bg-orange-500 py-3 px-6 rounded-lg w-2/4 shadow shadow-black"
              >
                <Text className="text-white text-center">Upload Photo </Text>
              </TouchableOpacity>
            </View>
            <View className="p-4 space-y-3">
            <SelectDropdown
              ref={dropdownRef}
              className='border border-gray-50 py-2 px-4 bg-white rounded-lg shadow shadow-black'
              buttonStyle={{
                borderColor: 'black',
                backgroundColor: 'white',
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 10,
                width: '100%',
                marginTop: 10,
                
              }}
              buttonTextStyle={{
                left : 0,
                textAlign : 'left',
                fontSize: 14,
              }}
              selectedRowTextStyle={{
                color: 'black'
              }}
              defaultButtonText={
                'Category'
              }
                data={categories}
                onSelect={(selectedItem, index) => {
                  setCategory(selectedItem)
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                  return item
                }}
              />
              <TextInput
                className="border border-gray-300 py-2 px-4 bg-white rounded-lg shadow shadow-black"
                onChangeText={(text) => setTitle(text)}
                defaultValue={title}
                placeholder="Title"
              />
              
              <TextInput
                className="border border-gray-300 py-2 px-4 bg-white rounded-lg"
                onChangeText={(text) => setDescription(text)}
                defaultValue={description}
                placeholder="Description"
                multiline={true}
                numberOfLines={3}
                textAlignVertical='top'
                
              />
              <TextInput
                className="border border-gray-300 py-2 px-4 bg-white rounded-lg"
                onChangeText={(text) => setPhone(text)}
                defaultValue={phone}
                keyboardType="Numeric"
                placeholder="Phone"
                maxLength={10}
              />
              <TextInput
                className="border border-gray-300 py-2 px-4 bg-white rounded-lg"
                onChangeText={(text) => setWhatsapp(text)}
                defaultValue={whatsapp}
                keyboardType="Numeric"
                placeholder="Whatsapp No"
                maxLength={10}
              />
              <TextInput
                className="border border-gray-300 py-2 px-4 bg-white rounded-lg"
                defaultValue={email}
                placeholder="Email"
                editable={false}
              />
              <TouchableOpacity
                onPress={UploadItem}
                className="py-2 px-4 bg-orange-500 rounded-lg"
              >
                <Text className="text-center text-white text-lg">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
};

export default Donate;
