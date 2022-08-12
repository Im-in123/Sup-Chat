import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import AddChatScreen from "./screens/AddChatScreen";
import ChatScreen from "./screens/ChatScreen";

import ChatGroupScreen from "./screens/ChatGroupScreen";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import ProfileSetupScreen from "./screens/ProfileSetupScreen";
import CameraScreen from "./screens/CameraScreen";
import VideoCameraScreen from "./screens/VideoCameraScreen";
import CaptureScreen from "./screens/CaptureScreen";
import Drawer from "./Drawer";
import { Platform } from "react-native";
import OtherUserProfileScreen from "./screens/OtherUserProfileScreen";

const asyncFunctionMiddleware = (storeAPI) => (next) => (action) => {
  if (typeof action === "function") {
    return action(storeAPI.dispatch, storeAPI.getState);
  }
  return next(action);
};

const middlewareEnhancer = applyMiddleware(asyncFunctionMiddleware);
const store = createStore(rootReducer, middlewareEnhancer);

export default function App() {
  const Stack = createNativeStackNavigator();
  const globalScreenOptions = {
    headerStyle: { backgroundColor: "#2C6BED" },
    headerTitleStyle: { color: "white" },
    headerTintColor: "white",
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={globalScreenOptions}
          initialRouteName="Login"
        >
          <Stack.Screen
            name="UserDrawer"
            component={Drawer}
            options={{ headerShown: Platform.OS == "web" ? true : false }}
          />

          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignUpScreen} />
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          <Stack.Screen
            name="OtherUserProfile"
            component={OtherUserProfileScreen}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddChat" component={AddChatScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="ChatGroup" component={ChatGroupScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="VideoCamera" component={VideoCameraScreen} />
          <Stack.Screen name="Capture" component={CaptureScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
