define("algorithm/genetic-algorithm/_interfaces", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("algorithm/genetic-algorithm/population", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Population extends Array {
    }
    exports.default = Population;
});
define("algorithm/genetic-algorithm/genetic-algorithm", ["require", "exports", "algorithm/genetic-algorithm/population"], function (require, exports, population_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GeneticAlgorithm {
        constructor(pipeline, initialPopulation) {
            this._currentScore = {
                min: 0,
                max: 0,
                avg: 0
            };
            this._pipeline = pipeline;
            this._currentPopulation = initialPopulation;
        }
        get currentPopulation() { return this._currentPopulation; }
        set pipeline(value) { this._pipeline = value; }
        step() {
            let newPopulation = new population_1.default();
            this._best = null;
            this.score(this.allTimeBest, true);
            let rootStep = null;
            for (let step of this._pipeline)
                rootStep = step.generate(this, rootStep);
            while (newPopulation.length < this._currentPopulation.length) {
                let newSpecimen = rootStep.getNext();
                newPopulation.push(newSpecimen);
                if (this._best == null || this.score(newSpecimen) < this.score(this._best))
                    this._best = newSpecimen;
                if (this._allTimeBest == null || this.score(this.best) < this.score(this._allTimeBest))
                    this._allTimeBest = this._best;
            }
            this._currentPopulation = newPopulation;
            this.calculateCurrentScore();
        }
        get best() {
            return this._best ? this._best : this.currentPopulation[0];
        }
        get allTimeBest() {
            return this._allTimeBest ? this._allTimeBest : this.best;
        }
        calculateCurrentScore() {
            let score = {
                min: Number.MAX_VALUE,
                max: Number.MIN_VALUE,
                avg: 0
            };
            for (let i = 0; i < this._currentPopulation.length; i++) {
                let specimenScore = this.score(this._currentPopulation[i]);
                score.min = Math.min(score.min, specimenScore);
                score.max = Math.max(score.max, specimenScore);
                score.avg += specimenScore;
            }
            score.avg /= this._currentPopulation.length;
            this._currentScore = score;
        }
        get currentScore() {
            return this._currentScore;
        }
    }
    exports.default = GeneticAlgorithm;
});
define("algorithm/genetic-algorithm/_index", ["require", "exports", "algorithm/genetic-algorithm/genetic-algorithm", "algorithm/genetic-algorithm/population"], function (require, exports, genetic_algorithm_1, population_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GeneticAlgorithm = genetic_algorithm_1.default;
    exports.Population = population_2.default;
});
define("algorithm/images/_interfaces", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("algorithm/images/algorithms/image-color-selector", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ImageColorSelector {
        _sameSize(first, second) {
            return (first.width == second.width &&
                first.height == second.height);
        }
        getColor(image, mask) {
            if (!this._sameSize(image, mask))
                throw new Error("Images have different size");
            let imagePixels = image.data, maskPixels = mask.data;
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
    exports.default = ImageColorSelector;
});
define("algorithm/images/algorithms/image-comparer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ImageComparer {
        _sameSize(first, second) {
            return (first.width == second.width &&
                first.height == second.height);
        }
        compare(first, second) {
            if (!this._sameSize(first, second))
                throw new Error("Images have different size");
            let pixels1 = first.data, pixels2 = second.data;
            let diff = 0;
            let bytes = pixels1.length;
            for (let i = 0; i < bytes; i++)
                diff += Math.pow(Math.abs(pixels1[i] - pixels2[i]) / 256, 2);
            return diff / bytes;
        }
    }
    exports.default = ImageComparer;
});
define("algorithm/images/algorithms/image-measurer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ImageMeasurer {
        measure(image) {
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
    exports.default = ImageMeasurer;
});
define("algorithm/images/raster/raster-image", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RasterImage {
        constructor(url) {
            this._source = url;
            this._canvas = document.createElement('canvas');
            this._context = this._canvas.getContext('2d');
        }
        load() {
            if (!this._promise && this._source) {
                this._promise = new Promise(resolve => {
                    var image = new Image;
                    image.crossOrigin = "Anonymous";
                    image.onload = () => {
                        this._loaded(image);
                        resolve();
                    };
                    if (typeof this._source == 'string') {
                        image.src = this._source;
                    }
                    else {
                        var reader = new FileReader();
                        reader.onload = (event) => {
                            image.src = event.target.result;
                        };
                        reader.readAsDataURL(this._source);
                    }
                });
            }
            return this._promise;
        }
        _loaded(image) {
            this._canvas.width = image.width;
            this._canvas.height = image.height;
            this._context.drawImage(image, 0, 0);
        }
        get width() {
            return this._canvas.width;
        }
        get height() {
            return this._canvas.height;
        }
        getCanvas() {
            return this._canvas;
        }
        getImageData() {
            return this._context.getImageData(0, 0, this.width, this.height);
        }
    }
    exports.default = RasterImage;
});
define("algorithm/images/raster/_index", ["require", "exports", "algorithm/images/raster/raster-image"], function (require, exports, raster_image_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RasterImage = raster_image_1.default;
});
define("algorithm/images/algorithms/image-transform", ["require", "exports", "algorithm/images/raster/_index"], function (require, exports, _index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function scaleImage(image, maxSize) {
        let scaledImage = new _index_1.RasterImage();
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
    exports.default = scaleImage;
});
define("algorithm/images/algorithms/_index", ["require", "exports", "algorithm/images/algorithms/image-color-selector", "algorithm/images/algorithms/image-comparer", "algorithm/images/algorithms/image-measurer", "algorithm/images/algorithms/image-transform"], function (require, exports, image_color_selector_1, image_comparer_1, image_measurer_1, image_transform_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImageColorSelector = image_color_selector_1.default;
    exports.ImageComparer = image_comparer_1.default;
    exports.ImageMeasurer = image_measurer_1.default;
    exports.scaleImage = image_transform_1.default;
});
define("algorithm/images/svg/_interfaces", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("algorithm/images/svg/svg-image", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SvgImage {
        constructor(width, height) {
            this._canvas = document.createElement('canvas');
            this._canvas.width = width;
            this._canvas.height = height;
            this._context = this._canvas.getContext('2d');
        }
        clear(color) {
            this._context.fillStyle = color;
            this._context.fillRect(0, 0, this.width, this.height);
        }
        add(shape, color) {
            this._context.fillStyle = color;
            shape.render(this._context, this._canvas.width, this._canvas.height);
        }
        get width() {
            return this._canvas.width;
        }
        get height() {
            return this._canvas.height;
        }
        getCanvas() {
            return this._canvas;
        }
        getImageData() {
            return this._context.getImageData(0, 0, this.width, this.height);
        }
    }
    exports.default = SvgImage;
});
define("algorithm/images/svg/shapes/polygon", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PolygonPoint {
    }
    class Polygon {
        constructor(length) {
            this.length = length;
            this._vertices = [...Array(length)].map(v => new PolygonPoint());
        }
        roundIndex(index) {
            let length = this.length;
            return ((index % length) + length) % length;
        }
        getPoint(index) {
            return this._vertices[this.roundIndex(index)];
        }
        render(context, canvasWidth, canvasHeight) {
            let vertices = this._vertices;
            let length = vertices.length;
            context.beginPath();
            context.moveTo(vertices[0].x * canvasWidth, vertices[0].y * canvasHeight);
            for (let i = 1; i < length; i++)
                context.lineTo(vertices[i].x * canvasWidth, vertices[i].y * canvasHeight);
            context.closePath();
            context.fill();
        }
    }
    exports.default = Polygon;
});
define("algorithm/images/svg/shapes/bezier-polygon", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BezierPolygonPoint {
        constructor() {
            this.angle = 0;
        }
    }
    class BezierPolygon {
        constructor(length) {
            this.length = length;
            this._vertices = [...Array(length)].map(v => new BezierPolygonPoint());
        }
        roundIndex(index) {
            let length = this.length;
            return ((index % length) + length) % length;
        }
        getPoint(index) {
            return this._vertices[this.roundIndex(index)];
        }
        render(context, canvasWidth, canvasHeight) {
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
                context.bezierCurveTo((point1.x + Math.sin(angle1) * point1.len2) * canvasWidth, (point1.y + Math.cos(angle1) * point1.len2) * canvasHeight, (point2.x - Math.sin(angle2) * point2.len1) * canvasWidth, (point2.y - Math.cos(angle2) * point2.len1) * canvasHeight, (point2.x) * canvasWidth, (point2.y) * canvasHeight);
            }
            //context.closePath();
            context.fill();
        }
    }
    exports.default = BezierPolygon;
});
define("algorithm/images/svg/shapes/_index", ["require", "exports", "algorithm/images/svg/shapes/polygon", "algorithm/images/svg/shapes/bezier-polygon"], function (require, exports, polygon_1, bezier_polygon_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Polygon = polygon_1.default;
    exports.BezierPolygon = bezier_polygon_1.default;
});
define("algorithm/images/svg/_index", ["require", "exports", "algorithm/images/svg/svg-image", "algorithm/images/svg/shapes/_index"], function (require, exports, svg_image_1, Shapes) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SvgImage = svg_image_1.default;
    exports.Shapes = Shapes;
});
define("algorithm/images/_index", ["require", "exports", "algorithm/images/algorithms/_index", "algorithm/images/svg/_index", "algorithm/images/raster/_index"], function (require, exports, Algorithms, Svg, Raster) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Algorithms = Algorithms;
    exports.Svg = Svg;
    exports.Raster = Raster;
});
define("algorithm/svg-processing/_imports", ["require", "exports", "algorithm/genetic-algorithm/_index", "algorithm/images/_index"], function (require, exports, GA, Images) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GA = GA;
    exports.Images = Images;
});
define("algorithm/svg-processing/_interfaces", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("algorithm/svg-processing/specimen", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Specimen {
        constructor(shape) {
            this.shape = shape;
            this.scored = false;
        }
    }
    exports.default = Specimen;
});
define("algorithm/svg-processing/evaluation/layer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Layer {
        constructor(shape, color) {
            this.shape = shape;
            this.color = color;
        }
    }
    exports.default = Layer;
});
define("algorithm/svg-processing/evaluation/evaluator", ["require", "exports", "algorithm/svg-processing/_imports"], function (require, exports, _imports_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Evaluator {
        compare(image) {
            let comparer = new _imports_1.Images.Algorithms.ImageComparer();
            let diff = comparer.compare(this.image, image.getImageData());
            return diff;
        }
        getSize(shape) {
            let measurer = new _imports_1.Images.Algorithms.ImageMeasurer();
            let mask = new _imports_1.Images.Svg.SvgImage(this.image.width, this.image.height);
            mask.clear('#000000');
            mask.add(shape, '#ffffff');
            let size = measurer.measure(mask.getImageData());
            return size;
        }
        evaluate(layers) {
            let comparer = new _imports_1.Images.Algorithms.ImageComparer();
            let newImage = new _imports_1.Images.Svg.SvgImage(this.image.width, this.image.height);
            newImage.clear('#ffffff');
            for (let layer of layers)
                newImage.add(layer.shape, layer.color);
            let imageData = newImage.getImageData();
            let diff = comparer.compare(this.image, imageData);
            return diff;
        }
        getLayerColor(layers, layer) {
            let colorSelector = new _imports_1.Images.Algorithms.ImageColorSelector();
            let mask = new _imports_1.Images.Svg.SvgImage(this.image.width, this.image.height);
            mask.clear('#000000');
            mask.add(layers[layer], '#ffffff');
            for (let i = layer + 1; i < layers.length; i++)
                mask.add(layers[i], '#000000');
            let color = colorSelector.getColor(this.image, mask.getImageData());
            return `rgba(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])}, ${color[2]})`;
        }
    }
    exports.default = Evaluator;
});
define("algorithm/svg-processing/evaluation/_index", ["require", "exports", "algorithm/svg-processing/evaluation/evaluator", "algorithm/svg-processing/evaluation/layer"], function (require, exports, evaluator_1, layer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Evaluator = evaluator_1.default;
    exports.Layer = layer_1.default;
});
define("algorithm/svg-processing/svg-genetic-algorithm", ["require", "exports", "algorithm/svg-processing/_imports", "algorithm/svg-processing/evaluation/_index"], function (require, exports, _imports_2, _index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SvgGeneticAlgorithm extends _imports_2.GA.GeneticAlgorithm {
        constructor(pipeline, initialPopulation, evaluator, environment) {
            super(pipeline, initialPopulation);
            this.evaluator = evaluator;
            this.environment = environment;
        }
        score(specimen, force = false) {
            if (!specimen)
                return 0;
            if (!specimen.scored || force) {
                let layer = this.layers[this.currentLayer];
                layer.shape = specimen.shape;
                layer.color = this.evaluator.getLayerColor(this.layers.map(l => l.shape), this.currentLayer);
                specimen.score = this.evaluator.evaluate(this.layers);
                specimen.scored = true;
            }
            return specimen.score;
        }
        step() {
            let shapes = this.environment.map(e => e.best.shape);
            this.layers = shapes.map((v, i) => new _index_2.Layer(v, this.evaluator.getLayerColor(shapes, i)));
            for (let i = 0; i < this.environment.length; i++)
                if (this.environment[i] == this)
                    this.currentLayer = i;
            super.step();
        }
    }
    exports.default = SvgGeneticAlgorithm;
});
define("algorithm/svg-processing/pipeline/polygon-mutation", ["require", "exports", "algorithm/svg-processing/_imports", "algorithm/svg-processing/specimen"], function (require, exports, _imports_3, specimen_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PolygonMutation {
        constructor(annealing, ga, next) {
            this.annealing = annealing;
            this.ga = ga;
            this.next = next;
        }
        getNext() {
            let specimen = this.next.getNext();
            let polygon = specimen.shape;
            let length = polygon.length;
            let annealing = this.annealing;
            let newPolygon = new _imports_3.Images.Svg.Shapes.Polygon(length);
            for (let i = 0; i < length; i++) {
                let point = newPolygon.getPoint(i);
                let x0 = polygon.getPoint(i - 1).x, x1 = polygon.getPoint(i).x, x2 = polygon.getPoint(i + 1).x;
                let y0 = polygon.getPoint(i - 1).y, y1 = polygon.getPoint(i).y, y2 = polygon.getPoint(i + 1).y;
                point.x = Math.min(1.5, Math.max(-0.5, x1 + Math.max(Math.abs(x0 - x1), Math.abs(x1 - x2)) * annealing * (Math.random() - 0.5)));
                point.y = Math.min(1.5, Math.max(-0.5, y1 + Math.max(Math.abs(y0 - y1), Math.abs(y1 - y2)) * annealing * (Math.random() - 0.5)));
            }
            return new specimen_1.default(newPolygon);
        }
    }
    class PolygonMutationGenerator {
        constructor(annealing) {
            this.annealing = annealing;
        }
        generate(ga, next) {
            return new PolygonMutation(this.annealing, ga, next);
        }
    }
    exports.default = PolygonMutationGenerator;
});
define("algorithm/svg-processing/pipeline/bezier-polygon-mutation", ["require", "exports", "algorithm/svg-processing/_imports", "algorithm/svg-processing/specimen"], function (require, exports, _imports_4, specimen_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BezierPolygonMutation {
        constructor(annealing, ga, next) {
            this.annealing = annealing;
            this.ga = ga;
            this.next = next;
        }
        getNext() {
            let specimen = this.next.getNext();
            let polygon = specimen.shape;
            let length = polygon.length;
            let annealing = this.annealing;
            let newPolygon = new _imports_4.Images.Svg.Shapes.BezierPolygon(length);
            for (let i = 0; i < length; i++) {
                let point = newPolygon.getPoint(i);
                let x0 = polygon.getPoint(i - 1).x, x1 = polygon.getPoint(i).x, x2 = polygon.getPoint(i + 1).x;
                let y0 = polygon.getPoint(i - 1).y, y1 = polygon.getPoint(i).y, y2 = polygon.getPoint(i + 1).y;
                point.x = Math.min(1.5, Math.max(-0.5, x1 + Math.max(Math.abs(x0 - x1), Math.abs(x1 - x2)) * annealing * (Math.random() - 0.5)));
                point.y = Math.min(1.5, Math.max(-0.5, y1 + Math.max(Math.abs(y0 - y1), Math.abs(y1 - y2)) * annealing * (Math.random() - 0.5)));
                let len1 = polygon.getPoint(i).len1, len2 = polygon.getPoint(i).len2;
                let d1 = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2)), d2 = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
                point.len1 = Math.min(d1 * 5, Math.max(0, len1 + d1 * annealing * (Math.random() - 0.5)));
                point.len2 = Math.min(d2 * 5, Math.max(0, len2 + d2 * annealing * (Math.random() - 0.5)));
                let angle = polygon.getPoint(i).angle;
                point.angle = angle + 0.5 * Math.PI * annealing * (Math.random() - 0.5);
            }
            return new specimen_2.default(newPolygon);
        }
    }
    class BezierPolygonMutationGenerator {
        constructor(annealing) {
            this.annealing = annealing;
        }
        generate(ga, next) {
            return new BezierPolygonMutation(this.annealing, ga, next);
        }
    }
    exports.default = BezierPolygonMutationGenerator;
});
define("algorithm/svg-processing/pipeline/ring-selection", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Selection {
        constructor(ring, ga) {
            this.ring = ring;
            this.ga = ga;
        }
        getNext() {
            let bestSpecimen = null;
            let population = this.ga.currentPopulation;
            for (let i = 0; i < this.ring; i++) {
                let specimen = population[Math.floor(population.length * Math.random())];
                if (bestSpecimen == null || this.ga.score(specimen) < this.ga.score(bestSpecimen))
                    bestSpecimen = specimen;
            }
            return bestSpecimen;
        }
    }
    class RingSelectionGenerator {
        constructor(ring) {
            this.ring = ring;
        }
        generate(ga, next) {
            return new Selection(this.ring, ga);
        }
    }
    exports.default = RingSelectionGenerator;
});
define("algorithm/svg-processing/pipeline/_index", ["require", "exports", "algorithm/svg-processing/pipeline/polygon-mutation", "algorithm/svg-processing/pipeline/bezier-polygon-mutation", "algorithm/svg-processing/pipeline/ring-selection"], function (require, exports, polygon_mutation_1, bezier_polygon_mutation_1, ring_selection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PolygonMutation = polygon_mutation_1.default;
    exports.BezierPolygonMutation = bezier_polygon_mutation_1.default;
    exports.RingSelection = ring_selection_1.default;
});
define("algorithm/svg-processing/_index", ["require", "exports", "algorithm/svg-processing/specimen", "algorithm/svg-processing/svg-genetic-algorithm", "algorithm/svg-processing/pipeline/_index", "algorithm/svg-processing/evaluation/_index"], function (require, exports, specimen_3, svg_genetic_algorithm_1, Pipeline, _index_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Specimen = specimen_3.default;
    exports.SvgGeneticAlgorithm = svg_genetic_algorithm_1.default;
    exports.Pipeline = Pipeline;
    exports.Evaluator = _index_3.Evaluator;
});
define("algorithm/_interfaces", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("algorithm/genetic-svg", ["require", "exports", "algorithm/images/_index", "algorithm/svg-processing/_index"], function (require, exports, Image, Svg) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GeneticSvg {
        constructor(image) {
            this.evaluator = new Svg.Evaluator();
            this.baseImage = image;
            this.layers = [];
        }
        addLayer() {
            let index = this.layers.length;
            let pipeline = this.getPipeline(index);
            let population = this.generatePopulation(index);
            let ga = new Svg.SvgGeneticAlgorithm(pipeline, population, this.evaluator, this.layers);
            this.layers.push(ga);
        }
        removeLayer() {
            this.layers.pop();
        }
        setLayersCount(count) {
            while (this.layers.length < count)
                this.addLayer();
            while (this.layers.length > count)
                this.removeLayer();
        }
        *step() {
            for (let layer of this.layers) {
                this._bestImage = null;
                this._bestScore = 0;
                layer.step();
                yield;
            }
            //this.sort();
        }
        sort() {
            this.layers = this
                .layers
                .map(l => ({ layer: l, size: this.evaluator.getSize(l.best.shape) }))
                .sort((a, b) => b.size - a.size)
                .map(l => l.layer);
        }
        get baseImage() {
            return this._baseImage;
        }
        set baseImage(value) {
            this._baseImage = value;
            this.image = value.getImageData();
            this.evaluator.image = this.image;
        }
        get bestImage() {
            if (this._bestImage == null)
                this._bestImage = this.bestResult(this.image.width, this.image.height);
            return this._bestImage;
        }
        bestResult(width, height) {
            let image = new Image.Svg.SvgImage(width, height);
            image.clear('#ffffff');
            let shapes = this.layers.map(l => l.best.shape);
            for (let i = 0; i < shapes.length; i++)
                image.add(shapes[i], this.evaluator.getLayerColor(shapes, i));
            return image;
        }
        get bestScore() {
            if (!this._bestScore) {
                this._bestScore = this.evaluator.compare(this.bestImage);
            }
            return this._bestScore;
        }
        currentScore() {
            let score = {
                min: 0,
                max: 0,
                avg: 0
            };
            for (let layer of this.layers) {
                let layerScore = layer.currentScore;
                score.min += layerScore.min;
                score.max += layerScore.max;
                score.avg += layerScore.avg;
            }
            return score;
        }
    }
    exports.default = GeneticSvg;
});
define("algorithm/_index", ["require", "exports", "algorithm/genetic-svg", "algorithm/genetic-algorithm/_index", "algorithm/images/_index", "algorithm/svg-processing/_index"], function (require, exports, genetic_svg_1, GA, Image, Svg) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GeneticSvg = genetic_svg_1.default;
    exports.GA = GA;
    exports.Image = Image;
    exports.Svg = Svg;
});
define("implementation/_imports", ["require", "exports", "algorithm/_index"], function (require, exports, _index_4) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(_index_4);
});
define("implementation/_interfaces", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("implementation/polygon-genetic-algorithm", ["require", "exports", "implementation/_imports"], function (require, exports, _imports_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PolygonGeneticAlgorithm extends _imports_5.GeneticSvg {
        constructor(image, configuration) {
            super(image);
            this.configuration = configuration;
            this.setLayersCount(configuration.layers);
        }
        getPipeline(layer) {
            let pipeline = [
                new _imports_5.Svg.Pipeline.RingSelection(3),
                new _imports_5.Svg.Pipeline.PolygonMutation(this.configuration.annealing)
            ];
            return pipeline;
        }
        generateSpecimen() {
            let vertices = this.configuration.vertices;
            let polygon = new _imports_5.Image.Svg.Shapes.Polygon(vertices);
            for (let j = 0; j < vertices; j++) {
                let point = polygon.getPoint(j);
                point.x = Math.random();
                point.y = Math.random();
            }
            return new _imports_5.Svg.Specimen(polygon);
        }
        generatePopulation(layer) {
            let size = this.configuration.population;
            let population = new _imports_5.GA.Population();
            for (let i = 0; i < size; i++)
                population.push(this.generateSpecimen());
            return population;
        }
        updateConfiguration(configuration) {
            this.configuration = configuration;
            this.setLayersCount(configuration.layers);
            for (let i = 0; i < this.layers.length; i++) {
                this.layers[i].pipeline = this.getPipeline(i);
            }
        }
        *step() {
            yield* super.step();
            this.postprocess();
        }
        postprocess() {
            console.dir('a');
            for (let layer of this.layers) {
                let worstScore = layer.best.score;
                let worstIndex = 0;
                for (let i = 0; i < layer.currentPopulation.length; i++) {
                    let specimenScore = layer.currentPopulation[i].score;
                    if (specimenScore > worstScore) {
                        worstScore = specimenScore;
                        worstIndex = i;
                    }
                }
                layer.currentPopulation[worstIndex] = this.generateSpecimen();
            }
        }
    }
    exports.PolygonGeneticAlgorithm = PolygonGeneticAlgorithm;
});
define("implementation/bezier-polygon-genetic-algorithm", ["require", "exports", "implementation/_imports"], function (require, exports, _imports_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BezierPolygonGeneticAlgorithm extends _imports_6.GeneticSvg {
        constructor(image, configuration) {
            super(image);
            this.configuration = configuration;
            this.setLayersCount(configuration.layers);
        }
        getPipeline(layer) {
            let pipeline = [
                new _imports_6.Svg.Pipeline.RingSelection(3),
                new _imports_6.Svg.Pipeline.BezierPolygonMutation(this.configuration.annealing)
            ];
            return pipeline;
        }
        generateSpecimen() {
            let vertices = this.configuration.vertices;
            let polygon = new _imports_6.Image.Svg.Shapes.BezierPolygon(vertices);
            for (let j = 0; j < vertices; j++) {
                let point = polygon.getPoint(j);
                point.x = Math.random();
                point.y = Math.random();
                point.angle = 2 * Math.PI * Math.random();
            }
            for (let j = 0; j < vertices; j++) {
                let p0 = polygon.getPoint(j - 1);
                let p1 = polygon.getPoint(j);
                let p2 = polygon.getPoint(j + 1);
                p1.len1 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)) / 2 * Math.random();
                p1.len2 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)) / 2 * Math.random();
            }
            return new _imports_6.Svg.Specimen(polygon);
        }
        generatePopulation(layer) {
            let vertices = this.configuration.vertices;
            let size = this.configuration.population;
            let population = new _imports_6.GA.Population();
            for (let i = 0; i < size; i++)
                population.push(this.generateSpecimen());
            return population;
        }
        updateConfiguration(configuration) {
            this.configuration = configuration;
            this.setLayersCount(configuration.layers);
            for (let i = 0; i < this.layers.length; i++) {
                this.layers[i].pipeline = this.getPipeline(i);
            }
        }
        *step() {
            yield* super.step();
            this.postprocess();
        }
        postprocess() {
            for (let layer of this.layers) {
                let worstScore = layer.best.score;
                let worstIndex = 0;
                for (let i = 0; i < layer.currentPopulation.length; i++) {
                    let specimenScore = layer.currentPopulation[i].score;
                    if (specimenScore > worstScore) {
                        worstScore = specimenScore;
                        worstIndex = i;
                    }
                }
                layer.currentPopulation[worstIndex] = this.generateSpecimen();
            }
        }
    }
    exports.BezierPolygonGeneticAlgorithm = BezierPolygonGeneticAlgorithm;
});
define("implementation/_index", ["require", "exports", "implementation/_imports", "implementation/polygon-genetic-algorithm", "implementation/bezier-polygon-genetic-algorithm"], function (require, exports, _imports_7, polygon_genetic_algorithm_1, bezier_polygon_genetic_algorithm_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(_imports_7);
    __export(polygon_genetic_algorithm_1);
    __export(bezier_polygon_genetic_algorithm_1);
});
define("components/_imports", ["require", "exports", "implementation/_index"], function (require, exports, _index_5) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(_index_5);
});
define("components/algorithm-configuration", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AlgorithmConfiguration extends React.Component {
        constructor(props) {
            super(props);
            this.state = props.configuration;
            this.setEdges = this.setEdges.bind(this);
            this.setLayers = this.setLayers.bind(this);
            this.addLayer = this.addLayer.bind(this);
            this.removeLayer = this.removeLayer.bind(this);
            this.setVertices = this.setVertices.bind(this);
            this.addVertice = this.addVertice.bind(this);
            this.removeVertices = this.removeVertices.bind(this);
            this.setAnnealing = this.setAnnealing.bind(this);
            this.increasAnnealing = this.increasAnnealing.bind(this);
            this.decreaseAnnealing = this.decreaseAnnealing.bind(this);
            this.update = this.update.bind(this);
        }
        update() {
            this.props.onChange({
                layers: Number(this.state.layers),
                vertices: Number(this.state.vertices),
                annealing: Number(this.state.annealing),
                population: Number(this.state.population),
                sharpEdges: this.state.sharpEdges
            });
        }
        setEdges(event) { this.setState({ sharpEdges: event.target.checked }); }
        setLayers(event) { this.setState({ layers: event.target.value }); }
        addLayer() { this.setState({ layers: Number(this.state.layers) + 1 }); }
        removeLayer() { this.setState({ layers: Number(this.state.layers) - 1 }); }
        setVertices(event) { this.setState({ vertices: event.target.value }); }
        addVertice() { this.setState({ vertices: Number(this.state.vertices) + 1 }); }
        removeVertices() { this.setState({ vertices: Number(this.state.vertices) - 1 }); }
        setAnnealing(event) { this.setState({ annealing: event.target.value }); }
        increasAnnealing() { this.setState({ annealing: Number(this.state.annealing) * 2 }); }
        decreaseAnnealing() { this.setState({ annealing: Number(this.state.annealing) / 2 }); }
        componentWillReceiveProps(nextProps) {
            let oldConfiguration = this.props.configuration;
            let newConfiguration = nextProps.configuration;
            if (newConfiguration.sharpEdges != oldConfiguration.sharpEdges)
                this.setState({ sharpEdges: newConfiguration.sharpEdges });
            if (newConfiguration.layers != oldConfiguration.layers)
                this.setState({ layers: newConfiguration.layers });
            if (newConfiguration.vertices != oldConfiguration.vertices)
                this.setState({ vertices: newConfiguration.vertices });
            if (newConfiguration.annealing != oldConfiguration.annealing)
                this.setState({ annealing: newConfiguration.annealing });
            if (newConfiguration.population != oldConfiguration.population)
                this.setState({ population: newConfiguration.population });
        }
        render() {
            return (React.createElement("div", { className: "ui segment configuration" },
                React.createElement("div", { className: "ui form" },
                    React.createElement("div", { className: "field" },
                        React.createElement("div", { className: "ui checkbox" },
                            React.createElement("input", { checked: this.state.sharpEdges, type: "checkbox", name: "example", onChange: this.setEdges }),
                            React.createElement("label", null, "Sharp edges"))),
                    React.createElement("div", { className: "field" },
                        React.createElement("label", null, "Layers "),
                        React.createElement("div", { className: "ui small action input" },
                            React.createElement("input", { type: "text", value: this.state.layers, onChange: this.setLayers }),
                            React.createElement("button", { className: "ui blue right button", onClick: this.addLayer }, "+"),
                            React.createElement("button", { className: "ui orange right button", onClick: this.removeLayer }, "-"))),
                    React.createElement("div", { className: "field" },
                        React.createElement("label", null, "Vertices "),
                        React.createElement("div", { className: "ui small action input" },
                            React.createElement("input", { type: "text", value: this.state.vertices, onChange: this.setVertices }),
                            React.createElement("button", { className: "ui blue right button", onClick: this.addVertice }, "+"),
                            React.createElement("button", { className: "ui orange right button", onClick: this.removeVertices }, "-"))),
                    React.createElement("div", { className: "field" },
                        React.createElement("label", null, "Learning factor "),
                        React.createElement("div", { className: "ui small action input" },
                            React.createElement("input", { type: "text", value: this.state.annealing, onChange: this.setAnnealing }),
                            React.createElement("button", { className: "ui blue right button", onClick: this.increasAnnealing }, "+"),
                            React.createElement("button", { className: "ui orange right button", onClick: this.decreaseAnnealing }, "-"))),
                    React.createElement("button", { className: "ui button", onClick: this.update }, "Update"))));
        }
    }
    exports.default = AlgorithmConfiguration;
});
define("components/image-viewer", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ImageViewer extends React.Component {
        render() {
            if (!this.props.image)
                return React.createElement("div", null);
            const src = this.props.image.getCanvas().toDataURL();
            return (React.createElement("div", { className: "image-viewer" },
                React.createElement("img", { src: src })));
        }
    }
    exports.default = ImageViewer;
});
define("components/flow-control", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FlowControl extends React.Component {
        constructor(props) {
            super(props);
        }
        render() {
            return (React.createElement("div", { className: "flow-control ui segment" },
                React.createElement("button", { className: "ui button", onClick: this.props.pause }, "Pause"),
                React.createElement("button", { className: "ui primary button", onClick: this.props.start }, "Start"),
                React.createElement("button", { className: "ui red button", onClick: this.props.reset }, "reset")));
        }
    }
    exports.default = FlowControl;
});
define("components/algorithm-log", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AlgorithmLog extends React.Component {
        constructor(params) {
            super(params);
            this.state = {
                history: []
            };
        }
        componentWillReceiveProps(nextProps) {
            if (nextProps.generation != this.props.generation)
                this.setState({
                    history: [...this.state.history, this.props]
                });
        }
        render() {
            let log = this.state.history.map(v => React.createElement("tr", { key: v.generation },
                React.createElement("td", null, v.generation),
                React.createElement("td", null, `${v.currentTotalScore.toFixed(6)}`),
                React.createElement("td", null, `${v.currentLayerScore.min.toFixed(6)}`),
                React.createElement("td", null, `${v.currentLayerScore.avg.toFixed(6)}`),
                React.createElement("td", null, `${v.currentLayerScore.max.toFixed(6)}`),
                React.createElement("td", null, v.configuration.annealing),
                React.createElement("td", null, v.configuration.layers),
                React.createElement("td", null, v.configuration.population),
                React.createElement("td", null, v.configuration.vertices)));
            return (React.createElement("div", { className: "ui segment logs" },
                React.createElement("h3", { className: "ui header" },
                    "Generation: ",
                    this.props.generation),
                React.createElement("h3", { className: "ui header" },
                    "Current score: ",
                    this.props.currentTotalScore.toFixed(6)),
                React.createElement("div", { className: "logScroll" },
                    React.createElement("table", { className: "ui celled table" },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "Generation"),
                                React.createElement("th", null, "Total score"),
                                React.createElement("th", null, "Min score"),
                                React.createElement("th", null, "Avg score"),
                                React.createElement("th", null, "Max score"),
                                React.createElement("th", null, "Annealing"),
                                React.createElement("th", null, "Layers"),
                                React.createElement("th", null, "Population"),
                                React.createElement("th", null, "Vertices"))),
                        React.createElement("tbody", null, log)))));
        }
    }
    exports.default = AlgorithmLog;
});
define("components/algorithm", ["require", "exports", "react", "components/_imports", "components/algorithm-configuration", "components/image-viewer", "components/flow-control", "components/algorithm-log"], function (require, exports, React, GA, algorithm_configuration_1, image_viewer_1, flow_control_1, algorithm_log_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Algorithm extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                generation: 0,
                currentScore: 1,
                latestBestScores: [],
                annealingAge: 0,
                configuration: {
                    layers: 30,
                    population: 10,
                    vertices: 3,
                    annealing: 0.25,
                    sharpEdges: false
                },
                paused: false
            };
            this.start = this.start.bind(this);
            this.pause = this.pause.bind(this);
            this.reset = this.reset.bind(this);
            this.updateConfiguration = this.updateConfiguration.bind(this);
            this.algorithmStep = this.algorithmStep.bind(this);
            this.reset();
        }
        componentWillReceiveProps(props) {
            if (props.image != this.props.image)
                this.reset(props);
        }
        componentDidMount() {
            this.algorithmStep();
        }
        algorithmStep() {
            //if (!this.state.paused) {
            //	let generator = this._geneticAlgorithm.step();
            //
            //	while (!generator.next().done) { }
            //
            //	let score = this._geneticAlgorithm.bestScore;
            //
            //	this.addNewScore(score);
            //}
            //
            //setTimeout(this.algorithmStep, 1);
            if (!this.state.paused) {
                let generator = this._geneticAlgorithm.step();
                let consumer = () => {
                    if (!generator.next().done) {
                        //this.setState({});
                        requestAnimationFrame(consumer);
                    }
                    else {
                        let score = this._geneticAlgorithm.bestScore;
                        this.addNewScore(score);
                        requestAnimationFrame(this.algorithmStep);
                    }
                };
                consumer();
            }
            else
                requestAnimationFrame(this.algorithmStep);
        }
        addNewScore(score) {
            if (this.state.annealingAge > 10 && this.state.latestBestScores.every(v => v <= score)) {
                this.updateConfiguration({
                    annealing: this.state.configuration.annealing / 2,
                    layers: this.state.configuration.layers,
                    population: this.state.configuration.population,
                    vertices: this.state.configuration.vertices,
                    sharpEdges: this.state.configuration.sharpEdges
                });
                this.setState({
                    generation: this.state.generation + 1,
                    currentScore: score,
                    latestBestScores: [score, ...this.state.latestBestScores].slice(0, 10),
                    annealingAge: 0
                });
            }
            else {
                this.setState({
                    generation: this.state.generation + 1,
                    currentScore: score,
                    latestBestScores: [score, ...this.state.latestBestScores].slice(0, 10),
                    annealingAge: this.state.annealingAge + 1
                });
            }
        }
        start() {
            this.setState({ paused: false });
        }
        pause() {
            this.setState({ paused: true });
        }
        reset(props, configuration) {
            if (!props)
                props = this.props;
            if (!configuration)
                configuration = this.state.configuration;
            let scaledImage = GA.Image.Algorithms.scaleImage(props.image, 100);
            if (configuration.sharpEdges)
                this._geneticAlgorithm = new GA.PolygonGeneticAlgorithm(scaledImage, configuration);
            else
                this._geneticAlgorithm = new GA.BezierPolygonGeneticAlgorithm(scaledImage, configuration);
        }
        updateConfiguration(newConfiguration) {
            if (newConfiguration.sharpEdges != this.state.configuration.sharpEdges || newConfiguration.vertices != this.state.configuration.vertices) {
                this.reset(null, newConfiguration);
            }
            this._geneticAlgorithm.updateConfiguration(newConfiguration);
            this.setState({ configuration: newConfiguration });
        }
        render() {
            let bestResult = this._geneticAlgorithm.bestResult(this.props.image.width, this.props.image.height);
            return (React.createElement("div", { className: "algorithm" },
                React.createElement("div", { className: "images-frame" },
                    React.createElement(image_viewer_1.default, { image: this.props.image }),
                    React.createElement("div", { className: "arrow" },
                        React.createElement("div", null)),
                    React.createElement(image_viewer_1.default, { image: this._geneticAlgorithm.baseImage }),
                    React.createElement("div", { className: "arrow" },
                        React.createElement("div", null)),
                    React.createElement(image_viewer_1.default, { image: this._geneticAlgorithm.bestImage }),
                    React.createElement("div", { className: "arrow" },
                        React.createElement("div", null)),
                    React.createElement(image_viewer_1.default, { image: bestResult })),
                React.createElement(algorithm_configuration_1.default, { configuration: this.state.configuration, onChange: this.updateConfiguration }),
                React.createElement(flow_control_1.default, { paused: this.state.paused, start: this.start, pause: this.pause, reset: this.reset }),
                React.createElement(algorithm_log_1.default, { generation: this.state.generation, currentTotalScore: this.state.currentScore, currentLayerScore: this._geneticAlgorithm.currentScore(), configuration: this.state.configuration })));
        }
    }
    exports.default = Algorithm;
});
define("components/image-selector", ["require", "exports", "react", "components/algorithm", "components/_imports"], function (require, exports, React, algorithm_1, SvgGenerator) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ImageSelector extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                ready: false
            };
            this._imageLoaded = this._imageLoaded.bind(this);
            this._imageSelected = this._imageSelected.bind(this);
            this._image = new SvgGenerator.Image.Raster.RasterImage("./resources/apple.jpg");
            this._image.load().then(this._imageLoaded);
        }
        _imageLoaded() {
            this.setState({
                ready: true
            });
        }
        _imageSelected(event) {
            var selectedFile = event.currentTarget.files[0];
            this._image = new SvgGenerator.Image.Raster.RasterImage(selectedFile);
            this._image.load().then(this._imageLoaded);
        }
        render() {
            if (!this.state.ready)
                return React.createElement("div", null, "Loading image");
            return (React.createElement("div", null,
                React.createElement("div", { className: "file-form" },
                    React.createElement("label", { htmlFor: "hidden-file-button", className: "ui primary button" }, "Open File"),
                    React.createElement("input", { type: "file", id: "hidden-file-button", onChange: this._imageSelected, style: { display: 'none' } })),
                React.createElement(algorithm_1.default, { image: this._image })));
        }
    }
    exports.ImageSelector = ImageSelector;
});
define("site", ["require", "exports", "react", "react-dom", "components/image-selector"], function (require, exports, React, ReactDOM, image_selector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ReactDOM.render(React.createElement(image_selector_1.ImageSelector, null), document.getElementById('site-content'));
});
//# sourceMappingURL=react.js.map