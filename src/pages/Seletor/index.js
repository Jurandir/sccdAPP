import React, {useState, useEffect} from 'react';
import {  View,  TextInput, 
          TouchableOpacity,
          Text,  StyleSheet, 
          Alert, BackHandler,
          Image, Modal
                   } from 'react-native';
                   
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';                  
import GetCartaFrete from '../../interface/GetCartaFrete';
import GetPlacasVeiculo from '../../interface/GetPlacasVeiculo';
import { delData, getData, setData } from '../../utils/dataStorage';
import Constants from 'expo-constants';

import RadioSeletor from '../../Components/RadioOpcaoSeletor'
import Trabalhando from '../../Components/Trabalhando'

// CARTAFRETE
export default function Seletor( { navigation } ) {
  const [cartaFrete  , setCartafrete]   = useState(''); 
  const [placas      , setPlacas]       = useState(''); 
  const [sel         , setSel]          = useState(''); 
  const [trabalhando , setTrabalhando ] = useState(false);

  let valorSeletor = 'CartaFrete'
  let nameDevice   = Constants.deviceName+' ('+Constants.sessionId+')'

  const OpcaoSeletor = (valor) => {
    valorSeletor = valor
    // console.log('OpcaoSeletor =',valorSeletor)
    setSel(valorSeletor)
  }

  useEffect(() => {
    (async () => {
      
      setSel(valorSeletor)
      setTrabalhando(false)

      let stoCartaFrete = await getData('@CartaFrete')
      if(!stoCartaFrete.data) {
        setCartafrete('')
      } else {
        setCartafrete(stoCartaFrete.data.cartaFrete)
      }

      let stoPlacas = await getData('@Placas')
      if(stoPlacas.data.placas) {
        setPlacas(stoPlacas.data.placas)
      }

    })();
  }, []);

  // MOSTRA OPÇÕES PARA ZERAR DADOS ()
  const zeraDados = async () => {
    
    let dadosPlacas = await getData('@ListaFotosPlacas')
    if(!dadosPlacas.data){
      dadosPlacas.data=[]
     }
    let totalPlacas = dadosPlacas.data.length || 0     

    // console.log('Dados Placas:',totalPlacas,dadosPlacas)

    getData('@ListaFotos').then( async (dados)=>{

      if(!dados.data){
        dados.data=[]
      }
      
      let qtde_fotos    = (dados.data.length || 0 ) + totalPlacas
      let qtde_enviados  = 0
      let qtde_soltas    = totalPlacas

      for await (let item of dados.data) {

        if(!(item.send===undefined)) {
          if(item.send.success) {   qtde_enviados++   }  
        } else {
          console.log('ERRO: (Seletor) item.send.success :',item.id, nameDevice)
        }

      }

      Alert.alert('Status:',`
        (Memória:)

        Total em memória: ${qtde_fotos}
        Não vinculadas: ${ qtde_soltas }
        Pendentes de envio: ${ qtde_fotos - qtde_enviados }
        Registros já enviados: ${qtde_enviados}
       `,
      [{
        text: 'Retornar',
        onPress: () => {},
        style: 'default'
      },{
        text: 'Zera dados já Enviados',
        onPress: () => {zeraDadosJaEnviados()},
        style: 'default'
      },{
        text: 'Zera Todos os Dados',
        onPress: () => {zeraTodosDados()},
        style: 'default'
      }],
      { cancelable: false })
    })
  }

  // Criar opção para apagar fotos SOLTAS sem vinculos

  // OPÇÃO PARA DELETAR TODOS OS DADOS
  const zeraTodosDados = async () => {
    
    let IDs = []
    let stoListaFotos = await getData('@ListaFotos')
    let listaFotos = stoListaFotos.data
    for await ( let i of listaFotos) {   
      IDs.push( i.id )
    }  

    let stoListaFotosPlacas = await getData('@ListaFotosPlacas')
    let listaFotosPlacas = stoListaFotosPlacas.data
    for await ( let i of listaFotosPlacas) {   
      IDs.push( i.id )
    }  

    if(IDs) {     
      await MediaLibrary.deleteAssetsAsync(IDs).then((ok)=>{
          setData('@ListaFotos',[]).then((b)=>{        
            setData('@ListaFotosPlacas',[]).then((b)=>{        
              Alert.alert('Dados zerados !!!')
            })
          })
      })
    }

  }


  // OPÇÃO PARA DELETAR OS DADOS DE FOTOS JÁ ENVIADAS
  const zeraDadosJaEnviados = async () => {
    let IDs = []
    let newListaFotos = []
    let stoListaFotos = await getData('@ListaFotos')
    let listaFotos = stoListaFotos.data

    for await ( let i of listaFotos) {   
      if(i.send.success) {
          IDs.push( i.id )
      } else {
          newListaFotos.push( i )
      }
    }
    if(IDs) {     
      await MediaLibrary.deleteAssetsAsync(IDs).then((ok)=>{
        setData('@ListaFotos',newListaFotos).then((a)=>{
          Alert.alert('Dados excluidos com sucesso !!!')
        })
      })
    } else {
      Alert.alert('Não há dados enviados para excluir !!!')
    }
 }

 // Seletor (CartaFrete/Placas)
 const entrarDetalhes = () => {
   // console.log('entrarDetalhes=',sel)
   if (sel=='CartaFrete') {
    entrarCartaFrete()
   } else 
   if (sel=='Placas') {
    entrarPlacas()
   }
 }

 // NAVEGAR PARA PAGINA DE DETALHES ( Placas ) 000000
 const entrarPlacas = () => {
  let token
  let success

  setTrabalhando(true)

  setData('@Placas',{ placas: placas })

  getData('@Credencial').then((sto)=>{
    success = sto.success
    if (success) {
        token = sto.data.token
        GetPlacasVeiculo(placas,token).then((ret)=>{
          success = ret.success  
          if (success) {
            let dadosVeiculo = { 
                placas: ret.PLACA,
                cidade: ret.CIDADE,
                marca: ret.MARCA,
                agregado: ret.AGREGADO,
                bloqueio: ret.BLOQUEIO,
                data: ret.DATA
            }

            setData('@Placas',dadosVeiculo)
            
            setTrabalhando(false)
            
            navigation.navigate('DadosPlacas',{dadosVeiculo})

          } else {
              let msg = ret.message
              
            setTrabalhando(false)

              if (!ret.message) {
                msg = 'Problemas com o servidor.'
              }
              Alert.alert('Aviso:', msg, [{
                text: 'OK',
                onPress: () => console.log('OK Pressed'),
                style: 'default'
              }],{ cancelable: false })                  
          }

        }).catch(err=>{ 
          setTrabalhando(false)
          console.log('ERRO:',err)
        })
    }
})
}
 
 // NAVEGAR PARA PAGINA DE DETALHES ( Carta Frete )
 const entrarCartaFrete = () => {
    let w = cartaFrete.replace('-','')
    let emp = w.substring(0,3)
    let cod = w.substring(3,12).replace(/([^\d])+/gim, '');
    let token
    let success

    setTrabalhando(true)

    setCartafrete(`${emp}-${cod}`)
    setData('@CartaFrete',{ cartaFrete: cartaFrete, empresa: emp, codigo: cod })

    getData('@Credencial').then((sto)=>{
        success = sto.success
        if (success) {
            token = sto.data.token
            GetCartaFrete(emp,cod,token).then((ret)=>{
              success = ret.success  
              if (success) {
                let dadosCarta = 
                  { cartaFrete: ret.CARTAFRETE, 
                    empresa: emp, 
                    codigo: cod ,
                    placas: ret.PLACAS,
                    motorista: ret.MOTORISTA,
                    data: ret.DATA,
                    api: ret.FOTOS_API || 0,
                    sccd: ret.FOTOS_SCCD || 0,
                    ids: ret.FOTOS_IDS || 0
                  }
                  setData('@CartaFrete',dadosCarta)

                  setTrabalhando(false)

                  navigation.navigate('DadosFrete',{dadosCarta})

              } else {
                  let msg = ret.message
                  
                  setTrabalhando(false)

                  if (!ret.message) {
                    msg = 'Problemas com o servidor.'
                  }
                  Alert.alert('Aviso:', msg, [{
                    text: 'OK',
                    onPress: () => console.log('OK Pressed'),
                    style: 'default'
                  }],{ cancelable: false })                  
              }

            }).catch(err=>{ 
              setTrabalhando(false)
              console.log('ERRO:',err)
            })
        }
    })
  }

  // NAVEGAR PARA TELA DE LOGIN
  const sairLogin = () => {
    navigation.navigate('Login')
  }

  // VISUAL REACT
  return (
    <View style={styles.background}>

          <Image
          style={{
            width: 100,
            height: 100,
          }} 
          source={require('../../../assets/Logotipo_Termaco2.png')}
          />

       <Text style={styles.LabelTitulo}>S C C D</Text>
       
       <RadioSeletor onPress={OpcaoSeletor}/>

        { sel == 'CartaFrete' &&
        <TextInput
            value={cartaFrete}
            autoCapitalize="characters"
            autoFocus={true}
            style={styles.input}
            placeholder="Carta Frete"
            autoCorrect={false}
            onChangeText={(text)=> { setCartafrete(text) }}
        />
        }

        { sel == 'Placas' &&
        <TextInput
            value={placas}
            autoCapitalize="characters"
            autoFocus={true}
            style={styles.input}
            placeholder="Placas"
            autoCorrect={false}
            onChangeText={(text)=> { setPlacas(text) }}
        />
        }

        <Modal
          animationType="fade"
          transparent={true}
          visible={trabalhando}
        >
          <Trabalhando /> 
        </Modal> 

        <TouchableOpacity 
            style={styles.btnSubmit}
            onPress={ entrarDetalhes }
        >
          <MaterialCommunityIcons name="location-enter" size={35} color="#FFF" />
          <Text style={styles.submitText}> 
             Entrar  
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={styles.btnSubmit}
            onPress={ () => { navigation.navigate('SelectPlacas') } }
        >
          <MaterialCommunityIcons name="account-switch" size={35} color="#FFF" />
          <Text style={styles.submitText}> 
              Vincular fotos
          </Text>
        </TouchableOpacity>        

        <TouchableOpacity 
            style={styles.btnSubmit}
            onPress={ sairLogin }
        >
          <AntDesign name="user" size={35} color="#FFF" />
          <Text style={styles.submitText}> 
              Trocar usuário
          </Text>
        </TouchableOpacity>        

        <TouchableOpacity 
            style={styles.btnSubmit}
            onPress={ zeraDados }
        >
          <MaterialCommunityIcons name="broom" size={35} color="#FFF" />
          <Text style={styles.submitText}> 
              Limpeza de Dados
          </Text>
        </TouchableOpacity>        

        <TouchableOpacity 
            style={styles.btnSubmit}
            onPress={ () => { navigation.navigate('Sincronizacao') } }
        >
          <MaterialCommunityIcons name="server-network" size={35} color="#FFF" />
          <Text style={styles.submitText}> 
              Sincronizar com servidor
          </Text>
        </TouchableOpacity>    

        <TouchableOpacity 
            style={styles.btnSubmit}
            onPress={ () => BackHandler.exitApp() }
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
