import React, { useState, useLayoutEffect, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { Button, Input, ListItem, Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/AntDesign";
import { axiosHandler, getToken } from "../auth/helper";
import {
  CHAT_LIST_URL,
  MESSAGE_GROUP_CHAT_URL,
  PROFILE_URL,
  ADD_TO_GROUP_CHAT,
  BASE_URL,
} from "../urls";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";
import { NEW_MESSAGE_CHATLIST_CHANGE } from "../redux/constants";

let breaker = false;

const AddChatScreen = ({ navigation, ...props }) => {
  const { userDetail } = props;
  // console.log("Userdetail::::", userDetail);
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [combinedset, setCombinedSet] = useState([]);

  let debouncer;
  let userholder = [];
  let groupholder = [];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new Chat",
    });

    return () => {};
  }, [navigation]);

  useEffect(() => {
    getAll();
    return () => {
      breaker = false;
    };
  }, [input]);

  const getAll = async () => {
    if (breaker) return;

    clearTimeout(debouncer);
    breaker = true;
    debouncer = setTimeout(async () => {
      setCombinedSet([]);
      userholder = [];
      groupholder = [];
      let extra = input;
      await getUser(extra);
      await getGroupChatlist(extra);
      let allcombined = [...userholder, ...groupholder];
      setCombinedSet(allcombined);
      breaker = false;
    }, 2000);
  };

  const getUser = async (extra = "") => {
    extra = `?keyword=${extra}`;
    const token = await getToken();
    const result = await axiosHandler({
      method: "get",
      url: PROFILE_URL + extra,
      token,
    }).catch((e) => {
      console.log("getUser error::::", e);
    });

    if (result) {
      // console.log("getUser results::::", result.data.results);
      userholder = result.data.results;
    }
  };
  const getGroupChatlist = async (extra = "") => {
    extra = `?groupword=${extra}&searchgroup=true`;
    const token = await getToken();
    const result = await axiosHandler({
      method: "get",
      url: CHAT_LIST_URL + extra,
      token,
    }).catch((e) => {
      console.log("getGroup error::::", e.response.data);
    });

    if (result) {
      // console.log("getGroup results::::", result.data.results);
      groupholder = result.data.results;
    }
  };
  const createChatGroup = async () => {
    const token = await getToken();
    const result = await axiosHandler({
      method: "post",
      url: MESSAGE_GROUP_CHAT_URL,
      token,
      data: { name: input, author_id: userDetail.user.id },
    }).catch((e) => {
      console.log("createchatGroup error::::", e);
    });
    if (result) {
      // console.log("createchatGroup results::::", result.data);
      navigation.navigate("ChatGroup", {
        id: result.data.id,
        chatName: result.data.name,
        group_id: result.data.id,
        pic: "",
        type: "group",
      });
      dispatch({ type: NEW_MESSAGE_CHATLIST_CHANGE, data: "" });
    }
  };

  const createUserChat = async (other_id) => {
    const token = await getToken();
    const result = await axiosHandler({
      method: "post",
      url: CHAT_LIST_URL,
      token,
      data: { other_id: other_id, user_id: userDetail.user.id },
    }).catch((e) => {
      console.log("createUserchat error::::", e);
    });

    if (result) {
      // console.log("createUserchat results::::", result.data);
      console.log("pic:::", result.data.other.user_picture);
      navigation.navigate("Chat", {
        id: result.data.id,
        chatName: result.data.other.username,
        user_id: result.data.other.id,
        pic: result.data.other.user_picture,
        type: "user",
      });
      dispatch({ type: NEW_MESSAGE_CHATLIST_CHANGE, data: "" });
    }
  };
  const joinGroupChatList = async (data) => {
    const token = await getToken();
    const result = await axiosHandler({
      method: "post",
      url: ADD_TO_GROUP_CHAT,
      token,
      data: { chatlist_id: data.id },
    }).catch((e) => {
      console.log("joinGroupChatList error::::", e);
    });
    if (result) {
      // console.log("joingroupchatlistResults:::", result.data);
      navigation.navigate("ChatGroup", {
        id: data.id,
        chatName: data.group.name,
        group_id: data.group.id,
        pic: "",
        type: "group",
      });
      dispatch({ type: NEW_MESSAGE_CHATLIST_CHANGE, data: "" });
    }
  };
  return (
    <View style={styles.container}>
      <Input
        value={input}
        onChangeText={(t) => setInput(t)}
        placeholder="Start typing to search users or create chat group"
        leftIcon={
          <Icon name="wechat" size={24} type="antdesign" color="black" />
        }
      />

      {combinedset.length < 1 && input ? (
        <Text>No user or group with this name was found!</Text>
      ) : (
        <Text></Text>
      )}

      <FlatList
        data={combinedset}
        renderItem={({ item }) => {
          if (item.group) {
            const pic = `${BASE_URL}static/group.jpg`;
            let group = item;
            return (
              <ListItem
                key={group.id}
                bottomDivider
                onPress={() => joinGroupChatList(group)}
              >
                <Avatar
                  rounded
                  source={{
                    uri: pic,
                  }}
                />
                <ListItem.Content>
                  <ListItem.Title style={{ fontWeight: "800" }}>
                    {group.group.name}
                  </ListItem.Title>
                  <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    {group.group.members.length + 1} member(s)
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            );
          }
          if (item.name) {
            let user = item;

            return (
              <ListItem
                key={user.id}
                bottomDivider
                onPress={() => createUserChat(user.user.id)}
              >
                <Avatar
                  rounded
                  source={{
                    uri: user.user.user_picture,
                  }}
                />
                <ListItem.Content>
                  <ListItem.Title style={{ fontWeight: "800" }}>
                    {user.name}
                  </ListItem.Title>
                  <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    {user.bio}
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            );
          }
        }}
      />

      <Button
        title="Create a new Chat group"
        onPress={createChatGroup}
        disabled={!input || combinedset.length > 0}
      />
    </View>
  );
};
const mapStateToProps = (store) => ({
  userDetail: store.userState.userDetail,
});

export default connect(mapStateToProps, null)(AddChatScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    height: "100%",
  },
});
