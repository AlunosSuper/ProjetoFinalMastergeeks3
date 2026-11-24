import { Router } from 'express'
import { db } from '../firebase.js'
import { idValido } from '../validacao.js'

const rotas = Router()

// GET /produtos -> todos os produtos disponíveis
// GET /produtos?categoria=Bebidas -> só os de uma categoria
rotas.get('/', async (req, res) => {
const { categoria } = req.query

let consulta = db.collection('produtos').where('disponivel', '==', true)

if (typeof categoria === 'string' && categoria !== '') {
  consulta = consulta.where('categoria', '==', categoria)
}

const resultado = await consulta.get()
const lista = resultado.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

// Ordenamos aqui no código para não precisar criar um "índice" no Firestore
lista.sort((a, b) => a.ordem - b.ordem)

res.json(lista)
})

//rota GET /categorias -> lista de categorias disponíveis
rotas.get('/categorias', async (req, res) => {
  const resultado = await db.collection('produtos').get()
  const categorias = new Set()
  resultado.docs.forEach((doc) => {
    categorias.add(doc.data().categoria)
  })
  res.json(Array.from(categorias))
})

// GET /produtos/3 -> um produto só
rotas.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!idValido(id)) {
    return res.status(400).json({ erro: "id inválido" });
  }

  const doc = await db.collection("produtos").doc(id).get();
  if (!doc.exists) {
    return res.status(404).json({ erro: "Produto não encontrado" });
  }

  res.json({ id: doc.id, ...doc.data() });
});



export default rotas