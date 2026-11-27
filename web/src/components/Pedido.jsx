import { useState } from 'react'
import { mesas, dinheiro } from '../dados'
import { enviarPedido } from '../api'
import ItemPedido from './ItemPedido'
import StatusPedido from './StatusPedido'

function Pedido({ produtos, carrinho, aoMudar, aoRemover, aoEsvaziar, aoVoltar }) {
  const [nome, setNome] = useState('')
  const [mesa, setMesa] = useState(mesas[0])
  const [recibo, setRecibo] = useState(null) // fica preenchido depois de enviar o pedido
  const [enviando, setEnviando] = useState(false) // true enquanto o pedido está sendo enviado
  const [erro, setErro] = useState('') // guarda o erro caso o envio falhe

  // Junta cada item do carrinho (id + qtd) com os dados do produto que vieram da API.
  // Se algum produto saiu do cardápio, o filter tira ele da lista.
  const itens = carrinho
    .map((item) => ({ ...item, produto: produtos.find((p) => p.id === item.id) }))
    .filter((item) => item.produto)
  const total = itens.reduce((soma, item) => soma + item.produto.preco * item.qtd, 0)
  const quantidade = itens.reduce((soma, item) => soma + item.qtd, 0)

  async function enviar(evento) {
    evento.preventDefault()
    if (nome.trim() === '' || enviando) return
    setEnviando(true)
    setErro('')
    try {
      // Mandamos só id e qtd: o servidor descobre os preços sozinho
      const pedido = await enviarPedido({
        nome: nome.trim(),
        mesa,
        itens: itens.map((item) => ({ id: item.id, qtd: item.qtd })),
      })
      setRecibo(pedido)
      aoEsvaziar()
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }

  if (recibo) {
    return (
      <section className="painel final entrada-zoom">
        <img className="selo" src="/images/pedido-feito.svg" alt="" />
        <h2>Pedido enviado, {recibo.nome}!</h2>
        <p className="senha">
          Senha <strong>{recibo.senha}</strong>
        </p>
        <StatusPedido id={recibo.id} />
        <p>
          {recibo.itens.reduce((soma, item) => soma + item.qtd, 0)} item(ns) · mesa {recibo.mesa} · total {dinheiro(recibo.total)}
        </p>
        <button className="botao grande" onClick={aoVoltar}>
          Fazer outro pedido
        </button>
      </section>
    )
  }

  if (itens.length === 0) {
    return (
      <section className="painel entrada-fade">
        <h2>Seu pedido está vazio</h2>
        <p>Escolha algo gostoso no cardápio.</p>
        <button className="botao grande" onClick={aoVoltar}>
          Ver cardápio
        </button>
      </section>
    )
  }

  return (
    <section>
      <h2 className="titulo-pagina">Seu pedido</h2>

      <div className="lista-pedido">
        {itens.map((item) => (
          <ItemPedido key={item.id} item={item} aoMudar={aoMudar} aoRemover={aoRemover} />
        ))}
      </div>

      <div className="total">
        <span>Total ({quantidade} itens)</span>
        <strong>{dinheiro(total)}</strong>
      </div>

      <form className="painel" onSubmit={enviar}>
        <label htmlFor="nome">Seu nome</label>
        <input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite seu nome"
          maxLength={20}
        />

        <label htmlFor="mesa">Mesa</label>
        <select id="mesa" value={mesa} onChange={(e) => setMesa(Number(e.target.value))}>
          {mesas.map((m) => (
            <option key={m} value={m}>
              Mesa {m}
            </option>
          ))}
        </select>

        {erro && <p className="erro-form">{erro}</p>}

        <div className="acoes">
          <button type="button" className="botao perigo" onClick={aoEsvaziar}>
            Limpar pedido
          </button>
          <button type="submit" className="botao grande" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar pedido'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default Pedido
