import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/pages/Home';
import Sobre from './src/pages/Sobre';
import TelaMapa from './src/pages/TelaMapa';
import Login from './src/pages/Login';
import Seletor from './src/pages/Seletor';
import DadosPlacas from './src/pages/DadosPlacas';
import DadosFrete from './src/pages/DadosFrete';
import Imagens from './src/pages/Imagens';
import Device  from './src/pages/Device';
import Pictures from './src/pages/Pictures';
import PicturesPlacas from './src/pages/PicturesPlacas';
import SelectPlacas from './src/pages/SelectPlacas';

const Stack = createStackNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

      <Stack.Screen name="Home" component={Home} />

      <Stack.Screen name="Login" component={Login} 
          options={{
            headerShown: false,
            title: '',
            headerTransparent: true,
            headerTintColor: '#000',
          }}
        />        

        <Stack.Screen name="Sobre" component={Sobre} 
          options={{
            headerShown: false,
            title: 'Detalhes',
            headerTransparent: false,
            headerTintColor: '#000',
          }}        
        />

        <Stack.Screen name="TelaMapa" component={TelaMapa} 
          options={{
            headerShown: true,
            title: '',
            headerTransparent: true,
            headerTintColor: '#000',
          }}
        />

        <Stack.Screen name="Seletor" component={Seletor} 
          options={{
            headerShown: false,
            title: '',
            headerTransparent: true,
            headerTintColor: '#000',
          }}
        />

        <Stack.Screen name="SelectPlacas" component={SelectPlacas} 
          options={{
            headerShown: false,
            title: '',
            headerTransparent: true,
            headerTintColor: '#000',
          }}
        />

        <Stack.Screen name="DadosFrete" component={DadosFrete} 
          options={{
            headerShown: false,
            title: '',
            headerTransparent: true,
            headerTintColor: '#000',
          }}
        />

        <Stack.Screen name="DadosPlacas" component={DadosPlacas} 
          options={{
            headerShown: false,
            title: '',
            headerTransparent: true,
            headerTintColor: '#000',
          }}
        />

        <Stack.Screen name="Imagens" component={Imagens} 
          options={{
            headerShown: false,
            title: '',
            headerTransparent: true,
            headerTintColor: '#000',
          }}
        />

        <Stack.Screen name="Picture" component={Pictures} 
          options={{
            headerShown: false,
            title: '',
            headerTransparent: true,
            headerTintColor: '#000',
          }}
        />

        <Stack.Screen name="PicturePlacas" component={PicturesPlacas} 
          options={{
            headerShown: false,
            title: '',
            headerTransparent: true,
            headerTintColor: '#000',
          }}
        />

        <Stack.Screen name="Device" component={Device} 
          options={{
            headerShown: false,
            title: '',
            headerTransparent: true,
            headerTintColor: '#000',
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
