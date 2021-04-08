const API_SERVER      = '192.168.1.138' // '192.168.0.45' //'192.168.0.153' //'192.168.0.31'  // ''
const API_PORTA       = '5000'
const API_SERV_UPLOAD = '192.168.1.138' // '192.168.0.45' // '192.168.0.153' 
const API_PORT_UPLOAD = '5000' 

const environment = {
    API_AD:               `http://${API_SERVER}:${API_PORTA}/api/loginad`,
    API_CARTAFRETE:       `http://${API_SERVER}:${API_PORTA}/api/cartafrete`,
    API_CARTAFRETEPLACAS: `http://${API_SERVER}:${API_PORTA}/api/cartafreteplacas`,
    API_PLACASVEICULO:    `http://${API_SERVER}:${API_PORTA}/api/placasveiculo`,
    API_UPLOAD:           `http://${API_SERV_UPLOAD}:${API_PORT_UPLOAD}/file/upload`,
    API_CHECKIMG:         `http://${API_SERVER}:${API_PORTA}/api/checkimgsccd`,
    API_DADOSAPP:         `http://${API_SERVER}:${API_PORTA}/api/receiveDataDebugAPP`,
}

export default environment