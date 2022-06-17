
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

const Canvas: React.FC = () => {

	const canvasRef = React.useRef<fabric.Canvas | null>(null);
	const [tool, setTool] = React.useState<string>('draw');
	const [mouseDown, setMouseDown] = React.useState<boolean>(false);
	const [drawing, setDrawing] = React.useState<boolean>(false);
	const [colorPicker, setColorPicker] = React.useState<boolean>(false);
	const [brushColor, setBrushColor] = React.useState<any>('black');
	const [brushWidth, setBrushWidth] = React.useState<number>(4);
	const [walletConnected, setWalletConnected] = React.useState<boolean>(false);
	const [walletAddress, setWalletAddress] = React.useState<string>('');


	React.useEffect(() => {

		if (!canvasRef.current) {
			initCanvas();
		}
		canvasRef.current?.renderAll();
	}, [canvasRef]);

	const connectWallet = () => {

		if ((window as any).ethereum) {

			(window as any).ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: any) => {
				const [account] = accounts;
				(window as any).userWalletAddress = account;
				setWalletConnected(true);
				setWalletAddress(account);
				// getTotalMinted();
				console.log('3')

			});
		} else {
			alert('No Web3 Wallet Extension Detected. Please install MetaMask');
		}

	}

	const initCanvas = () => {
		canvasRef.current = new fabric.Canvas('canvas', { width: 640, height: 640, backgroundColor: 'cyan' });
		canvasRef.current.renderAll();
		canvasRef.current.freeDrawingBrush.width = brushWidth;

		canvasRef.current.on('mouse:down', () => {
			setMouseDown(true);

		});
		canvasRef.current.on('mouse:move', () => {
			if (!mouseDown) return;

			switch (tool) {
				case 'draw':
					if (!canvasRef.current) return;
					canvasRef.current.renderAll();
					canvasRef.current.isDrawingMode = true;
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

	const setDrawingMode = () => {
		if (!canvasRef.current) return;

		if (canvasRef.current.isDrawingMode === true) {
			canvasRef.current.isDrawingMode = false;
			setDrawing(false);
		}

		else {
			canvasRef.current.isDrawingMode = true;
			setDrawing(true);

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

	const handleLine = () => {
		setTool('line');
	}

	/**
	 * color fill
	 * line
	 * choose bg color
	 * erase
	 * clear all
	 * undo
	 * add image?
	 * reset canvas
	 */

	return (
		<>
			<button onClick={connectWallet}>connect</button>
			<p>{walletConnected && `Connnected as ${walletAddress.slice(0, 10)}...`}</p>
			<div>
				<button onClick={setDrawingMode} style={{ color: drawing ? 'white' : 'black', backgroundColor: drawing ? 'black' : 'white' }}>draw</button>
				<button onClick={() => setColorPicker(!colorPicker)}>color</button>
				<label>
					brush width
					<input type="range" min={0} value={brushWidth} onChange={(e) => handleBrushWidth(Number(e.target.value))} />
					<input type="number" min={0} max={100} value={brushWidth} onChange={(e) => handleBrushWidth(Number(e.target.value))} />
				</label>
				<button onClick={handleClear}> clear </button>
				<button onClick={handleLine}> Line </button>

			</div>
			<br />
			<canvas id={'canvas'} style={{ border: 'solid 4px black' }} />
			{<ColorPicker setColor={handleBrushColor} color={brushColor} />}
			<p>hw</p>
		</>
	)
}

export default Canvas;
