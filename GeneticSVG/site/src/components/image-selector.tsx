import * as React from 'react'
import ImageViewer from "./image-viewer";
import Algorithm from "./algorithm";
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

		this._imageLoaded = this._imageLoaded.bind(this);
		this._imageSelected = this._imageSelected.bind(this);

		this._image = new SvgGenerator.Image.Raster.RasterImage("./resources/apple.jpg");
		this._image.load().then(this._imageLoaded);
	}

	private _imageLoaded(): void {
		this.setState({
			ready: true
		});
	}

	private _imageSelected(event: React.FormEvent<HTMLInputElement>) {
		var selectedFile = event.currentTarget.files[0];

		this._image = new SvgGenerator.Image.Raster.RasterImage(selectedFile);
		this._image.load().then(this._imageLoaded);
	}

	public render(): React.ReactNode {
		if (!this.state.ready)
			return <div>Loading image</div>;

		return (
			<div>
				<div className="file-form">
					<label htmlFor="hidden-file-button" className="ui primary button">
						Open File
					</label>
					<input type="file" id="hidden-file-button" onChange={this._imageSelected} style={{ display: 'none' }} />
				</div>

				<Algorithm image={this._image} />
			</div>
		);
	}
}