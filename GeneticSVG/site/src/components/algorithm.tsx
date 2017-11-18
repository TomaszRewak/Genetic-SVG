import * as React from 'react'
import { ImageViewer } from './image-viewer'
import * as SvgGenerator from './_imports'

type Props = { image: SvgGenerator.Image.IImage };
type State = { generation: number, paused: boolean };

export class Algorithm extends React.Component<Props, State> {
	private _geneticAlgorithm: SvgGenerator.GeneticSvg;

	public constructor(props: Props) {
		super(props);

		this._geneticAlgorithm = new SvgGenerator.GeneticSvg(props.image, 33);

		this.state = {
			generation: -1,
			paused: false
		};

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

	public render(): JSX.Element {
		return (
			<div>
				<div>
					<button onClick={this.start}>Start</button>
					<button onClick={this.pause}>Pause</button>
				</div>
				<div>Generation: {this.state.generation}</div>
				<div>Best score: {this._geneticAlgorithm.bestScore}</div>
				<ImageViewer image={this._geneticAlgorithm.bestImage} />
			</div>
		);
	}
}