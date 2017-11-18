import * as GA from './genetic-algorithm/_index'
import * as Image from './images/_index'
import * as Svg from './svg-processing/_index'

type Specimen = Svg.Specimen<Image.Svg.Shapes.Polygon>;

export default class GeneticSvg {
	private layers: GA.IGeneticAlgorithm<Specimen>[];
	private evaluator: Svg.Evaluator;
	private image: ImageData;

	public constructor(
		image: Image.IImage,
		layers: number
	) {
		let width = image.width,
			height = image.height;

		this.layers = [];
		
		this.image = image.getImageData();
		this.evaluator = new Svg.Evaluator(this.image);

		for (let i = 0; i < layers; i++) {
			let pipeline: GA.IPipelineGenerator<Specimen>[] = [
				new Svg.Pipeline.RingSelection<Image.Svg.Shapes.Polygon>(10),
				new Svg.Pipeline.PolygonMutation()
			];

			let population = new GA.Population<Specimen>();
			for (let i = 0; i < 10; i++) {
				let polygon = new Image.Svg.Shapes.Polygon(3);

				for (let j = 0; j < 3; j++) {
					polygon.setX(j, width * Math.random());
					polygon.setY(j, height * Math.random());
				}

				population.push(new Svg.Specimen<Image.Svg.Shapes.Polygon>(polygon));
			}

			let ga = new Svg.SvgGeneticAlgorithm<Image.Svg.Shapes.Polygon>(pipeline, population, this.evaluator, this.layers);

			this.layers.push(ga);
		}
	}

	public step(): void {
		for (let layer of this.layers) {
			layer.setp();
		}
	}

	public get bestImage(): Image.IImage {
		let image = new Image.Svg.SvgImage(this.image.width, this.image.height);
		image.clear('#ffffff');

		let shapes = this.layers.map(l => l.best.shape);
		for (let i = 0; i < shapes.length; i++)
			image.add(shapes[i], this.evaluator.getLayerColor(shapes, i));

		return image;
	}

	public get bestScore(): number {
		return 0;
	}
}