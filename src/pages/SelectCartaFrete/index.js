import React, {useState, useEffect} from 'react';
import {  View,  TouchableOpacity, Modal,
          Text,  StyleSheet, Alert 
                   } from 'react-native';                  
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { getData, setData } from '../../utils/dataStorage';
import Trabalhando from '../../Components/Trabalhando';
import ModeloCarta from "../../models/CartaFrete";


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
    let sel_placas     = sel_cartaFrete.placas
    let sto_carta      = await getData('@ListaFotos')
    
   
    if(!sto_carta.success){
      sto_carta = {}
      sto_carta.data = []
    }

    let var_carta      = sto_carta.data
    let sto_placa      = await getData('@ListaFotosPlacas')

    if(!sto_placa.success){
      sto_carta = {}
      sto_carta.data = []
    }

    let var_placa      = sto_placa.data
    let len_carta1     = var_carta.length
    let len_placa1     = var_placa.length
    let new_carta      = []
    let new_placa      = []

    //console.log('=================================================================================')

    //console.log('Antes de processar:  carta:',len_carta1,' placa:',len_placa1)
    //for await(let i of var_carta ) { console.log('var_CARTA:',i.id) }
    //for await(let i of var_placa ) { console.log('var_placa:',i.id) }

    async function add_nova_carta(item) {
      return await ModeloCarta(item,sel_cartaFrete)
    }

    new_carta.push(...var_carta)

    //console.log('Push:')
    //for await(let i of new_carta ) { console.log('new_CARTA:',i.id) }

    //console.log('Processando:')

    for await ( let i of var_placa ){ 
      let it_placa = i.dados.placas
      let param = i

      if(sel_placas.includes(it_placa)) {
        let x = await add_nova_carta(param)
        //console.log('Processando (NEW CARTA):',param.id,x.id)
        new_carta.push(x)
      } else {
        //console.log('Processando (NEW placa):',param.id)
        new_placa.push(param)
      }
    }

    //console.log('=== (X):',xx.length)
    //for await(let i of xx ) { console.log('xx:',i.id) }

    let len_carta2     = new_carta.length
    let len_placa2     = new_placa.length

    //console.log('Antes gravar:  carta:',len_carta1,' placa:',len_placa1)
    //for await(let i of new_carta ) { console.log('new_CARTA:',i.id) }
    //for await(let i of new_placa ) { console.log('new_placa:',i.id) }

    
    let erro    = null
    let success = false
    await setData('@ListaFotos',new_carta).then((r1)=>{
      success = r1.success
    }).catch(err => erro = err)

    if(success){
      await setData('@ListaFotosPlacas',new_placa).then((r2)=>{
        success = r2.success
      }).catch(err => erro = err)
    }

    //console.log('Depois de gravar: carta:',len_carta2,' placa:',len_placa2)
    sto_carta = await getData('@ListaFotos')
    var_carta = sto_carta.data
    sto_placa = await getData('@ListaFotosPlacas')
    var_placa = sto_placa.data

    //for await(let i of var_carta ) { console.log('var_CARTA:',i.id) }
    //for await(let i of var_placa ) { console.log('var_placa:',i.id) }

    if(success){
      setTrabalhando(false)
      Alert.alert(`Sucesso: CF: ${len_carta1} => ${len_carta2}, FP: ${len_placa1} => ${len_placa2}`)
      navigation.goBack()
    } else {
      console.log(`Problemas: (SelectCartaFrete) ${sel_placas} -> Sucesso: False`)
    }
    
    if(erro){
      console.log(`Erro: (SelectCartaFrete) ${sel_placas} -> ${erro}`)
      Alert.alert(`Erro: 
      ${erro}`)
    }

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
