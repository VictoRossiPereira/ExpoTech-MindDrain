import { StyleSheet } from "react-native";

export const estiloCadastro = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 24,
    justifyContent: "center",
  },

  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },

  logoBlue: {
    color: "#1DA1F2",
  },

  subtitle: {
    color: "#aaa",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 10,
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    color: "#ccc",
    marginBottom: 6,
    fontSize: 13,
  },

  required: {
    color: "red",
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    color: "#fff",
    paddingVertical: 6,
  },

  section: {
    color: "#ccc",
    marginTop: 10,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  dropdown: {
    backgroundColor: "#222",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  dropdownText: {
    color: "#ccc",
  },

  pill: {
    backgroundColor: "#222",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  pillActive: {
    backgroundColor: "#1DA1F2",
  },

  pillText: {
    color: "#ccc",
  },

  pillTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },

  button: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#1DA1F2",
    fontWeight: "bold",
    fontSize: 16,
  },

  footer: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 15,
    fontSize: 12,
  },
  dateButton: {
  backgroundColor: "#222",
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 10,
  marginBottom: 20,
},

dateText: {
  color: "#ccc",
},
});