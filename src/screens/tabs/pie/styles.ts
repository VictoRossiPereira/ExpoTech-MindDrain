import { StyleSheet } from 'react-native';

export const estilos = StyleSheet.create({
  backg: {
    backgroundColor: 'black',
    flex: 1,
  },
  textoI: {
    color: 'white',
    fontSize: 15,
  },
    textoB:{
    color: 'black',
    fontSize: 15,
    marginLeft: 15
  },
    textoP:{
    color: 'black',
    fontSize: 15,
  },
  logo: {
  color: "#fff",
  fontSize: 32,
  fontWeight: "bold",
  textAlign: "center",
  marginTop: 40,
  marginBottom: 30,
},

logoBlue: {
  color: "#1DA1F2",
},

sectionTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#fff",
  marginBottom: 15,
},

containerI: {
  backgroundColor: "#1a1a2e",
  marginHorizontal: 16,
  borderRadius: 12,
  padding: 15,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.1)",
},

socialRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 12,
},

rowBorder: {
  borderBottomWidth: 1,
  borderBottomColor: "rgba(255,255,255,0.1)",
},

socialLeft: {
  flexDirection: "row",
  alignItems: "center",
},

iconCircle: {
  width: 28,
  height: 28,
  borderRadius: 14,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 10,
},

iconText: {
  color: "#fff",
  fontWeight: "bold",
},

socialName: {
  fontSize: 16,
  fontWeight: "500",
  color: "#fff",
},

socialTime: {
  fontWeight: "bold",
  color: "#1DA1F2",
},

containerP: {
  backgroundColor: "#1a1a2e",
  marginHorizontal: 16,
  borderRadius: 12,
  padding: 15,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.1)",
},

chartWrapper: {
  alignItems: "center",
  marginVertical: 15,
},

legendContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: 10,
},

legendItem: {
  flexDirection: "row",
  alignItems: "center",
  marginHorizontal: 6,
  marginVertical: 4,
},

legendColor: {
  width: 12,
  height: 12,
  marginRight: 4,
},

legendText: {
  fontSize: 11,
  color: "#fff",
},
insight: {
  backgroundColor: "#2F6FD6",
  marginHorizontal: 16,
  borderRadius: 12,
  padding: 18,
  marginBottom: 20,
},

insightTitle: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 18,
  marginBottom: 10,
},

insightText: {
  color: "#fff",
  marginBottom: 6,
  lineHeight: 18,
},

bottomNav: {
  position: "absolute",
  bottom: 0,
  width: "100%",
  height: 70,
  backgroundColor: "#1A1A1A",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
},

navIcon: {
  color: "#fff",
  fontSize: 24,
  fontWeight: "bold",
},
});