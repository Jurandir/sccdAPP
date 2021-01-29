import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView, FlatList,
  Dimensions , Image, ImageBackground } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const deviceWidth = Dimensions.get('window').width

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const renderItem = ({ item }) => (
  <Item title={item.title} />
);

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <Image
        style={styles.tinyLogo}
        source= {{
            isStatic: true,
            uri: "file:///storage/emulated/0/DCIM/67a84fc7-cded-4c3d-bebb-6897ff589757.jpg"
          }}
      />
  </View>
);

function ImagemAnteriorScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Imagem Anterior!</Text>
    </View>
  );
}

function ImagemPosteriorScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Imagem Posterior!</Text>
    </View>
  );
}

function FotografarScreen() {

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal={true}
      />
    </SafeAreaView>
  );

}

function ExcluirImagemScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Excluir Imagem!</Text>
    </View>
  );
}

function ConfirmarScreen() {
  let navigation = nav
  alert('Dados Confirmados !!!')
  navigation.navigate('DadosFrete')
  return (
    <View style={styles.container}>
      <Text>Confirmar!</Text>
    </View>
  );
}


const Tab = createBottomTabNavigator();
var nav;

export default function Imagens({ route, navigation }) {
  nav = navigation

  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Imagens') { iconName = focused ? 'picture' : 'picture' } 
            else 
            if (route.name === 'Anterior')   { iconName = focused ? 'leftcircle' : 'leftcircleo' }
            else 
            if (route.name === 'Proximo')    { iconName = focused ? 'rightcircle' : 'rightcircleo' }
            else 
            if (route.name === 'Excluir')    { iconName = focused ? 'closecircle' : 'closecircleo' }
            else 
            if (route.name === 'Confirmar')  { iconName = focused ? 'checkcircle' : 'checkcircleo' }


            // You can return any component that you like here!
            return <AntDesign name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#35AAFF',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Imagens" component={FotografarScreen} />
        <Tab.Screen name="Anterior"   component={ImagemAnteriorScreen} />
        <Tab.Screen name="Proximo"    component={ImagemPosteriorScreen} />
        <Tab.Screen name="Excluir"    component={ExcluirImagemScreen} />
        <Tab.Screen name="Confirmar"  component={ConfirmarScreen} />
      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight || 0,   
  },
  input:{
    backgroundColor: '#FFF',
    width: '90%',
    marginBottom:15,
    color:'#222',
    fontSize: 17,
    borderRadius: 7,
    padding: 10,
  },
  fotoDevice:{
    flex: 1,
  },  
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    borderRadius: 7,
    marginVertical: 8,
    marginHorizontal: 8,
    width: deviceWidth-15,
  },
  title: {
    fontSize: 22,
  },
  tinyLogo:{
    width: '100%',
    height: 400,
  }

});
