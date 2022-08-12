import React, { useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { axiosHandler, getToken } from "../auth/helper";
import { PROFILE_URL } from "../urls";
import { Button, Input, Text } from "react-native-elements";
import { USER_DETAIL_CHANGE } from "../redux/constants/index.js";
import { useDispatch } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const ProfileSetupScreen = ({ navigation, route, ...props }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [setupError, setSetupError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldsError, setFieldsError] = useState({
    fullname: "",
    first_name: "",
    bio: "",
    city: "",
  });

  const data = route.params.data;

  const [setupData, setSetupData] = useState({
    ...setupData,
    user_id: data.user.id,
  });

  const onChangeSetup = (name, value) => {
    setSetupData({
      ...setupData,
      [name]: value,
    });
  };

  const checkInput = async () => {
    setFieldsError({
      fullname: "",
      first_name: "",
      bio: "",
      city: "",
    });
    if (!setupData.name) {
      setFieldsError({ fullname: "This field is required!" });
      return false;
    } else {
      if (!setupData.name.trim()) {
        setFieldsError({ fullname: "This field is required!" });
        return false;
      }
    }
    if (!setupData.first_name) {
      setFieldsError({ first_name: "This field is required!" });
      return false;
    } else {
      if (!setupData.first_name.trim()) {
        setFieldsError({ first_name: "This field is required!" });
        return false;
      }
    }
    if (!setupData.bio) {
      setFieldsError({ bio: "This field is required!" });
      return false;
    } else {
      if (!setupData.bio.trim()) {
        setFieldsError({ bio: "This field is required!" });
        return false;
      }
    }
    if (!setupData.city) {
      setFieldsError({ city: "This field is required!" });
      return false;
    } else {
      if (!setupData.city.trim()) {
        setFieldsError({ city: "This field is required!" });
        return false;
      }
    }
    return true;
  };

  const setupProfile = async () => {
    const check_non_empty_input = await checkInput();
    if (!check_non_empty_input) return;

    setLoading(true);
    setSetupError(false);
    const token = await getToken();
    const result = await axiosHandler({
      method: "post",
      url: PROFILE_URL,
      data: setupData,
      token,
    }).catch((e) => {
      console.log(e.response.data);
      setErrorMsg(e.response.data.error);
      setErrorMsg("An error occured. Try again!");
      setSetupError(true);
      setLoading(false);
    });

    if (result) {
      setLoading(false);
      dispatch({ type: USER_DETAIL_CHANGE, userDetail: result.data });
      navigation.replace("Home");
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={150}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />

      <View style={styles.inputContainer}>
        <Text h3 style={{ marginBottom: 50 }}>
          We just need a little more info to finish setting up your account!
        </Text>
        {setupError && (
          <Text style={{ marginBottom: 5, color: "red", fontWeight: "700" }}>
            {errorMsg}!!!
          </Text>
        )}
        <Input
          placeholder="Fullname"
          autoFocus
          value={setupData.fullname}
          type="text"
          onChangeText={(text) => onChangeSetup("name", text)}
          disabled={loading}
          leftIcon={<FontAwesome name="user" size={22} color="grey" />}
          errorStyle={{ color: "red" }}
          errorMessage={fieldsError.fullname}
        />
        <Input
          placeholder="Firstname"
          value={setupData.firstname}
          type="text"
          onChangeText={(text) => onChangeSetup("first_name", text)}
          disabled={loading}
          leftIcon={<FontAwesome name="user" size={22} color="grey" />}
          errorStyle={{ color: "red" }}
          errorMessage={fieldsError.first_name}
        />
        <Input
          placeholder="Bio"
          value={setupData.bio}
          type="text"
          onChangeText={(text) => onChangeSetup("bio", text)}
          disabled={loading}
          leftIcon={<FontAwesome name="edit" size={22} color="grey" />}
          errorStyle={{ color: "red" }}
          errorMessage={fieldsError.bio}
        />
        <Input
          placeholder="City"
          value={setupData.city}
          type="text"
          onChangeText={(text) => onChangeSetup("city", text)}
          disabled={loading}
          leftIcon={<FontAwesome5 name="house-user" size={22} color="grey" />}
          errorStyle={{ color: "red" }}
          errorMessage={fieldsError.city}
        />
      </View>
      {loading ? (
        <View>
          <Text style={{ marginBottom: 5 }}>Setting up your profile!</Text>
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
            title="Continue"
            containerStyle={styles.button}
            onPress={setupProfile}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default ProfileSetupScreen;

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
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
});
