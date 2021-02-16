import React, {useState, useEffect} from 'react';
import { AntDesign } from '@expo/vector-icons';
import {  Alert,          View,
          Modal,          SafeAreaView,
          TextInput,      TouchableOpacity,
          TouchableHighlight,          Text, 
          StyleSheet 
             } from 'react-native';
import { getData, setData } from '../../utils/dataStorage';

import Trabalhando from '../../Components/Trabalhando'



export default function DadosPlacas( props ) {
  const { navigation } = props 
  let params = props.route.params 

  const [modalVisible , setModalVisible] = useState(false);
  const [modalTipo    , setModalTipo]    = useState(false);
  const [placas       , setPlacas]       = useState(null);
  const [agregado     , setAgregado]     = useState(null);
  const [operacao     , setOperacao]     = useState(null);
  const [tipoVeiculo  , setTipoveiculo]  = useState(null);
  const [observacao   , setObservacao]   = useState(null);    
  const [cidade       , setCidade]       = useState(null);
  const [marca        , setMarca]        = useState(null);
  const [bloqueio     , setBloqueio]     = useState(null);
  const [trabalhando  , setTrabalhando ] = useState(false);

  useEffect( () => {
    if(params) {

      setPlacas(params.dadosVeiculo.placas);
      setAgregado(params.dadosVeiculo.agregado);
      setCidade(params.dadosVeiculo.cidade);
      setMarca(params.dadosVeiculo.marca);
      setBloqueio(params.dadosVeiculo.bloqueio);
      setTrabalhando(false);

      setOperacao('CARGA')
      setTipoveiculo('NORMAL')
    } else {
      getData('@Placas').then((sto) =>{
        setPlacas(sto.data.placas);
        setAgregado(sto.data.agregado);
      })

      getData('@DadosVeiculo').then((sto) => {        
        if (sto.data) {
          setOperacao(   sto.data.dadosVeiculo.operacao    );
          setTipoveiculo(sto.data.dadosVeiculo.tipoVeiculo );
          setObservacao( sto.data.dadosVeiculo.observacao  );
        }
      })
    }
  }, []);

  // GRAVA EM MEMÓRIA INTERNA (dadosFrete)
  const setDadosVeiculo = async () => {
    let dadosVeiculo = {
      placas: placas,
      cidade: cidade,
      marca: marca,
      bloqueio: bloqueio,
      agregado: agregado,
      bloqueio: bloqueio,
      operacao: operacao,
      tipoveiculo: tipoVeiculo,
      observacao: observacao,
    }
    setData('@DadosVeiculo',{ dadosVeiculo: dadosVeiculo })
  }

  // NAVEGA PARA TELA PARA FOTOGRAFAR
  const fotografar = () => {
      setTrabalhando(true)
      setDadosVeiculo().then(()=>{
          let dadosVeiculo = params.dadosVeiculo
          dadosVeiculo.operacao    = operacao
          dadosVeiculo.tipoVeiculo = tipoVeiculo
          dadosVeiculo.observacao  = observacao
          setTrabalhando(false)
          navigation.navigate('Device',{dadosVeiculo})
      })
  }

  // NAVEGA PARA TELA DE LISTA DE FOTOS A ENVIAR
  const showPictures = () => {
      setTrabalhando(true)
      getData('@ListaFotosPlacas').then((sto) =>{
         if(!sto.data) {
            sto.data = []
         }         
         if(sto.data.length>0) {
            setTrabalhando(false)
            navigation.navigate('PicturePlacas')
            setTrabalhando(false)
         } else {
          setTrabalhando(false)
          Alert.alert('Não existe dados relacionados !!!')
         }
      })
  }

  // TELA MODAL TIPO DE VEICULO
  function ItemModalTipo(props) {   
    function OnPressTipoVeiculo(value) {
      setTipoveiculo(value);
      setModalTipo(!modalTipo);
    }
    return (
        <TouchableHighlight
            style={{ ...styles.buttonModal, backgroundColor: "#2196F3" }}
            onPress={()=>{OnPressTipoVeiculo(props.VALOR)}}
          >
        <Text style={styles.textStyle}>{props.TITULO}</Text>
      </TouchableHighlight>
    )
  }

  // TELA MODAL TIPO DE OPERAÇÃO
  function ItemModalOperacao(props) {
    function OnPressOperacao(value) {
      setOperacao(value);
      setModalVisible(!modalVisible);
    }   
    return (
        <TouchableHighlight
            style={{ ...styles.buttonModal, backgroundColor: "#2196F3" }}
            onPress={()=>{OnPressOperacao(props.VALOR)}}
          >
        <Text style={styles.textStyle}>{props.TITULO}</Text>
      </TouchableHighlight>
    )
  }

  // VISUAL REACT
  return (
    <SafeAreaView style={styles.background}>

        <Text style={styles.LabelTitulo}>
          Placas:
        </Text>
        <Text style={styles.LabelPlacas}>
          {placas}
        </Text>
        <Text style={styles.LabelCidade}>
           {cidade}
        </Text>

        <Text style={styles.LabelText}>Marca</Text>
        <TextInput
          value={marca}
          style={styles.input}
          editable = {false}
          placeholder="Marca"
          autoCorrect={false}
          onChangeText={(text)=> { setMarca(text)}}
        />

        <Text style={styles.LabelText}>Agregado</Text>
        <TextInput
          value={agregado}
          style={styles.input}
          editable = {false}
          placeholder="Agregado"
          autoCorrect={false}
          onChangeText={(text)=> { setAgregado(text)}}
        />

        <Text style={styles.LabelText}>Operação:</Text>
        <View style={{flexDirection: 'row'}}>
        <TextInput
          value={operacao}
          style={styles.inputModal}
          editable = {false}
          placeholder="Operação"
          autoCorrect={false}
          onChangeText={(text)=> { setOperacao(text)}}
        />
          <TouchableHighlight 
              style={styles.openModal} 
              onPress={() => { setModalVisible(!modalVisible)}}
          >
              <AntDesign name="caretdown" size={20} color="#FFF" />
          </TouchableHighlight>
        </View>

        <Text style={styles.LabelText}>Tipo Veiculo:</Text>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            value={tipoVeiculo}
            style={styles.inputModal}
            editable = {false}
            placeholder="Tipo Veiculo"
            autoCorrect={false}
            onChangeText={(text)=> { setTipoveiculo(text)}}
          />
          <TouchableHighlight 
               style={styles.openModal}
               onPress={() => { setModalTipo(!modalTipo)}}
          >
              <AntDesign name="caretdown" size={20} color="#FFF" />
          </TouchableHighlight>
        </View>


        <Text style={styles.LabelText}>Observações</Text>
        <TextInput
          value={observacao}
          style={styles.input}
          placeholder="Observações"
          autoCorrect={false}
          onChangeText={(text)=> { setObservacao(text)}}
        />

        <View style={styles.containerBTN}>
          <TouchableOpacity 
              style={styles.btnImagens}
              onPress={ fotografar }
          >
            <Text style={styles.submitText}>
                Foto
            </Text>

          </TouchableOpacity>

          <TouchableOpacity 
              style={styles.btnImagens}
              onPress={ showPictures }
          >
            <Text style={styles.submitText}>
                Imagens
            </Text>

          </TouchableOpacity>


          <TouchableOpacity 
              style={styles.btnSair}
              onPress={ () => { navigation.navigate('Seletor')}}
          >
            <Text style={styles.submitText}>
                Sair
            </Text>

          </TouchableOpacity>        
        </View>
        
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalTipo}
          onRequestClose={() => { Alert.alert("Modal has been closed."); }}
        >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Tipo Veiculo:</Text>

                <ItemModalTipo LISTA="1" TITULO="Normal"           VALOR="NORMAL"/>
                <ItemModalTipo LISTA="1" TITULO="Complementar"     VALOR="COMPLEMANTAR"/>
                <ItemModalTipo LISTA="1" TITULO="Coleta / Entrega" VALOR="COLETA/ENTREGA"/>

              </View>
            </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => { Alert.alert("Modal has been closed."); }}
        >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Operação:</Text>

                <ItemModalOperacao LISTA="2" TITULO="Carga"    VALOR="CARGA"/>
                <ItemModalOperacao LISTA="2" TITULO="Descarga" VALOR="DESCARGA"/>
                <ItemModalOperacao LISTA="2" TITULO="Vazio"    VALOR="VAZIO"/>
                <ItemModalOperacao LISTA="2" TITULO="Avaria"   VALOR="AVARIA"/>

              </View>
            </View>
          </Modal>
      
          <Modal
              animationType="fade"
              transparent={true}
              visible={trabalhando}
          >
              <Trabalhando /> 
          </Modal> 

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#191919',
  },
  containerBTN:{
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#191919',
    marginTop:20,
  },
  container:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    paddingBottom: 10,
  },
  input:{
    backgroundColor: '#FFF',
    width: '90%',
    marginTop:5,
    marginBottom:10,
    color:'#000',
    fontSize: 17,
    borderRadius: 7,
    padding: 5,
  },
  inputModal:{
    backgroundColor: '#FFF',
    width: '78%',
    marginTop:5,
    marginBottom:10,
    color:'#000',
    fontSize: 17,
    borderRadius: 7,
    padding: 5,
  },
  openModal: {
    marginTop:5,
    marginLeft:2,
    width: '12%',
    height: 40,    
    backgroundColor: "#35AAFF",
    borderRadius: 7,
    padding: 10,
    elevation: 2
  },  
  btnImagens:{
    backgroundColor: '#35AAFF',
    width: '30%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    margin: 5,
  },
  btnSair:{
    backgroundColor: '#35AAFF',
    width: '30%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    margin: 5,
  },
  submitText:{
    color: '#FFF',
    fontSize: 20,
  },
  LabelText:{
    color: '#FFF',
    textAlign: "left",
    alignSelf: 'stretch',
    marginLeft: 20,
  },
  LabelTitulo:{
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 10,
    width: 350,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center"
  },
  buttonModal: {
    width: '90%',
    margin: 5,
    backgroundColor: "#F194FF",
    borderRadius: 5,
    padding: 10,
    elevation: 2
  },    
});

