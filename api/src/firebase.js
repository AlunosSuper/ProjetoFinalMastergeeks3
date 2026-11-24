import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// A chave é lida do arquivo indicado em GOOGLE_APPLICATION_CREDENTIALS (no .env)
initializeApp({ credential: applicationDefault() })

// "db" é a porta de entrada para o Firestore
export const db = getFirestore()