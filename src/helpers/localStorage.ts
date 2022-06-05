export const save = (canvas: HTMLCanvasElement | null) => {
	if (!canvas) return;
	localStorage.setItem('canvas', canvas.toDataURL());
};

export const load = (context: CanvasRenderingContext2D | null) => {
	if (!context) return;

	const loadedData = localStorage.getItem('canvas');

	if (!loadedData) return;
	const dataURL = localStorage.getItem('canvas');
	const img = new Image();

	if (!dataURL) return;

	img.src = dataURL;
	img.onload = function () {
		if (!context) return;

		context.drawImage(img, 0, 0);
	};
};
