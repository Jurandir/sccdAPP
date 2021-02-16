import React, {useState, useEffect} from 'react';
import {  View,  TouchableOpacity,
          Text,  StyleSheet, 
                   } from 'react-native';                  
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function SelectPlacas( { navigation } ) {
  const [placa,setPlacas] = useState(['XXX-9999','YYY-8888','TTT-4444'])

  useEffect(() => {
  }, []);

  const Placas = () =>{
    return (
        <TouchableOpacity 
            style={styles.btnSubmit}
            onPress={ ()=>{} }
        >
          <Text style={styles.submitText}> 
             XXX-9999  
          </Text>
        </TouchableOpacity>
    )
  }

  return (
    <View style={styles.background}>

       <Text style={styles.LabelTitulo}>Selecione a Placa:</Text>

        <Placas />

        <TouchableOpacity 
            style={styles.btnSubmit}
            onPress={ () => {} }
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
