import { useState } from 'react'
import { categorias } from '../dados'
import Produto from './Produto'

function Cardapio({ produtos, aoAdicionar }) {
  const [filtro, setFiltro] = useState('Todos')

  // Mostra tudo, ou só os produtos da categoria escolhida
  const visiveis = filtro === 'Todos' ? produtos : produtos.filter((p) => p.categoria === filtro)

  return (
    <section>
      <div className="filtros">
        {['Todos', ...categorias].map((categoria) => (
          <button
            key={categoria}
            className={`chip ${filtro === categoria ? 'ativo' : ''}`}
            onClick={() => setFiltro(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      <div className="grade">
        {visiveis.map((produto, i) => (
          // key com a categoria: ao trocar o filtro, os cartões "nascem" de novo e a animação toca
          <Produto key={filtro + produto.id} produto={produto} indice={i} aoAdicionar={aoAdicionar} />
        ))}
      </div>
    </section>
  )
}

export default Cardapio