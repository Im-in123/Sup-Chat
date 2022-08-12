import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";

export default function Header({ screen }) {
  const navigation = useNavigation();
  return (
    <View style={headerStyles.container}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      >
        {/* <TouchableOpacity onPress={() => navigation.openDrawer()}> */}

        <Entypo name="menu" size={24} color="white" />
      </TouchableOpacity>
      <View>
        <Text style={{ color: "white" }}>{screen}</Text>
      </View>
    </View>
  );
}
// I ran into this problem when trying to get a drawer to close itself. this.props.navigation.closeDrawer() would not work, but this.props.navigation.dispatch(DrawerActions.toggleDrawer()) worked just fine.

// Note that this.props.navigation.navigate('DrawerToggle') did NOT work in this case.
const headerStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#2B68E6",
    elevation: 5,
    height: 50,
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
