export function vitoria(board) {

  return board.every((cell) => cell !== "");
}

export function createEmptyBoard(rows, cols) {
  return Array.from({ length: rows * cols }, () => "");
}

export function reiniciarJogo(rows, cols) {
  return createEmptyBoard(rows, cols);
}