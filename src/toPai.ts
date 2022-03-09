import Convertor from './convertor';

import fs from 'fs';
import LZUTF8 from 'lzutf8';

(async () => {
	let conv = new Convertor('assets/brick.png');
	conv.convertToPAI();
})();
