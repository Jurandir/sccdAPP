import React, {useState, useEffect} from 'react';
import {  View,  TouchableOpacity, Modal, ScrollView,
          Text,  StyleSheet, Alert 
                   } from 'react-native';                  
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getData } from '../../utils/dataStorage';
import GetCartaFretePlacas from '../../interface/GetCartaFretePlacas';
import Tranbalhando from '../../Components/Trabalhando'


export default function SelectPlacas( { navigation } ) {
  const [trabalhando , setTrabalhando ] = useState(false)
  const [placas      , setPlacas]       = useState([])
  const [veiculos    , setVeiculos]     = useState([])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getPlacasSto()
      // console.log('Navigation FOCUS !!!')
    })
    return unsubscribe
  }, [navigation])

  const getPlacasSto = async () => {
    let listaPlacas = []
    let listaVeiculos = []
    let stoListaFotos = await getData('@ListaFotosPlacas')

    //console.log('stoListaFotos:',stoListaFotos)

    if(stoListaFotos===null || stoListaFotos.data===null || stoListaFotos===undefined || stoListaFotos.data===undefined){
      return 0
    }

    if(!stoListaFotos.data){
      stoListaFotos.data=[]
    }
    
    let listaFotos = stoListaFotos.data
    for await (let e of listaFotos) {
      let existe = listaPlacas.includes(e.dados.placas)
      if(!existe) {
          listaPlacas.push( e.dados.placas )
          listaVeiculos.push( `${e.dados.marca} - ${e.dados.placas}` )
      }
    }
    setPlacas(listaPlacas)
    setVeiculos(listaVeiculos)
  }

  const listaCartaFretePlacas = async (placas) => {
    let token
    let success
    let retorno = {}
    setTrabalhando(true)
    await getData('@Credencial').then( async (sto)=>{
        success = sto.success
        if (success) {
            token = sto.data.token
            await GetCartaFretePlacas(placas,token).then(async (ret)=>{
              success = ret.success  
              if (success) {
                retorno.data = await ret.data.map((i)=> { 
                    return {
                        empresa: i.EMPRESA, 
                        codigo: i.CODIGO ,
                        cartaFrete: i.CARTAFRETE, 
                        placas: i.PLACAS,
                        cidade: i.CIDADE,
                        motorista: i.MOTORISTA,
                        trecho: i.TRECHO,
                        data: i.DATA,
                    }
                  })
                  retorno.success = true
                  retorno.itens = retorno.data.length
                  setTrabalhando(false)
              } else {
                  retorno = {
                    success: false,
                    message: ret.message,
                    itens : 0

                  }  
                  setTrabalhando(false)
              }
            }).catch(err=>{ 
              retorno = {
                success: false,
                message: err
              }  
              setTrabalhando(false)
            })
        }
    })
    return retorno
  }

  const ListaCartas = async(index) => {
    let placa = placas[index]
    ret = await listaCartaFretePlacas(placa)
    if(!ret.success){
      Alert.alert(`Carta Frete - Placas: ${placa}\n${ret.message}`)
    } else {
      let veiculo = {
        index: index,
        placas: placa,
        cidade: ret.data[0].cidade,
        dados: ret.data
      }
      navigation.navigate('SelectCartaFrete',{veiculo})
    }

  }

  const Placas = () =>{
    return ( veiculos.map((veiculo,index)=>{ 
      return (   
        <TouchableOpacity
            key={index} 
            style={styles.btnSubmit}
            onPress={ ()=>{ ListaCartas(index) } }
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
        <ScrollView style={styles.scrollView}>
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

        </ScrollView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={trabalhando}
        >
          <Tranbalhando /> 
        </Modal>         

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
  scrollView:{
    width: '95%',
    marginBottom: 10,
    marginLeft: 25,
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
    marginTop: 50,
    marginBottom: 25,
    fontWeight: 'bold',
    fontSize: 20,
    width: '90%',
  }
});
