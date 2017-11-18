import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Algorithm } from './components/algorithm';
import { ImageSelector } from "./components/image-selector";

ReactDOM.render(
	<ImageSelector />,
	document.getElementById('site-content')
);
