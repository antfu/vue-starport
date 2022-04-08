import { customAlphabet } from 'nanoid'

export const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 5)

export function kebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^\w\d_-]/g, '')
}
