import * as Images from '../_interfaces'
import * as I from './_interfaces'

export default class SvgImage implements Images.IImage {
	private _canvas: HTMLCanvasElement;
	private _context: CanvasRenderingContext2D;

	public constructor(width: number, height: number) {
		this._canvas = document.createElement('canvas');
		this._canvas.width = width;
		this._canvas.height = height;

		this._context = this._canvas.getContext('2d');
	}

	public clear(color: string) {
		this._context.fillStyle = color;
		this._context.fillRect(0, 0, this.width, this.height);
	}

	public add(shape: I.ISvgShape, color: string) {
		this._context.fillStyle = color;
		shape.render(this._context, this._canvas.width, this._canvas.height);
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