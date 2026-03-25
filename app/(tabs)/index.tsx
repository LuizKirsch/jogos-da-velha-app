
const Tabuleiro = () => {
  const linhas = 4;
  const colunas = 5;

  const tabuleiro = Array.from({ length: linhas }, () =>
    Array.from({ length: colunas }, () => '')
  );

  return (
    <div style={estilos.tabuleiro}>
      {tabuleiro.map((linha, i) => (
        <div key={i} style={estilos.linha}>
          {linha.map((celula, j) => (
            <div key={j} style={estilos.celula}>
              {celula}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const estilos = {
  tabuleiro: {
    display: 'grid',
    gridTemplateRows: 'repeat(4, 50px)',
    gridTemplateColumns: 'repeat(5, 50px)',
    gap: '5px',
  },
  linha: {
    display: 'flex',
  },
  celula: {
    width: '50px',
    height: '50px',
    backgroundColor: '#ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
};

export default Tabuleiro;