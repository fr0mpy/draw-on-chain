
import React from 'react'

enum Tools {
	Pencil = 'Pencil',
	Eraser = 'Eraser',
	Line = 'Line'
}

interface IMousePosition {
	x: number,
	y: number
}

const Canvas: React.FC = () => {

	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const contextRef = React.useRef<CanvasRenderingContext2D | null>(null);

	const [currentTool, setCurrentTool] = React.useState<Tools>(Tools.Pencil);
	const [color, setColor] = React.useState<string>('black');
	const [toolSize, setToolSize] = React.useState<number>(15);
	const [currentlyUsingTool, setCurrentlyUsingTool] = React.useState<boolean>(false);
	const [isErasing, setIsErasing] = React.useState<boolean>(false);
	const [lineCap, setLineCap] = React.useState<CanvasLineCap>('square');
	const [scale, setScale] = React.useState<number>(0);
	const [mousePosition, setMousePosition] = React.useState<IMousePosition>({ x: 0, y: 0 });

	React.useEffect(() => {
		initaliseCanvas();
	}, []);

	const initaliseCanvas = () => {

		const CANVAS_WIDTH = 12;
		const CANVAS_HEIGHT = 12;
		const scale = Math.floor(window.innerWidth / (CANVAS_WIDTH * 2.5));
		const canvas = canvasRef.current;

		if (!canvas) return;

		canvas.width = CANVAS_WIDTH * scale;
		canvas.height = CANVAS_HEIGHT * scale;
		canvas.style.width = `${CANVAS_WIDTH * scale}px`
		canvas.style.height = `${CANVAS_HEIGHT * scale}px`
		canvas.style.border = 'solid 1px black';
		canvas.style.cursor = 'crosshair';

		contextRef.current = canvas.getContext('2d');

		if (!contextRef?.current) return;

		canvas.style.backgroundColor = 'cyan';
		// contextRef.current.lineCap = lineCap;
		// contextRef.current.strokeStyle = color;
		contextRef.current.lineWidth = 1 * scale;
		setScale(scale);
	}



	const drawOrErase = (e: React.MouseEvent<HTMLCanvasElement>, dot?: boolean): void => {
		if ((!dot && !currentlyUsingTool) || !canvasRef?.current || !contextRef?.current) return;

		let rect = canvasRef.current.getBoundingClientRect();

		const currentX = Math.floor((e.clientX - rect.left) / scale) * scale;
		const currentY = Math.floor((e.clientY - rect.top) / scale) * scale;

		contextRef.current.beginPath();
		contextRef.current.fillStyle = isErasing ? canvasRef.current.style.backgroundColor : color;
		contextRef.current.fillRect(currentX, currentY, 1 * scale, 1 * scale);
		contextRef.current.fill();
	}

	const clearCanvas = () => {
		if (!contextRef?.current || !canvasRef?.current) return;
		contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
	}

	return (
		<>
			<button onClick={() => setIsErasing(false)}>pencil</button>
			<button onClick={() => setIsErasing(true)}>eraser</button>
			<button onClick={clearCanvas}>clear</button>

			<canvas
				ref={canvasRef}
				onMouseDown={(e) => { setCurrentlyUsingTool(true); drawOrErase(e, true) }}
				onMouseMove={drawOrErase}

				onMouseUp={() => setCurrentlyUsingTool(false)}
				onMouseLeave={() => setCurrentlyUsingTool(false)}
			/>
		</>
	)
}

export default Canvas;


// const startDrawingSquare = () => { };
// const finishDrawingSquare = () => { };

// const startDrawingCircle = () => { };
// const finishDrawingCircle = () => { };

// const undo = () => { };
// const redo = () => { };

// const useColor = () => { };
// const fill = () => { };

// const zoomIn = () => { };
// const zoomOut = () => { };

