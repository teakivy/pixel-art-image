"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jimp_1 = __importDefault(require("jimp"));
var fs_1 = __importDefault(require("fs"));
var canvas_1 = require("canvas");
// open a file called "lenna.png"
// jimp.read('assets/smiley.png', (err: any, img: any) => {
// 	if (err) throw err;
// 	img.quality(60) // set JPEG quality
// 		.greyscale() // set greyscale
// 		.write('converted.png'); // save
// });
var pixelSeperator = '@';
var lineSeperator = '&';
var Convertor = /** @class */ (function () {
    function Convertor(img) {
        this.img = img;
    }
    Convertor.prototype.convertToPAI = function () {
        return __awaiter(this, void 0, void 0, function () {
            var imgString;
            var _this = this;
            return __generator(this, function (_a) {
                imgString = '';
                jimp_1.default.read(this.img, function (err, image) {
                    var width = image.getWidth();
                    var height = image.getHeight();
                    var lastPixel = null;
                    var pixelSize = 0;
                    for (var y = 0; y < height; y++) {
                        for (var x = 0; x < width; x++) {
                            var pixel = image.getPixelColor(x, y);
                            var pInfo = jimp_1.default.intToRGBA(pixel);
                            pixelSize++;
                            if (lastPixel === null) {
                                lastPixel = pInfo;
                            }
                            else {
                                if (lastPixel.r !== pInfo.r ||
                                    lastPixel.g !== pInfo.g ||
                                    lastPixel.b !== pInfo.b) {
                                    imgString += "".concat(lastPixel.r, ".").concat(lastPixel.g, ".").concat(lastPixel.b, ":").concat(pixelSize).concat(pixelSeperator);
                                    pixelSize = 0;
                                    lastPixel = pInfo;
                                }
                            }
                        }
                        imgString += "".concat(lastPixel.r, ".").concat(lastPixel.g, ".").concat(lastPixel.b, ":").concat(pixelSize).concat(lineSeperator);
                        pixelSize = 0;
                        lastPixel = null;
                    }
                    imgString = imgString.substring(0, imgString.length - 1);
                    var self = _this;
                    fs_1.default.writeFile(_this.img.substring(0, _this.img.length - 3) + 'pai', imgString, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("Created ".concat(self.img.substring(0, self.img.length - 3) + 'pai'));
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    Convertor.prototype.convertToPNG = function () {
        return __awaiter(this, void 0, void 0, function () {
            var imgString, lines, i, pixels, j, pixel, color, nPixel, height, width, _i, _a, i, canvas, ctx, x, y, i, j, pixel, out, stream, self;
            return __generator(this, function (_b) {
                imgString = '';
                imgString = fs_1.default.readFileSync(this.img).toString(); // read file
                lines = imgString.split(lineSeperator);
                for (i = 0; i < lines.length; i++) {
                    pixels = lines[i].split(pixelSeperator);
                    for (j = 0; j < pixels.length; j++) {
                        pixel = pixels[j].split(':');
                        color = pixel[0].split('.');
                        nPixel = {
                            r: parseInt(color[0]),
                            g: parseInt(color[1]),
                            b: parseInt(color[2]),
                            size: parseInt(pixel[1]),
                        };
                        pixels[j] = nPixel;
                    }
                    lines[i] = pixels;
                }
                height = lines.length;
                width = 0;
                for (_i = 0, _a = lines[0]; _i < _a.length; _i++) {
                    i = _a[_i];
                    width += i.size;
                }
                canvas = (0, canvas_1.createCanvas)(width, height);
                ctx = canvas.getContext('2d');
                x = 0;
                y = 0;
                for (i = 0; i < lines.length; i++) {
                    for (j = 0; j < lines[i].length; j++) {
                        pixel = lines[i][j];
                        ctx.fillStyle = "rgb(".concat(pixel.r, ", ").concat(pixel.g, ", ").concat(pixel.b, ")");
                        ctx.fillRect(x, y, pixel.size, 1);
                        x += pixel.size;
                    }
                    x = 0;
                    y++;
                }
                out = fs_1.default.createWriteStream(this.img.substring(0, this.img.length - 4) + '-converted.png');
                stream = canvas.createPNGStream();
                self = this;
                stream.on('data', function (chunk) {
                    out.write(chunk);
                });
                stream.on('end', function () {
                    console.log("Created ".concat(self.img.substring(0, self.img.length - 4) +
                        '-converted.png'));
                });
                return [2 /*return*/];
            });
        });
    };
    return Convertor;
}());
function _same(pixel, lastPixel) {
    if ((pixel == null || lastPixel == null) && lastPixel != pixel)
        return false;
    return (pixel.r === lastPixel.r &&
        pixel.g === lastPixel.g &&
        pixel.b === lastPixel.b);
}
exports.default = Convertor;
