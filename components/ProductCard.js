import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native';
import { db } from '../Config';
import { doc, updateDoc } from "firebase/firestore";
import Toast from 'react-native-toast-message'

const ProductCard = ({ product }) => {

    const navigation = useNavigation()
    const { pid, name, image, owner, category, description, whatsapp, phone, email, itemStatus } = product
    const route = useRoute()


    return (
        <TouchableOpacity onPress={() => navigation.navigate("ProductDetails", { pid, name, image, owner, category, description, whatsapp, phone, email, itemStatus, title: name })} className="w-[48%] border border-gray-50 bg-white rounded-md m-2 shadow shadow-black">
            <Image source={{ uri: image }} className='relative h-56 w-full bg-slate-500 rounded-md shadow-b-lg border border-slate-500' />
            {itemStatus == 'Donated' && <View className={`absolute top-24 bg-green-600 w-full`}><Text className="text-center py-2 text-white text-md font-semibold">Donated</Text></View>}
            <View className='mx-2 mt-1'>
                <Text className="text-slate-500 text-xs">{category}</Text>
                <Text className="text-black text-lg -mt-1">{name.slice(0,15) + (name.length > 15 ? "..." : "")}</Text>
                {route.name == "ReviewDonate" ? <Text></Text> : <Text className="text-xs text-gray-400">By: <Text className="text-black">{owner}</Text></Text>}
            </View>

        </TouchableOpacity>
    )
}

export default ProductCard