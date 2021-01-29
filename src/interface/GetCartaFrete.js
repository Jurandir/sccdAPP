import LoadAPI from '../utils/LoadAPI'
import env from  '../utils/environment'

const url = env.API_CARTAFRETE

const GetCartaFrete = (empresa,codigo,token) => { 
    return new Promise( async function(resolve, reject) {

        let method   = 'POST'
        let endpoint = ''
        let server   = url
        let params = {
            empresa: empresa,
            codigo: codigo,
        }
       try {
        
        retorno = await LoadAPI(method,endpoint,server,params,token)           
        
        resolve(retorno)

       } catch(err) {
           reject( {err: true, success: false, message: err} )
       }
     })
}

export default GetCartaFrete