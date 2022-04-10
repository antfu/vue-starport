import { customAlphabet } from 'nanoid/non-secure'

export const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 5)

export function kebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^\w\d_-]/g, '')
}

export function getComponentName(component: any) {
  return component.name || component.__file?.split(/[\/\\.]/).slice(-2)[0] || ''
}
