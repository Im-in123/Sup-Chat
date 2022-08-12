import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const DeleteMessageModal = ({
  setModalVisible,
  delMsgId,
  handleMessageDelete,
}) => {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalInnerContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: "black",
              alignItems: "center",
              padding: 13,
              borderRadius: 30,
              width: 150,
              position: "relative",
            }}
            onPress={() => {
              handleMessageDelete(delMsgId);
            }}
          >
            <Text style={{ color: "white", fontSize: 15 }}>Delete message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
            style={{
              marginTop: 20,
              backgroundColor: "black",
              alignItems: "center",
              padding: 13,
              borderRadius: 30,
              width: 150,
              position: "relative",
            }}
          >
            <AntDesign name="close" size={18} color="white" style={{}} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DeleteMessageModal;

const styles = StyleSheet.create({
  modalInnerContainer: {
    // backgroundColor: "white",
    padding: 16,
    height: 500,
    borderWidth: 1,
    // opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
});
