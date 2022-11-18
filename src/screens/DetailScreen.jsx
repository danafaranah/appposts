import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../config/colors.js";
import { SPACING } from "../config/spacing.js";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useIsFocused, useNavigation} from "@react-navigation/native";

const screenHeight = Dimensions.get("screen").height;

export default function DetailScreen({ route }) {
  // Capturar id del post
  const id = route.params;
  const isFocused = useIsFocused();

  // Navegación

  const navigation = useNavigation()

  
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [post, setPost] = useState({});

  // Obtener Posts
  const getPosts = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/post/${id}`);
      setPost(data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Error en get post", error.message);
    }
  };

  useEffect(() => {
    isFocused && getPosts();
  }, [isFocused]);


  const deletePost=async()=>{
    try {
      setIsRemoving(true)
      const {data} = await axios.delete(`/post/${post._id}`)
      setIsRemoving(false)
      navigation.navigate("HomeScreen")
    } catch (error) {
      setIsRemoving(false)
      console.log("Error en deletePost", error.message)
    }
  }

  // Spinner de Carga

  if (isLoading || isRemoving) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="red" size={80} />
      </View>
    );
  }

  return (
    <ScrollView>
      {/* Imágen */}
      <View style={styles.imageContainer}>
        <View style={styles.imageBorder}>
          <Image source={{ uri: post.imgUrl }} style={styles.image} />
        </View>
      </View>

      {/* Título y Descripción */}
      <View style={{ marginTop: 20 }}>
        {/* Título */}
        <Text style={styles.title}>{post.title}</Text>
        {/* Descripcion */}
        <Text style={styles.subtitle}>{post.description}</Text>
      </View>

      {/* Botónes */}

      <View style={styles.buttonsContainer}>

        {/* Botón para Actualizar Post */}
        <TouchableOpacity style={styles.buttonRadius} onPress={()=>navigation.navigate("PostActionScreen",post)}>
          <LinearGradient
            key={post._id}
            style={styles.gradient}
            colors={[colors["dark-gray"], colors.dark]}
          >
            <Ionicons
              name="create-outline"
              color={colors.light}
              size={30}
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* Botón para Eliminar Post */}
        <TouchableOpacity 
        style={styles.buttonRadius}
        onPress={()=>deletePost()}
        >
          <LinearGradient
            key={post._id}
            style={styles.gradient}
            colors={[colors["dark-gray"], colors.dark]}
          >
            <Ionicons
              name="trash-outline"
              color={colors.light}
              size={30}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Botón Para Regresar*/}
      <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>       
            <Ionicons
              name="arrow-back-outline"
              color="white"
              size={SPACING * 6}
            />
         
        </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: screenHeight * 0.7,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
  },
  imageBorder: {
    flex: 1,
    overflow: "hidden",
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
  },
  image: {
    flex: 1,
  },
  title: {
    color: colors.light,
    fontSize: SPACING * 2,
    fontWeight: "bold",
  },
  subtitle: {
    color: colors.light,
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 5,
  },
  buttonsContainer: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignposts: "center",
  },
  buttonRadius: {
    overflow: "hidden",
    borderRadius: SPACING / 2,
  },

  gradient: {
    paddingHorizontal: SPACING,
    paddingVertical: SPACING / 3,
  },
});
