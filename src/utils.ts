import { customAlphabet } from 'nanoid/non-secure'

export const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 5)

export function kebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^\w\d_-]/g, '')
}

export function isDevelopment() {
  return process.env.NODE_ENV === 'development'
}

export function isProduction() {
  return process.env.NODE_ENV === 'production'
}
