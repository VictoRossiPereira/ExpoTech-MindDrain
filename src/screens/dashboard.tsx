import { estilos } from '@/assets/Styles';
import { Text, View } from 'react-native';
const usuario = 1 //placeholder
export const Board = () => {
    return(
        <View style={estilos.backg}>
            <Text style={estilos.textoI}> Ola {usuario}</Text>
            <View style={estilos.insight}></View>
            <Text style={estilos.textoI}> Relatório semanal </Text>
            <View style={estilos.containerI}></View>
        </View>
    )
}