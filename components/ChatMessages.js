import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Image } from "react-native-elements";
// import { createElement } from "react-native-web";
import { Video } from "expo-av";

export const VideoObj = (props) => {
  // if (Platform.OS === "web") {
  //   attrs = {
  //     src: props.source,
  //     poster: props.poster,
  //     controls: "controls",
  //     preload: "none",
  //     style: styles.video,
  //   };
  //   return createElement("video", attrs);

  // } else {
  return (
    <Video
      style={styles.video}
      source={{
        uri: props.source,
      }}
      useNativeControls
      resizeMode="contain"
      // isLooping
      // onPlaybackStatusUpdate={status => setStatus(() => status)}
    />
  );
};

const ChatMessages = ({
  messages,
  userDetail,
  setModalVisible,
  setDelMsgId,
}) => {
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   if (messages) setData(messages);
  // }, [messages, userDetail]);
  return (
    <FlatList
      inverted
      contentContainerStyle={{
        paddingTop: 15,
      }}
      data={messages}
      renderItem={({ item }) => {
        return (
          <View>
            {item.sender.user.username === userDetail.user.username ? (
              <Pressable
                key={item.id}
                style={styles.receiver}
                onPress={() => {
                  if (Platform.OS === "web") {
                    setDelMsgId(item.id);
                    setModalVisible(true);
                  }
                }}
                onLongPress={() => {
                  setDelMsgId(item.id);
                  setModalVisible(true);
                }}
              >
                {!item.message ? (
                  <Text></Text>
                ) : (
                  <Text style={styles.receiverText}>{item.message} </Text>
                )}
                <FileAttachment files={item.message_attachments} />

                <Text style={styles.datereceive}>
                  {moment(item.created_at).format("DD/MM/YYYY")}{" "}
                  {moment(item.created_at).format("hh:mm a")}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                key={item.id}
                style={styles.sender}
                onPress={() => {
                  if (Platform.OS === "web") {
                    setDelMsgId(item.id);
                    setModalVisible(true);
                  }
                }}
                onLongPress={() => {
                  setDelMsgId(item.id);
                  setModalVisible(true);
                }}
              >
                {!item.message ? (
                  <Text></Text>
                ) : (
                  <Text style={styles.senderText}>{item.message} </Text>
                )}
                <FileAttachment files={item.message_attachments} />
                <Text style={styles.datesend}>
                  {moment(item.created_at).format("DD/MM/YYYY")}{" "}
                  {moment(item.created_at).format("hh:mm a")}
                </Text>
              </Pressable>
            )}
          </View>
        );
      }}
    />
  );
};

const FileAttachment = ({ files }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(files);
  }, [files]);
  return (
    <View>
      {data &&
        data.map((item, key) => (
          <View key={key}>
            {item.attachment.mediaType === "audio" && <Text>audio </Text>}
            {item.attachment.mediaType === "video" && (
              <VideoObj source={item.attachment.file_upload} />
            )}
            {item.attachment.mediaType === "image" && (
              <Image
                source={{
                  uri: item.attachment.file_upload,
                }}
                style={styles.image}
                resizeMode={"contain"}
              />
            )}
            {item.attachment.mediaType === "other_file" && (
              <Text>{item.attachment.og_name} </Text>
            )}
          </View>
        ))}
    </View>
  );
};

export default ChatMessages;

const styles = StyleSheet.create({
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
    marginBottom: 15,
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
  datesend: {
    color: "whitesmoke",
    fontSize: 9,
  },
  datereceive: {
    color: "grey",
    fontSize: 9,
  },
  image: {
    height: 250,
    width: 250,
    marginBottom: 3,
  },
  video: {
    // height: 300,
    // width: 300,
    maxHeight: 500,
    // maxWidth: 300,
    height: "100%",
    width: "100%",
    marginBottom: 3,
  },
});
