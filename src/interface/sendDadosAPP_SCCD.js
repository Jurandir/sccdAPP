import LoadAPI from '../utils/LoadAPI'
import env from  '../utils/environment'
import { getData, setData } from '../utils/dataStorage';

const url = env.API_DADOSAPP

const sendDadosAPP_SCCD = () => { 
    return new Promise( async function(resolve, reject) {

        try {
            let token
            let CartaFrete       = await getData('@CartaFrete')
            let Credencial       = await getData('@Credencial')
            let DadosFrete       = await getData('@DadosFrete')
            let DadosVeiculo     = await getData('@DadosVeiculo')
            let User             = await getData('@User')
            let ListaFotos       = await getData('@ListaFotos')
            let ListaFotosPlacas = await getData('@ListaFotosPlacas')
            let Placas           = await getData('@Placas')

            let method   = 'POST'
            let endpoint = ''
            let server   = url
            
            let params = {
                CartaFrete:       CartaFrete,
                Credencial:       Credencial,      
                DadosFrete:       DadosFrete,      
                DadosVeiculo:     DadosVeiculo,    
                User:             User,            
                ListaFotos:       ListaFotos,      
                ListaFotosPlacas: ListaFotosPlacas,
                Placas:           Placas,                  
            }
            
            retorno = await LoadAPI(method,endpoint,server,params,token)                      
            resolve(retorno)

       } catch(err) {
           reject( {err: true, success: false, message: err} )
       }
     })
}

export default sendDadosAPP_SCCD