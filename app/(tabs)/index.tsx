import { StyleSheet, Text, View, useWindowDimensions, Button } from "react-native";
import { vitoria, reiniciarJogo } from "..scripts\Vitoria.js";

const NUM_ROWS = 6;
const NUM_COLS = 4;

function Grid4x6() {
  const { width } = useWindowDimensions();
  const horizontalMargin = 40;
  const cellMargin = 4 * 2 * NUM_COLS;
  const cellSize = (width - horizontalMargin - cellMargin) / NUM_COLS;

  return (
    <View style={styles.grid}>
      {Array.from({ length: NUM_ROWS }).map((_, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {Array.from({ length: NUM_COLS }).map((_, colIdx) => (
            <View
              key={colIdx}
              style={[styles.cell, { width: cellSize, height: cellSize }]}
            >
              <Text style={styles.cellText}>
                {rowIdx * NUM_COLS + colIdx + 1}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
    <View style={}>
      <button title = "Reiniciar" onPress={handlePress}/>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    margin: 20,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    margin: 4,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    flexShrink: 1,
  },
  cellText: {
    fontSize: 16,
    color: "#333",
  },
});

export default function TabIndex() {
  return <Grid4x6 />;
}
