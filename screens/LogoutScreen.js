import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { tokenName } from "../auth/authController";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { REFRESH_CHECK_AUTH } from "../redux/constants";
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
import { uuidv4 } from "../auth/helper";

const LogoutScreen = ({ navigation, ...props }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      await AsyncStorage.removeItem(tokenName);
      dispatch({ type: REFRESH_CHECK_AUTH, refreshAuth: uuidv4() });
      navigation.navigate("Home");
    })();
    return () => {};
  }, []);

  return (
    <View>
      <Text>Logging out...</Text>
    </View>
  );
};

const mapStateToProps = (store) => ({
  // userDetail: store.userState.userDetail,
});
export default connect(mapStateToProps, null)(LogoutScreen);

const styles = StyleSheet.create({});
