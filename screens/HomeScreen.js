import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Text,
  TextInput,
} from "react-native";
import { Avatar } from "react-native-elements";
import CustomListItem from "../components/CustomListItem";
import { checkAuthState, logout } from "../auth/authController";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { getToken, axiosHandler } from "../auth/helper";
import { CHAT_LIST_URL } from "../urls";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { joinUsersSockect, dispatchMsg } from "../redux/actions/index";
import { useDispatch } from "react-redux";
import { CHAT_LIST_CHANGE } from "../redux/constants";
import { StatusBar } from "expo-status-bar";
import { Button } from "react-native-elements";
import moment from "moment";
moment.locale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "few seconds ago",
    ss: "%ss",
    m: "a minute",
    mm: "%dm",
    h: "an hour",
    hh: "%dh",
    d: "a day",
    dd: "%dd",
    M: "a month",
    MM: "%dm",
    y: "a year",
    yy: "%dy",
  },
});
const HomeScreen = ({ navigation, ...props }) => {
  const dispatch = useDispatch();
  const { userDetail, refreshAuth } = props;
  const [loading, setLoading] = useState(true);
  const [chatList, setChatList] = useState(props.chatList);
  const [resetHeader, setResetHeader] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);

  useLayoutEffect(() => {
    headerBarLayout();
    return () => {};
  }, [userDetail]);

  const headerBarLayout = () => {
    navigation.setOptions({
      title: "",
      headerStyle: {
        backgroundColor: "white",
      },
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",
      headerLeft: () => (
        <View style={{ marginLeft: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("UserDrawer")}
            activeOpacity={0.5}
          >
            <Avatar
              rounded
              source={{
                uri: userDetail?.user?.user_picture,
              }}
              size={50}
            />
            <Avatar
              size={30}
              rounded
              icon={{ name: "pencil", type: "font-awesome", color: "white" }}
              activeOpacity={0.7}
              containerStyle={{
                position: "absolute",
                bottom: -4,
                right: -1,
              }}
            />
          </TouchableOpacity>
        </View>
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
            onPress={() => {
              searchBarLayout();
            }}
            activeOpacity={0.5}
          >
            <AntDesign name="search1" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("AddChat")}
            activeOpacity={0.5}
          >
            <SimpleLineIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
    setResetHeader(false);
  };
  const searchBarLayout = () => {
    navigation.setOptions({
      headerLeft: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: 300,
            padding: 15,
            marginLeft: 10,
          }}
        >
          <TextInput
            autoFocus
            // value={search}
            onChangeText={(text) => setSearch(text)}
            placeholder="Search added chats ..."
            type="text"
            style={{
              bottom: 0,
              height: 40,
              flex: 1,
              marginRight: 15,
              backgroundColor: "#ECECEC",
              padding: 10,
              color: "black",
              borderRadius: 30,
              width: 200,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              headerBarLayout();
              setSearchList([]);
            }}
          >
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => <View></View>,
    });
    setResetHeader(true);
  };

  const searchParse = () => {
    let filtered = [];
    const filter = chatList.map((i) => {
      if (i.group) {
        if (i.group.name.includes(search)) {
          filtered.push(i);
        }
      } else {
        if (i.user.username === userDetail.user.username) {
          if (i.other.username.includes(search)) {
            filtered.push(i);
          }
        }
        if (i.other.username === userDetail.user.username) {
          if (i.user.username.includes(search)) {
            filtered.push(i);
          }
        }
      }
    });
    setSearchList(filtered);
  };

  useEffect(() => {
    setChatList(props.chatList);
    return () => {};
  }, [props.chatList]);

  useEffect(() => {
    firstrun();
    return () => {};
  }, [refreshAuth]);

  useEffect(() => {
    secondrun();
    return () => {};
  }, [props.refreshChatList]);

  useEffect(() => {
    searchParse();
  }, [search]);

  const firstrun = async () => {
    props.dispatchMsg();
    await checkAuthState(props, dispatch, props.joinUsersSockect, navigation);
  };

  const secondrun = async () => {
    await getChatList();
    setLoading(false);
  };

  const getChatList = async (extra = "") => {
    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      url: CHAT_LIST_URL,
      token,
    }).catch((e) => {
      console.log("Error in getChatList::::", e);
      setError(true);
    });

    if (res) {
      setError(false);

      console.log(" getChatList::::", res.data.results);
      dispatch({ type: CHAT_LIST_CHANGE, chatList: res.data.results });
    }
  };

  if (loading) {
    return (
      <View style={styles.page}>
        <StatusBar style="auto" />
        <ActivityIndicator
          animating={true}
          color="#2C6BED"
          size="large"
          style={styles.activityIndicator}
        />
      </View>
    );
  }
  return (
    <View style={styles.page}>
      <StatusBar style="auto" />
      <>
        {resetHeader ? (
          <>
            {!loading && chatList.length > 0 ? (
              <>
                {searchList.map((item) => (
                  <CustomListItem chatroom={item} key={item.id} />
                ))}
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            {!loading && chatList.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                // onEndReached
                // horizontal
                // ListHeaderComponent
                // extraData={chatList}
                keyExtractor={(item) => item.id}
                data={chatList}
                renderItem={({ item }) => <CustomListItem chatroom={item} />}
              />
            ) : (
              <View style={styles.btnview}>
                {error ? (
                  <>
                    <Text>Error getting chat!</Text>
                    <Button
                      title="Reload"
                      containerStyle={styles.button}
                      onPress={() => getChatList()}
                    />
                  </>
                ) : (
                  <>
                    <Text>No chats found!</Text>
                    <Button
                      title="Add a user or group"
                      containerStyle={styles.button}
                      onPress={() => navigation.navigate("AddChat")}
                    />
                  </>
                )}
              </View>
            )}
          </>
        )}
      </>
    </View>
  );
};

const mapStateToProps = (store) => ({
  userDetail: store.userState.userDetail,
  chatList: store.usersState.chatList,
  refreshChatList: store.usersState.refreshChatList,
  refreshAuth: store.userState.refreshAuth,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      joinUsersSockect,
      dispatchMsg,
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchProps)(HomeScreen);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
  },
  btnview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
