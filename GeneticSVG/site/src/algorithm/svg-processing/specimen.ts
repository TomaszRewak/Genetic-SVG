import { GA, Images } from './_imports'
import * as I from './_interfaces'

export default class Specimen<Shape extends Images.Svg.ISvgShape> implements I.ISvgSpecimen<Shape> {
	public constructor(
		public readonly shape: Shape,
	) { }

	public score: number;
	public scored: boolean = false;
}