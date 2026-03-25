import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
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

  const [jogadorAtual, setJogadorAtual] = useState<1 | 2>(1);
  const [jogadas, setJogadas] = useState<Record<number, number>>({
    1: 0,
    2: 0,
  });
  
  const [acertos, setAcertos] = useState<Record<number, number>>({
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
    setAcertos({ 1: 0, 2: 0 });
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
      
      // Regista o acerto para o jogador atual
      setAcertos((prev) => ({
        ...prev,
        [jogadorAtual]: prev[jogadorAtual] + 1,
      }));
      
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

  const jogoFinalizado = combinadas.length === LINHAS * COLUNAS && combinadas.length > 0;

  if (jogoFinalizado) {
    let mensagemVencedor = "Empate!";
    if (acertos[1] > acertos[2]) mensagemVencedor = "Jogador 1 Venceu!";
    else if (acertos[2] > acertos[1]) mensagemVencedor = "Jogador 2 Venceu!";

    return (
      <View style={estilos.telaVitoria}>
        <Text style={estilos.tituloVitoria}>Fim de Jogo!</Text>
        <Text style={estilos.textoVencedor}>{mensagemVencedor}</Text>
        
        <View style={estilos.caixaAcertos}>
          <Text style={estilos.textoAcertos}>Acertos do Jogador 1: {acertos[1]}</Text>
          <Text style={estilos.textoAcertos}>Acertos do Jogador 2: {acertos[2]}</Text>
        </View>

        <TouchableOpacity style={estilos.botaoReiniciarVitoria} onPress={aoReiniciar}>
          <Text style={estilos.textoBotaoReiniciar}>Jogar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
  // Estilos adicionados para o Ecrã de Vitória
  telaVitoria: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  tituloVitoria: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  textoVencedor: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 30,
  },
  caixaAcertos: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 40,
    width: '80%',
  },
  textoAcertos: {
    fontSize: 18,
    color: '#555',
    marginVertical: 5,
    textAlign: 'center',
  },
  botaoReiniciarVitoria: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#2196F3",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  textoBotaoReiniciar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default function TabIndex() {
  return <GradeJogoMemoria />;
}
