import Axios from "axios";
import { logout, tokenName } from "./authController";
import { ME_URL, REFRESH_URL } from "../urls";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const axiosHandler = ({
  method = "",
  url = "",
  token = null,
  data = {},
  extra = null,
}) => {
  let methodType = method.toUpperCase();
  if (
    ["GET", "POST", "PATCH", "PUT", "DELETE"].includes(methodType) ||
    {}.toString(data) !== "[object Object]"
  ) {
    let axiosProps = { method: methodType, url, data };

    if (token) {
      axiosProps.headers = { Authorization: `Bearer ${token}` };
    }
    if (extra) {
      axiosProps.headers = { ...axiosProps.headers, ...extra };
    }
    return Axios(axiosProps);
  } else {
    alert(`method ${methodType} is not accepted or data is not an object`);
    console.log(
      `method ${methodType} is not accepted or data is not an object`
    );
  }
};

export const errorHandler = (err, defaulted = false) => {
  if (defaulted) {
    console.log("Ops!, an error occurred.");
    return "Ops!, an error occurred.";
  }

  let messageString = "";
  if (!err.response) {
    messageString += "Network error! check your network and try again";
  } else {
    let data = err.response.data.results;
    if (!err.response.data.results) {
      data = err.response.data;
    }
    messageString = loopObj(data);
  }
  return messageString.replace(/{|}|'|\[|\]/g, "");
};

const loopObj = (obj) => {
  let agg = "";
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      agg += `<div>${key}: ${
        typeof obj[key] === "object" ? loopObj(obj[key]) : obj[key]
      }</div>`;
    }
  }
  return agg;
};

let tempNavigation = null;
export const custom_temp_navigation = (n) => {
  tempNavigation = n;
};
export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
export const getToken = async () => {
  let token = await AsyncStorage.getItem(tokenName);
  if (!token) {
    logout(tempNavigation);
    return;
  }
  token = JSON.parse(token);
  if (!token) {
    logout(tempNavigation);
    return;
  }
  if (!token.access) {
    logout(tempNavigation);
    return;
  }
  const userProfile = await axiosHandler({
    method: "get",
    url: ME_URL,
    token: token.access,
  }).catch((e) => {
    console.log(e);
  });

  if (userProfile) {
    return token.access;
  } else {
    const getNewAccess = await axiosHandler({
      method: "post",
      url: REFRESH_URL,
      data: {
        refresh: token.refresh,
      },
    }).catch((e) => {
      console.log(e);
      if (e.response) {
        console.log("e help response.data:::", e.response.data);

        if (
          e.response.data.error === "Token is invalid or has expired" ||
          e.response.data.error === "refresh token not found"
        ) {
          logout(tempNavigation);
        }
      } else if (e.request) {
        console.log("e help request:::", e.request);
        alert("Slow Network connection");
      }
    });
    if (getNewAccess) {
      await AsyncStorage.setItem(tokenName, JSON.stringify(getNewAccess.data));
      return getNewAccess.data.access;
    }
  }
};
