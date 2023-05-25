import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { EnvelopeIcon, PhoneIcon } from "react-native-heroicons/outline";
import { getAuth } from "firebase/auth";
import { db } from '../Config';
import { doc, updateDoc } from "firebase/firestore";
import Toast from 'react-native-toast-message'
import ReadMore from '@fawazahmed/react-native-read-more';

const ProductDetails = () => {

  const {
    params: {
      pid,
      name,
      owner,
      category,
      image,
      description,
      whatsapp,
      phone,
      email,
      itemStatus,
    },
  } = useRoute();

  const [status, setStatus] = useState(itemStatus)



  const auth = getAuth();
  const user = auth.currentUser;

  const updateDonate = async () => {
    const docRef = doc(db, "products", pid);
    if (docRef) {
      setStatus("Donated")
      await updateDoc(docRef, {
        itemStatus: 'Donated',
      });
      Toast.show({
        type: 'info',
        text1: 'Marked as Donated',
        visibilityTime: 2000
      })

    }
  }

  // Whatsapp Function
  const sendWhatsApp = () => {
    let msg = "Hello";
    let phoneWithCountryCode = `91${whatsapp}`;

    let mobile =
      Platform.OS == "ios" ? phoneWithCountryCode : "+" + phoneWithCountryCode;
    if (mobile) {
      if (msg) {
        let url = "whatsapp://send?text=" + msg + "&phone=" + mobile;
        Linking.openURL(url)
          .then((data) => {
            console.log("WhatsApp Opened");
          })
          .catch(() => {
            alert("Make sure WhatsApp installed on your device");
          });
      } else {
        alert("Please insert message to send");
      }
    } else {
      alert("Please insert mobile no");
    }
  };

  // Call Function
  const callNumber = () => {
    let phoneNumber = phone;
    if (Platform.OS !== "android") {
      phoneNumber = `telprompt:${phone}`;
    } else {
      phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Phone number is not available");
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch((err) => console.log(err));
  };

  //Email Function
  const sendEmailViaEmailApp = () => {
    let emailId = email
    let subject = `Regarding ${name}`
    let body = "Hello"
    if (emailId) {
      let link;
      link = `mailto:${emailId}?subject=${subject}&body=${body}`;

      Linking.canOpenURL(link)
        .then((supported) => {
          if (supported) {
            // 'mailto:support@example.com?subject=Billing Query&body=Description'
            Linking.openURL(link);
          }
        })
        .catch((err) => console.error("An error occurred", err));
    } else {
      alert("Mail link is undefined");
    }
  };
  return (
    <ScrollView className="flex-1 p-2" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="items-center my-2">
        <Image
          source={{ uri: image }}
          className="relative h-96 bg-gray-300 border border-gray-300 rounded-lg w-3/4"
        />
      </View>
      {/* <View className='absolute top-0 right-10 flex-row items-center ml-auto'>
        <View className={`px-2 py-1 rounded-lg ${status == 'available' ? 'bg-green-600' : 'bg-red-600'}`}><Text className={`text-lg text-center text-white`}>{status}</Text></View>
      </View> */}
      <View className='p-4'>
        <View className='mt-2'>
          <View className='flex-row items-center'>
            <View className='flex-1'>
              <Text className='text-xs text-gray-500 -mb-1'>{category}</Text>
              <Text className='text-2xl font-semibold'>{name}</Text>
            </View>
            <View>
              <View className={`px-2 py-1 rounded-lg ${status == 'available' ? 'bg-green-600' : 'bg-red-600'}`}><Text className={`text-center text-white`}>{status}</Text></View>
            </View>
          </View>
          <View>
            <Text className='text-sm text-gray-500 mb-2'>By: {owner}</Text>
            <ReadMore numberOfLines={2} seeLessStyle={{ color: '#2178DE' }} seeMoreStyle={{ color: '#2178DE' }} className=''>{description}</ReadMore>

          </View>

        </View>
        {/* <View className="space-y-3">
        <Text className="text-gray-500 mt-5 font-semibold text-lg border-b border-gray-300 mx-4">
          Item: <Text className="mx-3 text-black">{name}</Text>
        </Text>
        <Text className="text-gray-500 font-semibold text-lg border-b border-gray-300  mx-4">
          By: <Text className="mx-3 text-black">{owner}</Text>
        </Text>
        <Text className="text-gray-500 font-semibold text-lg border-b border-gray-300 mx-4">
          Category: <Text className="mx-3 text-black">{category}</Text>
        </Text>
        <Text className="text-gray-500 font-semibold text-lg border-b border-gray-300 mx-4">
          Description: <Text className="mx-3 text-black">{description}</Text>
        </Text>
      </View> */}
        <View>
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={callNumber}
              disabled={status == 'Donated'}
              className={`flex-row items-center justify-center ${status == 'available' ? 'bg-blue-50 border border-blue-400' : 'bg-gray-300 border border-gray-300'} w-[48%] rounded-lg mt-5 py-2`}
            >
              <PhoneIcon color="#3b83f6" size={20} />
              <Text className="mx-1 text-blue-500 text-lg">Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={sendWhatsApp}
              disabled={status == 'Donated'}
              className={`flex-row items-center justify-center ${status == 'available' ? 'bg-green-700 border border-green-700' : 'bg-green-500 border border-green-500'} w-[48%] rounded-lg mt-5 py-2`}
            >
              <Image source={require('../assets/whatsapp.png')} className="h-4 w-4 mx-1" />
              <Text className="mx-1 text-white text-lg">Whatsapp</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={sendEmailViaEmailApp}
            disabled={status == 'Donated'}
            className={`flex-row justify-center items-center ${status == 'available' ? 'bg-blue-600 border border-blue-600' : 'bg-blue-400 border border-blue-400'} w-[98%] rounded-lg mt-5 py-2`}
          >
            <EnvelopeIcon color="white" size={20} />
            <Text className="mx-1 text-white text-lg">Email</Text>
          </TouchableOpacity>
          {user?.email == email && <TouchableOpacity
            onPress={updateDonate}
            disabled={status == 'Donated'}
            className={`flex-row items-center justify-center ${status == 'available' ? 'bg-blue-50 border border-blue-400' : 'bg-blue-400 border border-blue-400'} w-[98%] rounded-lg mt-5 py-2`}
          >
            <Text className={`mx-1 ${status == 'available' ? 'text-blue-500' : 'text-white'} text-lg`}>{status == 'available' ? 'Mark as Donated' : 'Donated'}</Text>
          </TouchableOpacity>}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductDetails;
