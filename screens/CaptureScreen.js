import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../urls";
import { Video } from "expo-av";
import { StackActions } from "@react-navigation/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";
import { CAMERA_DATA_CHANGE } from "../redux/constants";

const CaptureScreen = ({ navigation, route, ...props }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [video_, setVideo_] = useState(null);
  const popAction = StackActions.pop(2);
  const { cameraData } = props;
  console.log("cameraData:::", cameraData);

  useLayoutEffect(() => {
    try {
      if (!route?.params) {
        alert("_dataff::" + JSON.stringify(route));

        return;
      }
      const _data = route.params;
      if (_data) {
        // alert("Data::" + JSON.stringify(data));
        setData(_data);
        if (_data.type === "pic") {
          setPhoto(_data.item.uri);
        } else {
          setVideo_(_data.item.uri);
        }
      } else {
        alert("_data2::" + JSON.stringify(route.params));
      }
    } catch (error) {
      alert(JSON.stringify(error));
    }
  }, [props]);
  return (
    <View>
      <View style={styles.content}>
        {photo ? (
          <>
            <Image
              source={{ uri: photo }}
              style={{
                flex: 1, //
                height: 400,
                width: 400,
              }}
              resizeMode="contain"
            />
          </>
        ) : (
          <>
        
          </>
        )}
        {video_ ? (
          <Video
            style={{
              // height: 300,
              // width: 300,
              marginBottom: 3,
            }}
            source={{
              uri: video_,
            }}
            shouldPlay={true}
            useNativeControls
            resizeMode="contain"
          />
        ) : (
          <></>
        )}
      </View>

      <View style={styles.footer}>
        <TextInput
          // value={input}
          // onChangeText={(t) => setInput(t)}
          placeholder="Write a message..."
          style={styles.textInput}
          // onSubmitEditing={() => {
          //   sendMessage();
          // }}
        />

        <TouchableOpacity
          style={{
            backgroundColor: "#2B68E6",
            borderRadius: 20,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
          activeOpacity={0.5}
          onPress={() => {
            const _data = data ? data : null;
            dispatch({
              type: CAMERA_DATA_CHANGE,
              cameraData: _data,
            });

            navigation.dispatch(popAction);
            //experiment with the others likepoptotop and back key or sumin
          }}
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const mapStateToProps = (store) => ({
  userDetail: store.userState.userDetail,
  cameraData: store.userState.cameraData,
});
export default connect(mapStateToProps, null)(CaptureScreen);

const styles = StyleSheet.create({
  content: {
    // flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 15,
    height: 600,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "black",
    borderRadius: 30,
  },
});

// <View>
// <View style={styles.content}>
//   {photo ? (
//     // <Image
//     //   source={{ uri: photo }}
//     //   style={{
//     //     flex: 1, //height: 400, width: 400
//     //   }}
//     //   resizeMode="contain"
//     // />
//     <></>
//   ) : (
//     <Image
//       source={{ uri: `${BASE_URL}static/erica.jpg` }}
//       style={{
//         flex: 1,
//         height: 400,
//         width: 400,
//       }}
//       resizeMode="contain"
//     />
//   )}
// </View>
