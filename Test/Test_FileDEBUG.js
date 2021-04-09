const fileDEBUG = require('./1419742c1c5b7d7e847318b9b883d99ee93ae6f2.json')

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
