import React, {useState, useEffect} from 'react';
import {  View,  TouchableOpacity,
          Text,  StyleSheet, Alert 
                   } from 'react-native';                  
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getData } from '../../utils/dataStorage';


export default function SelectPlacas( { navigation } ) {
  const [placas   , setPlacas]   = useState([])
  const [veiculos , setVeiculos] = useState([])

  useEffect(() => {
    
    getPlacasSto()

  }, []);

  const getPlacasSto = async () => {
    let listaPlacas = []
    let listaVeiculos = []
    let stoListaFotos = await getData('@ListaFotosPlacas')
    let listaFotos = stoListaFotos.data
    for await (let e of listaFotos) {
      console.log(e)
      listaPlacas.push( e.dados.placas )
      listaVeiculos.push( `${e.dados.marca} - ${e.dados.placas}` )
    }
    setPlacas(listaPlacas)
    setVeiculos(listaVeiculos)
  }

  const ListaCartas = (placa) => {
    Alert.alert(` Placa Selecionada ${placa}`)
  }

  const Placas = () =>{
    return ( veiculos.map((veiculo,index)=>{ 
      console.log(index,veiculo)
      return (   
        <TouchableOpacity
            key={index} 
            style={styles.btnSubmit}
            onPress={ ()=>{ ListaCartas(placa) } }
        >
          <Text style={styles.submitText}> 
             {veiculo}
          </Text>
        </TouchableOpacity>
    )
    }))
  }

  return (
    <View style={styles.background}>

       <Text style={styles.LabelTitulo}>Selecione o Veículo:</Text>

        <Placas />

        <TouchableOpacity 
            style={styles.btnSubmit}
            onPress={ () => { navigation.goBack() } }
        >
          <MaterialCommunityIcons name="exit-run" size={35} color="#FFF" />
          <Text style={styles.submitText}> 
              Sair
          </Text>
        </TouchableOpacity>        

    </View>
  );
}

const styles = StyleSheet.create({
  background:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#191919',
  },
  container:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    paddingBottom: 20,
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
  btnSubmit:{
    flexDirection: 'row',
    backgroundColor: '#35AAFF',
    width: '90%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 7,
    margin: 3,
  },
  submitText:{
    color: '#FFF',
    fontSize: 18,
    marginLeft: 10,
  },
  LabelTitulo:{
    color: '#FFF',
    textAlign: "center",
    marginBottom: 25,
    fontWeight: 'bold',
    fontSize: 20
  }
});
