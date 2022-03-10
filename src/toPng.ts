import Convertor from './convertor';

(async () => {
	let conv = new Convertor('assets/tree.pai');
	conv.convertToPNG();
})();
