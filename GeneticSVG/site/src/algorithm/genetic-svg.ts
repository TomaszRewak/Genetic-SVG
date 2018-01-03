import * as GA from './genetic-algorithm/_index'
import * as Image from './images/_index'
import * as Svg from './svg-processing/_index'
import { IGeneticSvg, GeneticSvgScore } from './_interfaces'

export default abstract class GeneticSvg<Shape extends Image.Svg.ISvgShape> implements IGeneticSvg {
	protected image: ImageData;
	protected evaluator: Svg.Evaluator;
	protected layers: GA.GeneticAlgorithm<Svg.Specimen<Shape>>[];

	public constructor(
		image: Image.IImage
	) {
		this.evaluator = new Svg.Evaluator();
		this.baseImage = image;
		this.layers = [];
	}

	protected abstract getPipeline(layer: number): GA.IPipelineGenerator<Svg.Specimen<Shape>>[];
	protected abstract generatePopulation(layer: number): GA.Population<Svg.Specimen<Shape>>;

	private addLayer(): void {
		let index = this.layers.length;

		let pipeline = this.getPipeline(index);
		let population = this.generatePopulation(index);

		let ga = new Svg.SvgGeneticAlgorithm<Shape>(pipeline, population, this.evaluator, this.layers);

		this.layers.push(ga);
	}

	private removeLayer(): void {
		this.layers.pop();
	}

	protected setLayersCount(count: number): void {
		while (this.layers.length < count)
			this.addLayer();

		while (this.layers.length > count)
			this.removeLayer();
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

	private _baseImage: Image.IImage;

	public get baseImage(): Image.IImage {
		return this._baseImage;
	}

	public set baseImage(value: Image.IImage) {
		this._baseImage = value;

		this.image = value.getImageData();
		this.evaluator.image = this.image;
	}

	private _bestImage: Image.IImage;
	private _bestScore: number;

	public get bestImage(): Image.IImage {
		if (this._bestImage == null)
			this._bestImage = this.bestResult(this.image.width, this.image.height);

		return this._bestImage;
	}

	public bestResult(width: number, height: number): Image.IImage {
		let image = new Image.Svg.SvgImage(width, height);
		image.clear('#ffffff');

		let shapes = this.layers.map(l => l.best.shape);
		for (let i = 0; i < shapes.length; i++)
			image.add(shapes[i], this.evaluator.getLayerColor(shapes, i));

		return image;
	}

	public get bestScore(): number {
		if (!this._bestScore) {
			this._bestScore = this.evaluator.compare(this.bestImage);
		}

		return this._bestScore;
	}

	public currentScore(): GeneticSvgScore {
		let score = {
			min: 0,
			max: 0,
			avg: 0
		}

		for (let layer of this.layers) {
			let layerScore = layer.currentScore;

			score.min += layerScore.min;
			score.max += layerScore.max;
			score.avg += layerScore.avg;
		}

		return score;
	}
}