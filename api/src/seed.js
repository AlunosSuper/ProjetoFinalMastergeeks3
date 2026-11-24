import { db } from './firebase.js'

// Os produtos que vão para o banco. "ordem" define a posição no cardápio.
const produtos = [
{
id: '1',
ordem: 1,
categoria: 'Lanches',
imagem: '/images/hamburguer.svg',
nome: 'Hambúrguer Pixel',
descricao: 'Pão macio, carne, queijo e salada.',
preco: 18.9,
disponivel: true,
},
{
id: '2',
ordem: 2,
categoria: 'Lanches',
imagem: '/images/cachorro.svg',
nome: 'Cachorro-quente',
descricao: 'Salsicha, molho e mostarda no pão.',
preco: 12.5,
disponivel: true,
},
{
id: '3',
ordem: 3,
categoria: 'Lanches',
imagem: '/images/pizza.svg',
nome: 'Fatia de pizza',
descricao: 'Queijo derretido com calabresa.',
preco: 9,
disponivel: true,
},
{
id: '4',
ordem: 4,
categoria: 'Lanches',
imagem: '/images/batata.svg',
nome: 'Batata frita',
descricao: 'Porção crocante para dividir.',
preco: 11,
disponivel: true,
},
{
id: '5',
ordem: 5,
categoria: 'Bebidas',
imagem: '/images/suco.svg',
nome: 'Suco de laranja',
descricao: 'Feito na hora, sem açúcar.',
preco: 7.5,
disponivel: true,
},
{
id: '6',
ordem: 6,
categoria: 'Bebidas',
imagem: '/images/refrigerante.svg',
nome: 'Refrigerante',
descricao: 'Lata gelada de 350 ml.',
preco: 6,
disponivel: true,
},
{
id: '7',
ordem: 7,
categoria: 'Bebidas',
imagem: '/images/milkshake.svg',
nome: 'Milk-shake de morango',
descricao: 'Cremoso, com chantilly e cereja.',
preco: 14,
disponivel: true,
},
{
id: '8',
ordem: 8,
categoria: 'Bebidas',
imagem: '/images/limonada.svg',
nome: 'Limonada com gelo',
descricao: 'Limão, gelo e folhas de hortelã.',
preco: 6.5,
disponivel: true,
},
{
id: '9',
ordem: 9,
categoria: 'Sobremesas',
imagem: '/images/sorvete.svg',
nome: 'Sorvete na casquinha',
descricao: 'Duas bolas: chocolate e morango.',
preco: 8,
disponivel: true,
},
{
id: '10',
ordem: 10,
categoria: 'Sobremesas',
imagem: '/images/bolo.svg',
nome: 'Fatia de bolo',
descricao: 'Bolo de chocolate com morango.',
preco: 9.5,
disponivel: true,
},
{
id: '11',
ordem: 11,
categoria: 'Sobremesas',
imagem: '/images/donut.svg',
nome: 'Donut colorido',
descricao: 'Cobertura rosa e confeitos.',
preco: 6.5,
disponivel: true,
},
{
id: '12',
ordem: 12,
categoria: 'Sobremesas',
imagem: '/images/cupcake.svg',
nome: 'Cupcake',
descricao: 'Cobertura cremosa e cereja.',
preco: 7,
disponivel: true,
},
{
id: '13',
ordem: 13,
categoria: 'Lanches',
imagem: '/images/xsalada.svg',
nome: 'X-Salada Especial',
descricao: 'Hambúrguer artesanal, queijo, alface, tomate e molho da casa.',
preco: 21.9,
disponivel: true,
},
]

// Um "lote" (batch) grava tudo de uma vez: ou grava os 12, ou não grava nenhum
const lote = db.batch()

for (const { id, ...dados } of produtos) {
  // O id do produto vira o id do documento no Firestore
  lote.set(db.collection('produtos').doc(id), dados)
}

await lote.commit()
console.log(`${produtos.length} produtos gravados no Firestore!`)