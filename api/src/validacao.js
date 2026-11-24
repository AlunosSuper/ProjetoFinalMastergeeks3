// Um id do Firestore não pode ter "/" nem ficar vazio. Aceitamos só letras, números, _ e -
export function idValido(id) {
    return typeof id === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(id)
}