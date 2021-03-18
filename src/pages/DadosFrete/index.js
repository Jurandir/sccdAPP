import React, {useState, useEffect} from 'react';
import { AntDesign } from '@expo/vector-icons';
import {  Alert,          View,
          Modal,          SafeAreaView,
          TextInput,      TouchableOpacity,
          TouchableHighlight,          Text, 
          StyleSheet 
             } from 'react-native';
import { getData, setData } from '../../utils/dataStorage';


export default function DadosFrete( props ) {
  const { navigation } = props 
  let params = props.route.params 

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo,    setModalTipo]    = useState(false);
  const [placas      , setPlacas]       = useState(null);
  const [motorista   , setMotorista]    = useState(null);
  const [operacao    , setOperacao]     = useState(null);
  const [tipoVeiculo , setTipoveiculo]  = useState(null);
  const [observacao  , setObservacao]   = useState(null);    
  const [cartaFrete  , setCartafrete]   = useState(null);    

  const [empresa  , setEmpresa]   = useState(null);    
  const [codigo   , setCodigo]    = useState(null);    
  const [emissao  , setEmissao]   = useState(null);    
  const [fotoAPI  , setFotoAPI]   = useState(0);    
  const [fotoSCCD , setFotoSCCD]  = useState(0);    
  const [fotoIDS  , setFotoIDS]   = useState(0);    

  useEffect( () => {
    if(params) {
      setCartafrete(params.dadosCarta.cartaFrete);
      setPlacas(params.dadosCarta.placas);
      setMotorista(params.dadosCarta.motorista);
      setEmpresa(params.dadosCarta.empresa);
      setCodigo(params.dadosCarta.codigo);
      setEmissao(params.dadosCarta.data);
      setFotoAPI(params.dadosCarta.api);
      setFotoSCCD(params.dadosCarta.sccd);
      setFotoIDS(params.dadosCarta.ids);
      setOperacao('CARGA')
      setTipoveiculo('NORMAL')
    } else {
      getData('@CartaFrete').then((sto) =>{
        setCartafrete(sto.data.cartaFrete);
        setPlacas(sto.data.placas);
        setMotorista(sto.data.motorista);
        setEmpresa(sto.data.empresa);
        setCodigo(sto.data.codigo);
        setEmissao(sto.data.data);
        setFotoAPI(sto.data.api);
        setFotoSCCD(sto.data.sccd);
        setFotoIDS(sto.data.ids);  
      })

      getData('@DadosFrete').then((sto) => {        
        if (sto.data) {
          setOperacao(   sto.data.dadosFrete.operacao    );
          setTipoveiculo(sto.data.dadosFrete.tipoVeiculo );
          setObservacao( sto.data.dadosFrete.observacao  );
        }
      })
    }
  }, []);

  // GRAVA EM MEMÓRIA INTERNA (dadosFrete)
  const setDadosFrete = async () => {
    let dadosFrete = {
      placas: placas,
      motorista: motorista,
      operacao: operacao,
      tipoveiculo: tipoVeiculo,
      observacao: observacao,
      cartafrete: cartaFrete
    }
    setData('@DadosFrete',{ dadosFrete: dadosFrete })
  }

  // NAVEGA PARA TELA PARA FOTOGRAFAR
  const fotografar = () => {
    setDadosFrete().then(()=>{
      let dadosCarta = params.dadosCarta
      dadosCarta.operacao    = operacao
      dadosCarta.tipoVeiculo = tipoVeiculo
      dadosCarta.observacao  = observacao
      navigation.navigate('Device',{dadosCarta})
    })
  }

  // NAVEGA PARA TELA DE LISTA DE FOTOS A ENVIAR
  const showPictures = () => {
      getData('@ListaFotos').then((sto) =>{
         if(!sto.data) {
            sto.data = []
         }         
         if(sto.data.length>0) {
            navigation.navigate('Picture')
         } else {
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
          Carta Frete 
        </Text>
        <Text style={styles.LabelCartaFrete}>
          {cartaFrete}
        </Text>
        <Text style={styles.LabelStatus}>
          Fotos: Srv {fotoAPI} - Site {fotoSCCD} - Ok {fotoIDS}
        </Text>

        <Text style={styles.LabelText}>Placas</Text>
        <TextInput
          value={placas}
          style={styles.input}
          editable = {false}
          placeholder="Placas"
          autoCorrect={false}
          onChangeText={(text)=> { setPlacas(text)}}
        />

        <Text style={styles.LabelText}>Motorista</Text>
        <TextInput
          value={motorista}
          style={styles.input}
          editable = {false}
          placeholder="Motorista"
          autoCorrect={false}
          onChangeText={(text)=> { setMotorista(text)}}
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
    marginTop: 2,
    fontSize: 14
  },
  LabelStatus:{
    backgroundColor: '#35AAFF',
    color: '#fff',
    paddingVertical:1,
    paddingHorizontal:6,
    borderRadius: 5,
    textAlign: "center",
    marginBottom: 10,
    fontSize: 12
  },
  LabelCartaFrete:{
    color: '#FFF',
    textAlign: "center",
    marginTop: 0,
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

