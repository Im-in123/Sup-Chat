import React, { useLayoutEffect, useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import SavedScreen from "./screens/Saved";
import ReferScreen from "./screens/Refer";
import DrawerItems from "./constants/DrawerItems";
import Header from "./components/Header";
import LogoutScreen from "./screens/LogoutScreen";

const Drawer = createDrawerNavigator();

export default function App({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
    });
  }, []);
  return (
    // <NavigationContainer independent={true}>
    <Drawer.Navigator
      drawerType="front"
      initialRouteName="Profile"
      // defaultStatus="open"
      //   screenOptions={{
      //     drawerStyle: {
      //       backgroundColor: "#c6cbef",
      //       width: 240,
      //     },
      //   }}
    >
      {DrawerItems.map((drawer) => (
        <Drawer.Screen
          key={drawer.name}
          name={drawer.name}
          options={{
            drawerIcon: ({ focused }) =>
              drawer.iconType === "Material" ? (
                <MaterialCommunityIcons
                  name={drawer.iconName}
                  size={24}
                  color={focused ? "#e91e63" : "black"}
                />
              ) : drawer.iconType === "Feather" ? (
                <Feather
                  name={drawer.iconName}
                  size={24}
                  color={focused ? "#e91e63" : "black"}
                />
              ) : drawer.iconType === "SimpleLine" ? (
                <SimpleLineIcons
                  name={drawer.iconName}
                  size={24}
                  color={focused ? "#e91e63" : "black"}
                />
              ) : (
                <FontAwesome5
                  name={drawer.iconName}
                  size={24}
                  color={focused ? "#e91e63" : "black"}
                />
              ),
            activeTintColor: "#e91e63",
            itemStyle: { marginVertical: 10 },

            headerShown: true,
            header: ({ navigation, route, options }) => {
              const title = route.name;
              return <Header screen={title} />;
            },
          }}
          component={
            drawer.name === "Profile"
              ? ProfileScreen
              : drawer.name === "Settings"
              ? SettingsScreen
              : drawer.name === "Logout"
              ? LogoutScreen
              : ReferScreen
          }
        />
      ))}
    </Drawer.Navigator>
    // </NavigationContainer>
  );
}
