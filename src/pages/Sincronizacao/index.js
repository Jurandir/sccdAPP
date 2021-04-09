import React, {useState, useEffect} from 'react';
import {  View,  TouchableOpacity, Modal,
          Text,  StyleSheet, Alert 
                   } from 'react-native';                  
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Device from 'expo-device';

import { getData, setData } from '../../utils/dataStorage';
import Trabalhando from '../../Components/Trabalhando';
import sendDadosAPP_SCCD from "../../interface/sendDadosAPP_SCCD";
import verifyImgSCCD_InServer from "../../interface/verifyImgSCCD_InServer";

export default function Sincronizacao( props ) {
  const { navigation } = props 
  let params = props.route.params 

  const [trabalhando , setTrabalhando ] = useState(false)

  useEffect(() => {

  }, [])

  const testaArquivos = () => {

    console.log( Device.osBuildId )
    
  }

  const confirmaSincronizacao = () => {
    Alert.alert('Confirmação:', 'Sincronizar os dados internos com o SERVIDOR?',
    [{
      text: 'SIM',
      onPress: () => {execConfirmaSincronizacao()},
      style: 'default'
    },{
      text: 'NÃO',
      onPress: () => {},
      style: 'default'
    }],
    { cancelable: false })
  }

  const execConfirmaSincronizacao = async () => {
    setTrabalhando(true)

    console.log('==== AJUSTA DADOS INTERNOS ====', new Date() )

    let par_List = []
    let stoListaFotos  = await getData('@ListaFotos')
    let listaFotos     = stoListaFotos.data
    let idx            = 0
    for await (let item of listaFotos) {
      par_List.push({
          id: item.imagem.id,
          file: item.imagem.filename,
          idx: idx
      })
      idx++
    }
    await verifyImgSCCD_InServer(par_List).then( async (ret)=>{
      for await (let item of ret) {
        idx = item.idx
        if(item.found){
          listaFotos[idx].send.date = new Date()
          listaFotos[idx].send.message   = 'OK. Está no servidor.'
          listaFotos[idx].send.success   = true
        } else {
          listaFotos[idx].send.date = null
          listaFotos[idx].send.message   = 'Não encontrado no servidor.'
          listaFotos[idx].send.success   = false
        }
        console.log('Found:',idx,item.found)
      }
    })

    setData('@ListaFotos',listaFotos).then(ret=>{
      setTrabalhando(false)
    }).catch(err=>{
      console.log('(confirmaSincronizacao) Erro:',err)
      setTrabalhando(false)
    })

  }

  const enviaDEBUG = () => {
    Alert.alert('Confirmação:', 'Envia dados de DUMP/mémoria para o SERVIDOR?',
    [{
      text: 'SIM',
      onPress: () => {ExecEnviaDEBUG()},
      style: 'default'
    },{
      text: 'NÃO',
      onPress: () => {},
      style: 'default'
    }],
    { cancelable: false })
  }

  const ExecEnviaDEBUG = async () => {

    setTrabalhando(true)

    console.log('==== SEND DEBUG PARA O SERVIDOR ====', new Date() )

    await sendDadosAPP_SCCD().then(ret=>{
      setTrabalhando(false)
      
      let msg = ret.success ? 'Enviado com sucesso !!!' : ret.message

      Alert.alert(msg)

    })

    setTrabalhando(false)

  }


  return (
    <View style={styles.background}>

        <Text style={styles.LabelTitulo}>Sincronização:</Text>

        <TouchableOpacity 
            style={styles.btnSubmit}
            onPress={ enviaDEBUG }
        >
          <MaterialCommunityIcons name="server-network" size={35} color="#FFF" />
          <Text style={styles.submitText}> 
              Envia DEBUG para o servidor
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={styles.btnSubmit}
            onPress={ confirmaSincronizacao }
        >
          <MaterialCommunityIcons name="server-network" size={35} color="#FFF" />
          <Text style={styles.submitText}> 
              Ajusta dados internos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={styles.btnSubmit}
            onPress={ testaArquivos }
        >
          <MaterialCommunityIcons name="server-network" size={35} color="#FFF" />
          <Text style={styles.submitText}> 
              Testa Arquivos
          </Text>
        </TouchableOpacity>        

        <TouchableOpacity 
            style={styles.btnSubmit}
            onPress={ () => { navigation.goBack() } }
        >
          <MaterialCommunityIcons name="exit-run" size={35} color="#FFF" />
          <Text style={styles.submitText}> 
              Sair
          </Text>
        </TouchableOpacity>



        <Modal
          animationType="fade"
          transparent={true}
          visible={trabalhando}
        >
          <Trabalhando /> 
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
  btnConfirma:{
    flexDirection: 'row',
    backgroundColor: '#5cb85c',
    width: '90%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 7,
    marginTop: 20,
  },
  submitText:{
    color: '#FFF',
    fontSize: 18,
    marginLeft: 10,
  },
  ConfirmaText:{
    color: '#FFF',
    fontSize: 25,
    marginLeft: 10,
    padding:1
  },
  LabelTitulo:{
    color: '#FFF',
    textAlign: "center",
    marginBottom: 25,
    fontWeight: 'bold',
    fontSize: 20
  },
  radiosGroup:{
    alignItems: 'baseline',
    justifyContent: 'space-between',
    margin: 1,
  },
  radios:{
    flexDirection: "row",
    alignItems: 'baseline',
    justifyContent: 'space-between',
    margin: 1,
  },
  texto:{
      color:'#fff',
      fontSize: 17,
      marginRight: 0,
  },
  Label_Placas:{
    color: '#FFF',
    textAlign: "center",
    marginTop: 0,
    marginBottom: 0,
    fontSize: 16
  },
  LabelCidade:{
    color: '#FFF',
    textAlign: "center",
    marginTop: 0,
    marginBottom: 10,
    fontSize: 10
  },
  LabelPlacas:{
    color: '#FFF',
    textAlign: "center",
    marginTop: 0,
    marginBottom: 0,
    fontSize: 30
  },
  CardPlacas:{
    backgroundColor: '#35AAFF',
    width: '90%',
    height: 90,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 7,
    marginBottom: 25,
  },      
});
