export default class ImageMeasurer {
	public measure(image: ImageData): number {
		let maskPixels = image.data;

		let bytes = maskPixels.length;
		let size = 0;

		for (let i = 0; i < bytes; i += 4) {
			if (maskPixels[i] || maskPixels[i + 1] || maskPixels[i + 2]) {
				size++;
			}
		}

		return size;
	}
}