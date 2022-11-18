import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { colors } from "../config/colors.js";
import { SPACING } from "../config/spacing.js";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import Post from "../components/Post.jsx";

export default function PostScreen() {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const [posts, setPosts] = useState([]);

  // Variable para saber si estoy en el homescreen

  const isFocused = useIsFocused();

  // Estados para el Refresh Control

  const [isRefresing, setIsRefreshing] = useState(false);

  // Obtener Posts
  const getPosts = async () => {
    try {
      const { data } = await axios.get("/post");
      console.log(data.data);
      setPosts(data.data);
    } catch (error) {
      console.log("Error en getPost", error);
    }
  };

  // Inicializar Función de GetPosts
  useEffect(() => {
   isFocused && getPosts();
  }, [isFocused]);

  // Función de Refrescar
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await getPosts();
    setIsRefreshing(false);
  }, []);

  return (
    <>
      <View style={{ ...styles.container, top: top }}>
        <Text style={styles.title}>Quizz</Text>
        <Text style={styles.subtitle}>Post</Text>
        <TouchableOpacity
          style={{ ...styles.button, top }}
          onPress={() => navigation.navigate("PostActionScreen")}
        >
          <LinearGradient
            style={styles.gradient}
            colors={[colors["dark-gray"], colors.dark]}
          >
            <Ionicons
              name="add-circle-outline"
              color={colors.light}
              size={30}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Listar Todos Los Posts */}
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefresing}
            onRefresh={onRefresh}
            colors={[colors.light]}
            progressBackgroundColor={colors["dark-gray"]}
          />
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },
  title: {
    color: colors.white,
    fontSize: SPACING * 5,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.light,
    marginTop: SPACING / 2,
  },
  button: {
    overflow: "hidden",
    borderRadius: 5,
    position: "absolute",
    right: 0,
  },
  gradient: {
    paddingHorizontal: SPACING,
    paddingVertical: SPACING / 3,
  },
});
