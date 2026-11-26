// Valores aceitos
export const MESAS = [1, 2, 3, 4, 5, 6, 7, 8]
export const STATUS = ['recebido', 'preparando', 'pronto', 'entregue']

// Um id do Firestore não pode ter "/" nem ficar vazio. Aceitamos só letras, números, _ e -
export function idValido(id) {
    return typeof id === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(id)
}


// Confere o corpo do pedido. Devolve a lista de erros e os dados já "limpos".
export function validarPedido(corpo) {
  const erros = []

  const nome = typeof corpo?.nome === 'string' ? corpo.nome.trim() : ''
  if (nome.length < 1 || nome.length > 20) {
    erros.push('nome deve ter de 1 a 20 letras')
  }

  const mesa = Number(corpo?.mesa)
  if (!MESAS.includes(mesa)) {
    erros.push('mesa deve ser um número de 1 a 8')
  }

  const itens = corpo?.itens
  if (!Array.isArray(itens) || itens.length === 0 || itens.length > 30) {
    erros.push('itens deve ser uma lista com 1 a 30 produtos')
  } else {
    for (const item of itens) {
      const idOk = idValido(item?.id)
      const qtdOk = Number.isInteger(item?.qtd) && item.qtd >= 1 && item.qtd <= 20
      if (!idOk || !qtdOk) {
        erros.push('cada item precisa de id (texto) e qtd (número inteiro de 1 a 20)')
        break
      }
    }
  }

  return { erros, dados: { nome, mesa, itens } }
}
