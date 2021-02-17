import React, {useState, useEffect} from 'react';
import {  View,  TouchableOpacity, Modal,
          Text,  StyleSheet, Alert 
                   } from 'react-native';                  
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { getData } from '../../utils/dataStorage';
import Trabalhando from '../../Components/Trabalhando';


export default function SelectCartaFrete( props ) {
  const { navigation } = props 
  let params = props.route.params 

  const [trabalhando , setTrabalhando ] = useState(false)
  const [cartaFrete  , setCartaFrete]   = useState([])
  const [carta       , setCarta]        = useState(null)
  const [placas      , setPlacas]       = useState(null)
  const [checked     , setChecked]      = useState(0)
  const [cidade      , setCidade]       = useState(null)

  useEffect(() => {

    if(params){
      setPlacas(params.veiculo.placas)
      setCidade(params.veiculo.cidade)
      
      let dados = params.veiculo.dados.map((item,index)=>{
        return {
          index: index+1,
          cartaFrete: item.cartaFrete,
          codigo: item.codigo,
          data: item.data,
          empresa: item.empresa,
          motorista: item.motorista,
          placas: item.placas,
          trecho: item.trecho
        }
      })
      setCartaFrete(dados)
    }

  }, [])

  useEffect(() => {
    if((cartaFrete.length>0) && (checked>0)) {
      let value = cartaFrete[checked-1].cartaFrete
      setCarta(value)
    } else {
      setCarta('')
    }
  }, [checked])

  const confirmaVinculacao = async () => {
    setTrabalhando(true)
    let sel_cartaFrete = cartaFrete[checked-1]
    let sto_carta      = await getData('@ListaFotos')
    let sto_placa      = await getData('@ListaFotosPlacas')
    
    console.log('=========================')
//    console.log('LOCAL cartaFrete',sel_cartaFrete)
//    console.log('LOCAL carta',sto_carta.data.dados)
    console.log('LOCAL placa',sto_placa.data)


    setTrabalhando(false)

  }

  const CartasFrete = () =>{
      return (
      <View style={styles.radiosGroup}>
        <View style={styles.radios}>
          <RadioButton
            value="0"
            uncheckedColor='#fff'
            status={ checked === 0 ? 'checked' : 'unchecked' }
            onPress={() => setChecked(0)}
          />
            <Text onPress={() => setChecked(0)} style={styles.texto}>Carta Frete não disponivel</Text>
        </View>
        { cartaFrete.map((item,index)=>{
                  let sdata = `${item.data}`.substr(8,2)+'/'+`${item.data}`.substr(5,2)+'/'+`${item.data}`.substr(0,4)
                  let ord = `${item.cartaFrete} - ${sdata} - ${item.trecho}`
                  return (
                  < View key={item.index} style={styles.radios}>
                  <RadioButton
                    value={item.index}
                    uncheckedColor='#fff'
                    status={ checked === item.index ? 'checked' : 'unchecked' }
                    onPress={() => setChecked(item.index)}
                  />
                    <Text onPress={() => setChecked(item.index)} style={styles.texto}>{ord}</Text> 
                </View>  )
        })}  
    </View> )
  }

  return (
    <View style={styles.background}>

        <Text style={styles.LabelTitulo}>Vinculação:</Text>

        <View style={styles.CardPlacas}>
          <Text style={styles.Label_Placas}>
            Placas:
          </Text>
          <Text style={styles.LabelPlacas}>
            {placas}
          </Text>
          <Text style={styles.LabelCidade}>
            {cidade}
          </Text>
        </View>

        <CartasFrete />

        <TouchableOpacity 
            style={styles.btnSubmit}
            onPress={ () => { navigation.goBack() } }
        >
          <MaterialCommunityIcons name="exit-run" size={35} color="#FFF" />
          <Text style={styles.submitText}> 
              Sair
          </Text>
        </TouchableOpacity>

        { checked > 0 &&
        <TouchableOpacity 
            style={styles.btnConfirma}
            onPress={ () => { confirmaVinculacao() } }
        >
          <MaterialCommunityIcons name="account-switch" size={40} color="#FFF" />
          <Text style={styles.ConfirmaText}> 
              Confirma {carta}
          </Text>
        </TouchableOpacity>
        }

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