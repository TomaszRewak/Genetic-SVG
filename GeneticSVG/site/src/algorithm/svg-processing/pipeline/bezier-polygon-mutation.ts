import { GA, Images } from '../_imports'
import Specimen from '../specimen'

type S = Specimen<Images.Svg.Shapes.BezierPolygon>;

class BezierPolygonMutation implements GA.IPipelineStep<S> {
	public constructor(
		private annealing: number,
		private ga: GA.IGeneticAlgorithm<S>,
		private next: GA.IPipelineStep<S>
	) { }

	getNext(): S {
		let specimen = this.next.getNext();

		let polygon = specimen.shape;
		let length = polygon.length;
		let annealing = this.annealing;
		let newPolygon = new Images.Svg.Shapes.BezierPolygon(length);

		for (let i = 0; i < length; i++) {
			let point = newPolygon.getPoint(i);

			let x0 = polygon.getPoint(i - 1).x,
				x1 = polygon.getPoint(i).x,
				x2 = polygon.getPoint(i + 1).x;

			let y0 = polygon.getPoint(i - 1).y,
				y1 = polygon.getPoint(i).y,
				y2 = polygon.getPoint(i + 1).y;

			point.x = Math.min(1.5, Math.max(-0.5, x1 + Math.max(Math.abs(x0 - x1), Math.abs(x1 - x2)) * annealing * (Math.random() - 0.5)));
			point.y = Math.min(1.5, Math.max(-0.5, y1 + Math.max(Math.abs(y0 - y1), Math.abs(y1 - y2)) * annealing * (Math.random() - 0.5)));

			let len1 = polygon.getPoint(i).len1,
				len2 = polygon.getPoint(i).len2;

			let d1 = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2)),
				d2 = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

			point.len1 = Math.min(d1 * 5, Math.max(0, len1 + d1 * annealing * (Math.random() - 0.5)));
			point.len2 = Math.min(d2 * 5, Math.max(0, len2 + d2 * annealing * (Math.random() - 0.5)));

			let angle = polygon.getPoint(i).angle;

			point.angle = angle + 0.5 * Math.PI * annealing * (Math.random() - 0.5);
		}

		return new Specimen<Images.Svg.Shapes.BezierPolygon>(newPolygon);
	}
}

export default class BezierPolygonMutationGenerator implements GA.IPipelineGenerator<Specimen<Images.Svg.Shapes.BezierPolygon>> {
	constructor(private annealing: number) {
	}

	generate(ga: GA.IGeneticAlgorithm<S>, next: GA.IPipelineStep<S>): GA.IPipelineStep<S> {
		return new BezierPolygonMutation(this.annealing, ga, next);
	}
}