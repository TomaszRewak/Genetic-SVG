import * as React from 'react'

type P = {
	paused: boolean,
	start: () => void,
	pause: () => void,
	reset: () => void
};
type S = {};

export default class FlowControl extends React.Component<P, S> {
	constructor(props: P) {
		super(props);
	}

	public render(): JSX.Element {
		return (
			<div className="flow-control ui segment">
				<button className="ui button" onClick={this.props.pause}>Pause</button>
				<button className="ui primary button" onClick={this.props.start}>Start</button>
				<button className="ui red button" onClick={this.props.reset}>reset</button>
			</div>
		);
	}
}