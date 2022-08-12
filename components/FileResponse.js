import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { VideoObj } from "./ChatMessages";

const FileResponse = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (props.data) setData(props.data);
  }, [props?.data]);
  return (
    <View>
      {data.map((file, index) => (
        <Item item={file} index={index} key={index} />
      ))}
    </View>
  );
};

const Item = ({ item, index }) => {
  if (!item) return <Text></Text>;
  // item.size,
  //add mimeType
  if (item.type.includes("image")) {
    return (
      <>
        {item.name && item.name}

        {item.uri ? (
          <>
            <Image
              source={{
                uri: item.uri,
              }}
              style={styles.image}
              resizeMode={"contain"}
            />
          </>
        ) : (
          ""
        )}
      </>
    );
  }
  if (item.type.includes("video")) {
    return (
      <>
        <Text key={index.toString()} numberOfLines={1} ellipsizeMode={"middle"}>
          {item.name && item.name}
        </Text>
        {item.uri ? (
          <>
            <VideoObj source={item.uri} />
          </>
        ) : (
          ""
        )}
      </>
    );
  }
  return (
    <Text key={index.toString()} numberOfLines={1} ellipsizeMode={"middle"}>
      {item.name && item.name} File
    </Text>
  );
};

export default FileResponse;

const styles = StyleSheet.create({
  image: {
    height: 250,
    width: 250,
    marginBottom: 3,
  },
});
