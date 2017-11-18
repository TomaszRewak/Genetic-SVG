import { Images, GA } from './_imports'

export interface ISvgSpecimen<Shape extends Images.Svg.ISvgShape> extends GA.ISpecimen {
	readonly shape: Shape;
}