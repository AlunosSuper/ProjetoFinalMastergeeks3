import { db } from './firebase.js'

// Pequeno teste: grava um documento, lê de volta e apaga
const ref = await db.collection('teste').add({
mensagem: 'Olá, Firestore!',
hora: new Date().toISOString(),
})

console.log('Gravei o documento com id:', ref.id)

const lido = await ref.get()
console.log('Li de volta:', lido.data())

await ref.delete()
console.log('Apaguei o documento. A conexão com o Firebase está funcionando!')