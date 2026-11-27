import { STATUS, ROTULOS, dinheiro } from '../dados'

// Um pedido na tela da cozinha
function CartaoPedido({ pedido, aoAvancar, aoExcluir }) {
  // O próximo status é o que vem depois do atual na lista STATUS (ou undefined se for o último)
  const proximo = STATUS[STATUS.indexOf(pedido.status) + 1]
  const hora = new Date(pedido.criadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <article className="cartao-pedido entrada-zoom">
      <header>
        <strong className="senha-mini">#{pedido.senha}</strong>
        <span>
          {pedido.nome} · mesa {pedido.mesa} · {hora}
        </span>
        <span className={`status status-${pedido.status}`}>{ROTULOS[pedido.status]}</span>
      </header>

      <ul>
        {pedido.itens.map((item, i) => (
          <li key={i}>
            {item.qtd}× {item.nome}
          </li>
        ))}
      </ul>

      <footer>
        <strong>{dinheiro(pedido.total)}</strong>
        {proximo && (
          <button className="botao pequeno" onClick={() => aoAvancar(pedido)}>
            Marcar como {proximo}
          </button>
        )}
        <button className="botao pequeno perigo" onClick={() => aoExcluir(pedido.id)}>
          Excluir
        </button>
      </footer>
    </article>
  )
}

export default CartaoPedido
