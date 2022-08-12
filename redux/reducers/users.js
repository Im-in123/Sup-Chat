import { uuidv4 } from "../../auth/helper";
import { CHAT_LIST_CHANGE, NEW_MESSAGE_CHATLIST_CHANGE } from "../constants";

const initialState = {
  chatList: [],
  refreshChatList: 0,
};

export const users = (state = initialState, action) => {
  switch (action.type) {
    case NEW_MESSAGE_CHATLIST_CHANGE:
      return {
        ...state,
        refreshChatList: uuidv4(),
      };
    case CHAT_LIST_CHANGE:
      return {
        ...state,
        chatList: action.chatList,
      };

    default:
      return state;
  }
};
