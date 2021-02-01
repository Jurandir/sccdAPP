import React, {useState, useEffect} from 'react';
import {  View,  TextInput, 
          TouchableOpacity,
          Text,  StyleSheet, 
          Alert, BackHandler,
          Image
                   } from 'react-native';
                   
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';                  
import GetCartaFrete from '../../interface/GetCartaFrete';
import { delData, getData, setData } from '../../utils/dataStorage';

// CARTAFRETE
export default function CartaFrete( { navigation } ) {
  const [cartaFrete  , setCartafrete]   = useState(''); 

  useEffect(() => {
    (async () => {
      let stoCartaFrete = await getData('@CartaFrete')
      if(stoCartaFrete.data.cartaFrete) {
        setCartafrete(stoCartaFrete.data.cartaFrete)
      }
    })();
  }, []);

  // MOSTRA OPÇÕES PARA ZERAR DADOS ()
  const zeraDados = () => {

    getData('@ListaFotos').then( async (dados)=>{
       if(!dados.data){
        dados.data=[]
       }
      let qtde_fotos        = dados.data.length || 0
      let qtde_enviados = 0     
      for await (let item of dados.data) {
        if(item.send.success) {
          qtde_enviados++
        }
      }
      Alert.alert('Status:',`
        (Memória:)

        Total em memória: ${qtde_fotos}
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

  // OPÇÃO PARA DELETAR TODOS OS DADOS
  const zeraTodosDados = () => {
    delData('@ListaFotos').then((a)=>{
       setData('@ListaFotos',[]).then((b)=>{        
        Alert.alert('Dados zerados !!!')
      })
     })
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

 // NAVEGAR PARA PAGINA DE DETALHES 
 const entrarDetalhes = () => {
    let w = cartaFrete.replace('-','')
    let emp = w.substring(0,3)
    let cod = w.substring(3,12).replace(/([^\d])+/gim, '');
    let token
    let success

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
                    data: ret.DATA
                  }
                  setData('@CartaFrete',dadosCarta)
                  navigation.navigate('DadosFrete',{dadosCarta})

              } else {
                  let msg = ret.message
                  if (!ret.message) {
                    msg = 'Problemas com o servidor.'
                  }
                  Alert.alert('Aviso:', msg, [{
                    text: 'OK',
                    onPress: () => console.log('OK Pressed'),
                    style: 'default'
                  }],{ cancelable: false })                  
              }

            }).catch(err=>{ console.log('ERRO:',err)})
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

       <Text style={styles.LabelTitulo}>Carta Frete</Text>

        <TextInput
            value={cartaFrete}
            autoCapitalize="characters"
            autoFocus={true}
            style={styles.input}
            placeholder="Carta Frete"
            autoCorrect={false}
            onChangeText={(text)=> { setCartafrete(text) }}
        />

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
    fontSize: 20
  }
});
