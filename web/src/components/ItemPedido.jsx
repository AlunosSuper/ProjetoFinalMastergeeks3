import { dinheiro } from '../dados'

// Uma linha do pedido: foto, nome, quantidade (− e +), subtotal e botão Excluir
function ItemPedido({ item, aoMudar, aoRemover }) {
  const { produto, qtd } = item

  return (
    <article className="item-pedido entrada-fade">
      <img src={produto.imagem} alt="" />
      <div className="item-info">
        <h3>{produto.nome}</h3>
        <span>{dinheiro(produto.preco)} cada</span>
      </div>
      <div className="qtd">
        <button onClick={() => aoMudar(produto.id, -1)} aria-label="Tirar um">
          −
        </button>
        <span>{qtd}</span>
        <button onClick={() => aoMudar(produto.id, 1)} aria-label="Colocar mais um">
          +
        </button>
      </div>
      <strong className="subtotal">{dinheiro(produto.preco * qtd)}</strong>
      <button className="botao pequeno perigo" onClick={() => aoRemover(produto.id)}>
        Excluir
      </button>
    </article>
  )
}

export default ItemPedido
