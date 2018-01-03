import { IGeneticSvg } from "./_imports";

export interface GeneticSvgConfiguration {
	layers: number,
	vertices: number,
	annealing: number,
	population: number,
	sharpEdges: boolean
}

export interface IConfigurableGeneticSvg extends IGeneticSvg {
	updateConfiguration(configuration: GeneticSvgConfiguration): void;
}