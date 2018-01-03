import * as I from '../_interfaces'

class BezierPolygonPoint {
	public x: number;
	public y: number;
	public angle: number = 0;
	public len1: number;
	public len2: number;
}

export default class BezierPolygon implements I.ISvgShape {
	private _vertices: BezierPolygonPoint[];

	public constructor(public readonly length: number) {
		this._vertices = [...Array(length)].map(v => new BezierPolygonPoint());
	}

	private roundIndex(index: number): number {
		let length = this.length;
		return ((index % length) + length) % length;
	}

	public getPoint(index: number): BezierPolygonPoint {
		return this._vertices[this.roundIndex(index)];
	}

	public render(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
		let vertices = this._vertices;
		let length = vertices.length;

		context.beginPath();

		context.moveTo(vertices[0].x * canvasWidth, vertices[0].y * canvasHeight);

		for (let i = 0; i < length; i++) {
			let point1 = vertices[this.roundIndex(i)];
			let point2 = vertices[this.roundIndex(i + 1)];
			let point3 = vertices[this.roundIndex(i + 2)];

			//console.log(`${point1.x}, ${point1.angle}`);

			let angle1 = Math.atan2(point2.y - point1.y, point2.x - point1.x) + point1.angle;
			let angle2 = Math.atan2(point3.y - point2.y, point3.x - point2.x) + point2.angle;

			context.bezierCurveTo(
				(point1.x + Math.sin(angle1) * point1.len2) * canvasWidth,
				(point1.y + Math.cos(angle1) * point1.len2) * canvasHeight,
				(point2.x - Math.sin(angle2) * point2.len1) * canvasWidth,
				(point2.y - Math.cos(angle2) * point2.len1) * canvasHeight,
				(point2.x) * canvasWidth,
				(point2.y) * canvasHeight
			);
		}

		//context.closePath();
		context.fill();
	}
}