import express from 'express'
import produtos from './rotas/produtos.js'
import pedidos from './rotas/pedidos.js'
import cors from 'cors'

const app = express()
const PORTA = process.env.PORT || 3001

//Só o nosso front-end pode chamar a API pelo navegador (CORS)
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))

//Entender JSON no corpo das requisições
app.use(express.json())

// Rota de teste para ver se a API está funcionando
app.get('/saude', (req, res) => {
	res.json({ ok: true, hora: new Date().toISOString() })
})

app.use('/produtos', produtos)
app.use('/pedidos', pedidos)

// Nenhuma rota combinou: 404
app.use((req, res) => {
	res.status(404).json({ erro: 'Rota não encontrada' })
})

// Qualquer erro inesperado cai aqui (precisa ter os 4 parâmetros: err, req, res, next)
app.use((err, req, res, next) => {
	if (err.type === 'entity.parse.failed') {
		return res.status(400).json({ erro: 'O corpo da requisição não é um JSON válido' })
	}
	console.error(err)
	res.status(500).json({ erro: 'Erro interno do servidor' })
})

app.listen(PORTA, () => {
	console.log(`API rodando em http://localhost:${PORTA}`)
})

