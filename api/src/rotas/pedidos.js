import { Router } from 'express'
import { db } from '../firebase.js'
import { STATUS, idValido, validarPedido } from '../validacao.js'

const rotas = Router()

// "Porteiro" da cozinha: só deixa passar quem mandar a chave certa no cabeçalho x-chave
function exigirChave(req, res, next) {
  const chave = process.env.CHAVE_COZINHA
  if (!chave || req.get('x-chave') !== chave) {
    return res.status(401).json({ erro: 'Chave da cozinha inválida' })
  }
  next()
}

// POST /pedidos -> o cliente envia o pedido
rotas.post('/', async (req, res) => {
  const { erros, dados } = validarPedido(req.body)
  if (erros.length > 0) {
    return res.status(400).json({ erro: erros.join('; ') })
  }

  // Nunca confiamos no preço que veio do navegador: buscamos o preço REAL no banco
  const docs = await Promise.all(
    dados.itens.map((item) => db.collection('produtos').doc(item.id).get()),
  )

  const itens = []
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i]
    if (!doc.exists || !doc.data().disponivel) {
      return res.status(400).json({ erro: `Produto indisponível: ${dados.itens[i].id}` })
    }
    const produto = doc.data()
    itens.push({ produtoId: doc.id, nome: produto.nome, preco: produto.preco, qtd: dados.itens[i].qtd })
  }

  // Arredondamos para 2 casas para evitar números como 37.800000000000004
  const total = Math.round(itens.reduce((soma, item) => soma + item.preco * item.qtd, 0) * 100) / 100

  const pedido = {
    nome: dados.nome,
    mesa: dados.mesa,
    itens,
    total,
    status: 'recebido',
    senha: Math.floor(Math.random() * 900) + 100,
    criadoEm: new Date().toISOString(),
  }

  const ref = await db.collection('pedidos').add(pedido)
  res.status(201).json({ id: ref.id, ...pedido })
})

// GET /pedidos -> a cozinha vê os pedidos (do mais novo para o mais antigo)
// GET /pedidos?status=pronto -> só os pedidos com esse status
rotas.get('/', exigirChave, async (req, res) => {
  const { status } = req.query
  const resultado = await db.collection('pedidos').orderBy('criadoEm', 'desc').limit(50).get()
  let lista = resultado.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

  // Filtramos aqui para não precisar de índice composto no Firestore
  if (status) {
    lista = lista.filter((pedido) => pedido.status === status)
  }

  res.json(lista)
})

// GET /pedidos/:id -> o cliente acompanha o próprio pedido (só mostra o básico)
rotas.get('/:id', async (req, res) => {
    const { id } = req.params
    if (!idValido(id)) {
        return res.status(400).json({ erro: 'id inválido' })
    }
    const doc = await db.collection('pedidos').doc(id).get()
    if (!doc.exists) {
        return res.status(404).json({ erro: 'Pedido não encontrado' })
    }
    const { senha, status, total } = doc.data()
    res.json({ id: doc.id, senha, status, total })
})

// PATCH /pedidos/:id/status -> a cozinha muda o andamento do pedido
rotas.patch('/:id/status', exigirChave, async (req, res) => {
    const { id } = req.params
    const status = req.body?.status
    if (!idValido(id)) {
        return res.status(400).json({ erro: 'id inválido' })
    }
    if (!STATUS.includes(status)) {
        return res.status(400).json({ erro: `status deve ser: ${STATUS.join(', ')}` })
    }
    const ref = db.collection('pedidos').doc(id)
    const doc = await ref.get()
    if (!doc.exists) {
        return res.status(404).json({ erro: 'Pedido não encontrado' })
    }
    await ref.update({ status })
    res.json({ id, status })
})
// DELETE /pedidos/:id -> a cozinha apaga um pedido
rotas.delete('/:id', exigirChave, async (req, res) => {
    const { id } = req.params
    if (!idValido(id)) {
        return res.status(400).json({ erro: 'id inválido' })
    }
    const ref = db.collection('pedidos').doc(id)
    const doc = await ref.get()
    if (!doc.exists) {
        return res.status(404).json({ erro: 'Pedido não encontrado' })
    }
    await ref.delete()
    res.json({ ok: true })
})

export default rotas
