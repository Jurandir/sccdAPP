import axios from 'axios'

const dadosTeste = {
    id: 9999,
    cartaFrete: "SPO-55841",
    codigo: "55841",
    date: "2021-01-13 00:00:00",
    motorista: "CARLOS ANDRE ANDRADE DA SILVA",
    placas: "IAN6638 IAO8068",
    observacao: "Ggyuyyy",
    operacao: "DESCARGA",
    tipoVeiculo: "COMPLEMANTAR",
    tipoDocumento: "SCCD",
}

async function SendForm() {

    const token    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbnBqIjoiMDAwMDAwMDAwMDAwMDAiLCJub21lIjoiSnVyYW5kaXIgQnJpdG8gRmVycmVpcmEgSnVuaW9yIiwibWF0cmljdWxhIjoiNTgxNCIsIm1haWwiOiJqdXJhbmRpci5qdW5pb3JAdGVybWFjby5jb20uYnIiLCJncnVwb3MiOlsiQVRJIiwiQVRJLVRlY25pY29zIiwiQ0FSR0FTX0xFR0FETyIsIkNBUkdBU19NQVJJVElNTyIsIkNBUkdBU19URVNURSIsIkNBUkdBU19URVNURV9NQVIiLCJGR19JTlRFUk5FVExJQkVSQURBIiwiR1JQX1RTIiwiSU5UUkFORVRfRVhURVJOTyIsIk1BVFJJWiIsIlFMS19QT05URVMiLCJUT1RWU19SRU1PVE8iLCJ0YWJsZWF1Il0sImlhdCI6MTYxMDk4ODgxNywiZXhwIjoxNjExMDc1MjE3fQ.QYF4hA7Dd1Ixz67BWEO4uy0N193iQWgz0GPwfKDHUmc"
    const method   = 'POST'
    const api      = 'http://192.168.1.138:5000/file/upload'
    const file     = "file:///storage/emulated/0/DCIM/0d1a07de-c516-4349-a28d-e8d48e938731.jpg"
    const filename = "d8870052-def2-48bd-83a3-70f5d9aca4cd.jpg"
    const formData = new FormData()

    formData.append('data', JSON.stringify(dadosTeste))

    formData.append('file', {
            uri: file,
            type: 'image/jpeg', 
            name: filename,
        })

    
    // console.log(formData)

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
            console.log("response :", response);
    })
    .catch(function (error) {
            console.log("error from image :",error);
    })
}    

export default SendForm