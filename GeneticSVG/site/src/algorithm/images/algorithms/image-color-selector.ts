export default class ImageColorSelector {
	private _sameSize(first: ImageData, second: ImageData): boolean {
		return (
			first.width == second.width &&
			first.height == second.height
		);
	}

	public getColor(image: ImageData, mask: ImageData): Float64Array {
		if (!this._sameSize(image, mask))
			throw new Error("Images have different size");

		let imagePixels = image.data,
			maskPixels = mask.data;

		let colors = new Float64Array(4);
		let bytes = imagePixels.length;
		let inMask = 0;

		for (let i = 0; i < bytes; i += 4) {
			if (maskPixels[i] || maskPixels[i + 1] || maskPixels[i + 2]) {
				colors[0] += Math.pow(imagePixels[i], 2);
				colors[1] += Math.pow(imagePixels[i + 1], 2);
				colors[2] += Math.pow(imagePixels[i + 2], 2);
				colors[3] += Math.pow(imagePixels[i + 3], 2);

				inMask++;
			}
		}

		colors[0] = Math.sqrt(colors[0] / inMask);
		colors[1] = Math.sqrt(colors[1] / inMask);
		colors[2] = Math.sqrt(colors[2] / inMask);
		colors[3] = Math.sqrt(colors[3] / inMask);

		return colors;
	}
}