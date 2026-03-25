import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  currentPlayer: 1 | 2;
  moves: {
    1: number;
    2: number;
  };
};

export function JogadorTurno({ currentPlayer, moves }: Props) {
  const getPlayerStyle = (id: 1 | 2) => [
    styles.playerBox,
    currentPlayer === id && styles.activePlayer,
  ];

  const getTextStyle = (id: 1 | 2) => [
    styles.name,
    currentPlayer === id && styles.activeText,
  ];

  return (
    <View style={styles.container}>
      {/* Jogador 1 */}
      <View style={getPlayerStyle(1)}>
        <Text style={getTextStyle(1)}>Jogador 1</Text>
        <Text style={[styles.moves, currentPlayer === 1 && styles.activeText]}>
          {moves[1]} {moves[1] === 1 ? "jogada" : "jogadas"}
        </Text>
      </View>

      <View style={styles.vsCircle}>
        <Text style={styles.vsText}>VS</Text>
      </View>

      {/* Jogador 2 */}
      <View style={getPlayerStyle(2)}>
        <Text style={getTextStyle(2)}>Jogador 2</Text>
        <Text style={[styles.moves, currentPlayer === 2 && styles.activeText]}>
          {moves[2]} {moves[2] === 1 ? "jogada" : "jogadas"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
    paddingHorizontal: 16,
  },

  playerBox: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    marginHorizontal: 8,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  activePlayer: {
    backgroundColor: "#4CAF50",
    borderColor: "#2E7D32",
    elevation: 10,
    shadowColor: "#4CAF50",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    transform: [{ scale: 1.05 }],
  },

  name: {
    fontWeight: "700",
    fontSize: 17,
    color: "#444",
  },

  moves: {
    marginTop: 6,
    fontSize: 13,
    color: "#777",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  vsCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    marginHorizontal: -10,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  vsText: {
    fontWeight: "bold",
    fontSize: 11,
    color: "#999",
  },
});
