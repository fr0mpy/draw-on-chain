
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { showPencilColorPicker } from '../../../Redux/appSlice';
import { PencilColorPicker } from '../PencilColorPicker';
import FloodFill from 'q-floodfill'
import { getPixelHexCode } from '../../../helpers/colors';
import { load, save } from '../../../helpers/localStorage';
import { pixelAlreadyDrawnOn } from '../../../helpers/canvas';
import { Tools } from '../../../enums/tools';


const Canvas: React.FC = () => {

	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const contextRef = React.useRef<CanvasRenderingContext2D | null>(null);
	const drawCanvasRef = React.useRef<HTMLCanvasElement>(null);
	const drawContextRef = React.useRef<CanvasRenderingContext2D | null>(null);

	const [currentlyUsingTool, setCurrentlyUsingTool] = React.useState<boolean>(false);
	const [isErasing, setIsErasing] = React.useState<boolean>(false);
	const [isFlooding, setIsFlooding] = React.useState<boolean>(false);
	const [isDrawingLine, setIsDrawingLine] = React.useState<boolean>(false);
	const [lineStart, setLineStart] = React.useState<{ x: number, y: number }>({ x: 0, y: 0 });
	const [lineEnd, setLineEnd] = React.useState<{ x: number, y: number }>({ x: 0, y: 0 });

	const [scale, setScale] = React.useState<number>(0);
	const [paths, setPaths] = React.useState<Array<ImageData>>([]);

	const { height, width, pencilColor, pencilColorPickerOpen } = useSelector((state: any) => {
		return {
			height: state.app.height,
			width: state.app.width,
			pencilColor: state.app.pencilColor,
			backgroundColor: state.app.backgroundColor,
			pencilColorPickerOpen: state.app.showPencilColorPicker,
			backgroundColorPickerOpen: state.app.showBackgroundColorPicker
		}
	});

	React.useEffect(() => {
		initalizeCanvas();
		load(contextRef.current);
	}, []);

	React.useEffect(() => {
		if (isDrawingLine) {

			const CANVAS_HEIGHT = height;
			const CANVAS_WIDTH = width;
			const scale = Math.floor(window.innerWidth / (CANVAS_WIDTH * 2.5));
			const canvas = drawCanvasRef.current;

			if (!canvas) return;

			canvas.width = CANVAS_WIDTH * scale;
			canvas.height = CANVAS_HEIGHT * scale;
			canvas.style.width = `${CANVAS_WIDTH * scale}px`
			canvas.style.height = `${CANVAS_HEIGHT * scale}px`
			canvas.style.border = 'solid 5px black';
			canvas.style.cursor = 'crosshair';

			drawContextRef.current = canvas.getContext('2d');

			if (!drawContextRef?.current) return;

			drawContextRef.current.lineWidth = 1 * scale;
			setScale(scale);


		}
	}, [isDrawingLine]);

	const dispatch = useDispatch();


	const initalizeCanvas = () => {

		const CANVAS_HEIGHT = height;
		const CANVAS_WIDTH = width;
		const scale = Math.floor(window.innerWidth / (CANVAS_WIDTH * 2.5));
		const canvas = canvasRef.current;

		if (!canvas) return;

		canvas.width = CANVAS_WIDTH * scale;
		canvas.height = CANVAS_HEIGHT * scale;
		canvas.style.width = `${CANVAS_WIDTH * scale}px`
		canvas.style.height = `${CANVAS_HEIGHT * scale}px`
		canvas.style.border = 'solid 5px black';
		canvas.style.cursor = 'crosshair';

		contextRef.current = canvas.getContext('2d');

		if (!contextRef?.current) return;

		contextRef.current.lineWidth = 1 * scale;
		setScale(scale);
	}

	const floodFill = (x: number, y: number) => {

		if (!contextRef?.current || !canvasRef?.current) return;

		const imgData = contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
		const floodFill = new FloodFill(imgData);
		floodFill.fill(pencilColor, x, y, 0);
		contextRef.current.putImageData(floodFill.imageData, 0, 0);
	}

	const drawOrErase = (e: React.MouseEvent<HTMLCanvasElement>, dot?: boolean): void => {
		if ((!dot && !currentlyUsingTool) || !canvasRef?.current || !contextRef?.current) return;
		const rect = canvasRef.current.getBoundingClientRect();
		const currentX = Math.floor((e.clientX - rect.left) / scale) * scale;
		const currentY = Math.floor((e.clientY - rect.top) / scale) * scale;

		if (pixelAlreadyDrawnOn(getPixelHexCode(currentX, currentY, contextRef.current), pencilColor) && !isErasing) return;

		contextRef.current.fillStyle = isErasing ? 'white' : pencilColor;
		contextRef.current.fillRect(currentX, currentY, 1 * scale, 1 * scale);

		setPaths([...paths, contextRef.current.getImageData(0, 0, Number(canvasRef.current.width), Number(canvasRef.current.height))])
	}

	const clearCanvas = (): void => {
		if (!contextRef?.current || !canvasRef?.current) return;
		contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
		localStorage.removeItem('canvas');
		setPaths([]);
	}

	const undo = () => {
		if (paths.length === 0) clearCanvas();
		setPaths(paths.slice(0, paths.length - 1));
		contextRef.current?.putImageData(paths[paths.length - 1], 0, 0);
	}

	const onButtonClick = (tool: Tools) => {
		switch (tool) {
			case Tools.Pencil:
				setIsErasing(false);
				setIsFlooding(false);
				setIsDrawingLine(false);
				break;
			case Tools.Eraser:
				setIsErasing(!isErasing);
				setIsFlooding(false);
				setIsDrawingLine(false);
				break;
			case Tools.Fill:
				setIsFlooding(!isFlooding);
				setIsErasing(false);
				setIsDrawingLine(false);
				break;
			case Tools.Undo:
				undo();
				break;
			case Tools.Clear:
				clearCanvas();
				break;
			case Tools.Color:
				dispatch(showPencilColorPicker(!pencilColorPickerOpen));
				break;
			case Tools.Line:
				setIsDrawingLine(!isDrawingLine);
				setIsErasing(false);
				setIsFlooding(false);
				setCurrentlyUsingTool(false);
				break;
			default:
				return;
		}
	}

	const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {

		if (isDrawingLine && drawCanvasRef?.current) {
			const rect = drawCanvasRef.current.getBoundingClientRect();
			const currentX = Math.floor((e.clientX - rect.left) / scale) * scale;
			const currentY = Math.floor((e.clientY - rect.top) / scale) * scale;
			setLineStart({ x: currentX, y: currentY });
			setCurrentlyUsingTool(true);
			// drawOrErase(e, true)
		}

		if (isFlooding && canvasRef?.current) {
			const rect = canvasRef.current.getBoundingClientRect();

			const currentX = Math.floor((e.clientX - rect.left) / scale) * scale;
			const currentY = Math.floor((e.clientY - rect.top) / scale) * scale;
			floodFill(currentX, currentY);
		} else {
			setCurrentlyUsingTool(true);
			drawOrErase(e, true);
		}
	}

	const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {

		if (isErasing || currentlyUsingTool) {
			drawOrErase(e);
		}

		if (isDrawingLine && currentlyUsingTool) {
			if (!drawCanvasRef?.current || !drawContextRef?.current) return;
			const rect = drawCanvasRef.current.getBoundingClientRect();

			const currentX = Math.floor((e.clientX - rect.left) / scale) * scale;
			const currentY = Math.floor((e.clientY - rect.top) / scale) * scale;

			if (onX !== lastOnX || onY !== lastOnY) {
				onScreenCTX.clearRect(0, 0, ocWidth, ocHeight);
				drawCanvas();
				//set offscreen endpoint
				lastX = mouseX;
				lastY = mouseY;
				actionLine(
					lineX,
					lineY,
					mouseX,
					mouseY,
					brushColor,
					onScreenCTX,
					ratio
				);
				lastOnX = onX;
				lastOnY = onY;
			}

		}
	}

	const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (isDrawingLine && drawCanvasRef?.current && contextRef?.current) {
			const rect = drawCanvasRef.current.getBoundingClientRect();

			const currentX = Math.floor((e.clientX - rect.left) / scale) * scale;
			const currentY = Math.floor((e.clientY - rect.top) / scale) * scale;

			// contextRef.current?.beginPath();
			// contextRef.current?.moveTo(lineStart.x, lineStart.y);
			// contextRef.current?.lineTo(currentX, currentY);
			// contextRef.current?.stroke();

			// drawContextRef.current?.clearRect(0, 0, 600, 600);

			// finds the distance between points

			// finds the angle of (x,y) on a plane from the origin
			const x = currentX - lineStart.x;
			const y = currentY - lineStart.y;

			let dist = Math.sqrt((currentX - lineStart.x) * (currentX - lineStart.x) + (lineStart.y - currentY) * (lineStart.y - currentY));
			let ang = Math.atan(y / (x === 0 ? 0.01 : x)) + (x < 0 ? Math.PI : 0);

			for (let i = 0; i < dist; i++) {
				// for each point along the line
				contextRef.current.fillRect(
					Math.round(lineStart.x + Math.cos(ang) * i) * scale, // round for perfect pixels
					Math.round(lineStart.y + Math.sin(ang) * i) * scale, // thus no aliasing
					scale,
					scale
				);
			}

			contextRef.current.fillRect(
				Math.round(currentX) * scale, // round for perfect pixels
				Math.round(currentY) * scale, // thus no aliasing
				scale,
				scale
			);
			setCurrentlyUsingTool(false);

		} else {
			setCurrentlyUsingTool(false);
		}
		save(canvasRef.current);
	}

	const onMouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
		setCurrentlyUsingTool(false);
	}


	return (
		<div style={{ display: 'flex', flexFlow: 'column' }}>
			<div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
				<button onClick={() => onButtonClick(Tools.Pencil)}>pencil</button>
				<button onClick={() => onButtonClick(Tools.Eraser)}>eraser</button>
				<button onClick={() => onButtonClick(Tools.Fill)}>fill</button>
				<button onClick={() => onButtonClick(Tools.Undo)}>undo</button>
				<button onClick={() => onButtonClick(Tools.Clear)}>clear all</button>
				<button onClick={() => onButtonClick(Tools.Color)}>color</button>
				<button onClick={() => onButtonClick(Tools.Line)}>line</button>
				<span
					onClick={() => dispatch(showPencilColorPicker(!pencilColorPickerOpen))}
					style={{ height: '22px', width: '22px', boxSizing: 'border-box', margin: '0 2px', border: 'solid 4px black', display: 'inline-block', backgroundColor: pencilColor }}
				/>
				{pencilColorPickerOpen ? <PencilColorPicker /> : null}
			</div>
			{isDrawingLine
				? <canvas
					ref={drawCanvasRef}
					onMouseDown={onMouseDown}
					onMouseMove={onMouseMove}
					onMouseUp={onMouseUp}
					onMouseLeave={onMouseLeave}
				/>
				: null}
			<canvas
				ref={canvasRef}
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove}
				onMouseUp={onMouseUp}
				onMouseLeave={onMouseLeave}
			/>
		</div>
	)
}

export default Canvas;
