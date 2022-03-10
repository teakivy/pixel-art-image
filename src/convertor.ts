import jimp from 'jimp';
import fs from 'fs';

import { createCanvas } from 'canvas';
import rgbHex from './rgbHex.js';
import hexRgb from './hexRgb.js';

import LZUTF8 from 'lzutf8';

const pixelSeperator = '@';
const lineSeperator = '&';

class Convertor {
	img: string;
	constructor(img: string) {
		this.img = img;
	}

	async convertToPAI() {
		let imgString = '';

		let lines: string[] = [];

		jimp.read(this.img, async (err, image) => {
			let width = image.getWidth();
			let height = image.getHeight();

			let lastPixel: any = null;
			let pixelSize = 0;
			for (let y = 0; y < height; y++) {
				let line = '';
				for (let x = 0; x < width; x++) {
					let pixel = image.getPixelColor(x, y);
					let pInfo = jimp.intToRGBA(pixel);

					pixelSize++;
					if (lastPixel === null) {
						lastPixel = pInfo;
					} else {
						if (
							lastPixel.r !== pInfo.r ||
							lastPixel.g !== pInfo.g ||
							lastPixel.b !== pInfo.b
						) {
							let hexCode = rgbHex(
								lastPixel.r,
								lastPixel.g,
								lastPixel.b
							);
							line += `${hexCode}:${pixelSize}${pixelSeperator}`;
							pixelSize = 0;
							lastPixel = pInfo;
						}
					}
				}
				let hexCode = rgbHex(lastPixel.r, lastPixel.g, lastPixel.b);
				line += `${hexCode}:${pixelSize}`;
				pixelSize = 0;
				lastPixel = null;

				lines.push(line);
			}

			// let lineSize = 0;
			// for (let i = 0; i < lines.length; i++) {
			// 	if (i <= 1) {
			// 		imgString += lines[i];
			// 		continue;
			// 	}

			// 	lineSize++;
			// 	if (lines[i] !== lines[i - 1] && lineSize > 1) {
			// 		imgString += `${lines[i]}x${lineSize}${lineSeperator}`;
			// 		lineSize = 0;
			// 	} else {
			// 		imgString += `${lines[i]}${lineSeperator}`;
			// 	}
			// }

			let lastLine = '';
			let lineSize = 1;

			for (let i = 0; i < lines.length; i++) {
				if (!lines[i - 1]) {
					lastLine = lines[i];
					continue;
				}

				if (lines[i] == lastLine) {
					lineSize++;
				} else {
					if (lineSize > 1) {
						imgString += `${lastLine}x${lineSize}${lineSeperator}`;
					} else {
						imgString += `${lastLine}${lineSeperator}`;
					}
					lineSize = 1;
					lastLine = lines[i];
				}

				// lineSize++;
				// if (lines[i] !== lines[i - 1] && lineSize > 1) {
				// 	imgString += `${lines[i]}x${lineSize}${lineSeperator}`;
				// 	console.log(lineSize, i);
				// 	lineSize = 0;
				// } else {
				// 	imgString += `${lines[i]}${lineSeperator}`;
				// }
			}

			// imgString = lines.join(lineSeperator);

			imgString = imgString.substring(0, imgString.length - 1);
			console.log(imgString);
			imgString = LZUTF8.compress(imgString, {
				outputEncoding: 'BinaryString',
			});

			let self: any = this;
			fs.writeFile(
				this.img.substring(0, this.img.length - 3) + 'pai',
				await imgString,
				function (err: any) {
					if (err) {
						return console.log(err);
					}
					console.log(
						`Created ${
							self.img.substring(0, self.img.length - 3) + 'pai'
						}`
					);
					process.exit(0);
				}
			);
		});
	}

	async convertToPNG() {
		let imgString = '';

		imgString = LZUTF8.decompress(fs.readFileSync(this.img).toString(), {
			inputEncoding: 'BinaryString',
		});

		let tlines: string[] | any = imgString.split(lineSeperator);

		let lines: string[] | any = [];

		for (let i = 0; i < tlines.length; i++) {
			let tline = tlines[i].split('x');
			let pixels = tline[0].split(pixelSeperator);

			for (let j = 0; j < pixels.length; j++) {
				let pixel = pixels[j].split(':');
				let color = hexRgb(pixel[0]);

				let nPixel = {
					r: color.red,
					g: color.green,
					b: color.blue,
					size: parseInt(pixel[1]),
				};

				pixels[j] = nPixel;
			}

			// tlines[i] = pixels;
			if (tline.length > 1) {
				for (let j = 0; j < parseInt(tline[1]); j++) {
					lines.push(pixels);
				}
			} else {
				lines.push(pixels);
			}
		}
		let height = lines.length;
		let width = 0;
		for (let i of lines[0]) {
			width += i.size;
		}

		let canvas = createCanvas(width, height);
		let ctx = canvas.getContext('2d');

		let x = 0;
		let y = 0;
		for (let i = 0; i < lines.length; i++) {
			for (let j = 0; j < lines[i].length; j++) {
				let pixel = lines[i][j];
				ctx.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
				ctx.fillRect(x, y, pixel.size, 1);
				x += pixel.size;
			}
			x = 0;
			y++;
		}

		let out = fs.createWriteStream(
			this.img.substring(0, this.img.length - 4) + '-converted.png'
		);
		let stream = canvas.createPNGStream();

		let self = this;
		stream.on('data', function (chunk) {
			out.write(chunk);
		});

		stream.on('end', function () {
			console.log(
				`Created ${
					self.img.substring(0, self.img.length - 4) +
					'-converted.png'
				}`
			);
		});
	}
}

function _same(pixel: any, lastPixel: any) {
	if ((pixel == null || lastPixel == null) && lastPixel != pixel)
		return false;
	return (
		pixel.r === lastPixel.r &&
		pixel.g === lastPixel.g &&
		pixel.b === lastPixel.b
	);
}

export default Convertor;
