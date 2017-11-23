import * as React from 'react'
import { ImageViewer } from './image-viewer'
import * as GA from './_imports'

type Props = {
	image: GA.Image.IImage
};
type State = {
	generation: number,
	paused: boolean,
	layers: string,
	population: string,
	vertices: string,
	annealing: string
};

export class Algorithm extends React.Component<Props, State> {
	private _geneticAlgorithm: GA.ConfigurableGeneticAlgorithm;

	public constructor(props: Props) {
		super(props);

		this.state = {
			generation: -1,
			paused: false,
			layers: '40',
			population: '10',
			vertices: '4',
			annealing: '0.5'
		};

		this._geneticAlgorithm = new GA.ConfigurableGeneticAlgorithm(props.image, this.getConfiguration());

		this.start = this.start.bind(this);
		this.pause = this.pause.bind(this);
	}

	public componentDidMount(): void {
		setInterval(this.algorithmStep.bind(this), 1);
	}

	private algorithmStep(): void {
		if (!this.state.paused) {
			this._geneticAlgorithm.step();

			this.setState((prevState) => ({
				generation: prevState.generation + 1
			}))
		}
	}

	private start(): void {
		this.setState({ paused: false });
	}

	private pause(): void {
		this.setState({ paused: true });
	}

	private getConfiguration(): GA.GeneticSvgConfiguration {
		return {
			annealing: Number(this.state.annealing),
			layers: Number(this.state.layers),
			population: Number(this.state.population),
			vertices: Number(this.state.vertices)
		};
	}

	private _setLayers(event: React.ChangeEvent<HTMLSelectElement>): void { this.setState({ layers: event.target.value }, () => { this.updateGA(); }) }
	private _setVertices(event: React.ChangeEvent<HTMLSelectElement>): void { this.setState({ vertices: event.target.value }, () => { this.updateGA(); }) }
	private _setAnnealing(event: React.ChangeEvent<HTMLSelectElement>): void { this.setState({ annealing: event.target.value }, () => { this.updateGA(); }) }

	private setLayers = this._setLayers.bind(this);
	private setVertices = this._setVertices.bind(this);
	private setAnnealing = this._setAnnealing.bind(this);

	private updateGA() {
		this._geneticAlgorithm.updateConfiguration(this.getConfiguration());
	}

	public render(): JSX.Element {
		return (
			<div>
				<div>
					<button onClick={this.start}>Start</button>
					<button onClick={this.pause}>Pause</button>
					<div>
						<div>layers: </div>
						<input type="text" value={this.state.layers} onChange={this.setLayers} />
					</div>
					<div>
						<div>vertices: </div>
						<input type="text" value={this.state.vertices} onChange={this.setVertices} />
					</div>
					<div>
						<div>annealing: </div>
						<input type="text" value={this.state.annealing} onChange={this.setAnnealing} />
					</div>
				</div>
				<div>Generation: {this.state.generation}</div>
				<div>Best score: {this._geneticAlgorithm.bestScore}</div>
				<ImageViewer image={this._geneticAlgorithm.bestImage} />
			</div>
		);
	}
}