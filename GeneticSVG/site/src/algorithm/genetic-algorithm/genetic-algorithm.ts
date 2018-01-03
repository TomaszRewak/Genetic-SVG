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
		this.score(this.allTimeBest, true);

		let rootStep: I.IPipelineStep<Specimen> = null;
		for (let step of this._pipeline)
			rootStep = step.generate(this, rootStep);

		while (newPopulation.length < this._currentPopulation.length) {
			let newSpecimen = rootStep.getNext();
			newPopulation.push(newSpecimen);

			if (this._best == null || this.score(newSpecimen) < this.score(this._best))
				this._best = newSpecimen;

			if (this._allTimeBest == null || this.score(this.best) < this.score(this._allTimeBest))
				this._allTimeBest = this._best;
		}

		this._currentPopulation = newPopulation;
		this.calculateCurrentScore();
	}

	private _best: Specimen;
	public get best(): Specimen {
		return this._best ? this._best : this.currentPopulation[0];
	}

	private _allTimeBest: Specimen;
	public get allTimeBest(): Specimen {
		return this._allTimeBest ? this._allTimeBest : this.best;
	}

	public abstract score(specimen: Specimen, force?: boolean): number;

	private _currentScore: I.Score = {
		min: 0,
		max: 0,
		avg: 0
	}
	private calculateCurrentScore() {
		let score = {
			min: Number.MAX_VALUE,
			max: Number.MIN_VALUE,
			avg: 0
		}

		for (let i = 0; i < this._currentPopulation.length; i++) {
			let specimenScore = this.score(this._currentPopulation[i]);

			score.min = Math.min(score.min, specimenScore);
			score.max = Math.max(score.max, specimenScore);
			score.avg += specimenScore;
		}

		score.avg /= this._currentPopulation.length;

		this._currentScore = score;
	}

	public get currentScore(): I.Score {
		return this._currentScore;
	}
}