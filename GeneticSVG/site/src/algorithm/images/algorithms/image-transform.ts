import { IImage } from '../_interfaces'
import { RasterImage } from '../raster/_index'

export default function scaleImage(image: IImage, maxSize: number): RasterImage {
	let scaledImage = new RasterImage();

	let width = maxSize;
	let height = maxSize;

	if (image.width > image.height)
		height *= image.height / image.width;
	else
		width *= image.width / image.height;

	let canvas = scaledImage.getCanvas();
	canvas.width = width;
	canvas.height = height;

	canvas.getContext("2d").drawImage(image.getCanvas(), 0, 0, width, height);

	return scaledImage;
}