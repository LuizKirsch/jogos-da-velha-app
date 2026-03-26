import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TelaVitoriaProps {
  acertos: { 1: number; 2: number };
  onReiniciar: () => void;
  tempoVencedor: number;
  jogadasVencedor: number;
  vencedor: number | null;
}

export function TelaVitoria({
  acertos,
  onReiniciar,
  tempoVencedor,
  jogadasVencedor,
  vencedor,
}: TelaVitoriaProps) {
  let mensagemVencedor = "Empate!";
  if (acertos[1] > acertos[2]) mensagemVencedor = "Jogador 1 Venceu!";
  else if (acertos[2] > acertos[1]) mensagemVencedor = "Jogador 2 Venceu!";

  const formatarTempo = (ms: number) => {
    const segundos = Math.floor(ms / 1000);
    const decimos = Math.floor((ms % 1000) / 100);
    return `${segundos}.${decimos}s`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Fim de Jogo!</Text>
      <Text style={styles.vencedor}>{mensagemVencedor}</Text>

      {vencedor && (
        <View style={styles.caixa}>
          <Text style={styles.texto}>
            Tempo: {formatarTempo(tempoVencedor)}
          </Text>
          <Text style={styles.texto}>Jogadas: {jogadasVencedor}</Text>
          <Text style={styles.texto}>Acertos: {acertos[vencedor as keyof typeof acertos]}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.botao} onPress={onReiniciar}>
        <Text style={styles.botaoTexto}>Jogar Novamente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  vencedor: {
    fontSize: 24,
    color: "#4CAF50",
    marginBottom: 30,
    fontWeight: "600",
  },
  caixa: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
    elevation: 3,
  },
  texto: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 5,
  },
  botao: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
