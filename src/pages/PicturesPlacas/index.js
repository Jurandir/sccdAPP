import React, {useState, useEffect, useRef} from 'react';
import {  Alert,            View,  Modal,
          SafeAreaView,     FlatList,
          Image,            TouchableOpacity,
          Text,             StyleSheet,
          StatusBar,        Dimensions } from 'react-native';
import { getData, setData } from '../../utils/dataStorage';
import { AntDesign } from '@expo/vector-icons' ;
import * as MediaLibrary from 'expo-media-library';

import Trabalhando from '../../Components/Trabalhando'

const deviceWidth = Dimensions.get('window').width
const deviceHeigh = Dimensions.get("window").height

export default function PicturesPlacas( { navigation } ) {

  const [ dadosFotos  , setDadosFotos  ] = useState({});
  const [ credencial  , setCredencial  ] = useState({});
  const  [trabalhando , setTrabalhando ] = useState(false);

  const refFoto                         = useRef(null)

  const Validade =( {DADOS, INDEX} ) => {
    let icon_name  = dadosFotos[INDEX].valida ? 'check' : 'close'
    let icon_color = dadosFotos[INDEX].valida ? '#5cb85c' : '#d9534f'
  return ( 
     <View style={styles.validade}>
        <AntDesign name={icon_name} size={35} color={icon_color} /> 
    </View>
  )}

  // TELA DE APRESENTAÇÃO DA FOTO / DADOS
  const renderItem = ({ item }) => {
    return (
    <Item ITEM={item}/>
  )}

  // ITEM FOTO/DADOS
  const Item = ( params ) => { 
    let valida  = dadosFotos[params.ITEM.index].valida
    // console.log('param ITEMS:',params.ITEM)
    return (
    <View style={styles.item}>
      <Text style={styles.LabelTitulo}>{params.ITEM.title}</Text>
      <Image
          style={styles.imagem}
          source={ getImagem( params.ITEM ) }
      />

      <Validade DADOS={dadosFotos} INDEX={params.ITEM.index}/>
     
      <TouchableOpacity style={styles.delete} onPress={()=>deleteItem(params.ITEM,params)}>
          <AntDesign name="delete" size={35} color="#FFF" />
      </TouchableOpacity>

      <Text style={styles.filename}>{'Marca: '+params.ITEM.marca}</Text>
      <Text style={styles.filename}>{'Agregado: '+params.ITEM.agregado}</Text>
      <Text style={styles.filename}>{'Tipo Veículo: '+params.ITEM.tipoVeiculo}</Text>
      <Text style={styles.filename}>{'Obs: '+params.ITEM.observacao}</Text>
      <Text style={styles.filename}>{'Válida: '+valida}</Text>
    </View>
  )};

  // MONTA JSON IMAGEM
  const getImagem = (obj) =>{
    return { isStatic: true , uri: obj.uri }
  }

  // APAGA ITEM
  const deleteItem = (item) => {
    let { index, valida }  = item
    valida = !valida
    setValidaFoto(index,valida)
  }

  // SETA SE É UMA FOTO VALIDA (TRUE/FALSE)
  const setValidaFoto = (index,valida) => {
    let tmp_dados = dadosFotos
    tmp_dados[index].valida = valida
    setDadosFotos(tmp_dados)
    refFoto.current.forceUpdate()
  }

  useEffect(() => {   
    (async () => {
      let stoCredencial = await getData('@Credencial')
      let stoListaFotos = await getData('@ListaFotosPlacas')
      let varDados      = []
      let index         = 0

      for await ( let it of stoListaFotos.data ) {
        varDados.push( {id: it.id, 
                        title: it.dados.placas+' - '+it.dados.operacao, 
                        uri: it.imagem.uri,
                        filename: it.imagem.filename,
                        date: it.dados.data,
                        agregado: it.dados.agregado,
                        placas: it.dados.placas,
                        marca: it.dados.marca,
                        observacao: it.dados.observacao || '',
                        operacao: it.dados.operacao,
                        tipoVeiculo: it.dados.tipoVeiculo,
                        valida: true,
                        index: index++,
           })
      }

      setCredencial(stoCredencial)
      setDadosFotos( varDados )
      setTrabalhando(false)

    })();

  }, []);
  
  // VERIFICA SE EXISTE FOTOS MARCADAS PARA EXCLUIR
  const existeMarcadosParaExcluir = async () => {
    let ret = false
    for await (let i of dadosFotos) {
      if(i.valida===false) { ret = true }
    }
    return ret
  }

  // SAIDA DA TELA E NAVEGAÇÃO PARA TELA ANTERIOR
  const sairTela = async () => {  
    let marcados = await existeMarcadosParaExcluir()
    if (marcados) {
        Alert.alert('Confirmação:', 'Exclui dados marcados, para exclusão?',
        [{
          text: 'SIM',
          onPress: () => {excluiMarcadosParaExclusao()},
          style: 'default'
        },{
          text: 'NÃO',
          onPress: () => {},
          style: 'default'
        }],
        { cancelable: false })
        navigation.goBack()

    } else {
      navigation.goBack()
    }
  }

  // EXCLUIR FOTOS MARCADAS COMO NÃO VALIDAS
  const excluiMarcadosParaExclusao = async () =>{
    let IDs = []
    let newListaFotosPlacas = []
    let ok  = false
    let idx
    let stoListaFotosPlacas = await getData('@ListaFotosPlacas')
    let listaFotosPlacas = stoListaFotosPlacas.data

    setTrabalhando(true)

    for await ( let i of dadosFotos) {   
      idx = i.index
      if(!i.valida) {
         IDs.push( i.id )
      } else {
        let newItem = listaFotosPlacas[idx]
        if(newItem) {
          newListaFotosPlacas.push( newItem )
        }  
      }
    }

    if(IDs) {     
      await MediaLibrary.deleteAssetsAsync(IDs).then((ok)=>{
        setData('@ListaFotosPlacas',newListaFotosPlacas).then((a)=>{
          Alert.alert('Dados excluidos com sucesso.')
        })
      })
    }
  }

  // VISUAL REACT
  return (
    <View style={styles.background}>

       <SafeAreaView style={styles.container}>
        <FlatList
          ref={refFoto}
          data={dadosFotos}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal={true}
        />
      </SafeAreaView>

      <SafeAreaView
            style={styles.btnContainer}
            >
      <TouchableOpacity 
            style={styles.btnSubmit}
            onPress={ sairTela }
        >
          <Text style={styles.submitText}> 
              Sair
          </Text>
      </TouchableOpacity>        

      
      </SafeAreaView>

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
    width: '100%',
    padding: 1,
    margin: 1,
    marginTop: StatusBar.currentHeight-12 || 0,
  },
  btnSubmit:{
    backgroundColor: '#35AAFF',
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    marginLeft: 10,
    marginRight: 10,
  },
  submitText:{
    color: '#FFF',
    fontSize: 18,
  },
  LabelTitulo:{
    color: 'red',
    fontWeight: 'bold',
    textAlign: "center",
    margin: 0,
    padding: 0,
    fontSize: 16
  },
  imagem:{
    width: '100%',
    height: deviceHeigh-190,
  },
  item: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 7,
    marginVertical: 8,
    marginHorizontal: 8,
    width: deviceWidth-15,
  },
  title: {
    color: '#000',
    fontSize: 22,
  },    
  filename: {
    color: '#121212',
    fontSize: 12,
  },    
  delete:{
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 15,
    right: 5,
    position: 'absolute',
    margin:2,
    backgroundColor: '#35AAFF',
    height: 50,
    width: 50,
    borderRadius: 7,
    zIndex: 1,
  },
  validade:{
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 15,
    right: 50,
    position: 'absolute',
    margin:2,
    backgroundColor: 'transparent',
    height: 50,
    width: 50,
    borderRadius: 7,
    zIndex: 1,
  },
  btnContainer: {
    flexDirection: 'row',
    marginBottom: 2,
  },
});
