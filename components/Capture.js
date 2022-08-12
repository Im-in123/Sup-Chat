import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../urls";
// import { Video } from "expo-av";

const Capture = ({ navigation, data, setShowCapture }) => {
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const videoref = useRef(null);
  const [videoStatus, setVideoStatus] = useState({});

  useEffect(() => {
    if (!data) return;

    if (data) {
      if (data.type === "pic") {
        setPhoto(data.item.uri);
      } else {
        setVideo(data.item.uri);
      }
    }
  }, [data]);

  return (
    <View>
      {/* <AntDesign
        name="close"
        size={18}
        color="red"
        style={{}}
        onPress={() => setShowCapture(false)}
      /> */}
      <View style={styles.content}>
        {photo ? (
          <Image
            source={{ uri: photo }}
            style={{
              flex: 1, //height: 400, width: 400
            }}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={{ uri: `${BASE_URL}static/erica.jpg` }}
            style={{
              flex: 1,
              height: 400,
              width: 400,
            }}
            resizeMode="contain"
          />
        )}
        {video ? (
          <>
            {/* <Video
              ref={videoref}
              source={{
                uri: video,
              }}
              useNativeControls
              resizeMode="contain"
              isLooping
              onPlaybackStatusUpdate={(status) => setVideoStatus(() => status)}
            />
            <View>
              <Button
                title={videoStatus.isPlaying ? "Pause" : "Play"}
                onPress={() =>
                  videoStatus.isPlaying
                    ? videoref.current.pauseAsync()
                    : videoref.current.playAsync()
                }
              />
            </View> */}
          </>
        ) : (
          <> </>
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
          onPress={() => navigation.goBack}
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Capture;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 15,
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
