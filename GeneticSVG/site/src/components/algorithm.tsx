import * as React from 'react'
import * as GA from './_imports'

import AlgorithmParameters from './algorithm-configuration'
import ImageViewer from './image-viewer'
import FlowControl from './flow-control'
import AlgorithmLog from './algorithm-log'

type Props = {
	image: GA.Image.IImage
};
type State = {
	generation: number,
	currentScore: number,
	bestScore: number,
	bestScoreAge: number,
	configuration: GA.GeneticSvgConfiguration,
	paused: boolean
};

export default class Algorithm extends React.Component<Props, State> {
	private _geneticAlgorithm: GA.ConfigurableGeneticAlgorithm;

	public constructor(props: Props) {
		super(props);

		this.state = {
			generation: 0,
			currentScore: 1,
			bestScore: 1,
			bestScoreAge: 0,
			configuration: {
				layers: 30,
				population: 10,
				vertices: 4,
				annealing: 0.5
			},
			paused: false
		};

		this._geneticAlgorithm = new GA.ConfigurableGeneticAlgorithm(props.image, this.state.configuration);

		this.start = this.start.bind(this);
		this.pause = this.pause.bind(this);
		this.reset = this.reset.bind(this);
		this.updateConfiguration = this.updateConfiguration.bind(this);
		this.algorithmStep = this.algorithmStep.bind(this);
	}

	public componentDidMount(): void {
		this.algorithmStep();
	}

	private algorithmStep(): void {
		//if (!this.state.paused) {
		//	let generator = this._geneticAlgorithm.step();
		//
		//	while (!generator.next().done) { }
		//
		//	let score = this._geneticAlgorithm.bestScore;
		//
		//	this.addNewScore(score);
		//}
		//
		//setTimeout(this.algorithmStep, 1);

		if (!this.state.paused) {
			let generator = this._geneticAlgorithm.step();
		
			let consumer = () => {
				if (!generator.next().done) {
					//this.setState({});
		
					requestAnimationFrame(consumer);
				}
				else {
					let score = this._geneticAlgorithm.bestScore;
					this.addNewScore(score);
		
					requestAnimationFrame(this.algorithmStep);
				}
			}
		
			consumer();
		}
		else
			requestAnimationFrame(this.algorithmStep);
	}

	private addNewScore(score: number): void {
		if (score < this.state.bestScore) {
			this.setState({
				generation: this.state.generation + 1,
				currentScore: score,
				bestScore: score,
				bestScoreAge: 0
			});
		}
		else if (this.state.bestScoreAge < 10) {
			this.setState({
				generation: this.state.generation + 1,
				currentScore: score,
				bestScoreAge: this.state.bestScoreAge + 1
			});
		}
		else {
			this.updateConfiguration({
				annealing: this.state.configuration.annealing / 2,
				layers: this.state.configuration.layers,
				population: this.state.configuration.population,
				vertices: this.state.configuration.vertices
			});
			this.setState({
				generation: this.state.generation + 1,
				currentScore: score,
				bestScoreAge: 0
			});
		}
	}

	private start(): void {
		this.setState({ paused: false });
	}

	private pause(): void {
		this.setState({ paused: true });
	}

	private reset(): void {

	}

	private updateConfiguration(newConfiguration: GA.GeneticSvgConfiguration): void {
		this._geneticAlgorithm.updateConfiguration(newConfiguration);
		this.setState({ configuration: newConfiguration });
	}

	public render(): JSX.Element {
		return (
			<div className="algorithm">
				<ImageViewer image={this.props.image} />
				<ImageViewer image={this._geneticAlgorithm.bestImage} />
				<AlgorithmParameters configuration={this.state.configuration} onChange={this.updateConfiguration} />
				<FlowControl paused={this.state.paused} start={this.start} pause={this.pause} reset={this.reset} />
				<AlgorithmLog
					generation={this.state.generation}
					currentScore={this.state.currentScore}
					bestScore={this.state.bestScore}
					bestScoreAge={this.state.bestScoreAge}
					configuration={this.state.configuration} />
			</div>
		);
	}
}