import { StyleSheet } from "react-native";

export const forgor = StyleSheet.create({
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
    marginTop: 10,
    marginBottom: 40,
  },

  description: {
    color: "#aaa",
    textAlign: "left",
    marginBottom: 30,
    lineHeight: 18,
  },

  inputGroup: {
    marginBottom: 30,
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

  button: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
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
});