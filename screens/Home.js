import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Product from "../components/Product";
import { getAuth, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Config";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "../components/Loading";

const Home = () => {
  const navigation = useNavigation();
  const [logUser, setLogUser] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  const category = [
    {
      id: "01",
      name: "All",
    },
    {
      id: "02",
      name: "Clothes",
    },
    {
      id: "03",
      name: "Books",
    },
    {
      id: "04",
      name: "Toys",
    },
    {
      id: "05",
      name: "Furniture",
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const [products, setProducts] = useState([]);
  const [initialProducts, setInitialProducts] = useState([])
  const [loading, setLoading] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false)

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
    if(selectedCategory==="All"){
      setProducts(productsArray)
    }
    setInitialProducts(productsArray)
    setLoading(false);
  };

  const filterProducts = async (category) => {
    setLoading(true);
    setSelectedCategory(category);
    if (category === "All") {
      setProducts(initialProducts)
    } else {
      let filteredProducts = initialProducts.filter(
        (item) => item.category === category
      );
      setProducts(filteredProducts);
    }
    setLoading(false);
    // setRefreshing(false)
  };

  const onRefresh = () => {
    setRefreshing(true)
  }

  useEffect(() => {
      setLogUser(user);
      getProducts();
    setRefreshing(false)
  }, [refreshing]);

  const logOut = () => {
    Alert.alert("Log-Out", "You sure you w ant to logout?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          signOut(auth)
            .then(() => {
              Toast.show({
                type: "success",
                text1: "You logged out!",
                visibilityTime: 2000,
              });
            })
            .catch((error) => {
              Toast.show({
                type: "error",
                text1: error.message,
                visibilityTime: 2000,
              });
            });
          setLogUser(null);
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="bg-slate-100">
      <View className="flex-row flex-1 px-4 items-center justify-between border-b border-gray-300 py-3 rounded-sm bg-slate-100 shadow-md">
        <Text className="text-center font-semibold text-xl text-orange-600 ">
          The Giving Tree!
        </Text>
        {logUser && (
          <TouchableOpacity
            onPress={logOut}
            className="bg-orange-600 px-3 py-1  rounded-md"
          >
            <Text className="text-center text-white font-semibold">Logout</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingVertical: 7,
        }}
        className="border-b border-gray-300 shadow-b-lg"
      >
        {category.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => filterProducts(item.name)}
              className={`border border-gray-300 justify-center items-center shadow-md bg-white rounded-md mx-1 px-2 py-1 ${
                selectedCategory === item.name && "bg-orange-600"
              }`}
            >
              <Text
                className={`text-lg font-semibold ${
                  selectedCategory === item.name ? "text-white" : "text-orange-600"
                }`}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <View className="my-64">
          <Loading />
        </View>
      ) : (
        <Product products={products} refreshing={refreshing} onRefresh={onRefresh} />
      )}
      {/* <Product products={products} /> */}
    </SafeAreaView>
  );
};

export default Home;
