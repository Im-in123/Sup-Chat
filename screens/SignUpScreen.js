import React, { useLayoutEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { Platform } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { axiosHandler } from "../auth/helper";
import { SIGNUP_URL, LOGIN_URL } from "../urls";
import { tokenName } from "../auth/authController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import IonIcon from "react-native-vector-icons/Ionicons";

export const loginRequest = async (
  data,
  setSignupError,
  navigation,
  setErrorMsg,
  setLoading
) => {
  const ldata = { username: data.username, password: data.password };

  const result = await axiosHandler({
    method: "post",
    url: LOGIN_URL,
    data: ldata,
  }).catch((e) => {
    console.log(e.response.data);
    setErrorMsg(e.response.data.error);
    setSignupError(true);
  });
  if (result) {
    await AsyncStorage.setItem(tokenName, JSON.stringify(result.data));
    navigation.replace("Login");
  }
  setLoading(false);
};

const SignUpScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldsError, setFieldsError] = useState({
    username: "",
    email: "",
    password: "",
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back to Login",
    });

    return () => {};
  }, [navigation]);

  const checkInput = async () => {
    setFieldsError({ username: "", email: "", password: "" });
    if (!username.trim()) {
      setFieldsError({ username: "This field is required!" });
      return false;
    }
    if (!email.trim()) {
      setFieldsError({ email: "This field is required!" });
      return false;
    }
    if (!password.trim()) {
      setFieldsError({ password: "This field is required!" });
      return false;
    }
    return true;
  };

  const signUp = async () => {
    const check_non_empty_input = await checkInput();
    if (!check_non_empty_input) return;

    setLoading(true);
    setSignupError(false);

    const signupData = {
      username: username,
      email: email,
      password: password,
    };

    const result = await axiosHandler({
      method: "post",
      url: SIGNUP_URL,
      data: signupData,
    }).catch((e) => {
      if (e.response) {
        console.log(e.response.data);
        setErrorMsg(e.response.data.error);
      } else if (e.request) {
        setErrorMsg("Slow internet connection. Try agian");
      }

      setSignupError(true);
      setLoading(false);
    });

    if (result) {
      await loginRequest(
        signupData,
        setSignupError,
        navigation,
        setErrorMsg,
        setLoading
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={100}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />
      {signupError && (
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
      <Text h3 style={{ marginBottom: 50 }}>
        Create a Sup account
      </Text>

      <View style={styles.inputContainer}>
        <Input
          placeholder="Username"
          autoFocus
          type="text"
          value={username}
          onChangeText={(text) => setUsername(text)}
          disabled={loading}
          leftIcon={<FontAwesome name="user" size={22} color="grey" />}
          errorStyle={{ color: "red" }}
          errorMessage={fieldsError.username}
        />
        <Input
          placeholder="Email"
          type="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          disabled={loading}
          leftIcon={<IonIcon name="mail" size={22} color="grey" />}
          errorStyle={{ color: "red" }}
          errorMessage={fieldsError.email}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signUp}
          disabled={loading}
          leftIcon={<FontAwesome name="lock" size={22} color="grey" />}
          errorStyle={{ color: "red" }}
          errorMessage={fieldsError.password}
        />
      </View>

      {loading ? (
        <View>
          <Text style={{ marginBottom: 5 }}>Signing you up!</Text>
          <ActivityIndicator
            animating={true}
            color="#2C6BED"
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      ) : (
        <Button
          title="Sign up"
          raised
          containerStyle={styles.button}
          onPress={signUp}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
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
