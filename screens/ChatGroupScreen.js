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
  FlatList,
} from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { BASE_URL, MESSAGE_GROUP_URL } from "../urls";
import { axiosHandler, getToken } from "../auth/helper";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DocumentPicker, { types } from "react-native-document-picker";

const ChatGroupScreen = ({ navigation, route, ...props }) => {
  const { userDetail } = props;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sendingMsg, setSendingMsg] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerBackTitleVisisble: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            rounded
            source={{
              uri: `${route.params.pic}`,
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
        </View>
      ),

      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{}}>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
    return () => {};
  }, [navigation]);

  useEffect(() => {
    const id = route.params.group_id;
    getChatGroupMsgs(id, 1);
    return () => {};
  }, [route]);

  const getChatGroupMsgs = async (id, page = 1) => {
    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      url: `${MESSAGE_GROUP_URL}?page=${page}&group_id=${id}`,
      token,
    }).catch((e) => {
      console.log("Error in getChatGroupMsg::::", e);
    });

    if (res) {
      // console.log(" getChatGroupMessages::::", res.data.results);
      setMessages(res.data.results);
    }
  };

  const sendMessage = async () => {
    Keyboard.dismiss();
    if (!input) return;
    setSendingMsg("sending....");
    const token = await getToken();
    const res = await axiosHandler({
      method: "post",
      url: `${MESSAGE_GROUP_URL}`,
      token,
      data: {
        message: input,
        sender_id: userDetail.user.id,
        group_id: route.params.group_id,
      },
    }).catch((e) => {
      console.log("Error in Send Group Message::::", e);
    });

    if (res) {
      // console.log(" Send Group Message results::::", res.data);
      setMessages([res.data, ...messages]);
    }
    setSendingMsg(null);
    setInput("");
  };
  const getPhoneFilePicker = async () => {
    //Opening Document Picker for selection of multiple file

    try {
      // const response = await DocumentPicker.pickMultiple({
      const response = await DocumentPicker.pickSingleFile({
        type: types.allFiles,
        //There can me more options as well find above
      });
      // console.log(response);
      alert(JSON.stringify(response));
    } catch (err) {
      alert("Unknown Error2: " + JSON.stringify(err));
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={150}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <FlatList
              inverted
              contentContainerStyle={{
                paddingTop: 15,
              }}
              data={messages}
              renderItem={({ item }) => (
                <>
                  {item.sender.user.username === userDetail.user.username ? (
                    <View key={item.id} style={styles.receiver}>
                      <Avatar
                        rounded
                        size={30}
                        // position="absolute"
                        //   bottom={-15}
                        //   right={-5}
                        containerStyle={{
                          position: "absolute",
                          bottom: -15,
                          right: -5,
                        }}
                        source={{
                          uri:
                            userDetail.user.user_picture ||
                            `${BASE_URL}static/guest.jpg`,
                        }}
                      />
                      <Text style={styles.receiverText}>{item.message} </Text>
                    </View>
                  ) : (
                    <View key={item.id} style={styles.sender}>
                      <Avatar
                        rounded
                        size={30}
                        // position="absolute"
                        //   bottom={-15}
                        //   left={-5}
                        containerStyle={{
                          position: "absolute",
                          bottom: -15,
                          left: -5,
                        }}
                        source={{
                          uri:
                            route.params.pic || `${BASE_URL}static/erica.jpg`,
                        }}
                      />
                      <Text style={styles.senderText}>{item.message}</Text>
                      <Text style={styles.senderName}>
                        {item.sender.user.username}
                      </Text>
                    </View>
                  )}
                </>
              )}
            />
            {sendingMsg && (
              <View style={styles.receiver}>
                <Avatar
                  rounded
                  size={30}
                  // position="absolute"
                  //   bottom={-15}
                  //   right={-5}
                  containerStyle={{
                    position: "absolute",
                    bottom: -15,
                    right: -5,
                  }}
                  source={{
                    uri: userDetail.user.user_picture,
                    // ||
                    // `${BASE_URL}static/erica.jpg`,
                  }}
                />
                <Text style={styles.receiverText}>{input} </Text>

                <Text style={styles.receiverText}>{sendingMsg} </Text>
              </View>
            )}
            <View style={styles.footer}>
              <TextInput
                value={input}
                onChangeText={(t) => setInput(t)}
                placeholder="Sup Message"
                style={styles.textInput}
                onSubmitEditing={sendMessage}
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
                  onPress={sendMessage}
                  // disabled={!input}
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
                  onPress={() => getPhoneFilePicker()}
                  // disabled={!input}
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
});

const mapDispatchProps = (dispatch) => bindActionCreators({}, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(ChatGroupScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: "grey",
    borderRadius: 30,
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    margin: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
    borderRadius: 20,
  },
  receiver: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
    borderRadius: 20,
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  receiverText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white",
  },
  icon: {
    // marginHorizontal: 5,
  },
});
