import { dinheiro } from '../dados'

// Mostra UM produto do cardápio. Tudo chega pelas "props".
function Produto({ produto, indice, aoAdicionar }) {
  return (
    // O atraso cresce com o índice: os cartões entram um depois do outro
    <article className="produto entrada-zoom" style={{ animationDelay: `${indice * 60}ms` }}>
      <div className="foto">
        <img src={produto.imagem} alt={produto.nome} />
      </div>
      <span className="etiqueta">{produto.categoria}</span>
      <h3>{produto.nome}</h3>
      <p>{produto.descricao}</p>
      <div className="preco-linha">
        <strong>{dinheiro(produto.preco)}</strong>
        <button className="botao pequeno" onClick={() => aoAdicionar(produto)}>
          Adicionar
        </button>
      </div>
    </article>
  )
}

export default Produto
