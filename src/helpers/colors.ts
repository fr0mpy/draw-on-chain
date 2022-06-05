export const componentToHex = (c: string) => {
	var hex = parseInt(c, 16);
	return hex.toString().length === 1 ? "0" + hex : hex;
}

export const rgbToHex = (r: string, g: string, b: string) => {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export const getPixelHexCode = (currentX: number, currentY: number, context: CanvasRenderingContext2D): string => {
	if (!context) return '';

	const data = context.getImageData(currentX, currentY, 1, 1).data;
	const hex = rgbToHex(data[0].toString(), data[1].toString(), data[2].toString());

	return hex;
}
