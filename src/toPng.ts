import Convertor from './convertor';

(async () => {
	let conv = new Convertor('assets/brick.pai');
	conv.convertToPNG();
})();
