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
	population: string | number,
	sharpEdges: boolean
}

export default class AlgorithmConfiguration extends React.Component<P, S> {
	constructor(props: P) {
		super(props);

		this.state = props.configuration;

		this.setEdges = this.setEdges.bind(this);

		this.setLayers = this.setLayers.bind(this);
		this.addLayer = this.addLayer.bind(this);
		this.removeLayer = this.removeLayer.bind(this);

		this.setVertices = this.setVertices.bind(this);
		this.addVertice = this.addVertice.bind(this);
		this.removeVertices = this.removeVertices.bind(this);

		this.setAnnealing = this.setAnnealing.bind(this);
		this.increasAnnealing = this.increasAnnealing.bind(this);
		this.decreaseAnnealing = this.decreaseAnnealing.bind(this);

		this.update = this.update.bind(this);
	}

	private update(): void {
		this.props.onChange({
			layers: Number(this.state.layers),
			vertices: Number(this.state.vertices),
			annealing: Number(this.state.annealing),
			population: Number(this.state.population),
			sharpEdges: this.state.sharpEdges
		});
	}

	private setEdges(event: React.ChangeEvent<HTMLInputElement>): void { this.setState({ sharpEdges: event.target.checked }) }

	private setLayers(event: React.ChangeEvent<HTMLInputElement>): void { this.setState({ layers: event.target.value }) }
	private addLayer(): void { this.setState({ layers: Number(this.state.layers) + 1 }) }
	private removeLayer(): void { this.setState({ layers: Number(this.state.layers) - 1 }) }

	private setVertices(event: React.ChangeEvent<HTMLInputElement>): void { this.setState({ vertices: event.target.value }) }
	private addVertice(): void { this.setState({ vertices: Number(this.state.vertices) + 1 }) }
	private removeVertices(): void { this.setState({ vertices: Number(this.state.vertices) - 1 }) }

	private setAnnealing(event: React.ChangeEvent<HTMLInputElement>): void { this.setState({ annealing: event.target.value }) }
	private increasAnnealing(): void { this.setState({ annealing: Number(this.state.annealing) * 2 }) }
	private decreaseAnnealing(): void { this.setState({ annealing: Number(this.state.annealing) / 2 }) }

	public componentWillReceiveProps(nextProps: P): void {
		let oldConfiguration = this.props.configuration;
		let newConfiguration = nextProps.configuration;

		if (newConfiguration.sharpEdges != oldConfiguration.sharpEdges) this.setState({ sharpEdges: newConfiguration.sharpEdges });
		if (newConfiguration.layers != oldConfiguration.layers) this.setState({ layers: newConfiguration.layers });
		if (newConfiguration.vertices != oldConfiguration.vertices) this.setState({ vertices: newConfiguration.vertices });
		if (newConfiguration.annealing != oldConfiguration.annealing) this.setState({ annealing: newConfiguration.annealing });
		if (newConfiguration.population != oldConfiguration.population) this.setState({ population: newConfiguration.population });
	}

	public render(): JSX.Element {
		return (
			<div className="ui segment configuration">
				<div className="ui form">
					<div className="field">
						<div className="ui checkbox">
							<input checked={this.state.sharpEdges} type="checkbox" name="example" onChange={this.setEdges} />
							<label>Sharp edges</label>
						</div>
					</div>
					<div className="field">
						<label>Layers </label>
						<div className="ui small action input">
							<input type="text" value={this.state.layers} onChange={this.setLayers} />
							<button className="ui blue right button" onClick={this.addLayer}>+</button>
							<button className="ui orange right button" onClick={this.removeLayer}>-</button>
						</div>
					</div>
					<div className="field">
						<label>Vertices </label>
						<div className="ui small action input">
							<input type="text" value={this.state.vertices} onChange={this.setVertices} />
							<button className="ui blue right button" onClick={this.addVertice}>+</button>
							<button className="ui orange right button" onClick={this.removeVertices}>-</button>
						</div>
					</div>
					<div className="field">
						<label>Learning factor </label>
						<div className="ui small action input">
							<input type="text" value={this.state.annealing} onChange={this.setAnnealing} />
							<button className="ui blue right button" onClick={this.increasAnnealing}>+</button>
							<button className="ui orange right button" onClick={this.decreaseAnnealing}>-</button>
						</div>
					</div>
					<button className="ui button" onClick={this.update}>Update</button>
				</div>
			</div>
		);
	}
}