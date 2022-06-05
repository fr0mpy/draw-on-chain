import FloodFill from 'q-floodfill'

export const pixelAlreadyDrawnOn = (pixelColor: string, pencilColor: string): boolean => {
	return pixelColor === pencilColor;
};

export const floodFill = (
	x: number,
	y: number,
	context: CanvasRenderingContext2D | null,
	canvas: HTMLCanvasElement | null,
	color: string
) => {

	if (!context || !canvas) return;

	const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
	const floodFill = new FloodFill(imgData);
	floodFill.fill(color, x, y, 0);
	context.putImageData(floodFill.imageData, 0, 0);
}
