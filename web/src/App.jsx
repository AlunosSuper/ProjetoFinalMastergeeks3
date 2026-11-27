import { useEffect, useState } from 'react'
import Cardapio from './components/Cardapio'
import Pedido from './components/Pedido'
import { buscarProdutos } from './api'

function App() {
  const [pagina, setPagina] = useState('cardapio') // 'cardapio' ou 'pedido'

  // Os produtos agora vêm da API (e não mais do dados.js)
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroProdutos, setErroProdutos] = useState('')

  // O carrinho é uma lista de { id, qtd }. Começa com o que estiver salvo no navegador.
  const [carrinho, setCarrinho] = useState(() => {
    const salvo = localStorage.getItem('carrinho-pixel')
    return salvo ? JSON.parse(salvo) : []
  })
  const [aviso, setAviso] = useState(null) // { id, texto } ou null

  async function carregarProdutos() {
    setCarregando(true)
    setErroProdutos('')
    try {
      setProdutos(await buscarProdutos())
    } catch (erro) {
      setErroProdutos(erro.message)
    } finally {
      setCarregando(false)
    }
  }

  // Busca os produtos uma única vez, quando a página abre
  useEffect(() => {
    carregarProdutos()
  }, [])

  // Sempre que o carrinho mudar, salva no navegador
  useEffect(() => {
    localStorage.setItem('carrinho-pixel', JSON.stringify(carrinho))
  }, [carrinho])

  // Quando os produtos chegarem, pré-carrega as imagens para a troca não "piscar"
  useEffect(() => {
    produtos.forEach((p) => {
      const img = new Image()
      img.src = p.imagem
    })
  }, [produtos])

  function mostrarAviso(texto) {
    const novo = { id: Date.now(), texto }
    setAviso(novo)
    // Some depois de 2 segundos, mas só se ainda for o MESMO aviso
    setTimeout(() => setAviso((atual) => (atual && atual.id === novo.id ? null : atual)), 2000)
  }

  function adicionar(produto) {
    const existe = carrinho.find((item) => item.id === produto.id)
    if (existe) {
      setCarrinho(carrinho.map((item) => (item.id === produto.id ? { ...item, qtd: item.qtd + 1 } : item)))
    } else {
      setCarrinho([...carrinho, { id: produto.id, qtd: 1 }])
    }
    mostrarAviso(`${produto.nome} adicionado!`)
  }

  function mudarQuantidade(id, mudanca) {
    setCarrinho(
      carrinho
        .map((item) => (item.id === id ? { ...item, qtd: item.qtd + mudanca } : item))
        .filter((item) => item.qtd > 0),
    )
  }

  function remover(id) {
    setCarrinho(carrinho.filter((item) => item.id !== id))
  }

  function esvaziar() {
    setCarrinho([])
  }

  const totalItens = carrinho.reduce((soma, item) => soma + item.qtd, 0)

  // Escolhe o que aparece na tela: "carregando", erro, ou a página normal
  function conteudo() {
    if (carregando) {
      return (
        <section className="painel entrada-fade">
          <h2>Carregando o cardápio...</h2>
        </section>
      )
    }

    if (erroProdutos) {
      return (
        <section className="painel entrada-fade">
          <h2>Ops! Não consegui carregar o cardápio</h2>
          <p className="erro-form">{erroProdutos}</p>
          <button className="botao grande" onClick={carregarProdutos}>
            Tentar de novo
          </button>
        </section>
      )
    }

    if (pagina === 'cardapio') {
      return <Cardapio produtos={produtos} aoAdicionar={adicionar} />
    }

    return (
      <Pedido
        produtos={produtos}
        carrinho={carrinho}
        aoMudar={mudarQuantidade}
        aoRemover={remover}
        aoEsvaziar={esvaziar}
        aoVoltar={() => setPagina('cardapio')}
      />
    )
  }

  return (
    <div className="app">
      <header className="topo">
        <img className="logo" src="/images/hamburguer.svg" alt="" />
        <div>
          <h1>Lanchonete Pixel</h1>
          <p>Escolha, monte seu pedido e peça sem sair da mesa</p>
        </div>
      </header>

      <nav className="abas">
        <button
          className={`aba ${pagina === 'cardapio' ? 'ativa' : ''}`}
          onClick={() => setPagina('cardapio')}
        >
          Cardápio
        </button>
        <button className={`aba ${pagina === 'pedido' ? 'ativa' : ''}`} onClick={() => setPagina('pedido')}>
          Meu pedido
          {totalItens > 0 && <span className="contador-aba">{totalItens}</span>}
        </button>
      </nav>

      <main>{conteudo()}</main>

      {/* key = id do aviso: cada aviso novo é um elemento novo e a animação toca de novo */}
      {aviso && (
        <div key={aviso.id} className="aviso">
          {aviso.texto}
        </div>
      )}
    </div>
  )
}

export default App
