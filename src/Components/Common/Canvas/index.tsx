
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { showPencilColorPicker } from '../../../Redux/appSlice';
import { ColorPicker } from '../PencilColorPicker';
import FloodFill from 'q-floodfill'
import { getPixelHexCode } from '../../../helpers/colors';
import { load, save } from '../../../helpers/localStorage';
import { pixelAlreadyDrawnOn } from '../../../helpers/canvas';
import { Tools } from '../../../enums/tools';
import { fabric } from 'fabric';
import { render } from '@testing-library/react';
import { usePrevious } from '../../../hooks/usePrevious';
import 'fabric-history';


const Canvas: React.FC = () => {

	const canvasRef = React.useRef<fabric.Canvas | null>(null);
	const objRef = React.useRef<fabric.Line | null>(null);

	const [tool, setTool] = React.useState<string>('draw');
	const [mouseDown, setMouseDown] = React.useState<boolean>(false);
	const [drawing, setDrawing] = React.useState<boolean>(false);
	const [colorPicker, setColorPicker] = React.useState<boolean>(false);
	const [brushColor, setBrushColor] = React.useState<any>('black');
	const [brushWidth, setBrushWidth] = React.useState<number>(4);
	const [walletConnected, setWalletConnected] = React.useState<boolean>(false);
	const [walletAddress, setWalletAddress] = React.useState<string>('');
	const [line, setLine] = React.useState<fabric.Line>();
	const [isDrawingMode, setDrawingMode] = React.useState<boolean>(true);


	React.useEffect(() => {
		setCanvas();
	}, [canvasRef, tool]);


	const connectWallet = () => {

		if ((window as any).ethereum) {

			(window as any).ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: any) => {
				const [account] = accounts;
				(window as any).userWalletAddress = account;
				setWalletConnected(true);
				setWalletAddress(account);
				console.log('3')

			});
		} else {
			alert('No Web3 Wallet Extension Detected. Please install MetaMask');
		}

	}

	const setCanvas = () => {
		if (!canvasRef.current) {
			canvasRef.current = new fabric.Canvas('canvas', { width: 640, height: 640, backgroundColor: 'white' });

			canvasRef.current.renderAll();

		}
		canvasRef.current.freeDrawingBrush.width = brushWidth;
		canvasRef.current.freeDrawingBrush.color = brushColor;
		canvasRef.current.isDrawingMode = isDrawingMode;

		canvasRef.current.on('mouse:down', (e) => {
			setMouseDown(true);

			if (!canvasRef.current) return;

			switch (tool) {
				case 'line':
					if (!e.pointer) return;

					objRef.current = new fabric.Line(
						[e.pointer?.x, e.pointer?.y, e.pointer?.x + 100, e.pointer.y + 100],
						{ stroke: brushColor, strokeWidth: brushWidth }
					)
					canvasRef.current.add(objRef.current);
					break;
				default:
					return;
			}

		});
		canvasRef.current.on('mouse:move', (e) => {
			if (!mouseDown) return;

			switch (tool) {
				case 'draw':
					if (!canvasRef.current) return;
					// canvasRef.current.isDrawingMode = true;
					// canvasRef.current.renderAll();
					break;
				case 'erase':
					if (!canvasRef.current) return;
					// canvasRef.current.isDrawingMode = true;
					// canvasRef.current.renderAll();
					break;
				default:
					if (!canvasRef.current) return;
					return canvasRef.current.isDrawingMode === false;
			}
		});
		canvasRef.current.on('mouse:up', () => {
			setMouseDown(false);
		});
	}

	const handleBrushColor = (color: string) => {
		if (!canvasRef.current) return;
		canvasRef.current.freeDrawingBrush.color = color;
		setBrushColor(color)
	}

	const handleBrushWidth = (width: number) => {
		if (!canvasRef.current) return;
		canvasRef.current.freeDrawingBrush.width = width;
		setBrushWidth(width)
	}

	const handleDraw = () => {

		if (!canvasRef.current) return;

		if (tool === 'draw') {
			setDrawingMode(false);
			setTool('')
		}

		else {
			setDrawingMode(true);
			setBrushColor('black');
			setTool('draw');
		}
	}

	const handleClear = () => {
		if (!canvasRef.current) return;

		canvasRef.current.getObjects().forEach(o => {
			if (o !== canvasRef.current?.backgroundImage) {
				canvasRef.current?.remove(o);
			}
		})
	}

	const handleToSVG = () => {
		if (!canvasRef.current) return;

		console.log('svg', canvasRef.current.toSVG());
	}

	const handleErase = () => {

		if (!canvasRef.current) return;

		if (tool === 'erase') {
			setDrawingMode(false);
			setTool('');
			setBrushColor('black');
		}

		else {
			setDrawingMode(true);
			setTool('erase')
			setBrushColor('white')
		}
	}

	const handleUndo = () => {
		if (!canvasRef.current) return;
		(canvasRef.current as any).undo();
	}

	const handleRedo = () => {
		if (!canvasRef.current) return;
		(canvasRef.current as any).redo();
	}

	/**
	 * choose bg color
	 * add image?
	 */

	const tempDrawBtnStyle = { color: tool === 'draw' ? 'white' : 'black', backgroundColor: tool === 'draw' ? 'black' : 'white' }
	const tempEraseBtnStyle = { color: tool === 'erase' ? 'white' : 'black', backgroundColor: tool === 'erase' ? 'black' : 'white' }

	return (
		<>
			<button onClick={connectWallet}>connect</button>
			<p>{walletConnected && `Connected as ${walletAddress.slice(0, 10)}...`}</p>
			<div>
				<button onClick={handleDraw} style={tempDrawBtnStyle}>draw</button>
				<button onClick={() => setColorPicker(!colorPicker)}>color</button>
				<label>
					brush width
					<input type="range" min={1} max={100} value={brushWidth} onChange={(e) => handleBrushWidth(Number(e.target.value))} />
					<input type="number" min={1} max={100} value={brushWidth} onChange={(e) => handleBrushWidth(Number(e.target.value))} />
				</label>
				<button onClick={handleClear}> clear </button>
				<button onClick={handleErase} style={tempEraseBtnStyle}> erase</button>
				<button onClick={handleToSVG}> to SVG </button>
				<button onClick={handleUndo}> undo </button>
				<button onClick={handleRedo}> redo </button>


			</div>
			<br />
			<div style={{ border: 'solid 4px black', height: 640, width: 640 }}>
				<canvas id={'canvas'} />
			</div>
			{<ColorPicker setColor={handleBrushColor} color={brushColor} />}
			<p>hw</p>
		</>
	)
}

export default Canvas;
