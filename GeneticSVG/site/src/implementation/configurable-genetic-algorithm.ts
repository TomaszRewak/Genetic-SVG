import { GA, Svg, Image, GeneticSvg } from './_imports'

type Specimen = Svg.Specimen<Image.Svg.Shapes.Polygon>;

export interface GeneticSvgConfiguration {
	layers: number,
	vertices: number,
	annealing: number,
	population: number
}

export class ConfigurableGeneticAlgorithm extends GeneticSvg {
	constructor(image: Image.IImage, private configuration: GeneticSvgConfiguration) {
		super(image);
		this.initialize(configuration.layers);
	}

	protected getPipeline(layer: number): GA.IPipelineGenerator<Specimen>[] {
		let pipeline: GA.IPipelineGenerator<Specimen>[] = [
			new Svg.Pipeline.RingSelection<Image.Svg.Shapes.Polygon>(10),
			new Svg.Pipeline.PolygonMutation(this.configuration.annealing)
		];

		return pipeline;
	}

	protected generatePopulation(layer: number): GA.Population<Specimen> {
		let vertices = this.configuration.vertices;
		let size = this.configuration.population;

		let population = new GA.Population<Specimen>();

		for (let i = 0; i < size; i++) {
			let polygon = new Image.Svg.Shapes.Polygon(vertices);

			for (let j = 0; j < vertices; j++) {
				polygon.setX(j, this.image.width * Math.random());
				polygon.setY(j, this.image.height * Math.random());
			}

			population.push(new Svg.Specimen<Image.Svg.Shapes.Polygon>(polygon));
		}

		return population;
	}

	public updateConfiguration(configuration: GeneticSvgConfiguration): void {
		this.configuration = configuration;

		for (let i = 0; i < this.layers.length; i++) {
			this.layers[i].pipeline = this.getPipeline(i);
		}
	}
}