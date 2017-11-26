import * as React from 'react'

import * as GA from './_imports'

type P = {
	generation: number,
	currentScore: number,
	bestScore: number,
	bestScoreAge: number,
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
				<td>{`${v.bestScore.toFixed(6)}`}</td>
				<td>{v.configuration.annealing}</td>
				<td>{v.configuration.layers}</td>
				<td>{v.configuration.population}</td>
				<td>{v.configuration.vertices}</td>
			</tr>
		);

		return (
			<div className="logs">
				<div>Generation: {this.props.generation}</div>
				<div>Best score: {`${this.props.bestScore.toFixed(6)} (from ${this.props.bestScoreAge} generations)`}</div>
				<div>Current score: {this.props.currentScore.toFixed(6)}</div>
				<table>
					<tr>
						<th>Generation</th>
						<th>Best score</th>
						<th>Annealing</th>
						<th>Layers</th>
						<th>Population</th>
						<th>Vertices</th>
					</tr>
					{log}
				</table>
			</div>
		);
	}
}