import React from "react";
import { Text, View, Image, Pressable } from "react-native";
import styles from "./styles";
import { useNavigation } from "@react-navigation/core";
import { connect } from "react-redux";
import { BASE_URL } from "../urls";
import moment from "moment";
const CustomListItem = ({ chatroom, ...props }) => {
  const { userDetail } = props;

  const pic = `${BASE_URL}static/group.jpg`;

  const navigation = useNavigation();
  const group = chatroom.group;
  const lastmessage = chatroom.lastmsg;
  let user;
  let notification;

  if (chatroom.other) {
    if (chatroom.other.username === userDetail.user.username) {
      user = chatroom.user;
      notification = chatroom.other_notification;
    }
  }
  if (chatroom.user) {
    if (chatroom.user.username === userDetail.user.username) {
      user = chatroom.other;
      notification = chatroom.user_notification;
    }
  }

  const onPress = () => {
    if (group) {
      navigation.navigate("ChatGroup", {
        id: chatroom.id,
        chatName: group.name,
        group_id: group.id,
        pic: pic,
        type: "group",
      });
    } else {
      navigation.navigate("Chat", {
        id: chatroom.id,
        chatName: user.username,
        user_id: user.id,
        pic: user.user_picture,
        type: "user",
        fulluser: user,
      });
    }
  };
  return (
    <Pressable style={styles.container} onPress={onPress} key={chatroom.id}>
      {group ? (
        <>
          <Image
            source={{
              uri: pic,
            }}
            style={styles.image}
          />
          {group.notification ? (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{group.notification}</Text>
            </View>
          ) : null}

          <View style={styles.rightContainer}>
            <View style={styles.row}>
              <Text style={styles.name}>{group.name}</Text>
              {lastmessage && (
                <Text style={styles.text}>
                  {moment(lastmessage.createdat).format("DD/MM/YYYY")}
                </Text>
              )}
            </View>
            {lastmessage && (
              <Text numberOfLines={1} ellipsizeMode="head" style={styles.text}>
                {lastmessage.lastmsg}
              </Text>
            )}
          </View>
        </>
      ) : (
        <>
          <Image
            source={{
              uri: user.user_picture,
            }}
            style={styles.image}
          />
          {notification ? (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{notification}</Text>
            </View>
          ) : null}

          <View style={styles.rightContainer}>
            <View style={styles.row}>
              <Text style={styles.name}>{user.username}</Text>
              {lastmessage && (
                <Text style={styles.text}>
                  {moment(lastmessage.createdat).format("DD/MM/YYYY")}
                </Text>
              )}
            </View>
            {lastmessage && (
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
                {lastmessage.lastmsg}
              </Text>
            )}
          </View>
        </>
      )}
    </Pressable>
  );
};

const mapStateToProps = (store) => ({
  userDetail: store.userState.userDetail,
});

export default connect(mapStateToProps, null)(CustomListItem);
