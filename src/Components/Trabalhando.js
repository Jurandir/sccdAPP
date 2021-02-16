import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Trabalhando = () => (
  <View style={[styles.container]}>
    <ActivityIndicator color={'#FFF'} size="large" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});

export default Trabalhando;