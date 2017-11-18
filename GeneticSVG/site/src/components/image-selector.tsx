import * as React from 'react'
import { ImageViewer } from "./image-viewer";
import { Algorithm } from "./algorithm";
import * as SvgGenerator from './_imports'

type Props = {};
type State = { ready: boolean };

export class ImageSelector extends React.Component<Props, State> {
	private _image: SvgGenerator.Image.Raster.RasterImage;

	public constructor(props: Props) {
		super(props);

		this.state = {
			ready: false
		};

		this._image = new SvgGenerator.Image.Raster.RasterImage("./resources/apple.jpg");
		this._image.load().then(this._imageLoaded.bind(this));
	}

	private _imageLoaded(): void {
		this.setState({
			ready: true
		});
	}

	public render(): React.ReactNode {
		if (!this.state.ready)
			return <div>Loading image</div>;

		return (
			<div>
				<ImageViewer image={this._image} />
				<Algorithm image={this._image} />
			</div>
		);
	}
}