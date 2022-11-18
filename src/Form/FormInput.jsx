import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { colors } from "../config/colors.js";

export default function FormInput(props) {
  const { label, placeholder, error } = props;
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.textLabel}>{label}</Text>
        {error && <Text style={styles.textError}>{error}</Text>}
      </View>

      <TextInput {...props} style={styles.input} placeholder={placeholder}/>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  textLabel: {
    fontWeight: "bold",
    color: colors.light,
  },
  textError: {
    fontSize: 12,
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.light,
    height: 35,

    borderRadius: 8,
    fontSize: 16,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: colors.light,
  },
});
