import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 60,
  },

  header: {
    color: "#f0eeff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    color: "#7b78a0",
    marginBottom: 10,
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: "#12142a",
    marginBottom: 25,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(126, 117, 255, 0.18)",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    fontSize: 28,
    marginRight: 15,
  },

  rowTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#f0eeff",
  },

  rowSubtitle: {
    fontSize: 12,
    color: "#9d9bbf",
    marginTop: 2,
  },

  rightText: {
    fontSize: 16,
    color: "#f0eeff",
  },

  arrow: {
    fontSize: 34,
    color: "#7b78a0",
  },

  logoutButton: {
    marginHorizontal: 30,
    marginTop: 30,
    borderWidth: 1,
    borderColor: "rgba(126, 117, 255, 0.4)",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },

  logoutText: {
    color: "#7b78a0",
    fontWeight: "bold",
    fontSize: 22,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#12142a",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(126, 117, 255, 0.25)",
  },

  modalTitle: {
    color: "#f0eeff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  modalLabel: {
    color: "#f0eeff",
    marginBottom: 8,
    fontWeight: "600",
  },

  modalInput: {
    backgroundColor: "#0d0d14",
    color: "#f0eeff",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  saveButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#1E7BE0",
    backgroundColor: "rgba(30, 123, 224, 0.12)",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },

  saveButtonText: {
    color: "#1E7BE0",
    fontWeight: "bold",
    fontSize: 22,
  },
});