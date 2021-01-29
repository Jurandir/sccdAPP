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
        const jsonValue = await AsyncStorage.getItem(chave)

        let ret = jsonValue != null ? JSON.parse(jsonValue) : null

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
