export default class ImageComparer {
	private _sameSize(first: ImageData, second: ImageData): boolean {
		return (
			first.width == second.width &&
			first.height == second.height
		);
	}

	public compare(first: ImageData, second: ImageData): number {
		if (!this._sameSize(first, second))
			throw new Error("Images have different size");

		let pixels1 = first.data,
			pixels2 = second.data;

		let diff = 0;
		let bytes = pixels1.length;

		for (let i = 0; i < bytes; i++)
			diff += Math.pow(Math.abs(pixels1[i] - pixels2[i]) / 256, 3);

		return diff / bytes;
	}
}