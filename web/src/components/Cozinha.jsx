import { useEffect, useState } from 'react'
import { STATUS } from '../dados'
import { buscarPedidos, mudarStatus, excluirPedido } from '../api'
import CartaoPedido from './CartaoPedido'

function Cozinha() {
  const [chaveDigitada, setChaveDigitada] = useState('')
  const [chave, setChave] = useState('') // a chave que já usamos para falar com a API
  const [pedidos, setPedidos] = useState([])
  const [filtro, setFiltro] = useState('Todos')
  const [erro, setErro] = useState('')

  // Enquanto houver chave, busca os pedidos agora e repete a cada 5 segundos
  useEffect(() => {
    if (!chave) return

    async function atualizar() {
      try {
        setPedidos(await buscarPedidos(chave))
        setErro('')
      } catch (e) {
        setErro(e.message)
        if (e.status === 401) setChave('') // chave errada: volta para a tela de entrada
      }
    }

    atualizar()
    const relogio = setInterval(atualizar, 5000)
    return () => clearInterval(relogio)
  }, [chave])

  function entrar(evento) {
    evento.preventDefault()
    setChave(chaveDigitada.trim())
  }

  async function avancar(pedido) {
    const proximo = STATUS[STATUS.indexOf(pedido.status) + 1]
    try {
      await mudarStatus(pedido.id, proximo, chave)
      // Só depois de o servidor aceitar é que atualizamos a tela
      setPedidos((atuais) => atuais.map((p) => (p.id === pedido.id ? { ...p, status: proximo } : p)))
    } catch (e) {
      setErro(e.message)
    }
  }

  async function excluir(id) {
    try {
      await excluirPedido(id, chave)
      setPedidos((atuais) => atuais.filter((p) => p.id !== id))
    } catch (e) {
      setErro(e.message)
    }
  }

  // Sem chave: mostra só a tela de entrada
  if (!chave) {
    return (
      <form className="painel entrada-fade" onSubmit={entrar}>
        <h2>Área da cozinha</h2>
        <label htmlFor="chave">Chave da cozinha</label>
        <input
          id="chave"
          type="password"
          value={chaveDigitada}
          onChange={(e) => setChaveDigitada(e.target.value)}
          placeholder="Digite a chave"
        />
        {erro && <p className="erro-form">{erro}</p>}
        <div className="acoes">
          <button type="submit" className="botao grande">
            Entrar
          </button>
        </div>
      </form>
    )
  }

  const visiveis = filtro === 'Todos' ? pedidos : pedidos.filter((p) => p.status === filtro)

  return (
    <section>
      <h2 className="titulo-pagina">Pedidos da cozinha</h2>

      <div className="filtros">
        {['Todos', ...STATUS].map((status) => (
          <button
            key={status}
            className={`chip ${filtro === status ? 'ativo' : ''}`}
            onClick={() => setFiltro(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {erro && <p className="erro-form">{erro}</p>}

      <div className="lista-cozinha">
        {visiveis.map((pedido) => (
          <CartaoPedido key={pedido.id} pedido={pedido} aoAvancar={avancar} aoExcluir={excluir} />
        ))}
        {visiveis.length === 0 && <p className="vazio">Nenhum pedido por aqui.</p>}
      </div>
    </section>
  )
}

export default Cozinha
