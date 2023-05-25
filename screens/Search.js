import { View, Text, TextInput, TouchableOpacity, Keyboard } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon, MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/outline";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Config";
import Product from "../components/Product";
import Loading from "../components/Loading";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState([]);
  const [initialProducts, setInitialProducts] = useState([])
  const [loading, setLoading] = useState(null);

  const getProducts = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsArray = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const {
        itemName,
        itemDescription,
        itemCategory,
        photoURL,
        userEmail,
        userPhone,
        userWhatsapp,
        userName,
        itemStatus,
      } = doc.data();
      productsArray.push({
        pid: doc.id,
        name: itemName,
        description: itemDescription,
        category: itemCategory,
        image: photoURL,
        whatsapp: userWhatsapp,
        phone: userPhone,
        email: userEmail,
        owner: userName,
        itemStatus: itemStatus,
      });
    });
    if(searchText===""){
      setProducts(productsArray)
    }
    setInitialProducts(productsArray)
    setLoading(false);
  };

  const handleSearch = () => {
    setIsSearching(true);
    const filteredProducts = initialProducts.filter((product) => {
      const regex = new RegExp(searchText, 'i');
      return regex.test(product.name) || regex.test(product.category);
    });
    setProducts(filteredProducts)

  };

  const handleBack = () => {
    setIsSearching(false);
    Keyboard.dismiss();
  };

  const handleClose = () => {
    setSearchText("");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    getProducts();
  }, [])
  

  return (
    <SafeAreaView className="flex-1">
      <View className="bg-white px-3 flex-row justify-start items-center border border-slate-200 rounded-md focus:border-slate-300 focus:shadow-lg focus:shadow-slate-600 shadow-md shadow-slate-500 mx-3 mt-2">
      {isSearching ? (
        <TouchableOpacity onPress={handleBack} className="bg-white p-2 ">
          <ArrowLeftIcon size={24} color="#F87114"/>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleSearch} className="bg-white p-2 ">
          <MagnifyingGlassIcon size={24} color="#F87114"/>
        </TouchableOpacity>
      )}
        <TextInput
          className="bg-white flex-1 px-2 py-2 shadow-lg text-base"
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          autoFocus={isSearching}
          onFocus={()=>setIsSearching(true)}
        />
        {searchText !== '' &&(
          <TouchableOpacity onPress={handleClose} className="bg-white p-2">
            <XMarkIcon size={24} color="#F87114"/>
          </TouchableOpacity>
        )}
      </View>
      {loading ? (
        <View className="my-64">
          <Loading />
        </View>
      ) : (
        <Product products={products} />
      )}
    </SafeAreaView>
  );
};

export default Search;
