// Endereço da API (vem do arquivo .env do front)
const URL_API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

// Função base: faz a requisição, lê a resposta e transforma problemas em erros com mensagem clara
async function pedir(caminho, opcoes = {}) {
  let resposta
  try {
    resposta = await fetch(URL_API + caminho, {
      ...opcoes,
      headers: { 'Content-Type': 'application/json', ...opcoes.headers },
    })
  } catch {
    // fetch só falha assim quando não consegue nem falar com o servidor
    throw new Error('Não consegui falar com o servidor. Ele está ligado?')
  }

  const dados = await resposta.json().catch(() => ({}))
  if (!resposta.ok) {
    const erro = new Error(dados.erro || 'Algo deu errado. Tente de novo.')
    erro.status = resposta.status
    throw erro
  }
  return dados
}

// ----- Funções que o resto do front vai usar -----
export function buscarProdutos() {
  return pedir('/produtos')
}

export function enviarPedido(pedido) {
  return pedir('/pedidos', { method: 'POST', body: JSON.stringify(pedido) })
}

export function buscarStatus(id) {
  return pedir(`/pedidos/${id}`)
}

// As três abaixo são da cozinha e levam a chave no cabeçalho x-chave
export function buscarPedidos(chave) {
  return pedir('/pedidos', { headers: { 'x-chave': chave } })
}

export function mudarStatus(id, status, chave) {
  return pedir(`/pedidos/${id}/status`, {
    method: 'PATCH',
    headers: { 'x-chave': chave },
    body: JSON.stringify({ status }),
  })
}

export function excluirPedido(id, chave) {
  return pedir(`/pedidos/${id}`, { method: 'DELETE', headers: { 'x-chave': chave } })
}
