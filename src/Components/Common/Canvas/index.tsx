
import React, { useRef, useEffect } from 'react'

enum Tools {
	Pencil = 'Pencil',
	Eraser = 'Eraser',
	Line = 'Line'
}

const Canvas: React.FC = () => {

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const contextRef = useRef<CanvasRenderingContext2D>(null);

	const [currentTool, setCurrentTool] = React.useState<Tools>(Tools.Pencil);
	const [color, setColor] = React.useState<string>('black');
	const [toolSize, setToolSize] = React.useState<number>(5);
	const [currentlyUsingTool, setCurrentlyUsingTool] = React.useState<boolean>(false);
	const [isErasing, setIsErasing] = React.useState<boolean>(false);
	const [lineCap, setLineCap] = React.useState<CanvasLineCap>('square');

	useEffect(() => {
		initaliseCanvas();
	}, []);

	useEffect(() => {
		if (currentTool !== Tools.Eraser && isErasing) {
			finishErasing();
		}
	}, [currentTool]);

	const initaliseCanvas = () => {
		const canvas = canvasRef.current;
		contextRef.current = canvas.getContext('2d');
		canvas.height = 200;
		canvas.width = 400;
		canvas.style.height = '200px';
		canvas.style.width = '400px';
		canvas.style.cursor = 'crosshair';
		canvas.style.border = 'solid 1px black';
		canvas.style.backgroundColor = 'white';
		contextRef.current.lineCap = lineCap;
		contextRef.current.strokeStyle = color;
		contextRef.current.lineWidth = toolSize;
	}

	const startUsingTool = (tool: Tools, e: React.MouseEvent<HTMLCanvasElement>): void => {
		switch (tool) {
			case Tools.Pencil:
				startDrawing(e);
				break;
			case Tools.Eraser:
				startErasing(e);
				break;
			case Tools.Line:
				startDrawingLine(e);
				break;
			default:
				startDrawing(e);
		}
	}

	const finishUsingTool = (tool: Tools): void => {
		switch (tool) {
			case Tools.Pencil:
				finishDrawing();
				break;
			case Tools.Eraser:
				finishErasing();
				break;
			case Tools.Line:
				finishDrawing();
				break;
			default:
				finishDrawing();
		}
	}

	const brushStroke = ({ nativeEvent: { offsetX, offsetY } }: React.MouseEvent<HTMLCanvasElement>) => {
		contextRef.current.beginPath();
		contextRef.current.moveTo(offsetX, offsetY);
		contextRef.current.lineTo(offsetX, offsetY);
		contextRef.current.stroke();
	}

	const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>): void => {
		contextRef.current.strokeStyle = color;
		brushStroke(e);
		setCurrentlyUsingTool(true);
	};

	const startErasing = (e: React.MouseEvent<HTMLCanvasElement>): void => {
		contextRef.current.strokeStyle = canvasRef.current.style.backgroundColor
		brushStroke(e)
		setCurrentlyUsingTool(true);
	};

	const finishDrawing = (): void => {
		contextRef.current.closePath();
		setCurrentlyUsingTool(false);
	};

	const finishErasing = () => {
		contextRef.current.strokeStyle = color;
		setCurrentlyUsingTool(false);
	};


	const draw = ({ nativeEvent: { offsetX, offsetY } }: React.MouseEvent<HTMLCanvasElement>): void => {
		if (!currentlyUsingTool) return;

		contextRef.current.lineTo(offsetX, offsetY);
		contextRef.current.stroke();
	};

	const startDrawingLine = ({ nativeEvent: { offsetX, offsetY } }: React.MouseEvent<HTMLCanvasElement>): void => { };
	const finishDrawingLine = () => { };

	const clearCanvas = () => {
		contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
	}


	return (
		<>
			<button onClick={() => setCurrentTool(Tools.Pencil)}>pencil</button>
			<button onClick={() => setCurrentTool(Tools.Eraser)}>eraser</button>
			<button onClick={() => setCurrentTool(Tools.Line)}>Line</button>
			<button onClick={clearCanvas}>Clear</button>

			<canvas
				ref={canvasRef}
				onMouseDown={(e) => startUsingTool(currentTool, e)}
				onMouseMove={draw}
				onMouseUp={() => finishUsingTool(currentTool)}
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