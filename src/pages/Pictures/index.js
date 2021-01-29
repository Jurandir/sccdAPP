import React, {useState, useEffect, useRef} from 'react';
import {  Alert,            View, 
          SafeAreaView,     FlatList,
          Image,            TouchableOpacity,
          Text,             StyleSheet,
          StatusBar,        Dimensions } from 'react-native';
import { getData, setData } from '../../utils/dataStorage';
import { AntDesign } from '@expo/vector-icons' ;
import * as MediaLibrary from 'expo-media-library';
import SendForm from '../../utils/SendForm';

const deviceWidth = Dimensions.get('window').width

export default function Pictures( { navigation } ) {

  const [ dadosFotos, setDadosFotos ]   = useState({});
  const [ credencial, setCredencial ]   = useState({});
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
    let enviada = dadosFotos[params.ITEM.index].enviada
    return (
    <View style={styles.item}>
      <Text style={styles.LabelTitulo}>{params.ITEM.title}</Text>
      <Image
          style={styles.imagem}
          source={ getImagem( params.ITEM ) }
      />

      <Validade DADOS={dadosFotos} INDEX={params.ITEM.index}/>
     
      { !enviada &&
      <TouchableOpacity style={styles.delete} onPress={()=>deleteItem(params.ITEM,params)}>
          <AntDesign name="delete" size={35} color="#FFF" />
      </TouchableOpacity> }

      <Text style={styles.filename}>{'Placas: '+params.ITEM.placas}</Text>
      <Text style={styles.filename}>{'Motorista: '+params.ITEM.motorista}</Text>
      <Text style={styles.filename}>{'Tipo Veículo: '+params.ITEM.tipoVeiculo}</Text>
      <Text style={styles.filename}>{'Obs: '+params.ITEM.observacao}</Text>
      <Text style={styles.filename}>{'Válida: '+valida+',  Enviada: '+enviada}</Text>
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

  // ENVIA DADOS PARA API - ALERT
  const enviasDados = () => {
    Alert.alert('Confirmação:', 'Envia dados para o servidor?',
      [{
        text: 'SIM',
        onPress: () => {enviaDadosServidor()},
        style: 'default'
      },{
        text: 'NÃO',
        onPress: () => {},
        style: 'default'
      }],
      { cancelable: false })
  }

  // ENVIA DADOS PARA API
  const enviaDadosServidor = async () => {
    let data = {}
    let imagem = {}
    let token = credencial.data.token    
    let listaEnvios = []
    let imagensIDs = []

    for await (let foto of dadosFotos) {
      imagem = {
        file: foto.uri,
        filename: foto.filename
      }
     
      data = {
        id: foto.id,
        cartaFrete: foto.cartaFrete,
        date: foto.date,
        motorista: foto.motorista,
        placas: foto.placas,
        observacao: foto.observacao,
        operacao: foto.operacao,
        tipoVeiculo: foto.tipoVeiculo,
        tipoDocumento: "SCCD"
      }
      
      if( (foto.valida) && (!foto.enviada) ) {
        listaEnvios.push( 
            SendForm(data, imagem, token)
            .then((ret)=>{
                if(ret.success) {
                  imagensIDs.push(ret.id)
                }  
            })
        )  
      }

    }

    await Promise.all(listaEnvios)

    setFotosEnviadas(imagensIDs)
    .then((ret)=>{
      if(ret.qtde>0){
        Alert.alert(`(${ret.qtde}), Fotos enviadas com sucesso !!!`)
      } else
      if(ret.qtde===0){
        Alert.alert('Não há fotos disponíveis para envio !!!')
      } else  
      if(ret.qtde===-1){
        Alert.alert('Problemas no envio !!!')
      }
    })

  }

  // SETA SE É UMA FOTO VALIDA (TRUE/FALSE)
  const setValidaFoto = (index,valida) => {
    let tmp_dados = dadosFotos
    tmp_dados[index].valida = valida
    setDadosFotos(tmp_dados)
    refFoto.current.forceUpdate()
  }

  // SETA PARA "TRUE" AS FOTOS ENVIADAS
  const setFotosEnviadas = async (IDs) => {
    let tmp_Lista     = await getData('@ListaFotos')
    let tmp_dados     = dadosFotos
    let tmp_qtde      = 0
    let idx
    
    for await (let foto of dadosFotos){
      idx = foto.index
      if(IDs.includes(foto.id) ) {
        tmp_qtde++
        tmp_dados[idx].enviada = true
        tmp_Lista.data[idx].send.success = true
        tmp_Lista.data[idx].send.message = 'OK'
        tmp_Lista.data[idx].send.date    =  new Date()
      }
    }
    
    let ret = { success: true, qtde: tmp_qtde, message:'' }

    setDadosFotos(tmp_dados)
    refFoto.current.forceUpdate()

    await setData('@ListaFotos',tmp_Lista.data)
          .then((a)=>{
            ret.message = 'Success. OK.' 
          }).catch(err=>{
            ret.success = false
            ret.qtde = -1
            ret.message = 'ERRO: '+err
          })
    return ret
  }

  useEffect(() => {   
    (async () => {
      let stoCredencial = await getData('@Credencial')
      let stoListaFotos = await getData('@ListaFotos')
      let varDados      = []
      let index         = 0

      for await ( let it of stoListaFotos.data ) {
        varDados.push( {id: it.id, 
                        title: it.dados.cartaFrete+' - '+it.dados.operacao, 
                        uri: it.imagem.uri,
                        filename: it.imagem.filename,
                        cartaFrete: it.dados.cartaFrete,
                        date: it.dados.data,
                        motorista: it.dados.motorista,
                        placas: it.dados.placas,
                        observacao: it.dados.observacao || '',
                        operacao: it.dados.operacao,
                        tipoVeiculo: it.dados.tipoVeiculo,
                        valida: true,
                        enviada: it.send.success,
                        index: index++,
           })
      }

      setCredencial(stoCredencial)
      setDadosFotos( varDados )

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
    let newListaFotos = []
    let ok  = false
    let idx
    let stoListaFotos = await getData('@ListaFotos')
    let listaFotos = stoListaFotos.data

    for await ( let i of dadosFotos) {   
      idx = i.index
      if(!i.valida) {
        IDs.push( i.id )
      } else {
        if(listaFotos[idx]) {
          newListaFotos.push( listaFotos[idx] )
        }  
      }
    }

    if(IDs) {     
      await MediaLibrary.deleteAssetsAsync(IDs).then((ok)=>{
        setData('@ListaFotos',newListaFotos).then((a)=>{
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

      <TouchableOpacity 
            style={styles.btnSubmit}
            onPress={ enviasDados }
        >
          <Text style={styles.submitText}> 
              Enviar
          </Text>
      </TouchableOpacity>        
      </SafeAreaView>

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
    color: '#000',
    textAlign: "center",
    margin: 0,
    padding: 0,
    fontSize: 16
  },
  imagem:{
    width: '100%',
    height: 410,
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
  },
});
