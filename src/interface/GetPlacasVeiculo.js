import LoadAPI from '../utils/LoadAPI'
import env from  '../utils/environment'

const url = env.API_PLACASVEICULO

const GetPlacasVeiculo = (placas,token) => { 
    return new Promise( async function(resolve, reject) {

        let method   = 'POST'
        let endpoint = ''
        let server   = url
        let params = {
            placas: placas,
        }
       try {
        
        retorno = await LoadAPI(method,endpoint,server,params,token)           
        
        resolve(retorno)

       } catch(err) {
           reject( {err: true, success: false, message: err} )
       }
     })
}

export default GetPlacasVeiculo