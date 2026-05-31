import { StyleSheet } from "react-native";

export const loginestilos = StyleSheet.create({
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

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  checkbox: {
    color: "#ccc",
    fontSize: 12,
  },

  link: {
    color: "#1DA1F2",
    fontSize: 12,
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
    marginTop: 20,
    fontSize: 12,
  },

  google: {
    marginTop: 30,
    alignItems: "center",
  },

  googleText: {
    color: "#fff",
  },
});