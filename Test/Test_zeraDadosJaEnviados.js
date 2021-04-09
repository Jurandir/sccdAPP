const fileDEBUG = require('./1419742c1c5b7d7e847318b9b883d99ee93ae6f2.json')

let ListaFotos = fileDEBUG.ListaFotos
let nameDevice = 'TESTE'

async function testa(dados) {
  let IDs = []
  let newListaFotos = []
  let stoListaFotos = dados
  let listaFotos = stoListaFotos.data

  for await ( let i of listaFotos) {   
    if(i.send.success) {
        IDs.push( i.id )
    } else {
        newListaFotos.push( i )
    }
  }
  
  console.log(nameDevice,' , IDs:',IDs.length,' de ',listaFotos.length)

}

testa(ListaFotos)
