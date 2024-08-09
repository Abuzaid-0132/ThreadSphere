import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import User from "../components/User";

const ActivityScreen = () => {
  const [selectedButton, setSelectedButton] = useState("people");
  const [content, setContent] = useState("People Content");
  const [users, setUsers] = useState([]);
  const { userId, setUserId } = useContext(UserType);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem("authToken");

        // Check if the token exists
        if (!token) {
          console.log("No token found");
          return;
        }

        // Decode the token to extract the user ID
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        // Set the userId in the state
        setUserId(userId);

        // Fetch the user data from the server
        const response = await axios.get(
          `http://192.168.43.210:3000/user/${userId}`
        );

        // Update the users state with the fetched data
        setUsers(response.data);
      } catch (error) {
        // Log errors for debugging
        console.error("Error fetching users:", error);
      }
    };

    // Call the fetchUsers function
    fetchUsers();
  }, []);

  console.log("Users", users);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            ActivityScreen
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => handleButtonClick("people")}
              style={[
                {
                  flex: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: "white",
                  borderColor: "#D0D0D0",
                  borderRadius: 6,
                  borderWidth: 0.7,
                },
                selectedButton === "people"
                  ? { backgroundColor: "black" }
                  : null,
              ]}
            >
              <Text
                style={[
                  { textAlign: "center", fontWeight: "bold" },
                  selectedButton === "people"
                    ? { color: "white" }
                    : { color: "black" },
                ]}
              >
                People
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleButtonClick("all")}
              style={[
                {
                  flex: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: "white",
                  borderColor: "#D0D0D0",
                  borderRadius: 6,
                  borderWidth: 0.7,
                },
                selectedButton === "all" ? { backgroundColor: "black" } : null,
              ]}
            >
              <Text
                style={[
                  { textAlign: "center", fontWeight: "bold" },
                  selectedButton === "all"
                    ? { color: "white" }
                    : { color: "black" },
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleButtonClick("requests")}
              style={[
                {
                  flex: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: "white",
                  borderColor: "#D0D0D0",
                  borderRadius: 6,
                  borderWidth: 0.7,
                },
                selectedButton === "requests"
                  ? { backgroundColor: "black" }
                  : null,
              ]}
            >
              <Text
                style={[
                  { textAlign: "center", fontWeight: "bold" },
                  selectedButton === "requests"
                    ? { color: "white" }
                    : { color: "black" },
                ]}
              >
                Requests
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            {selectedButton === "people" && (
              <View style={{ marginTop: 20 }}>
                {users.map((item, index) => (
                  <User key={index} item={item} />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({});
