import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './screens/Home';
import Login from './screens/Login';
import Donate from './screens/Donate';
import TabNav from './TabNav'
import Signup from './screens/Signup';
import ProductDetails from './screens/ProductDetails';
import ReviewDonate from './screens/ReviewDonate';
import Toast from 'react-native-toast-message'
import ChangePassword from './screens/ChangePassword';

export default function App() {


  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      
      <Stack.Navigator>
        <Stack.Screen
          name="TabNav"
          component={TabNav}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="Home" component={Home} /> */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Donate" component={Donate} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="ReviewDonate" component={ReviewDonate} options={{ title: 'Your Donations' }}/>
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={({ route }) => ({ title: route.params.title })} />
      </Stack.Navigator>
      <Toast position='bottom' bottomOffset={60}/>
    </NavigationContainer>
  );
}
