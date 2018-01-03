import * as Image from './images/_index'

export interface GeneticSvgScore {
	min: number;
	max: number;
	avg: number;
}

export interface IGeneticSvg {
	step(): Generator;
	readonly baseImage: Image.IImage;
	readonly bestImage: Image.IImage;
	bestResult(width: number, height: number): Image.IImage;
	readonly bestScore: number;
	currentScore(): GeneticSvgScore;
}