import * as GA from './genetic-algorithm/_index'
import * as Image from './images/_index'
import * as Svg from './svg-processing/_index'

type Specimen = Svg.Specimen<Image.Svg.Shapes.Polygon>;

export default abstract class GeneticSvg {
	protected layers: GA.GeneticAlgorithm<Specimen>[];
	protected evaluator: Svg.Evaluator;
	protected image: ImageData;

	public constructor(
		image: Image.IImage
	) {		
		this.image = image.getImageData();
		this.evaluator = new Svg.Evaluator(this.image);
	}

	protected abstract getPipeline(layer: number): GA.IPipelineGenerator<Specimen>[];
	protected abstract generatePopulation(layer: number): GA.Population<Specimen>;

	protected initialize(layers: number): void {
		this.layers = [];

		for (let i = 0; i < layers; i++) {
			let pipeline = this.getPipeline(i);
			let population = this.generatePopulation(i);

			let ga = new Svg.SvgGeneticAlgorithm<Image.Svg.Shapes.Polygon>(pipeline, population, this.evaluator, this.layers);

			this.layers.push(ga);
		}
	}

	public *step(): Generator {
		for (let layer of this.layers) {
			this._bestImage = null;
			this._bestScore = 0;

			layer.step();

			yield;
		}

		//this.sort();
	}

	private sort(): void {
		this.layers = this
			.layers
			.map(l => ({ layer: l, size: this.evaluator.getSize(l.best.shape) }))
			.sort((a, b) => b.size - a.size)
			.map(l => l.layer);
	}

	private _bestImage: Image.IImage;
	private _bestScore: number;

	public get bestImage(): Image.IImage {
		if (this._bestImage == null) {
			let image = new Image.Svg.SvgImage(this.image.width, this.image.height);
			image.clear('#ffffff');

			let shapes = this.layers.map(l => l.best.shape);
			for (let i = 0; i < shapes.length; i++)
				image.add(shapes[i], this.evaluator.getLayerColor(shapes, i));

			this._bestImage = image;
		}

		return this._bestImage;
	}

	public get bestScore(): number {
		if (!this._bestScore) {
			this._bestScore = this.evaluator.compare(this.bestImage);
		}

		return this._bestScore;
	}
}