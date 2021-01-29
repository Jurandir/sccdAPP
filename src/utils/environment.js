const API_SERVER      = '192.168.1.138' //'192.168.0.31'  // ''
const API_PORTA       = '5000'
const API_SERV_UPLOAD = '192.168.1.138' 
const API_PORT_UPLOAD = '5000' 

const environment = {
    API_AD:         `http://${API_SERVER}:${API_PORTA}/api/loginad`,
    API_CARTAFRETE: `http://${API_SERVER}:${API_PORTA}/api/cartafrete`,
    API_UPLOAD:     `http://${API_SERV_UPLOAD}:${API_PORT_UPLOAD}/file/upload`
}

export default environment