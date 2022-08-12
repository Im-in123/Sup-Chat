import React, { useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { axiosHandler } from "../auth/helper";
import { BASE_URL, LOGIN_URL } from "../urls";
import { tokenName } from "../auth/authController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showScreen, setShowScreen] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldsError, setFieldsError] = useState({ user: "", password: "" });
  useLayoutEffect(() => {
    const auth = async () => {
      let token = await AsyncStorage.getItem(tokenName);

      if (token) {
        navigation.replace("Home");
      } else {
        setShowScreen(true);
      }
    };
    auth();

    return () => {};
  }, []);

  const checkInput = async () => {
    setFieldsError({ user: "", password: "" });
    if (!loginData.username.trim()) {
      // setFieldsError({...fieldsError, user: "This field is required!" });
      setFieldsError({ user: "This field is required!" });
      return false;
    }
    if (!loginData.password.trim()) {
      setFieldsError({ password: "This field is required!" });
      return false;
    }
    return true;
  };

  const signIn = async () => {
    const check_non_empty_input = await checkInput();
    if (!check_non_empty_input) return;

    setLoading(true);
    setLoginError(false);
    const result = await axiosHandler({
      method: "post",
      url: LOGIN_URL,
      data: loginData,
    }).catch((e) => {
      if (e.response) {
        console.log(e.response.data);
        setErrorMsg(e.response.data.error);
      } else if (e.request) {
        setErrorMsg("Slow internet connection. Try agian");
      }
      setLoginError(true);
      setLoading(false);
    });

    if (result) {
      await AsyncStorage.setItem(tokenName, JSON.stringify(result.data));
      navigation.replace("Login");
    }
  };
  const onChangeLogin = (name, value) => {
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  if (!showScreen) {
    return (
      <View>
        <StatusBar style="light" />
        <ActivityIndicator
          animating={true}
          color="#2C6BED"
          size="large"
          style={styles.activityIndicator}
        />
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={100}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />
      {loginError && (
        <Text
          style={{
            marginBottom: 5,
            color: "red",
            fontWeight: "700",
            fontSize: 18,
          }}
        >
          {errorMsg}!!!
        </Text>
      )}
      <Image
        source={{
          uri: `${BASE_URL}static/sup.png`,
        }}
        style={{ height: 200, width: 200, marginBottom: 10 }}
      />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Username"
          autoFocus
          value={loginData.username}
          type="text"
          onChangeText={(text) => onChangeLogin("username", text)}
          disabled={loading}
          leftIcon={<FontAwesome name="user" size={22} color="grey" />}
          errorStyle={{ color: "red" }}
          errorMessage={fieldsError.user}
        />

        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          value={loginData.password}
          onChangeText={(text) => onChangeLogin("password", text)}
          onEndEditing={signIn}
          disabled={loading}
          leftIcon={{
            type: "font-awesome",
            name: "lock",
            color: "grey",
            size: 22,
          }}
          errorStyle={{ color: "red" }}
          errorMessage={fieldsError.password}
        />
      </View>
      {loading ? (
        <View>
          <Text style={{ marginBottom: 5 }}>Logging you in!</Text>
          <ActivityIndicator
            animating={true}
            color="#2C6BED"
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      ) : (
        <View>
          <Button
            title="Login"
            containerStyle={styles.button}
            onPress={signIn}
          />
          <Button
            title="Sign up"
            containerStyle={styles.button}
            type="outline"
            onPress={() => navigation.navigate("Signup")}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 10,
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  activityIndicator: {
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
});
