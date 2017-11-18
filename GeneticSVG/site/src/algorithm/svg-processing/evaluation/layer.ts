import { Images } from '../_imports'

export default class Layer {
	public constructor(
		public shape: Images.Svg.ISvgShape,
		public color: string
	) { }
}