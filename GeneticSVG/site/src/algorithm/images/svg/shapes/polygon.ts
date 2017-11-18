import * as I from '../_interfaces'

export default class Polygon implements I.ISvgShape {
	private _vertices: Float32Array;

	public constructor(public readonly length: number) {
		this._vertices = new Float32Array(length * 2);
	}

	private roundIndex(index: number): number {
		let length = this.length;
		return ((index % length) + length) % length;
	}

	public setX(index: number, value: number): void {
		this._vertices[this.roundIndex(index) * 2] = value;
	}

	public setY(index: number, value: number): void {
		this._vertices[this.roundIndex(index) * 2 + 1] = value;
	}

	public getX(index: number): number {
		return this._vertices[this.roundIndex(index) * 2];
	}

	public getY(index: number): number {
		return this._vertices[this.roundIndex(index) * 2 + 1];
	}

	public render(context: CanvasRenderingContext2D): void {
		let vertices = this._vertices;
		let length = vertices.length;

		context.beginPath();

		context.moveTo(vertices[0], vertices[1]);

		for (let i = 2; i < length; i += 2)
			context.lineTo(vertices[i], vertices[i + 1]);

		context.closePath();
		context.fill();
	}
}