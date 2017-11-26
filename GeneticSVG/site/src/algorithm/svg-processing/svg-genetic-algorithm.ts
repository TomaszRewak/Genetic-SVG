import { GA, Images } from './_imports'
import Specimen from './specimen'
import { Evaluator, Layer } from './evaluation/_index'

export default class SvgGeneticAlgorithm<Shape extends Images.Svg.ISvgShape> extends GA.GeneticAlgorithm<Specimen<Shape>> {
	constructor(
		pipeline: GA.IPipelineGenerator<Specimen<Shape>>[],
		initialPopulation: GA.IPopulation<Specimen<Shape>>,
		private evaluator: Evaluator,
		private environment: GA.IGeneticAlgorithm<Specimen<Shape>>[]
	) {
		super(pipeline, initialPopulation);
	}

	public score(specimen: Specimen<Shape>): number {
		if (!specimen.scored) {
			let layer = this.layers[this.currentLayer];
			layer.shape = specimen.shape;
			layer.color = this.evaluator.getLayerColor(this.layers.map(l => l.shape), this.currentLayer);

			specimen.score = this.evaluator.evaluate(this.layers);
			specimen.scored = true;
		}

		return specimen.score;
	}

	private currentLayer: number;
	private layers: Layer[];

	public step(): void {
		let shapes = this.environment.map(e => e.best.shape);
		this.layers = shapes.map((v, i) => new Layer(v, this.evaluator.getLayerColor(shapes, i)));

		for (let i = 0; i < this.environment.length; i++)
			if (this.environment[i] == this)
				this.currentLayer = i;

		super.step();
	}
}