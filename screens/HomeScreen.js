import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          setUserId(userId);
          console.log("User ID:", userId); // Debug log
        }
      } catch (error) {
        console.error("Error decoding token or fetching user ID:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchPosts();
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchPosts();
      }
    }, [userId])
  );

  const fetchPosts = async () => {
    try {
      console.log("Fetching posts..."); // Debug log
      const response = await axios.get("http://192.168.43.210:3000/get-posts");
      setPosts(response.data);
      console.log("Fetched posts:", response.data); // Debug log
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://192.168.43.210:3000/posts/${postId}/${userId}/like`
      );
      const updatedPost = response.data;

      const updatedPosts = posts?.map((post) =>
        post?._id === updatedPost._id ? updatedPost : post
      );

      setPosts(updatedPosts);
    } catch (error) {
      console.log("Error liking the post", error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await axios.put(
        `http://192.168.43.210:3000/posts/${postId}/${userId}/unlike`
      );
      const updatedPost = response.data;

      const updatedPosts = posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );

      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  return (
    <ScrollView style={{ marginTop: 50, flex: 1, backgroundColor: "white" }}>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Image
          style={{ width: 60, height: 40, resizeMode: "contain" }}
          source={{
            uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
          }}
        />
      </View>

      <View style={{ marginTop: 20, marginRight: 40 }}>
        {posts?.length > 0 ? (
          posts.map((post) => (
            <View
              key={post._id}
              style={{
                padding: 15,
                borderColor: "#D0D0D0",
                borderTopWidth: 1,
                flexDirection: "row",
                gap: 10,
                marginVertical: 10,
              }}
            >
              <View>
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
              </View>

              <View>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", marginBottom: 4 }}
                >
                  {post?.user?.name}
                </Text>
                <Text>{post?.content}</Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 15,
                  }}
                >
                  {post?.likes?.includes(userId) ? (
                    <AntDesign
                      onPress={() => handleDislike(post?._id)}
                      name="heart"
                      size={18}
                      color="red"
                    />
                  ) : (
                    <AntDesign
                      onPress={() => handleLike(post?._id)}
                      name="hearto"
                      size={18}
                      color="black"
                    />
                  )}

                  <FontAwesome name="comment-o" size={18} color="black" />
                  <Ionicons
                    name="share-social-outline"
                    size={18}
                    color="black"
                  />
                </View>

                <Text style={{ marginTop: 7, color: "gray" }}>
                  {post?.likes?.length} likes • {post?.replies?.length} reply
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No posts available
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
