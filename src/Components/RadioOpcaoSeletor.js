import * as React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';

const RadioOpcaoSeletor = ({onPress}) => {
  const [checked, setChecked] = React.useState('CartaFrete');

  function SetOpcao (valor) {
    setChecked(valor)
    onPress(valor)
  }
    
  return (
    <View style={styles.radios}>
      <RadioButton
        value="CartaFrete"
        uncheckedColor='#fff'
        status={ checked === 'CartaFrete' ? 'checked' : 'unchecked' }
        onPress={() => SetOpcao('CartaFrete')}
      />
      <Text onPress={() => SetOpcao('CartaFrete')} style={styles.texto}>Carta Frete</Text>
      <RadioButton
        value="Placas"
        uncheckedColor='#fff'
        status={ checked === 'Placas' ? 'checked' : 'unchecked' }
        onPress={() => SetOpcao('Placas')}
      />
      <Text onPress={() => SetOpcao('Placas')} style={styles.texto}>Placas do veículo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    radios:{
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      margin: 3,
    },
    texto:{
        color:'#fff',
        fontSize: 16,
        marginRight: 15,
    }
  });
  
export default RadioOpcaoSeletor;