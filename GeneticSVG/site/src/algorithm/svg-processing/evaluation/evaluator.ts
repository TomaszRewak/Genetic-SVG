import { Images } from '../_imports'

import Layer from './layer'

export default class Evaluator {
	public image: ImageData;

	public compare(image: Images.IImage) {
		let comparer = new Images.Algorithms.ImageComparer();

		let diff = comparer.compare(this.image, image.getImageData());

		return diff;
	}

	public getSize(shape: Images.Svg.ISvgShape): number {
		let measurer = new Images.Algorithms.ImageMeasurer();
		let mask = new Images.Svg.SvgImage(this.image.width, this.image.height);

		mask.clear('#000000');
		mask.add(shape, '#ffffff');

		let size = measurer.measure(mask.getImageData());

		return size;
	}

	public evaluate(layers: Layer[]): number {
		let comparer = new Images.Algorithms.ImageComparer();
		let newImage = new Images.Svg.SvgImage(this.image.width, this.image.height);

		newImage.clear('#ffffff');
		for (let layer of layers)
			newImage.add(layer.shape, layer.color);
		let imageData = newImage.getImageData();

		let diff = comparer.compare(this.image, imageData);

		return diff;
	}

	public getLayerColor(layers: Images.Svg.ISvgShape[], layer: number): string {
		let colorSelector = new Images.Algorithms.ImageColorSelector();
		let mask = new Images.Svg.SvgImage(this.image.width, this.image.height);

		mask.clear('#000000');
		mask.add(layers[layer], '#ffffff');

		for (let i = layer + 1; i < layers.length; i++)
			mask.add(layers[i], '#000000');

		let color = colorSelector.getColor(this.image, mask.getImageData());

		return `rgba(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])}, ${color[2]})`;
	}
}