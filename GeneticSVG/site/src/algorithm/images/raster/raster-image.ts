import * as I from "../_interfaces";

export default class RasterImage implements I.IImage {
	private _width: number;
	private _height: number;

	private _source: string;
	private _promise: Promise<void>;

	private _canvas: HTMLCanvasElement;
	private _context: CanvasRenderingContext2D;

	public constructor(url: string) {
		this._source = url;
		this._canvas = document.createElement('canvas');
		this._context = this._canvas.getContext('2d');
	}

	public load(): Promise<void> {
		if (!this._promise) {
			this._promise = new Promise<void>(resolve => {
				var image = new Image;
				image.crossOrigin = "Anonymous";
				image.onload = () => {
					this._loaded(image);
					resolve();
				};
				image.src = this._source;
			});
		}

		return this._promise;
	}

	private _loaded(image: HTMLImageElement): void {
		this._width = image.width;
		this._height = image.height;

		this._canvas.width = image.width;
		this._canvas.height = image.height;

		this._context.drawImage(image, 0, 0);
	}

	public get width(): number {
		return this._width;
	}

	public get height(): number {
		return this._height;
	}

	public getCanvas(): HTMLCanvasElement {
		return this._canvas;
	}

	public getImageData(): ImageData{
		return this._context.getImageData(0, 0, this._width, this._height);
	}
}