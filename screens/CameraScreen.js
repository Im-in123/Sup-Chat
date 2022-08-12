import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

const CameraScreen = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);

  const [type, setType] = useState(Camera.Constants.Type.front);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      console.log("pic uri::", data.uri);
      alert("data: " + JSON.stringify(data));

      setImage(data.uri);
    }
    navigation.naigate();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: true, //supports web. doesnt work on android or ios use expo multiple image picker
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  // if (hasCameraPermission === false || hasGalleryPermission === false) {
  //   return <Text>No access to camera</Text>;
  // }
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.fixedRatio}
          ratio={"1:1"}
          type={type}
          ref={(ref) => setCamera(ref)}
        ></Camera>
      </View>
      <Button
        style={{
          flex: 0.1,
          alignSelf: "flex-end",
          alignItems: "center",
        }}
        title="Flip Image"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}
      ></Button>
      <Button title="Take a Picture" onPress={() => takePicture()} />
      <Button title="Pick image from Gallery" onPress={() => pickImage()} />
      {/* <Button
                title="Save" onPress={() => navigation.navigate("Save", { image })}
            /> */}
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
});
