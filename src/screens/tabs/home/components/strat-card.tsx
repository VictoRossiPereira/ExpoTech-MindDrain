import { Text, View } from "react-native";
import { styles } from "../styles";


export function StatCard({ title, value }: {
    title: string,
    value: string
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}