import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function Home( { navigation }) {
  return (
    <View style={styles.container}>

      <AntDesign name="caretright" size={24} color="black" />
      <AntDesign name="caretleft" size={24} color="black" />
      <AntDesign name="check" size={24} color="black" />
      <AntDesign name="close" size={24} color="black" />
      <AntDesign name="bars" size={24} color="black" />
      <AntDesign name="picture" size={24} color="black" />
      <AntDesign name="camerao" size={24} color="black" />

      <Text>Home</Text>
      <Button 
        title="Sobre" 
        onPress={ () => navigation.navigate('Sobre')}
      />
      <Button 
        title="Mapa" 
        onPress={ () => navigation.navigate('TelaMapa')}
      />
      <Button 
        title="Login" 
        onPress={ () => navigation.navigate('Login')}
      />
      <Button 
        title="Carta Frete" 
        onPress={ () => navigation.navigate('Seletor')}
      />
      <Button 
        title="Dados do Frete" 
        onPress={ () => navigation.navigate('DadosFrete')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
