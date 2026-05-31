import { JSX } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles";


interface IProps {
    icon: string,
    title: string,
    subtitle?: string,
    right: JSX.Element,
}


export function ConfigRow({
  icon,
  title,
  subtitle,
  right,
}: IProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.icon}>
          {icon}
        </Text>

        <View>
          <Text style={styles.rowTitle}>
            {title}
          </Text>

          {subtitle && (
            <Text style={styles.rowSubtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {right}
    </View>
  );
}