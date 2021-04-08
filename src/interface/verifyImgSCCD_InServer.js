import LoadAPI from '../utils/LoadAPI'
import env from  '../utils/environment'

const url = env.API_CHECKIMG

const verifyImgSCCD_InServer = (par_List,token) => { 
    return new Promise( async function(resolve, reject) {

        let method   = 'POST'
        let endpoint = ''
        let server   = url
        let params = {
            list : par_List
        }
       try {
        
        retorno = await LoadAPI(method,endpoint,server,params,token)           
        
        resolve(retorno)

       } catch(err) {
           reject( {err: true, success: false, message: err} )
       }
     })
}

export default verifyImgSCCD_InServer