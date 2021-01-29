import LoadAPI from '../utils/LoadAPI'
import env from  '../utils/environment'

const url = env.API_AD

const CheckAD = (cliente,usuario,senha) => { 
    return new Promise( async function(resolve, reject) {

        let method   = 'POST'
        let endpoint = ''
        let server   = url
        let params = {
            cnpj: cliente,
            usuario: usuario,
            senha: senha
        }
       try {
           retorno = await LoadAPI(method,endpoint,server,params)           
           resolve(retorno)
       } catch(err) {
           reject( {err: true, success: false, message: err} )
       }
     })
}

export default CheckAD