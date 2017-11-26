import * as React from 'react'
import * as GA from './_imports'

type P = {
	configuration: GA.GeneticSvgConfiguration,
	onChange: (newConfiguration: GA.GeneticSvgConfiguration) => void,
};
type S = {
	layers: string | number,
	vertices: string | number,
	annealing: string | number,
	population: string | number
}

export default class AlgorithmConfiguration extends React.Component<P, S> {
	constructor(props: P) {
		super(props);

		this.state = props.configuration;

		this.setLayers = this.setLayers.bind(this);
		this.setVertices = this.setVertices.bind(this);
		this.setAnnealing = this.setAnnealing.bind(this);
		this.update = this.update.bind(this);
	}

	private update(): void {
		this.props.onChange({
			layers: Number(this.state.layers),
			vertices: Number(this.state.vertices),
			annealing: Number(this.state.annealing),
			population: Number(this.state.population)
		});
	}

	private setLayers(event: React.ChangeEvent<HTMLInputElement>): void { this.setState({ layers: event.target.value }) }
	private setVertices(event: React.ChangeEvent<HTMLInputElement>): void { this.setState({ vertices: event.target.value }) }
	private setAnnealing(event: React.ChangeEvent<HTMLInputElement>): void { this.setState({ annealing: event.target.value }) }

	public componentWillReceiveProps(nextProps: P): void {
		let oldConfiguration = this.props.configuration;
		let newConfiguration = nextProps.configuration;

		if (newConfiguration.layers != oldConfiguration.layers) this.setState({ annealing: newConfiguration.layers });
		if (newConfiguration.vertices != oldConfiguration.vertices) this.setState({ annealing: newConfiguration.vertices });
		if (newConfiguration.annealing != oldConfiguration.annealing) this.setState({ annealing: newConfiguration.annealing });
		if (newConfiguration.population != oldConfiguration.population) this.setState({ annealing: newConfiguration.population });
	}

	public render(): JSX.Element {
		return (
			<div>
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
				<button onClick={this.update}>Update</button>
			</div>
		);
	}
}