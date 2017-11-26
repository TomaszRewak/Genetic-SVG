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
			<div className="flow-control">
				<button onClick={this.props.pause}>Pause</button>
				<button onClick={this.props.start}>Start</button>
				<button onClick={this.props.reset}>reset</button>
			</div>
		);
	}
}