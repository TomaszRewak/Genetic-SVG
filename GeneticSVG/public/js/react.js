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
            this._pipeline = pipeline;
            this._currentPopulation = initialPopulation;
        }
        get currentPopulation() { return this._currentPopulation; }
        set pipeline(value) { this._pipeline = value; }
        step() {
            let newPopulation = new population_1.default();
            this._best = null;
            let rootStep = null;
            for (let step of this._pipeline)
                rootStep = step.generate(this, rootStep);
            while (newPopulation.length < this._currentPopulation.length) {
                let newSpecimen = rootStep.getNext();
                newPopulation.push(newSpecimen);
                if (this._best == null || this.score(newSpecimen) < this.score(this._best))
                    this._best = newSpecimen;
            }
            this._currentPopulation = newPopulation;
        }
        get best() {
            return this._best ? this._best : this.currentPopulation[0];
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
                    colors[0] += imagePixels[i];
                    colors[1] += imagePixels[i + 1];
                    colors[2] += imagePixels[i + 2];
                    colors[3] += imagePixels[i + 3];
                    inMask++;
                }
            }
            colors[0] /= inMask;
            colors[1] /= inMask;
            colors[2] /= inMask;
            colors[3] /= inMask;
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
                diff += Math.pow(Math.abs(pixels1[i] - pixels2[i]) / 256, 3);
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
define("algorithm/images/algorithms/_index", ["require", "exports", "algorithm/images/algorithms/image-color-selector", "algorithm/images/algorithms/image-comparer", "algorithm/images/algorithms/image-measurer"], function (require, exports, image_color_selector_1, image_comparer_1, image_measurer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImageColorSelector = image_color_selector_1.default;
    exports.ImageComparer = image_comparer_1.default;
    exports.ImageMeasurer = image_measurer_1.default;
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
            shape.render(this._context);
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
    class Polygon {
        constructor(length) {
            this.length = length;
            this._vertices = new Float32Array(length * 2);
        }
        roundIndex(index) {
            let length = this.length;
            return ((index % length) + length) % length;
        }
        setX(index, value) {
            this._vertices[this.roundIndex(index) * 2] = value;
        }
        setY(index, value) {
            this._vertices[this.roundIndex(index) * 2 + 1] = value;
        }
        getX(index) {
            return this._vertices[this.roundIndex(index) * 2];
        }
        getY(index) {
            return this._vertices[this.roundIndex(index) * 2 + 1];
        }
        render(context) {
            let vertices = this._vertices;
            let length = vertices.length;
            context.beginPath();
            context.moveTo(vertices[0], vertices[1]);
            for (let i = 2; i < length; i += 2)
                context.lineTo(vertices[i], vertices[i + 1]);
            context.closePath();
            context.fill();
        }
    }
    exports.default = Polygon;
});
define("algorithm/images/svg/shapes/_index", ["require", "exports", "algorithm/images/svg/shapes/polygon"], function (require, exports, polygon_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Polygon = polygon_1.default;
});
define("algorithm/images/svg/_index", ["require", "exports", "algorithm/images/svg/svg-image", "algorithm/images/svg/shapes/_index"], function (require, exports, svg_image_1, Shapes) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SvgImage = svg_image_1.default;
    exports.Shapes = Shapes;
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
            if (!this._promise) {
                this._promise = new Promise(resolve => {
                    var image = new Image;
                    image.crossOrigin = "Anonymous";
                    image.onload = () => {
                        this._loaded(image);
                        resolve();
                    };
                    image.src = this._source;
                });
            }
            return this._promise;
        }
        _loaded(image) {
            this._width = image.width;
            this._height = image.height;
            this._canvas.width = image.width;
            this._canvas.height = image.height;
            this._context.drawImage(image, 0, 0);
        }
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
        getCanvas() {
            return this._canvas;
        }
        getImageData() {
            return this._context.getImageData(0, 0, this._width, this._height);
        }
    }
    exports.default = RasterImage;
});
define("algorithm/images/raster/_index", ["require", "exports", "algorithm/images/raster/raster-image"], function (require, exports, raster_image_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RasterImage = raster_image_1.default;
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
        constructor(image) {
            this.image = image;
        }
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
define("algorithm/svg-processing/svg-genetic-algorithm", ["require", "exports", "algorithm/svg-processing/_imports", "algorithm/svg-processing/evaluation/_index"], function (require, exports, _imports_2, _index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SvgGeneticAlgorithm extends _imports_2.GA.GeneticAlgorithm {
        constructor(pipeline, initialPopulation, evaluator, environment) {
            super(pipeline, initialPopulation);
            this.evaluator = evaluator;
            this.environment = environment;
        }
        score(specimen) {
            if (!specimen.scored) {
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
            this.layers = shapes.map((v, i) => new _index_1.Layer(v, this.evaluator.getLayerColor(shapes, i)));
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
    class Mutation {
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
                let x0 = polygon.getX(i - 1), x1 = polygon.getX(i), x2 = polygon.getX(i + 1);
                newPolygon.setX(i, x0 + Math.max(Math.abs(x0 - x1), Math.abs(x1 - x2)) * annealing * (Math.random() - 0.5));
                let y0 = polygon.getY(i - 1), y1 = polygon.getY(i), y2 = polygon.getY(i + 1);
                newPolygon.setY(i, y0 + Math.max(Math.abs(y0 - y1), Math.abs(y1 - y2)) * annealing * (Math.random() - 0.5));
            }
            return new specimen_1.default(newPolygon);
        }
    }
    class PolygonMutationGenerator {
        constructor(annealing) {
            this.annealing = annealing;
        }
        generate(ga, next) {
            return new Mutation(this.annealing, ga, next);
        }
    }
    exports.default = PolygonMutationGenerator;
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
define("algorithm/svg-processing/pipeline/_index", ["require", "exports", "algorithm/svg-processing/pipeline/polygon-mutation", "algorithm/svg-processing/pipeline/ring-selection"], function (require, exports, polygon_mutation_1, ring_selection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PolygonMutation = polygon_mutation_1.default;
    exports.RingSelection = ring_selection_1.default;
});
define("algorithm/svg-processing/_index", ["require", "exports", "algorithm/svg-processing/specimen", "algorithm/svg-processing/svg-genetic-algorithm", "algorithm/svg-processing/pipeline/_index", "algorithm/svg-processing/evaluation/_index"], function (require, exports, specimen_2, svg_genetic_algorithm_1, Pipeline, _index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Specimen = specimen_2.default;
    exports.SvgGeneticAlgorithm = svg_genetic_algorithm_1.default;
    exports.Pipeline = Pipeline;
    exports.Evaluator = _index_2.Evaluator;
});
define("algorithm/genetic-svg", ["require", "exports", "algorithm/images/_index", "algorithm/svg-processing/_index"], function (require, exports, Image, Svg) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GeneticSvg {
        constructor(image) {
            this.image = image.getImageData();
            this.evaluator = new Svg.Evaluator(this.image);
        }
        initialize(layers) {
            this.layers = [];
            for (let i = 0; i < layers; i++) {
                let pipeline = this.getPipeline(i);
                let population = this.generatePopulation(i);
                let ga = new Svg.SvgGeneticAlgorithm(pipeline, population, this.evaluator, this.layers);
                this.layers.push(ga);
            }
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
        get bestImage() {
            if (this._bestImage == null) {
                let image = new Image.Svg.SvgImage(this.image.width, this.image.height);
                image.clear('#ffffff');
                let shapes = this.layers.map(l => l.best.shape);
                for (let i = 0; i < shapes.length; i++)
                    image.add(shapes[i], this.evaluator.getLayerColor(shapes, i));
                this._bestImage = image;
            }
            return this._bestImage;
        }
        get bestScore() {
            if (!this._bestScore) {
                this._bestScore = this.evaluator.compare(this.bestImage);
            }
            return this._bestScore;
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
define("implementation/_imports", ["require", "exports", "algorithm/_index"], function (require, exports, _index_3) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(_index_3);
});
define("implementation/configurable-genetic-algorithm", ["require", "exports", "implementation/_imports"], function (require, exports, _imports_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ConfigurableGeneticAlgorithm extends _imports_4.GeneticSvg {
        constructor(image, configuration) {
            super(image);
            this.configuration = configuration;
            this.initialize(configuration.layers);
        }
        getPipeline(layer) {
            let pipeline = [
                new _imports_4.Svg.Pipeline.RingSelection(10),
                new _imports_4.Svg.Pipeline.PolygonMutation(this.configuration.annealing)
            ];
            return pipeline;
        }
        generatePopulation(layer) {
            let vertices = this.configuration.vertices;
            let size = this.configuration.population;
            let population = new _imports_4.GA.Population();
            for (let i = 0; i < size; i++) {
                let polygon = new _imports_4.Image.Svg.Shapes.Polygon(vertices);
                for (let j = 0; j < vertices; j++) {
                    polygon.setX(j, this.image.width * Math.random());
                    polygon.setY(j, this.image.height * Math.random());
                }
                population.push(new _imports_4.Svg.Specimen(polygon));
            }
            return population;
        }
        updateConfiguration(configuration) {
            this.configuration = configuration;
            for (let i = 0; i < this.layers.length; i++) {
                this.layers[i].pipeline = this.getPipeline(i);
            }
        }
    }
    exports.ConfigurableGeneticAlgorithm = ConfigurableGeneticAlgorithm;
});
define("implementation/_index", ["require", "exports", "implementation/_imports", "implementation/configurable-genetic-algorithm"], function (require, exports, _imports_5, configurable_genetic_algorithm_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(_imports_5);
    __export(configurable_genetic_algorithm_1);
});
define("components/_imports", ["require", "exports", "implementation/_index"], function (require, exports, _index_4) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(_index_4);
});
define("components/algorithm-configuration", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AlgorithmConfiguration extends React.Component {
        constructor(props) {
            super(props);
            this.state = props.configuration;
            this.setLayers = this.setLayers.bind(this);
            this.setVertices = this.setVertices.bind(this);
            this.setAnnealing = this.setAnnealing.bind(this);
            this.update = this.update.bind(this);
        }
        update() {
            this.props.onChange({
                layers: Number(this.state.layers),
                vertices: Number(this.state.vertices),
                annealing: Number(this.state.annealing),
                population: Number(this.state.population)
            });
        }
        setLayers(event) { this.setState({ layers: event.target.value }); }
        setVertices(event) { this.setState({ vertices: event.target.value }); }
        setAnnealing(event) { this.setState({ annealing: event.target.value }); }
        componentWillReceiveProps(nextProps) {
            let oldConfiguration = this.props.configuration;
            let newConfiguration = nextProps.configuration;
            if (newConfiguration.layers != oldConfiguration.layers)
                this.setState({ annealing: newConfiguration.layers });
            if (newConfiguration.vertices != oldConfiguration.vertices)
                this.setState({ annealing: newConfiguration.vertices });
            if (newConfiguration.annealing != oldConfiguration.annealing)
                this.setState({ annealing: newConfiguration.annealing });
            if (newConfiguration.population != oldConfiguration.population)
                this.setState({ annealing: newConfiguration.population });
        }
        render() {
            return (React.createElement("div", null,
                React.createElement("div", null,
                    React.createElement("div", null, "layers: "),
                    React.createElement("input", { type: "text", value: this.state.layers, onChange: this.setLayers })),
                React.createElement("div", null,
                    React.createElement("div", null, "vertices: "),
                    React.createElement("input", { type: "text", value: this.state.vertices, onChange: this.setVertices })),
                React.createElement("div", null,
                    React.createElement("div", null, "annealing: "),
                    React.createElement("input", { type: "text", value: this.state.annealing, onChange: this.setAnnealing })),
                React.createElement("button", { onClick: this.update }, "Update")));
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
            return (React.createElement("div", null,
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
            return (React.createElement("div", { className: "flow-control" },
                React.createElement("button", { onClick: this.props.pause }, "Pause"),
                React.createElement("button", { onClick: this.props.start }, "Start"),
                React.createElement("button", { onClick: this.props.reset }, "reset")));
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
                React.createElement("td", null, `${v.bestScore.toFixed(6)}`),
                React.createElement("td", null, v.configuration.annealing),
                React.createElement("td", null, v.configuration.layers),
                React.createElement("td", null, v.configuration.population),
                React.createElement("td", null, v.configuration.vertices)));
            return (React.createElement("div", { className: "logs" },
                React.createElement("div", null,
                    "Generation: ",
                    this.props.generation),
                React.createElement("div", null,
                    "Best score: ",
                    `${this.props.bestScore.toFixed(6)} (from ${this.props.bestScoreAge} generations)`),
                React.createElement("div", null,
                    "Current score: ",
                    this.props.currentScore.toFixed(6)),
                React.createElement("table", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Generation"),
                        React.createElement("th", null, "Best score"),
                        React.createElement("th", null, "Annealing"),
                        React.createElement("th", null, "Layers"),
                        React.createElement("th", null, "Population"),
                        React.createElement("th", null, "Vertices")),
                    log)));
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
                bestScore: 1,
                bestScoreAge: 0,
                configuration: {
                    layers: 30,
                    population: 10,
                    vertices: 4,
                    annealing: 0.5
                },
                paused: false
            };
            this._geneticAlgorithm = new GA.ConfigurableGeneticAlgorithm(props.image, this.state.configuration);
            this.start = this.start.bind(this);
            this.pause = this.pause.bind(this);
            this.reset = this.reset.bind(this);
            this.updateConfiguration = this.updateConfiguration.bind(this);
            this.algorithmStep = this.algorithmStep.bind(this);
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
            if (score < this.state.bestScore) {
                this.setState({
                    generation: this.state.generation + 1,
                    currentScore: score,
                    bestScore: score,
                    bestScoreAge: 0
                });
            }
            else if (this.state.bestScoreAge < 10) {
                this.setState({
                    generation: this.state.generation + 1,
                    currentScore: score,
                    bestScoreAge: this.state.bestScoreAge + 1
                });
            }
            else {
                this.updateConfiguration({
                    annealing: this.state.configuration.annealing / 2,
                    layers: this.state.configuration.layers,
                    population: this.state.configuration.population,
                    vertices: this.state.configuration.vertices
                });
                this.setState({
                    generation: this.state.generation + 1,
                    currentScore: score,
                    bestScoreAge: 0
                });
            }
        }
        start() {
            this.setState({ paused: false });
        }
        pause() {
            this.setState({ paused: true });
        }
        reset() {
        }
        updateConfiguration(newConfiguration) {
            this._geneticAlgorithm.updateConfiguration(newConfiguration);
            this.setState({ configuration: newConfiguration });
        }
        render() {
            return (React.createElement("div", { className: "algorithm" },
                React.createElement(image_viewer_1.default, { image: this.props.image }),
                React.createElement(image_viewer_1.default, { image: this._geneticAlgorithm.bestImage }),
                React.createElement(algorithm_configuration_1.default, { configuration: this.state.configuration, onChange: this.updateConfiguration }),
                React.createElement(flow_control_1.default, { paused: this.state.paused, start: this.start, pause: this.pause, reset: this.reset }),
                React.createElement(algorithm_log_1.default, { generation: this.state.generation, currentScore: this.state.currentScore, bestScore: this.state.bestScore, bestScoreAge: this.state.bestScoreAge, configuration: this.state.configuration })));
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
            this._image = new SvgGenerator.Image.Raster.RasterImage("./resources/apple.jpg");
            this._image.load().then(this._imageLoaded.bind(this));
        }
        _imageLoaded() {
            this.setState({
                ready: true
            });
        }
        render() {
            if (!this.state.ready)
                return React.createElement("div", null, "Loading image");
            return (React.createElement("div", null,
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