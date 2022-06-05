
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { showPencilColorPicker } from '../../../Redux/appSlice';
import { BackgroundColorPicker } from '../../BackgroundColorPicker';
import { PencilColorPicker } from '../PencilColorPicker';
import FloodFill from 'q-floodfill'
import { getPixelHexCode } from '../../../helpers/colors';
import { load, save } from '../../../helpers/localStorage';
import { pixelAlreadyDrawnOn } from '../../../helpers/canvas';


const Canvas: React.FC = () => {

	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const contextRef = React.useRef<CanvasRenderingContext2D | null>(null);

	const [currentlyUsingTool, setCurrentlyUsingTool] = React.useState<boolean>(false);
	const [isErasing, setIsErasing] = React.useState<boolean>(false);
	const [isFlooding, setIsFlooding] = React.useState<boolean>(false);

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
		let rect = canvasRef.current.getBoundingClientRect();
		const currentX = Math.floor((e.clientX - rect.left) / scale) * scale;
		const currentY = Math.floor((e.clientY - rect.top) / scale) * scale;

		if (pixelAlreadyDrawnOn(getPixelHexCode(currentX, currentY, contextRef.current), pencilColor)) return;

		contextRef.current.fillStyle = isErasing ? canvasRef.current.style.backgroundColor : pencilColor;
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

	const onButtonClick = (buttonName: string) => {
		switch (buttonName) {
			case 'pencil':
				setIsErasing(false);
				setIsFlooding(false)
				break;
			case 'eraser':
				setIsErasing(true);
				setIsFlooding(false)
				break;
			case 'fill':
				setIsFlooding(!isFlooding)
				break;
			case 'undo':
				undo();
				break;
			case 'clear-all':
				clearCanvas();
				break;
			case 'color':
				dispatch(showPencilColorPicker(!pencilColorPickerOpen))
				break;
			default:
				return;
		}
	}

	const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (isFlooding && canvasRef?.current) {
			let rect = canvasRef.current.getBoundingClientRect();

			const currentX = Math.floor((e.clientX - rect.left) / scale) * scale;
			const currentY = Math.floor((e.clientY - rect.top) / scale) * scale;
			floodFill(currentX, currentY);
		} else {
			setCurrentlyUsingTool(true);
			drawOrErase(e, true);
		}
	}

	const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
		drawOrErase(e);
	}

	const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
		setCurrentlyUsingTool(false);
		save(canvasRef.current);
	}

	const onMouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
		setCurrentlyUsingTool(false);
	}


	return (
		<div style={{ display: 'flex', flexFlow: 'column' }}>
			<div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
				<button onClick={() => onButtonClick('pencil')}>pencil</button>
				<button onClick={() => onButtonClick('eraser')}>eraser</button>
				<button onClick={() => onButtonClick('fill')}>fill</button>
				<button onClick={() => onButtonClick('undo')}>undo</button>
				<button onClick={() => onButtonClick('clear-all')}>clear all</button>
				<button onClick={() => onButtonClick('color')}>color</button>
				<span
					onClick={() => dispatch(showPencilColorPicker(!pencilColorPickerOpen))}
					style={{ height: '22px', width: '22px', boxSizing: 'border-box', margin: '0 2px', border: 'solid 4px black', display: 'inline-block', backgroundColor: pencilColor }}
				/>
				{pencilColorPickerOpen ? <PencilColorPicker /> : null}
			</div>
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
