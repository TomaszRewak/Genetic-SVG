export interface IImage {
	readonly width: number;
	readonly height: number;

	getImageData(): ImageData;
	getCanvas(): HTMLCanvasElement;
}