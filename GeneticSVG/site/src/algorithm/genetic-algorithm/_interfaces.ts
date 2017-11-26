export interface ISpecimen {
	readonly score: number;
}

export interface IPopulation<Specimen extends ISpecimen> {
	[key: number]: Specimen
	length: number;
}

export interface IGeneticAlgorithm<Specimen extends ISpecimen> {
	readonly currentPopulation: IPopulation<Specimen>;
	step(): void;
	score(specimen: Specimen): number;
	readonly best: Specimen;
}

export interface IPipelineStep<Specimen extends ISpecimen> {
	getNext(): Specimen;
}

export interface IPipelineGenerator<Specimen extends ISpecimen> {
	generate(ga: IGeneticAlgorithm<Specimen>, next: IPipelineStep<Specimen>): IPipelineStep<Specimen>;
}