import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

const Loading = () => {
  return (
    <ActivityIndicator
      animating={true}
      hidesWhenStopped={true}
      size="large"
      color="#F87114"
    />
  );
};

export default Loading;
