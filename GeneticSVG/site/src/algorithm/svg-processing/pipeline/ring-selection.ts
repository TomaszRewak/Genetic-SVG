import { GA, Images } from '../_imports'
import Specimen from '../specimen'

type S = Specimen<Images.Svg.Shapes.Polygon>;

class Selection<Shape extends Images.Svg.ISvgShape> implements GA.IPipelineStep<Specimen<Shape>> {
	public constructor(
		private ring: number,
		private ga: GA.IGeneticAlgorithm<Specimen<Shape>>) {
	}

	public getNext(): Specimen<Shape> {
		let bestSpecimen: Specimen<Shape> = null;

		let population = this.ga.currentPopulation;

		for (let i = 0; i < this.ring; i++) {
			let specimen = population[Math.floor(population.length * Math.random())];

			if (bestSpecimen == null || this.ga.score(specimen) < this.ga.score(bestSpecimen))
				bestSpecimen = specimen;
		}

		return bestSpecimen;
	}
}

export default class RingSelectionGenerator<Shape extends Images.Svg.ISvgShape> implements GA.IPipelineGenerator<Specimen<Shape>> {
	public constructor(private ring: number)
	{ }

	public generate(ga: GA.IGeneticAlgorithm<Specimen<Shape>>, next: GA.IPipelineStep<Specimen<Shape>>): GA.IPipelineStep<Specimen<Shape>> {
		return new Selection(this.ring, ga);
	}
}