import React from "react";
import {createNativeStackNavigator}from"@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native";
import Login from "./Screens/Login"
import RegisterScreen from "./Screens/RegisterScreen";
import MainScreen from "./Screens/MainScreen";
import { Provider } from "react-redux";
import store from "./Redux/store";

export default function App() {
    const Root=createNativeStackNavigator();
    return (
       <Provider store={store}>
          <NavigationContainer >
        <Root.Navigator>
            <Root.Screen name="Login" component={Login} options={{headerShown:false}}/>
            <Root.Screen name="Register" component={RegisterScreen} options={{headerShown:false}}/>
            <Root.Screen name="MainScreen" component={MainScreen} options={{headerShown:false}}/>
        </Root.Navigator>
     </NavigationContainer>
       </Provider>
    );
  }