import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserType } from "../UserContext";
import axios from "axios";

const ThreadsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [content, setContent] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://192.168.43.210:3000/profile/${userId}`
        );
        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchProfile();
  });

  const handlePostSubmit = () => {
    // Validate content
    if (content.trim() === "") {
      Alert.alert("Write something here...");
      return; // Early return if content is empty
    }

    const postData = {
      userId,
      content, // Include content in postData if it's not empty
    };

    axios
      .post("http://192.168.43.210:3000/create-post", postData)
      .then((response) => {
        // Optionally handle the response here if needed
        setContent(""); // Clear content after successful post
      })
      .catch((error) => {
        // Provide user feedback for the error
        Alert.alert("Error", "Failed to create post. Please try again.");
        console.log("Error creating Post: ", error);
      });
  };

  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 10,
        }}
      >
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />
        <Text>{user?.name}</Text>
      </View>

      <View style={{ flexDirection: "row", marginLeft: 10 }}>
        <TextInput
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholder="Type your message here..."
          placeholderTextColor={"black"}
          multiline
        />
      </View>
      <View style={{ marginTop: 20 }} />
      <Button onPress={handlePostSubmit} title="Share Post" />
    </SafeAreaView>
  );
};

export default ThreadsScreen;

const styles = StyleSheet.create({});
