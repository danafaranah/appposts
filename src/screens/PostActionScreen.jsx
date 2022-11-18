import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { colors } from "../config/colors.js";
import { SPACING } from "../config/spacing.js";
import * as Yup from "yup";
import { Formik } from "formik";
import FormContainer from "../Form/FormContainer.jsx";
import FormInput from "../Form/FormInput.jsx";
import * as ImagePicker from "expo-image-picker";
import FormSubmitButton from "../Form/FormSubmitButton.jsx";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

// Esquema de validación de campos
const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, "Título inválido")
    .required("El título es obligatorio"),

  description: Yup.string()
    .trim()
    .min(3, "Descripción inválida")
    .required("La descripción es obligatoria"),
});

export default function PostActionScreen({ route }) {
  const post = route.params;
  const navigation = useNavigation();
  const [image, setImage] = useState(post?.imgUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  // Información del Post
  const postInfo = {
    title: post?.title || "",
    description: post?.description || "",
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Función de guardar el post
  const savePost = async (formData) => {
    try {
      setIsLoading(true)
      await axios.post("/post", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log("Error en savePost", error.message);
    }
  };

  // Función de Actualizar Post

  const updatePost = async (formData) => {
    try {
      setIsLoading(true)
      await axios.put(`/post/${post._id}`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log("Error en savePost", error.message);
    }
  };

  // Función para saber si el post se actualizará o se creará
  const actions = async (values, formikActions) => {
    const { title, description } = values;
    const formData = new FormData();

    if (post) {
      if (post.imgUrl !== image) {
        formData.append("img", {
          name: image.uri.split("/").sortedArray.at(-1),
          uri: image,
          type: "image/jpg",
        });
      }
    } else {
      if (image) {
        formData.append("img", {
          name: image.uri.split("/").sortedArray.at(-1),
          uri: image,
          type: "image/jpg",
        });
      }
    }

    formData.append("title", title);
    formData.append("description", description);
    post ? await updatePost(formData) : await savePost(formData);
    formikActions.resetForm();
    formikActions.setSubmitting(false);
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="red" size={80} />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <FormContainer>
          <Formik
            initialValues={postInfo}
            validationSchema={validationSchema}
            onSubmit={actions}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => {
              const { title, description } = values;
              return (
                <>
                  {/* Input Título */}
                  <FormInput
                    value={title}
                    error={touched.title && errors.title}
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("titulo")}
                    label="Título"
                    placeholder="Título"
                  />
                  {/* Input Descripcióm */}
                  <FormInput
                    value={description}
                    error={touched.description && errors.description}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("descripcion")}
                    label="Descripción"
                    placeholder="Descripción"
                  />

                  {/* Imagen */}

                  <View>
                    <TouchableOpacity
                      style={styles.uploadBtnContainer}
                      onPress={() => pickImage()}
                    >
                      {image ? (
                        <Image
                          source={{ uri: image }}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        <Text style={styles.uploadBtn}>Seleccioner Imagen</Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <FormSubmitButton
                    submitting={isSubmitting}
                    onPress={handleSubmit}
                    title={post ? "Actualizar" : "Guardar"}
                  />
                </>
              );
            }}
          </Formik>
        </FormContainer>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
  },

  uploadBtnContainer: {
    height: 125,
    width: 125,
    borderRadius: 60,
    borderColor: colors.light,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    overflow: "hidden",
    marginVertical: 10,
    // marginLeft: 100,
  },
  uploadBtn: {
    textAlign: "center",
    fontSize: 16,
    opacity: 0.3,
    fontWeight: "bold",
    color: colors.light,
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 5,
  },
});
