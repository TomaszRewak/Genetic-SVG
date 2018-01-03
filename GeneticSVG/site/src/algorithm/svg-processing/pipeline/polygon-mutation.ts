import { GA, Images } from '../_imports'
import Specimen from '../specimen'

type S = Specimen<Images.Svg.Shapes.Polygon>;

class PolygonMutation implements GA.IPipelineStep<S> {
	public constructor(
		private annealing: number,
		private ga: GA.IGeneticAlgorithm<S>,
		private next: GA.IPipelineStep<S>
	)
	{ }

	getNext(): S {
		let specimen = this.next.getNext();

		let polygon = specimen.shape;
		let length = polygon.length;
		let annealing = this.annealing;
		let newPolygon = new Images.Svg.Shapes.Polygon(length);

		for (let i = 0; i < length; i++) {
			let point = newPolygon.getPoint(i);

			let x0 = polygon.getPoint(i - 1).x,
				x1 = polygon.getPoint(i).x,
				x2 = polygon.getPoint(i + 1).x;

			let y0 = polygon.getPoint(i - 1).y,
				y1 = polygon.getPoint(i).y,
				y2 = polygon.getPoint(i + 1).y;

			point.x = Math.min(1.5, Math.max(-0.5, x1 + Math.max(Math.abs(x0 - x1), Math.abs(x1 - x2)) * annealing * (Math.random() - 0.5)));
			point.y = Math.min(1.5, Math.max(-0.5,  y1 + Math.max(Math.abs(y0 - y1), Math.abs(y1 - y2)) * annealing * (Math.random() - 0.5)));
		}

		return new Specimen<Images.Svg.Shapes.Polygon>(newPolygon);
	}
}

export default class PolygonMutationGenerator implements GA.IPipelineGenerator<Specimen<Images.Svg.Shapes.Polygon>> {
	constructor(private annealing: number) {
	}

	generate(ga: GA.IGeneticAlgorithm<S>, next: GA.IPipelineStep<S>): GA.IPipelineStep<S> {
		return new PolygonMutation(this.annealing, ga, next);
	}
}