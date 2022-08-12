import { NEW_MSG_CHANGE, NEW_MESSAGE_CHATLIST_CHANGE } from "../constants";
import { SOCKET_API_URL } from "../../urls";
import io from "socket.io-client";

export const setFromReadMsgs = (data) => {
  return (dispatch) => {
    dispatch({ type: NEW_MESSAGE_CHATLIST_CHANGE, data: "" });
  };
};

// export const tempFunc = () => {
//   return (dispatch, getState) => {
//     console.log("In Found:::");
//     const found = getState().userState.userDetail;
//     console.log("Found:::", found);
//   };
// };

export const Sockobj = () => {
  const socket = io(`${SOCKET_API_URL}`, {
    forceNew: true,
  });
  socket.on("connection", () => console.log("connected"));

  socket.on("openChat", (data) => {
    console.log("openchat::", data);
  });
  return socket;
};
let socket;
try {
  if (socket == null) {
    console.log("socket spawned");
    socket = Sockobj();
  }
} catch (error) {}

export const sendUserChatMsgSockect = (data) => {
  return (dispatch) => {
    console.log("sendUserChatMsgSockect data:;;", data);
    socket.emit("userChatMsg", data, (err) => {
      console.log(err);
    });
  };
};

export const joinUsersSockect = (userID) => {
  return (dispatch) => {
    // console.log("joinUsersSockect data:::", userID);
    socket.emit("joinUsers", userID, (cb) => {
      console.log(cb);
    });
  };
};

export const dispatchMsg = () => {
  return (dispatch) => {
    socket.on("dispatchMsg", (data) => {
      console.log("dispatchMsg::", data);
      dispatch({ type: NEW_MSG_CHANGE, newMsg: data.info });
      dispatch({ type: NEW_MESSAGE_CHATLIST_CHANGE, data: "" });
    });
  };
};
