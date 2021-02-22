import AsyncStorage from '@react-native-async-storage/async-storage'; 

export async function setData( chave, value ) {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(chave, jsonValue)
        return { success : true }
      } catch (e) {
        return { success : false, err: e }
      }
}

export async function getData( chave ) {
    try {
        let jsonValue = await AsyncStorage.getItem(chave)

        if(jsonValue===undefined){
          jsonValue = []
        }

        let ret = jsonValue != null ? JSON.parse(jsonValue) : []

        return  { success : true, data : ret  }
      } catch(e) {
        return { success : false, err: e }
      }
}

export async function delData( chave ) {
    try {
        await AsyncStorage.removeItem(chave)
        return { success : true }
      } catch(e) {
        return { success : false, err: e }
      }
}

export async function getAllKeys() {
    let keys = []
    try {
      keys = await AsyncStorage.getAllKeys()
      return { success : true, array: keys }
    } catch(e) {
      return { success : false, err: e }
    }
}
