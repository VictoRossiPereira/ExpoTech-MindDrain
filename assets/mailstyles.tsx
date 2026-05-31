import { StyleSheet } from "react-native";

export const emailstyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 60,
    justifyContent: "space-between",
  },

  /* HEADER */

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  backArrow: {
    color: "#fff",
    fontSize: 34,
    marginRight: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  /* CONTENT */

  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
  },

  inputGroup: {
    marginBottom: 50,
  },

  label: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 18,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#777",
  },

  input: {
    flex: 1,
    color: "#fff",
    fontSize: 20,
    paddingVertical: 10,
  },

  icon: {
    color: "#fff",
    fontSize: 22,
    marginLeft: 10,
  },

  /* BUTTON */

  saveButton: {
    marginHorizontal: 28,
    marginBottom: 50,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#00A2FF",
    fontSize: 28,
    fontWeight: "bold",
  },
});