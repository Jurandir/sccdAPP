import axios from 'axios'
import env from  '../utils/environment'

const url = env.API_UPLOAD

const SendForm = function ( data, imagem, token ) {
    return new Promise( function(resolve, reject) {
        const method   = 'POST'
        const formData = new FormData()
        const api      = url
        const file     = imagem.file
        const filename = imagem.filename

        formData.append('data', JSON.stringify(data))

        formData.append('file', {
                uri: file,
                type: 'image/jpeg', 
                name: filename,
        })
    
        axios({
        url    : api,
        method : method,
        data   : formData,
        headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer "${token}"`
            }
        })
        .then(function (response) {
                resolve( {success: true, message: 'Success. OK.', id: data.id } )
        })
        .catch(function (err) {
                rejeita( {success: false, message: err, id: data.id} )
        })
    })    
}

export default SendForm
