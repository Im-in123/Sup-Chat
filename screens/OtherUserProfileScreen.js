import React, { useLayoutEffect, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { axiosHandler, getToken } from "../auth/helper";
import { OTHER_PROFILE_URL } from "../urls";

const OtherUserProfileScreen = ({ navigation, route }) => {
  const [fetching, setFetching] = useState(false);
  const [info, setInfo] = useState({});
  const data = route.params;
  console.log("data:::", data);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: data.username,
    });
  }, []);
  useEffect(() => {
    const othername = data.username;
    let extra = `?keyword=${othername}`;
    getOtherProfile(extra);
  }, []);

  const getOtherProfile = async (extra) => {
    setFetching(true);
    const token = await getToken();
    const gp = await axiosHandler({
      method: "get",
      url: OTHER_PROFILE_URL + extra,
      token,
    }).catch((e) => {
      console.log("Error in getOtherProfile::::", e);
      // setError(true);
    });

    if (gp) {
      console.log("res::", gp.data);
      setInfo(gp.data);
      setFetching(false);
    }
  };
  if (fetching) {
    return (
      <View style={styles.container}>
        <View style={styles.header}></View>
        <Image style={styles.avatar} source={{ uri: data.user_picture }} />
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.name}>{data.username}</Text>
            <Text style={styles.info}>...</Text>
            <Text style={styles.description}>...</Text>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => navigation.goBack()}
            >
              <Text>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <Image style={styles.avatar} source={{ uri: data.user_picture }} />
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <Text style={styles.name}>{data.username}</Text>
          <Text style={styles.info}>{info.user?.email}</Text>
          <Text style={styles.description}>{info?.bio}</Text>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigation.goBack()}
          >
            <Text>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default OtherUserProfileScreen;
const styles = StyleSheet.create({
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
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  body: {
    marginTop: 40,
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
});
