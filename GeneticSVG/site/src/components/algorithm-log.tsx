import * as React from 'react'

import * as GA from './_imports'

type P = {
	generation: number,
	currentTotalScore: number,
	currentLayerScore: GA.GeneticSvgScore,
	configuration: GA.GeneticSvgConfiguration
};
type S = {
	history: P[];
};

export default class AlgorithmLog extends React.Component<P, S> {
	constructor(params: P) {
		super(params);

		this.state = {
			history: []
		};
	}

	public componentWillReceiveProps(nextProps: P): void {
		if (nextProps.generation != this.props.generation)
			this.setState({
				history: [...this.state.history, this.props]
			});
	}

	public render(): JSX.Element {
		let log = this.state.history.map(v =>
			<tr key={v.generation}>
				<td>{v.generation}</td>
				<td>{`${v.currentTotalScore.toFixed(6)}`}</td>
				<td>{`${v.currentLayerScore.min.toFixed(6)}`}</td>
				<td>{`${v.currentLayerScore.avg.toFixed(6)}`}</td>
				<td>{`${v.currentLayerScore.max.toFixed(6)}`}</td>
				<td>{v.configuration.annealing}</td>
				<td>{v.configuration.layers}</td>
				<td>{v.configuration.population}</td>
				<td>{v.configuration.vertices}</td>
			</tr>
		);

		return (
			<div className="ui segment logs">
				<h3 className="ui header">Generation: {this.props.generation}</h3>
				<h3 className="ui header">Current score: {this.props.currentTotalScore.toFixed(6)}</h3>
				<div className="logScroll">
					<table className="ui celled table">
						<thead>
							<tr>
								<th>Generation</th>
								<th>Total score</th>
								<th>Min score</th>
								<th>Avg score</th>
								<th>Max score</th>
								<th>Annealing</th>
								<th>Layers</th>
								<th>Population</th>
								<th>Vertices</th>
							</tr>
						</thead>
						<tbody>
							{log}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}