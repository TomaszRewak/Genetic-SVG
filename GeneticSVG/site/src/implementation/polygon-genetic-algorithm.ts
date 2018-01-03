import { GA, Svg, Image, GeneticSvg } from './_imports'
import { GeneticSvgConfiguration, IConfigurableGeneticSvg } from './_interfaces'

type Specimen = Svg.Specimen<Image.Svg.Shapes.Polygon>;

export class PolygonGeneticAlgorithm extends GeneticSvg<Image.Svg.Shapes.Polygon> implements IConfigurableGeneticSvg {
	constructor(image: Image.IImage, private configuration: GeneticSvgConfiguration) {
		super(image);
		this.setLayersCount(configuration.layers);
	}

	protected getPipeline(layer: number): GA.IPipelineGenerator<Specimen>[] {
		let pipeline: GA.IPipelineGenerator<Specimen>[] = [
			new Svg.Pipeline.RingSelection<Image.Svg.Shapes.Polygon>(3),
			new Svg.Pipeline.PolygonMutation(this.configuration.annealing)
		];

		return pipeline;
	}

	private generateSpecimen(): Specimen {
		let vertices = this.configuration.vertices;
		let polygon = new Image.Svg.Shapes.Polygon(vertices);

		for (let j = 0; j < vertices; j++) {
			let point = polygon.getPoint(j);

			point.x = Math.random();
			point.y = Math.random();
		}

		return new Svg.Specimen<Image.Svg.Shapes.Polygon>(polygon);
	}

	protected generatePopulation(layer: number): GA.Population<Specimen> {
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
		console.dir('a');
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