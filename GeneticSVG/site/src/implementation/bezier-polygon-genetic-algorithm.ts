import { GA, Svg, Image, GeneticSvg } from './_imports'
import { GeneticSvgConfiguration, IConfigurableGeneticSvg } from './_interfaces'

type Specimen = Svg.Specimen<Image.Svg.Shapes.BezierPolygon>;

export class BezierPolygonGeneticAlgorithm extends GeneticSvg<Image.Svg.Shapes.BezierPolygon> implements IConfigurableGeneticSvg {
	constructor(image: Image.IImage, private configuration: GeneticSvgConfiguration) {
		super(image);
		this.setLayersCount(configuration.layers);
	}

	protected getPipeline(layer: number): GA.IPipelineGenerator<Specimen>[] {
		let pipeline: GA.IPipelineGenerator<Specimen>[] = [
			new Svg.Pipeline.RingSelection<Image.Svg.Shapes.BezierPolygon>(3),
			new Svg.Pipeline.BezierPolygonMutation(this.configuration.annealing)
		];

		return pipeline;
	}

	protected generateSpecimen(): Specimen {
		let vertices = this.configuration.vertices;
		let polygon = new Image.Svg.Shapes.BezierPolygon(vertices);

		for (let j = 0; j < vertices; j++) {
			let point = polygon.getPoint(j);

			point.x = Math.random();
			point.y = Math.random();
			point.angle = 2 * Math.PI * Math.random();
		}

		for (let j = 0; j < vertices; j++) {
			let p0 = polygon.getPoint(j - 1);
			let p1 = polygon.getPoint(j);
			let p2 = polygon.getPoint(j + 1);

			p1.len1 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)) / 2 * Math.random();
			p1.len2 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)) / 2 * Math.random();
		}

		return new Svg.Specimen<Image.Svg.Shapes.BezierPolygon>(polygon);
	}

	protected generatePopulation(layer: number): GA.Population<Specimen> {
		let vertices = this.configuration.vertices;
		let size = this.configuration.population;

		let population = new GA.Population<Specimen>();

		for (let i = 0; i < size; i++)
			population.push(this.generateSpecimen());

		return population;
	}

	public updateConfiguration(configuration: GeneticSvgConfiguration): void {
		this.configuration = configuration;

		this.setLayersCount(configuration.layers);

		for (let i = 0; i < this.layers.length; i++) {
			this.layers[i].pipeline = this.getPipeline(i);
		}
	}

	public *step(): Generator {
		yield* super.step();

		this.postprocess();
	}

	public postprocess(): void {
		for (let layer of this.layers) {
			let worstScore = layer.best.score;
			let worstIndex = 0;

			for (let i = 0; i < layer.currentPopulation.length; i++) {
				let specimenScore = layer.currentPopulation[i].score;

				if (specimenScore > worstScore) {
					worstScore = specimenScore;
					worstIndex = i;
				}
			}

			layer.currentPopulation[worstIndex] = this.generateSpecimen();
		}
	}
}