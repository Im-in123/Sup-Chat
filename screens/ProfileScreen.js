import React, { useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { axiosHandler, getToken } from "../auth/helper";
import { PROFILE_URL } from "../urls";
import { Button, Input } from "react-native-elements";
import { useDispatch } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { connect } from "react-redux";
import { USER_DETAIL_CHANGE } from "../redux/constants/index.js";

const ProfileScreen = ({ navigation, route, ...props }) => {
  const dispatch = useDispatch();
  const { userDetail } = props;
  console.log("userdetail::", userDetail);
  const [setupData, setSetupData] = useState({
    ...userDetail,
    user_id: userDetail.user.id,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [setupError, setSetupError] = useState(false);
  const [fieldsError, setFieldsError] = useState({
    fullname: "",
    first_name: "",
    bio: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
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

  const updateProfile = async () => {
    const check_non_empty_input = await checkInput();
    if (!check_non_empty_input) return;
    console.log("setupdata:::", setupData);
    setLoading(true);
    setSetupError(false);
    const token = await getToken();
    const result = await axiosHandler({
      method: "patch",
      url: `${PROFILE_URL}`,
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
      console.log("res::", result.data);
      dispatch({ type: USER_DETAIL_CHANGE, userDetail: result.data });
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={100}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <View style={styles.header}></View>
      <Image
        style={styles.avatar}
        source={{ uri: userDetail.user.user_picture }}
      />
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <Text style={styles.name}>{userDetail.user.username}</Text>
          <Text style={styles.info}>{userDetail.user.email}</Text>
          <Text style={styles.description}>{userDetail.bio}</Text>
          <View style={styles.inputView}>
            <Input
              placeholder="Full Name"
              // autoFocus
              value={setupData.name}
              type="text"
              inputContainerStyle={styles.bContainer}
              inputStyle={styles.TextInput}
              placeholderTextColor="black"
              onChangeText={(text) => onChangeSetup("name", text)}
              disabled={loading}
              leftIcon={<FontAwesome name="user" size={22} color="black" />}
              errorStyle={{ color: "red" }}
              errorMessage={fieldsError.fullname}
            />
            <Input
              placeholder="Bio"
              value={setupData.bio}
              type="text"
              inputContainerStyle={styles.bContainer}
              inputStyle={styles.TextInput}
              placeholderTextColor="black"
              onChangeText={(text) => onChangeSetup("bio", text)}
              disabled={loading}
              leftIcon={<FontAwesome name="edit" size={22} color="black" />}
              errorStyle={{ color: "red" }}
              errorMessage={fieldsError.bio}
            />
            <Input
              placeholder="Firstname"
              value={setupData.first_name}
              type="text"
              inputContainerStyle={styles.bContainer}
              inputStyle={styles.TextInput}
              placeholderTextColor="black"
              onChangeText={(text) => onChangeSetup("first_name", text)}
              disabled={loading}
              leftIcon={<FontAwesome name="user" size={22} color="black" />}
              errorStyle={{ color: "red" }}
              errorMessage={fieldsError.first_name}
            />

            <Input
              placeholder="City"
              value={setupData.city}
              type="text"
              inputContainerStyle={styles.bContainer}
              inputStyle={styles.TextInput}
              placeholderTextColor="black"
              onChangeText={(text) => onChangeSetup("city", text)}
              disabled={loading}
              leftIcon={
                <FontAwesome5 name="house-user" size={22} color="black" />
              }
              errorStyle={{ color: "red" }}
              errorMessage={fieldsError.city}
            />
            {setupError && (
              <Text
                style={{ marginBottom: 5, color: "red", fontWeight: "700" }}
              >
                {errorMsg}!!!
              </Text>
            )}
            <Button
              title="Update"
              containerStyle={styles.button}
              onPress={updateProfile}
              loading={loading}
              type="clear"
              titleStyle={{
                color: "white",
                fontWeight: 700,
              }}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
const mapStateToProps = (store) => ({
  userDetail: store.userState.userDetail,
});
export default connect(mapStateToProps, null)(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#00BFFF",
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 130,
  },
  name: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  body: {
    marginTop: 40,
    // backgroundColor: "white",
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600",
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
  inputContainer: {
    width: "90%",
  },

  button: {
    width: 300,
    borderRadius: 25,
    marginTop: 40,
    backgroundColor: "#00BFFF",
  },

  bContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#00BFFF",
  },
  TextInput: {
    color: "black",
    fontSize: 13,
  },
});
