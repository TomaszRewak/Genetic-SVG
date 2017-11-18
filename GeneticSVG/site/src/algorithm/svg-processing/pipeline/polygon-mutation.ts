import { GA, Images } from '../_imports'
import Specimen from '../specimen'

type S = Specimen<Images.Svg.Shapes.Polygon>;

class Mutation implements GA.IPipelineStep<S> {
	public constructor(
		private ga: GA.IGeneticAlgorithm<S>,
		private next: GA.IPipelineStep<S>
	)
	{ }

	getNext(): S {
		let specimen = this.next.getNext();

		let polygon = specimen.shape;
		let length = polygon.length;
		let newPolygon = new Images.Svg.Shapes.Polygon(length);

		for (let i = 0; i < length; i++) {
			let x0 = polygon.getX(i - 1),
				x1 = polygon.getX(i),
				x2 = polygon.getX(i + 1);

			newPolygon.setX(i, x0 + Math.max(Math.abs(x0 - x1), Math.abs(x1 - x2)) * 0.3 * (Math.random() - 0.5));

			let y0 = polygon.getY(i - 1),
				y1 = polygon.getY(i),
				y2 = polygon.getY(i + 1);

			newPolygon.setY(i, y0 + Math.max(Math.abs(y0 - y1), Math.abs(y1 - y2)) * 0.3 * (Math.random() - 0.5));
		}

		return new Specimen<Images.Svg.Shapes.Polygon>(newPolygon);
	}
}

export default class PolygonMutationGenerator implements GA.IPipelineGenerator<Specimen<Images.Svg.Shapes.Polygon>> {
	generate(ga: GA.IGeneticAlgorithm<S>, next: GA.IPipelineStep<S>): GA.IPipelineStep<S> {
		return new Mutation(ga, next);
	}
}