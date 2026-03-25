import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { JogadorTurno } from "../../components/jogador-turno";
import { reiniciarJogo } from "../../scripts/Vitoria";

function gerarParesEmbaralhados(qtdPares: number) {
  const ids = Array.from(
    { length: qtdPares },
    () => Math.floor(Math.random() * 1000) + 1,
  );

  const urls = ids.map((id) => `https://picsum.photos/seed/${id}/400/400`);
  const pares = [...urls, ...urls];

  return pares.sort(() => Math.random() - 0.5);
}

const LINHAS = 2;
const COLUNAS = 2;

function GradeJogoMemoria() {
  const { width } = useWindowDimensions();

  const margemHorizontal = 40;
  const margemCelula = 4 * 2 * COLUNAS;
  const tamanhoCelula = (width - margemHorizontal - margemCelula) / COLUNAS;

  const qtdPares = (LINHAS * COLUNAS) / 2;

  const cartas = useMemo(() => gerarParesEmbaralhados(qtdPares), []);

  const [viradas, setViradas] = useState<number[]>([]);
  const [combinadas, setCombinadas] = useState<number[]>([]);
  const [bloqueado, setBloqueado] = useState(false);

  const [jogadorAtual, setJogadorAtual] = useState(1);
  const [jogadas, setJogadas] = useState<Record<number, number>>({
    1: 0,
    2: 0,
  });

  const [inicioTurno, setInicioTurno] = useState(Date.now());
  const [temposTurno, setTemposTurno] = useState<
    { jogador: number; tempo: number }[]
  >([]);

  function aoPressionarCarta(indice: number) {
    if (bloqueado || viradas.includes(indice) || combinadas.includes(indice))
      return;

    setViradas((prev) => [...prev, indice]);
  }

  function aoReiniciar() {
    reiniciarJogo();

    setViradas([]);
    setCombinadas([]);
    setBloqueado(false);
    setJogadorAtual(1);
    setJogadas({ 1: 0, 2: 0 });
    setTemposTurno([]);
    setInicioTurno(Date.now());
  }

  useEffect(() => {
    if (viradas.length !== 2) return;

    setBloqueado(true);

    const [primeira, segunda] = viradas;

    const fim = Date.now();
    const duracao = fim - inicioTurno;

    setTemposTurno((prev) => [
      ...prev,
      { jogador: jogadorAtual, tempo: duracao },
    ]);

    setJogadas((prev) => ({
      ...prev,
      [jogadorAtual]: prev[jogadorAtual] + 1,
    }));

    if (cartas[primeira] === cartas[segunda]) {
      setCombinadas((prev) => [...prev, primeira, segunda]);
      setViradas([]);
      setBloqueado(false);
      setInicioTurno(Date.now());
    } else {
      const timer = setTimeout(() => {
        setViradas([]);
        setBloqueado(false);
        setJogadorAtual((prev) => (prev === 1 ? 2 : 1));
        setInicioTurno(Date.now());
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [viradas, cartas, jogadorAtual, inicioTurno]);

  return (
    <View style={estilos.container}>
      <View style={estilos.info}>
        <JogadorTurno currentPlayer={jogadorAtual} moves={jogadas} />
      </View>

      <View style={estilos.grade}>
        {Array.from({ length: LINHAS }).map((_, linhaIdx) => (
          <View key={linhaIdx} style={estilos.linha}>
            {Array.from({ length: COLUNAS }).map((_, colunaIdx) => {
              const indice = linhaIdx * COLUNAS + colunaIdx;
              const estaVirada =
                viradas.includes(indice) || combinadas.includes(indice);

              return (
                <TouchableOpacity
                  key={colunaIdx}
                  style={[
                    estilos.celula,
                    { width: tamanhoCelula, height: tamanhoCelula },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => aoPressionarCarta(indice)}
                >
                  {estaVirada ? (
                    <Image
                      source={{ uri: cartas[indice] }}
                      style={estilos.imagem}
                    />
                  ) : (
                    <View style={estilos.oculta} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <Button title="Reiniciar" onPress={aoReiniciar} />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  grade: {
    margin: 20,
  },
  linha: {
    flexDirection: "row",
  },
  celula: {
    margin: 4,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  oculta: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#bdbdbd",
    borderRadius: 6,
  },
  imagem: {
    width: "80%",
    height: "80%",
    borderRadius: 6,
  },
  info: {
    padding: 10,
  },
});

export default function TabIndex() {
  return <GradeJogoMemoria />;
}
