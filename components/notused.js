// import { sendUserChatMsgSockect, setFromReadMsgs } from "../redux/actions";
// // import DocumentPicker, { types } from "react-native-document-picker";

//   const getPhoneFilePicker = async () => {
//     //Opening Document Picker for selection of multiple file
//     try {
//       let response = await DocumentPicker.getDocumentAsync({
//         copyToCacheDirectory: false,
//       });
//       console.log(response);
//       try {
//         alert(JSON.stringify(response));
//       } catch (error) {}
//       if (response.type === "success") {
//         // console.log(response.output);
//         let renderfiles = [];
//         renderfiles.append(response);

//         console.log(renderfiles);
//         setFileData(renderfiles);
//         setInput("Attachments");
//         setFileResponses(renderfiles);

//         // await sendMessage(response.output);
//         // setFileResponses([]);
//       }
//     } catch (err) {
//       //Handling any exception (If any)

//       alert("Unknown Error: " + JSON.stringify(err));
//     //   throw err;
//     }
//   };

//        // left:null,
//       // headerLeft: () => (
//       //   <TouchableOpacity
//       //     style={{ marginLeft: 10 }}
//       //     onPress={navigation.goBack}
//       //   >
//       //     <AntDesign name="arrowleft" size={24} color="white" />
//       //   </TouchableOpacity>
//       // ),

// const _selectAndUpload = async () => {
//   try {
//     const picked = await WebDocumentPicker.getDocumentAsync({
//       type: "*/*",
//       copyToCacheDirectory: true,
//       multiple: true,
//     });
//     if (picked.type === "cancel") {
//       return;
//     } else if (picked.type === "success") {
//       console.log("picked::", picked);
//       const { name } = picked;
//       const fileUri = `${FileSystem.documentDirectory}${name}`;
//       console.log("fileuri::", fileUri);
//       if (Platform.OS === "ios") {
//         const pickerResult = await FileSystem.downloadAsync(
//           picked.uri,
//           fileUri
//         );
//       } else {
//         const pickerResult = {
//           name: picked.name,
//           uri: picked.uri,
//         };
//       }
//     } else {
//       return;
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

//   const getPhoneFilePicker = async () => {
//     try {
//       let result = await ImagePicker.launchImageLibraryAsync({
//         // mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         mediaTypes: ImagePicker.MediaTypeOptions.All,
//         base64: true,
//         // allowsEditing: true,
//         // aspect: [1, 1],
//         quality: 1,
//         // allowsMultipleSelection: true, //supports web. doesnt work on android or ios use expo multiple image picker
//       });
//       console.log(result);
//       if (!result.cancelled) {
//         let renderfiles = [];
//         renderfiles.append(result);
//         setInput("File");
//         setFileResponses(renderfiles);
//       }
//     } catch (error) {
//       alert("Unknown Error: " + JSON.stringify(error));
//     }
//   };

// add below ------
//   // saved the asset uri
//   const data = await cameraRef.current.takePictureAsync(options);
//   const source = data.uri;

//   if (source) {
//   const cachedAsset = await MediaLibrary.createAssetAsync(source);
//   const albumName = 'NEW ALBUM';
//   const album = await MediaLibrary.getAlbumAsync(albumName);
//   // check if the album if exists or not
//   if (album) {
//     await MediaLibrary.addAssetsToAlbumAsync(
//       [cachedAsset],
//       album,
//       true
//     );
//   } else {
//     // if album does not exists, create on
//     const asset = await MediaLibrary.createAssetAsync(source);
//     await MediaLibrary.createAlbumAsync(albumName, asset);
//   }
