import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Product from '../components/Product'
import { useIsFocused } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from '../Config';
import ProductCard from '../components/ProductCard';

const ReviewDonate = ({ }) => {

  const focus = useIsFocused();
  const [products, setProducts] = useState([]);

  const getProduct = async () => {

    const auth = getAuth();
    const user = auth.currentUser;

    const querySnap = query(collection(db, "products"), where("userEmail", "==", user.email));
    const querySnapshot = await getDocs(querySnap)
    const products = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const { itemName, itemDescription, itemCategory, photoURL, userEmail, userPhone, userWhatsapp, userName, itemStatus } = doc.data()
      products.push({
        pid: doc.id,
        name: itemName,
        description: itemDescription,
        category: itemCategory,
        image: photoURL,
        whatsapp: userWhatsapp,
        phone: userPhone,
        email: userEmail,
        owner: userName,
        itemStatus: itemStatus
      })
    });
    setProducts(products)
  }

  useEffect(() => {
    if (focus == true) {
      getProduct()
    }
  }, [focus])

  return (
    <View>
      {products.length<=0
      ? <View className='justify-center items-center my-72'><Text className='text-center text-xl'>You haven't donated yet!</Text></View> 
      : <FlatList vertical
        contentContainerStyle={{
          paddingRight: 20,
          paddingTop: 17,
          paddingBottom: 150
        }}
        numColumns={2}
        data={products}
        renderItem={({ item }) => (
          <ProductCard product={item} />
        )}
        keyExtractor={(item) => item.pid}
        showsVerticalScrollIndicator={false}
      />}
    </View>
  )
}

export default ReviewDonate