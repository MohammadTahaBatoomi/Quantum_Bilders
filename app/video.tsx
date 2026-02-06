import React from "react";
import { View } from "react-native";
import Video from "../components/ui/Video";
import { sharedStyles } from "../components/ui/theme";

const VideoPage = () => {
  return (
    <View style={sharedStyles.screen}>
      <Video />
    </View>
  );
};

export default VideoPage;
