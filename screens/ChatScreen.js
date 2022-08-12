import React, { useLayoutEffect, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { MESSAGE_URL, READ_CHATROOM_URL } from "../urls";
import { axiosHandler, getToken } from "../auth/helper";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as DocumentPicker from "expo-document-picker";
import FileResponse from "../components/FileResponse";
import ChatMessages from "../components/ChatMessages";
import { sendUserChatMsgSockect, setFromReadMsgs } from "../redux/actions";
import DeleteMessageModal from "../components/DeleteMessageModal";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import { useDispatch } from "react-redux";
import { CAMERA_DATA_CHANGE } from "../redux/constants";

const ChatScreen = ({ navigation, route, ...props }) => {
  const { userDetail, newMsg, cameraData } = props;
  const [modalVisible, setModalVisible] = useState(false);

  const [input, setInput] = useState("");
  const [delMsgId, setDelMsgId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [sendingMsg, setSendingMsg] = useState(null);
  const [fileResponses, setFileResponses] = useState([]);
  const [fileData, setFileData] = useState([]);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      // headerBackTitleVisisble: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() =>
            navigation.navigate("OtherUserProfile", route.params.fulluser)
          }
        >
          <Avatar
            rounded
            source={{
              uri: route.params.pic,
            }}
          />
          <Text
            style={{
              color: "white",
              marginLeft: 10,
              fontWeight: "700",
            }}
          >
            {route.params.chatName}
          </Text>
        </TouchableOpacity>
      ),

      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 10,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("VideoCamera")}
          >
            <FontAwesome name="camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{}}
            activeOpacity={0.5}
            onPress={() => navigation.navigate("VideoCamera")}
          >
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
    return () => {};
  }, [navigation]);

  useEffect(() => {
    if (newMsg) {
      setMessages([newMsg, ...messages]);
      readChatroom();
    }

    return () => {};
  }, [newMsg]);

  useEffect(() => {
    try {
      if (cameraData) {
        const item = [{ type: cameraData.type, uri: cameraData.item.uri }];
        setFileData(item);
        setFileResponses(item);
        setInput(cameraData.type);
        dispatch({
          type: CAMERA_DATA_CHANGE,
          cameraData: null,
        });
      }
    } catch (error) {
      alert("cmduseffe: " + JSON.stringify(error));
    }

    return () => {};
  }, [cameraData]);

  useEffect(() => {
    const id = route.params.user_id;
    getChatMsgs(id, 1);
    readChatroom();
    return () => {};
  }, [route]);

  const readChatroom = async () => {
    const token = await getToken();
    const res = await axiosHandler({
      method: "post",
      url: `${READ_CHATROOM_URL}`,
      data: {
        chat_id: route.params.id,
      },
      token,
    }).catch((e) => {
      console.log("Error in readChatroom::::", e);
    });

    if (res) {
      // console.log(" readChatroom::::", res.data);
      props.setFromReadMsgs("");
    }
  };

  const getChatMsgs = async (id, page = 1) => {
    const perm = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

    console.log("in getchatmsgs");
    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      url: `${MESSAGE_URL}?page=${page}&user_id=${id}`,
      token,
    }).catch((e) => {
      console.log("Error in getChatMsg::::", e);
    });

    if (res) {
      // console.log(" getChatMsg::::", res.data.results);

      setMessages(res.data.results);
    }
  };

  const sendMessage = async () => {
    Keyboard.dismiss();
    const formData = new FormData();
    // console.log("datasend::", fileData);
    if (Platform.OS === "web") {
      // alert("in web");
      if (!input) {
        if (!fileData) {
          return;
        } else {
          formData.append("message", "Attachment");
        }
      } else {
        formData.append("message", input);
      }

      formData.append("sender_id", userDetail.user.id);
      formData.append("receiver_id", route.params.user_id);
      formData.append("chatlist_id", route.params.id);
      if (fileData.length > 0) {
        for (let i = 0; i < fileData.length; i++) {
          formData.append("attachments", fileData[i]);
        }

        console.log("added");
      }

      setSendingMsg("....");
      const token = await getToken();
      const res = await axiosHandler({
        method: "post",
        url: `${MESSAGE_URL}`,
        token,
        data: formData,
      }).catch((e) => {
        console.log("Error in send Message::::", e);
      });

      if (res) {
        console.log(" Send Message results::::", res.data);
        setMessages([res.data, ...messages]);
        const data = {
          chatroom: route.params.id,
          info: res.data,
        };
        props.sendUserChatMsgSockect(data);
      }
    } else {
      // alert("in phone");
      if (!input) {
        if (!fileData) {
          return;
        } else {
          formData.append("message", "File");
        }
      } else {
        formData.append("message", input);
      }

      formData.append("sender_id", userDetail.user.id);
      formData.append("receiver_id", route.params.user_id);
      formData.append("chatlist_id", route.params.id);
      if (fileData.length > 0) {
        try {
          let b64_uri = await FileSystem.readAsStringAsync(fileData[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          formData.append("b64_uri", b64_uri ? b64_uri : "empty");

          // alert("get2 file: " + JSON.stringify(fileExtension));
        } catch (error) {
          alert("get2 Error: " + JSON.stringify(error));
        }
        // alert("fileData: " + JSON.stringify(fileData));
        let nn = fileData[0].uri;
        let fileExtension = nn.substr(nn.lastIndexOf(".") + 1);
        formData.append("ext", fileExtension);
        console.log("added");
      }

      setSendingMsg("sending....");
      const token = await getToken();
      const res = await axiosHandler({
        method: "post",
        url: `${MESSAGE_URL}`,
        token,
        data: formData,
        extra: { "content-type": "multipart/form-data" },
      }).catch((e) => {
        console.log("Error in send Message::::", e);
      });
      if (res) {
        console.log(" Send Message results::::", res.data);
        setMessages([res.data, ...messages]);
        const data = {
          chatroom: route.params.id,
          info: res.data,
        };
        props.sendUserChatMsgSockect(data);
      }
    }
    setFileResponses([]);
    setSendingMsg(null);
    setInput("");
  };

  const getFile = () => {
    if (Platform.OS === "web") {
      getWebFilePicker();
    } else {
      getPhoneFilePicker();
    }
  };

  const getPhoneFilePicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        // base64: true,
        quality: 1,
      });

      try {
        console.log(result);
        try {
          //cancelled//base64//uri/type//height/width
          // alert("result: " + JSON.stringify(result));
        } catch (error) {
          alert("uri Error: " + JSON.stringify(error));
        }
        // alert("result: " + JSON.stringify(result));
        setInput("File");
      } catch (error) {
        alert("log Error: " + JSON.stringify(error));
      }
      try {
        if (result.cancelled !== true) {
          let renderfiles = [];
          try {
            renderfiles.push(result);
          } catch (error) {
            alert("render: " + JSON.stringify(renderfiles));
          }
          setFileData(renderfiles);

          setFileResponses(renderfiles);
        }
      } catch (error) {
        alert("Another Error: " + JSON.stringify(error));
      }
    } catch (error) {
      alert("Unknown Error: " + JSON.stringify(error));
    }
  };

  const getWebFilePicker = async () => {
    let response = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: true,
    });
    console.log(response);
    if (response.type === "success") {
      let renderfiles = [];
      for (let f = 0; f < response.output.length; f++) {
        renderfiles.push(response.output[f]);
      }
      console.log(renderfiles);
      setFileData(response.output);
      setInput("Attachment");
      setFileResponses(renderfiles);
    }
  };
  const handleMessageDelete = async (id) => {
    if (!id) return;
    const token = await getToken();
    const res = await axiosHandler({
      method: "DELETE",
      url: `${MESSAGE_URL}${id}/`,
      token,
    }).catch((e) => {
      console.log("Error in delete Message::::", e);
    });
    if (res) {
      console.log(" Delete Message results::::", res.data);
      const msgs = messages.filter((e) => e.id !== id);
      setMessages(msgs);
      setModalVisible(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={150}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
      >
        <StatusBar style="dark" />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <Modal
              animationType="slide"
              visible={modalVisible}
              transparent={true}
              onRequestClose={() => setModalVisible(false)}
            >
              <DeleteMessageModal
                setModalVisible={setModalVisible}
                delMsgId={delMsgId}
                handleMessageDelete={handleMessageDelete}
              />
            </Modal>
            <ChatMessages
              messages={messages}
              userDetail={userDetail}
              setModalVisible={setModalVisible}
              setDelMsgId={setDelMsgId}
            />
            {fileResponses && fileResponses.length > 0 ? (
              <View style={styles.receiver}>
                <AntDesign
                  name="close"
                  size={18}
                  color="red"
                  style={{}}
                  onPress={() => setFileResponses([])}
                />
                <FileResponse data={fileResponses} />
              </View>
            ) : null}

            {sendingMsg && (
              <View style={styles.receiver}>
                <Text style={styles.receiverText}>{input} </Text>

                <Text style={styles.receiverText}>{sendingMsg} </Text>
              </View>
            )}
            <View style={styles.footer}>
              <TextInput
                value={input}
                onChangeText={(t) => setInput(t)}
                placeholder="Sup message..."
                style={styles.textInput}
                onSubmitEditing={() => {
                  sendMessage();
                }}
                disabled={sendingMsg}
              />

              {input ? (
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
                    sendMessage();
                  }}
                >
                  <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
              ) : (
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
                  onPress={() => getFile()}
                >
                  <AntDesign
                    name="plus"
                    size={18}
                    color="white"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              )}
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const mapStateToProps = (store) => ({
  userDetail: store.userState.userDetail,
  newMsg: store.userState.newMsg,
  cameraData: store.userState.cameraData,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      sendUserChatMsgSockect,
      setFromReadMsgs,
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchProps)(ChatScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  receiver: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    marginRight: 15,
    marginBottom: 10,
    maxWidth: "80%",
    position: "relative",
    borderRadius: 20,
  },
  receiverText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
  },
  icon: {
    // marginHorizontal: 5,
  },
});
