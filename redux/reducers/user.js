import {
  USER_DETAIL_CHANGE,
  NEW_MSG_CHANGE,
  CAMERA_DATA_CHANGE,
  REFRESH_CHECK_AUTH,
} from "../constants";

const initialState = {
  userDetail: null,
  newMsg: null,
  cameraData: null,
  refreshAuth: null,
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case NEW_MSG_CHANGE:
      return {
        ...state,
        newMsg: action.newMsg,
      };

    case USER_DETAIL_CHANGE:
      return {
        ...state,
        userDetail: action.userDetail,
      };
    case CAMERA_DATA_CHANGE:
      return {
        ...state,
        cameraData: action.cameraData,
      };
    case REFRESH_CHECK_AUTH:
      return {
        ...state,
        refreshAuth: action.refreshAuth,
      };
    default:
      return state;
  }
};
