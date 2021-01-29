import { post, get } from 'axios'

async function LoadAPI(method, endpoint, server, params, token ) {
    let config

    if(token) {
        config = { headers: { Authorization: `Bearer ${token}`   } }    
    } else {
        config = { headers: { "Content-Type": 'application/json' } }
    }        

    let url = server + endpoint

    try {
        if (method == 'POST') {
            ret = await post(url, params, config)
        } else {
            ret = await get(url, { params }, config)
        }
        dados                = ret.data

        dados.isErr          = false
        dados.isAxiosError   = false
        return dados

    } catch (err) {
        dados = { success: false, message: 'ERRO', url: url, err, Err: true, isAxiosError: true }
        if (err.message) {
            dados.message  = err.message
        }
        return dados
    }
}

export default LoadAPI
