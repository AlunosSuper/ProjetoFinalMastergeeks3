// Categorias do cardápio (os produtos agora vêm da API!)
export const categorias = ['Lanches', 'Bebidas', 'Sobremesas']

// Mesas disponíveis para o cliente escolher
export const mesas = [1, 2, 3, 4, 5, 6, 7, 8]

// Transforma 18.9 em "R$ 18,90"
export function dinheiro(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}