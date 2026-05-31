import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  content: {
    padding: 24,
    paddingBottom: 100,
  },

  logo: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },

  logoBlue: {
    color: "#1E7BE0",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },

  greeting: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#777",
    marginTop: 5,
  },

  avatar: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: "#7b78a0",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E7BE0",
  },

  avatarIcon: {
    color: "#fff",
    fontSize: 40,
  },

  mainCard: {
    backgroundColor: "#1E7BE0",
    borderRadius: 12,
    padding: 16,
    marginTop: 25,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
  },

  bigTime: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    marginVertical: 10,
  },

  progressBar: {
    height: 4,
    backgroundColor: "rgba(30,123,224,0.25)",
    borderRadius: 10,
  },

  progressFill: {
    width: "60%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  goal: {
    color: "#DCEBFF",
    marginTop: 10,
    fontSize: 12,
  },

  section: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 30,
    marginBottom: 15,
  },

  chartCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  chartTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "flex-start",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  statCard: {
    backgroundColor: "#1a1a2e",
    width: "31%",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  statTitle: {
    fontSize: 10,
    color: "#aaa",
  },

  statValue: {
    color: "#1E7BE0",
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 14,
  },

  resumeCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  resumeTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 15,
  },

  resumeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },

  resumeDay: {
    color: "#fff",
  },

  resumeValue: {
    color: "#1E7BE0",
    fontWeight: "bold",
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