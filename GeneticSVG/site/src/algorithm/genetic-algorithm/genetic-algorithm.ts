import * as I from "./_interfaces";
import Population from "./population";

export default abstract class GeneticAlgorithm<Specimen extends I.ISpecimen> implements I.IGeneticAlgorithm<Specimen> {
	private _currentPopulation: I.IPopulation<Specimen>;
	private _pipeline: I.IPipelineGenerator<Specimen>[];

	constructor(
		pipeline: I.IPipelineGenerator<Specimen>[],
		initialPopulation: I.IPopulation<Specimen>
	) {
		this._pipeline = pipeline;
		this._currentPopulation = initialPopulation;
	}

	public get currentPopulation() { return this._currentPopulation; }
	public set pipeline(value: I.IPipelineGenerator<Specimen>[]) { this._pipeline = value; }

	public step(): void {
		let newPopulation = new Population<Specimen>();
		this._best = null;

		let rootStep: I.IPipelineStep<Specimen> = null;
		for (let step of this._pipeline)
			rootStep = step.generate(this, rootStep);

		while (newPopulation.length < this._currentPopulation.length) {
			let newSpecimen = rootStep.getNext();
			newPopulation.push(newSpecimen);

			if (this._best == null || this.score(newSpecimen) < this.score(this._best))
				this._best = newSpecimen;
		}

		this._currentPopulation = newPopulation;
	}

	private _best: Specimen;
	public get best(): Specimen {
		return this._best ? this._best : this.currentPopulation[0];
	}

	public abstract score(specimen: Specimen): number;
}