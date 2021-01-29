import React from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';

export default class TelaMapa extends React.Component {
  render() {
    return (
      <View style={styles.container}>

        <MapView style={styles.mapStyle} 
         initialRegion={{
          latitude: -3.8082,
          longitude: -38.5052,
          latitudeDelta: 0.002,
          longitudeDelta: 0.01,
        }}>
          <Marker coordinate={{
            latitude: -3.8082,
            longitude: -38.5052,
            }}
            title="Minha Casa"
          />
        </MapView>  

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});