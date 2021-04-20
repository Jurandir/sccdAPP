const fileDEBUG = require('./0e395623f39c8a38699461b1eb19529298c765c6.json')

let ListaFotos = fileDEBUG.ListaFotos
let nameDevice = 'TESTE'

async function testa(dados) {

        if(!dados.data){
          dados.data=[]
        }
        
        let qtde_fotos    = dados.data.length || 0 
        let qtde_enviados  = 0
  
        for await (let item of dados.data) {
  
          if(!(item.send===undefined)) {

            if(item.send.success) {
              qtde_enviados++
          } else {

            console.log('ERRO: (Seletor) item.send.success :',item.id, nameDevice)
          }} else {
            console.log('(undefined) ITEM:',item)
          }
        }
        console.log('qtde_fotos:',qtde_fotos)
        console.log('qtde_enviados:',qtde_enviados)
}

testa(ListaFotos)
