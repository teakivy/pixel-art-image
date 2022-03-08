import jimp from 'jimp';
import fs from 'fs';

import { createCanvas } from 'canvas';

// open a file called "lenna.png"
// jimp.read('assets/smiley.png', (err: any, img: any) => {
// 	if (err) throw err;
// 	img.quality(60) // set JPEG quality
// 		.greyscale() // set greyscale
// 		.write('converted.png'); // save
// });

const pixelSeperator = '@';
const lineSeperator = '&';

class Convertor {
	img: string;
	constructor(img: string) {
		this.img = img;
	}

	async convertToPAI() {
		let imgString = '';

		jimp.read(this.img, (err, image) => {
			let width = image.getWidth();
			let height = image.getHeight();

			let lastPixel: any = null;
			let pixelSize = 0;
			for (let y = 0; y < height; y++) {
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
							imgString += `${lastPixel.r}.${lastPixel.g}.${lastPixel.b}:${pixelSize}${pixelSeperator}`;
							pixelSize = 0;
							lastPixel = pInfo;
						}
					}
				}
				imgString += `${lastPixel.r}.${lastPixel.g}.${lastPixel.b}:${pixelSize}${lineSeperator}`;
				pixelSize = 0;
				lastPixel = null;
			}
			imgString = imgString.substring(0, imgString.length - 1);
			let self: any = this;
			fs.writeFile(
				this.img.substring(0, this.img.length - 3) + 'pai',
				imgString,
				function (err: any) {
					if (err) {
						return console.log(err);
					}
					console.log(
						`Created ${
							self.img.substring(0, self.img.length - 3) + 'pai'
						}`
					);
				}
			);
		});
	}

	async convertToPNG() {
		let imgString = '';

		imgString = fs.readFileSync(this.img).toString(); // read file

		let lines: string[] | any = imgString.split(lineSeperator);

		for (let i = 0; i < lines.length; i++) {
			let pixels = lines[i].split(pixelSeperator);

			for (let j = 0; j < pixels.length; j++) {
				let pixel = pixels[j].split(':');
				let color = pixel[0].split('.');
				let nPixel = {
					r: parseInt(color[0]),
					g: parseInt(color[1]),
					b: parseInt(color[2]),
					size: parseInt(pixel[1]),
				};

				pixels[j] = nPixel;
			}

			lines[i] = pixels;
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
