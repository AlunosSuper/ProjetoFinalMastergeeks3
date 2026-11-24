import express from 'express'
import produtos from './rotas/produtos.js'

const app = express()
const PORTA = process.env.PORT || 3001

// Rota de teste para ver se a API está funcionando
app.get('/saude', (req, res) => {
	res.json({ ok: true, hora: new Date().toISOString() })
})

app.use('/produtos', produtos)

app.listen(PORTA, () => {
	console.log(`API rodando em http://localhost:${PORTA}`)
})