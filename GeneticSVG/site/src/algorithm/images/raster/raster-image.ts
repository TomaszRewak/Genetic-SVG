import * as I from "../_interfaces";

export default class RasterImage implements I.IImage {
	private _source?: string | File;
	private _promise: Promise<void>;

	private _canvas: HTMLCanvasElement;
	private _context: CanvasRenderingContext2D;

	public constructor(url?: string | File) {
		this._source = url;
		this._canvas = document.createElement('canvas');
		this._context = this._canvas.getContext('2d');
	}

	public load(): Promise<void> {
		if (!this._promise && this._source) {
			this._promise = new Promise<void>(resolve => {
				var image = new Image;
				image.crossOrigin = "Anonymous";
				image.onload = () => {
					this._loaded(image);
					resolve();
				};

				if (typeof this._source == 'string') {
					image.src = this._source;
				}
				else {
					var reader = new FileReader();

					reader.onload = (event: any) => {
						image.src = event.target.result;
					};

					reader.readAsDataURL(this._source);
				}
			});
		}

		return this._promise;
	}

	private _loaded(image: HTMLImageElement): void {
		this._canvas.width = image.width;
		this._canvas.height = image.height;

		this._context.drawImage(image, 0, 0);
	}

	public get width(): number {
		return this._canvas.width;
	}

	public get height(): number {
		return this._canvas.height;
	}

	public getCanvas(): HTMLCanvasElement {
		return this._canvas;
	}

	public getImageData(): ImageData {
		return this._context.getImageData(0, 0, this.width, this.height);
	}
}