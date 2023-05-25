import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Donate from "./screens/Donate";
import Ionicons from "@expo/vector-icons/Ionicons";
import Search from "./screens/Search";
import { getAuth } from "firebase/auth";
import ReviewDonate from "./screens/ReviewDonate";
import Setting from "./screens/Setting";

const TabNav = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Login") {
            iconName = focused ? "log-in" : "log-in-outline";
          } else if (route.name === "Donate") {
            iconName = focused ? "shirt" : "shirt-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          }
          else if (route.name === "Setting") {
            iconName = focused ? "settings" : "settings-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={25} color={color} />;
        },
        tabBarActiveTintColor: "#F87114",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="Search"
        component={Search}
      />
      <Tab.Screen name="Donate" component={Donate} />
      {!user ? <Tab.Screen name="Login" component={Login} /> : <Tab.Screen name="Setting" component={Setting} options={{ title: 'Account' }}/>}
    </Tab.Navigator>
  );
};

export default TabNav;
