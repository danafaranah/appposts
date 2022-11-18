import { NavigationContainer } from "@react-navigation/native";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { Navigation } from "./src/navigation/Navigation";

// URL IP para conectar con el BackEnd
axios.defaults.baseURL="http://192.168.1.185:4000"

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light"/>
      <Navigation />
    </NavigationContainer>
  );
}
