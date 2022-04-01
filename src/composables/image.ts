import TheImage from '../components/TheImage.vue'
import { createFloating } from './floating'

const {
  container: TheImageContainer,
  proxy: TheImageProxy,
} = createFloating(TheImage)

export {
  TheImageContainer,
  TheImageProxy,
}
