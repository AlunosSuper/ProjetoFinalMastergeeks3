import { useEffect, useState } from 'react'
import { ROTULOS } from '../dados'
import { buscarStatus } from '../api'

// Mostra o andamento do pedido e confere com o servidor a cada 5 segundos
function StatusPedido({ id }) {
  const [status, setStatus] = useState('recebido')

  useEffect(() => {
    async function atualizar() {
      try {
        const dados = await buscarStatus(id)
        setStatus(dados.status)
      } catch {
        // Se falhar, não faz nada: tentamos de novo daqui a 5 segundos
      }
    }

    const relogio = setInterval(atualizar, 5000)

    // Quando o componente sair da tela, desligamos o relógio
    return () => clearInterval(relogio)
  }, [id])

  return <p className={`status status-${status}`}>{ROTULOS[status]}</p>
}

export default StatusPedido