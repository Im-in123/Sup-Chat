import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { temp_image_uri, temp_video_uri } from "../components/tempy";
import { Button } from "react-native-elements";
import { Video, AVPlaybackStatus } from "expo-av";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { CAMERA_DATA_CHANGE } from "../redux/constants";
import * as MediaLibrary from "expo-media-library";

const VideoCamera = ({ navigation }) => {
  const dispatch = useDispatch();
  const [cameraRef, setCameraRef] = useState(null);
  const [recording, setRecording] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [modalVisible, setModalVisible] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [video_, setVideo_] = useState(null);
  const [data, setData] = useState(null);
  const video_ref = useRef(null);
  const [status, setStatus] = useState({});
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Take a pic or video",
    });

    return () => {};
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === "granted");
      await MediaLibrary.requestPermissionsAsync();
    })();
  }, []);
  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    // return <Text>No access to camera</Text>;
    // const data = { type: "pic", item: { uri: temp_image_uri } };
    // const data = { type: "video", item: { uri: temp_video_uri } };
  }
  const takepic = async () => {
    try {
      if (cameraRef) {
        let photo = await cameraRef.takePictureAsync({
          // quality: 1,
          // base64: true,
        });
        console.log("photo", photo);
        // alert("photo: " + JSON.stringify(photo));
        //{width, uri, height,  base64}
        const data_ = { type: "image", item: photo };
        setPhoto(photo.uri);
        setData(data_);
        setModalVisible(true);
      }
    } catch (error) {
      alert("Unknown Error: " + JSON.stringify(error));
    }
  };

  const takevideo = async () => {
    try {
      if (cameraRef) {
        let video;
        if (!recording) {
          setRecording(true);
          video = await cameraRef.recordAsync({
            // VideoQuality: ["2160p"],
            maxDuration: 15,
            // maxFileSize: 200,
            mute: false,
            // videoBitrate: 5000000,
          });
          try {
            console.log("video", video);
            setVideo_(video.uri);
            const data_ = { type: "video", item: video };
            setData(data_);
            setModalVisible(true);
          } catch (error) {
            alert("Unknown11 Error: " + JSON.stringify(error));
          }
        } else {
          setRecording(false);
          cameraRef.stopRecording();
        }
      }
    } catch (error) {
      alert("Unknown Error: " + JSON.stringify(error));
    }
  };

  const gotoChat = async () => {
    const _data = data ? data : null;

    dispatch({
      type: CAMERA_DATA_CHANGE,
      cameraData: _data,
    });
    await MediaLibrary.createAssetAsync(_data.item.uri);
    setPhoto(null);
    setVideo_(null);
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setPhoto(null);
          setVideo_(null);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(242, 233, 233, 0.9)",
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              height: "90%",
            }}
            resizeMode="contain"
          >
            {photo && (
              <Image
                source={{ uri: photo }}
                style={{
                  flex: 1,
                  width: "100%",
                }}
                // resizeMode="contain"
              />
              // source={{ uri: "http://127.0.0.1:8000/static/erica.jpg" }}
            )}
            {video_ && (
              <>
                <Video
                  ref={video_ref}
                  style={{
                    flex: 0.9,
                    width: "100%",
                  }}
                  source={{
                    uri: video_,
                  }}
                  useNativeControls
                  resizeMode="contain"
                  // shouldPlay={true}
                  onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                />
                <Button
                  title={status.isPlaying ? "Pause" : "Play"}
                  onPress={() =>
                    status.isPlaying
                      ? video_ref.current.pauseAsync()
                      : video_ref.current.playAsync()
                  }
                  style={{
                    flex: 0.1,
                  }}
                />
              </>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              height: "10%",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Button title="Continue" onPress={() => gotoChat()} />
            <Button
              title="Back"
              onPress={() => {
                setPhoto(null);
                setVideo_(null);
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
      <Camera
        style={{ flex: 1 }}
        type={type}
        flashMode="auto"
        autoFocus="auto"
        zoom={1}
        ref={(ref) => {
          setCameraRef(ref);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity
              // style={{
              //   flex: 0.1,
              //   alignSelf: "flex-end",
              // }}
              onPress={() => {
                // setShowCapture(true);
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Ionicons
                name={
                  Platform.OS === "ios"
                    ? "ios-camera-reverse"
                    : "camera-reverse"
                }
                size={40}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={takepic}
              // onPress={() => {
              //   setPhoto(true);
              //   setModalVisible(true);
              // }}
            >
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: 25,
                  borderColor: "white",
                  height: 50,
                  width: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 25,
                    borderColor: "white",
                    height: 40,
                    width: 40,
                    backgroundColor: "white",
                  }}
                ></View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={takevideo}
            >
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: 25,
                  borderColor: "red",
                  height: 50,
                  width: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 25,
                    borderColor: recording ? "blue" : "red",
                    height: 40,
                    width: 40,
                    backgroundColor: recording ? "blue" : "red",
                  }}
                ></View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
};

const mapStateToProps = (store) => ({
  userDetail: store.userState.userDetail,
  cameraData: store.userState.cameraData,
});
export default connect(mapStateToProps, null)(VideoCamera);

const styles = StyleSheet.create({});
