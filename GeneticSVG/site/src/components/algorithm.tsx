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
	annealingAge: number,
	latestBestScores: number[],
	configuration: GA.GeneticSvgConfiguration,
	paused: boolean
};

export default class Algorithm extends React.Component<Props, State> {
	private _geneticAlgorithm: GA.IConfigurableGeneticSvg;

	public constructor(props: Props) {
		super(props);

		this.state = {
			generation: 0,
			currentScore: 1,
			latestBestScores: [],
			annealingAge: 0,
			configuration: {
				layers: 30,
				population: 10,
				vertices: 3,
				annealing: 0.25,
				sharpEdges: false
			},
			paused: false
		};

		this.start = this.start.bind(this);
		this.pause = this.pause.bind(this);
		this.reset = this.reset.bind(this);
		this.updateConfiguration = this.updateConfiguration.bind(this);
		this.algorithmStep = this.algorithmStep.bind(this);

		this.reset();
	}

	public componentWillReceiveProps(props: Props) {
		if (props.image != this.props.image)
			this.reset(props);
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
		if (this.state.annealingAge > 10 && this.state.latestBestScores.every(v => v <= score)) {
			this.updateConfiguration({
				annealing: this.state.configuration.annealing / 2,
				layers: this.state.configuration.layers,
				population: this.state.configuration.population,
				vertices: this.state.configuration.vertices,
				sharpEdges: this.state.configuration.sharpEdges
			});
			this.setState({
				generation: this.state.generation + 1,
				currentScore: score,
				latestBestScores: [score, ...this.state.latestBestScores].slice(0, 10),
				annealingAge: 0
			});
		}
		else {
			this.setState({
				generation: this.state.generation + 1,
				currentScore: score,
				latestBestScores: [score, ...this.state.latestBestScores].slice(0, 10),
				annealingAge: this.state.annealingAge + 1
			});
		}
	}

	private start(): void {
		this.setState({ paused: false });
	}

	private pause(): void {
		this.setState({ paused: true });
	}

	private reset(props?: Props, configuration?: GA.GeneticSvgConfiguration): void {
		if (!props)
			props = this.props;

		if (!configuration)
			configuration = this.state.configuration;

		let scaledImage = GA.Image.Algorithms.scaleImage(props.image, 100);

		if (configuration.sharpEdges)
			this._geneticAlgorithm = new GA.PolygonGeneticAlgorithm(scaledImage, configuration);
		else
			this._geneticAlgorithm = new GA.BezierPolygonGeneticAlgorithm(scaledImage, configuration);
	}

	private updateConfiguration(newConfiguration: GA.GeneticSvgConfiguration): void {
		if (newConfiguration.sharpEdges != this.state.configuration.sharpEdges || newConfiguration.vertices != this.state.configuration.vertices) {
			this.reset(null, newConfiguration);
		}

		this._geneticAlgorithm.updateConfiguration(newConfiguration);
		this.setState({ configuration: newConfiguration });
	}

	public render(): JSX.Element {
		let bestResult = this._geneticAlgorithm.bestResult(this.props.image.width, this.props.image.height);

		return (
			<div className="algorithm">
				<div className="images-frame">
					<ImageViewer image={this.props.image} />
					<div className="arrow"><div /></div>
					<ImageViewer image={this._geneticAlgorithm.baseImage} />
					<div className="arrow"><div /></div>
					<ImageViewer image={this._geneticAlgorithm.bestImage} />
					<div className="arrow"><div /></div>
					<ImageViewer image={bestResult} />
				</div>
				<AlgorithmParameters configuration={this.state.configuration} onChange={this.updateConfiguration} />
				<FlowControl paused={this.state.paused} start={this.start} pause={this.pause} reset={this.reset} />
				<AlgorithmLog
					generation={this.state.generation}
					currentTotalScore={this.state.currentScore}
					currentLayerScore={this._geneticAlgorithm.currentScore()}
					configuration={this.state.configuration} />
			</div>
		);
	}
}