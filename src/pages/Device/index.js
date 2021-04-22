import React, { useState, useEffect, useRef  } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Image, Alert, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { getData, setData } from '../../utils/dataStorage';

import Trabalhando from '../../Components/Trabalhando'

const deviceHeight = Dimensions.get("window").height
const fotoHeight   = deviceHeight-100

export default function Device( props ) {
  const { navigation } = props 
  let params       = props.route.params 
  let isCartaFrete = params.dadosCarta   ? true : false
  let VarDadosFoto = params.dadosCarta   ? '@ListaFotos' : '@ListaFotosPlacas'

  const [hasPermission , setHasPermission] = useState(null);
  const [type          , setType]          = useState(Camera.Constants.Type.back);
  const [flash         , setFlash]         = useState(Camera.Constants.FlashMode.off);
  const [capturedPhoto , setCapturedPhoto] = useState(null);
  const [modalOpen     , setModalOpen]     = useState(false);
  const [fotoTipo      , setFotoTipo]      = useState(null);
  const [trabalhando   , setTrabalhando ]  = useState(false);
  const [pictureSize   , setPictureSize ]  = useState("1280x720")

  const camRef = useRef(null);

  useEffect(() => {  

    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      setHasPermission(status === 'granted');
    })();

    if(!isCartaFrete) {
      setFotoTipo('Placas')
    } else {
      setFotoTipo('CartaFrete')
    }

    setTrabalhando(false)
 
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // CAPTURA IMAGEM DA CÂMERA
  async function takePicture(){
    setTrabalhando(true)
    if(camRef){
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri)
      setModalOpen(true); 
      setTrabalhando(false)
      // console.log(data);
    } else {
      setTrabalhando(false)
    }
  }

  // SALVA IMAGEM CAPTURADA NA GALERIA DO CELULAR
  async function savePicture(){
    let listaFotos      = []
    let foto            = {id:0, dados:{}, imagem:{}}

    setTrabalhando(true)

    const stoListaFotos = await getData( VarDadosFoto )

    if(stoListaFotos.data){
       listaFotos.push(...stoListaFotos.data)
    }   
    
    //const asset = await MediaLibrary.saveToLibraryAsync(capturedPhoto)
    const asset = await MediaLibrary.createAssetAsync(capturedPhoto)
    .then((img)=>{     
      setTrabalhando(false)
      foto.id     = img.id
      foto.origem = fotoTipo     
      foto.dados  = (fotoTipo=='Placas') ? params.dadosVeiculo : params.dadosCarta
      foto.imagem = img
      foto.send   = {
        success: false,
        date: null,
        message: ''
      }    

      listaFotos.push(foto)

      setData( VarDadosFoto , listaFotos ).then((a)=>{
           setTrabalhando(false)
           Alert.alert('Salvo com sucesso !!!')
           navigation.goBack()
      }).catch(err=>{
        setTrabalhando(false)
        console.log(' problemas com - salvar foto')

        Alert.alert('ERRO:',err)
      })
    })
    .catch( err => {
      setTrabalhando(false)
      console.log('Err:',err)
    })

  }
  
  // VISUAL REACT
  return (
      <Camera style={styles.camera} pictureSize={pictureSize} type={type} flashMode={flash} ref={camRef}>
        <View style={styles.buttonContainer}>
        
        <TouchableOpacity
            style={styles.button}
            onPress={() => 
              setFlash(flash === Camera.Constants.FlashMode.on 
                ? Camera.Constants.FlashMode.off
                : Camera.Constants.FlashMode.on)}
            >
            <Feather
              name={ flash === Camera.Constants.FlashMode.on ? "zap" : "zap-off"}
              size={30}
              color="white"
            />
            <Text style={styles.text}>Flash</Text>
            
        </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <MaterialCommunityIcons name="swap-vertical-bold" size={30} color="white" />
            <Text style={styles.text}>Frente/Verso</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button}
            onPress={takePicture}
            >

                <FontAwesome
                  name="camera"
                  style={{ color: "#fff", fontSize: 40}}
                />
               <Text style={styles.text}>Foto</Text>
            
          </TouchableOpacity>

          { capturedPhoto &&

          <Modal
          animationType="slide"
          transparent={false}
          visible={modalOpen}
          >

            <View style={{flex:1,backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', margin:0}}>

                  <Image
                    style={{width:'100%', height: fotoHeight, borderRadius: 20}}
                    source={{ uri: capturedPhoto }}                  
                  />

                  <View style={{marginTop: 5, flexDirection: 'row'}}>

                        <TouchableOpacity 
                            style={styles.btnImagens}
                            onPress={()=> setModalOpen(false)}
                        >
                          <AntDesign name="delete" size={35} color="#FFF" />
                          <Text style={styles.submitText}>
                             Descartar
                          </Text>                        
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.btnImagens}
                            onPress={savePicture}
                        >
                          <Entypo name="save" size={35} color="#FFF" />
                          <Text style={styles.submitText}>
                             Salvar
                          </Text>                        
                        </TouchableOpacity>

                  </View>

            </View>
          </Modal>
          }

          <Modal
            animationType="fade"
            transparent={true}
            visible={trabalhando}
          >
            <Trabalhando /> 
          </Modal> 

        </View>
      </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    color: 'white',
  },
  btnImagens:{
    backgroundColor: '#35AAFF',
    flexDirection: 'row',
    width: '45%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    margin: 5,
  },
  submitText:{
    color: '#FFF',
    fontSize: 20,
    marginLeft: 5,
  },
});
