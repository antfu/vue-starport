import TheImage from '../components/TheImage.vue'
import { createStarport } from '../../../src'

const {
  container: TheImageContainer,
  proxy: TheImageProxy,
} = createStarport(TheImage)

export {
  TheImageContainer,
  TheImageProxy,
}
