import * as I from '../_interfaces'

class PolygonPoint {
	public x: number;
	public y: number;
}

export default class Polygon implements I.ISvgShape {
	private _vertices: PolygonPoint[];

	public constructor(public readonly length: number) {
		this._vertices = [...Array(length)].map(v => new PolygonPoint());
	}

	private roundIndex(index: number): number {
		let length = this.length;
		return ((index % length) + length) % length;
	}

	public getPoint(index: number): PolygonPoint {
		return this._vertices[this.roundIndex(index)];
	}

	public render(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
		let vertices = this._vertices;
		let length = vertices.length;

		context.beginPath();

		context.moveTo(
			vertices[0].x * canvasWidth,
			vertices[0].y * canvasHeight
		);

		for (let i = 1; i < length; i++)
			context.lineTo(vertices[i].x * canvasWidth, vertices[i].y * canvasHeight);

		context.closePath();
		context.fill();
	}
}