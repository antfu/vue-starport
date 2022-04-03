import TheImage from '../components/TheImage.vue'
import { createStarport } from '../../../src'

const {
  carrier: TheImageCarrier,
  starcraft: TheImageCraft,
  proxy: TheImageProxy,
} = createStarport(TheImage)

export {
  TheImageCarrier,
  TheImageCraft,
  TheImageProxy,
}
