export interface ISvgShape {
	render(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void;
}