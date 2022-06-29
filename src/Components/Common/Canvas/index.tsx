
import React from 'react'
import { ColorPicker } from '../ColorPicker';
import FloodFill from 'q-floodfill'
import { fabric } from 'fabric';
import 'fabric-history';


const Canvas: React.FC = () => {

	const canvasRef = React.useRef<fabric.Canvas | null>(null);
	const objRef = React.useRef<fabric.Line | fabric.Triangle | fabric.Circle | fabric.Rect | null>(null);
	const mousedownRef = React.useRef<boolean>(false);
	const drawingObjRef = React.useRef<boolean>(false);

	const [tool, setTool] = React.useState<string>('draw');
	const [colorPicker, setColorPicker] = React.useState<boolean>(false);
	const [brushColor, setBrushColor] = React.useState<any>('black');
	const [brushWidth, setBrushWidth] = React.useState<number>(4);
	const [walletConnected, setWalletConnected] = React.useState<boolean>(false);
	const [walletAddress, setWalletAddress] = React.useState<string>('');
	const [isDrawingMode, setDrawingMode] = React.useState<boolean>(true);
	const [objectSelection, setObjectSelection] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (!canvasRef.current) return;
		canvasRef.current.isDrawingMode = isDrawingMode;
		handleLoad();
		loadBrushColor();
	}, []);

	React.useEffect(() => {
		setCanvas();
	}, [canvasRef, tool, brushWidth, brushColor, objectSelection]);

	const connectWallet = () => {

		if ((window as any).ethereum) {

			(window as any).ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: any) => {
				const [account] = accounts;
				(window as any).userWalletAddress = account;
				setWalletConnected(true);
				setWalletAddress(account);

			});
		} else {
			alert('No Web3 Wallet Extension Detected. Please install MetaMask');
		}

	}

	// Add: triangles, squares, circles.

	const setCanvas = () => {
		if (!canvasRef.current) {
			canvasRef.current = new fabric.Canvas('canvas', { width: 640, height: 640, backgroundColor: 'white' });
			canvasRef.current.renderAll();
		}

		canvasRef.current.forEachObject(o => { o.selectable = objectSelection; o.evented = objectSelection });
		canvasRef.current.freeDrawingBrush.width = brushWidth;
		canvasRef.current.freeDrawingBrush.color = tool === 'erase' ? 'white' : brushColor;

		canvasRef.current.on('mouse:down', (e) => {

			if (!canvasRef.current) return;
			mousedownRef.current = true;

			switch (tool) {
				case 'line':
					if (!e.pointer || !drawingObjRef.current) return;
					canvasRef.current.selection = objectSelection;

					objRef.current = new fabric.Line(
						[e.pointer?.x, e.pointer?.y, e.pointer?.x, e.pointer.y],
						{ stroke: brushColor, strokeWidth: brushWidth, selectable: objectSelection, evented: objectSelection }
					)
					canvasRef.current.add(objRef.current);
					canvasRef.current.renderAll();
					break;
				case 'circle':
					if (!e.pointer || !drawingObjRef.current) return;
					canvasRef.current.selection = objectSelection;

					objRef.current = new fabric.Circle(
						{
							left: e.pointer.x,
							top: e.pointer.y,
							originX: 'left',
							originY: 'top',
							radius: e.pointer.x,
							angle: 0,
							fill: '',
							stroke: brushColor,
							strokeWidth: brushWidth,
							selectable: objectSelection,
							evented: objectSelection
						}
					)
					canvasRef.current.add(objRef.current);
					canvasRef.current.renderAll();
					break;
				case 'select':
					break;
				default:
					return;
			}

		});

		canvasRef.current.on('mouse:move', (e) => {
			if (!mousedownRef.current) return;
			switch (tool) {
				case 'draw':
					break;
				case 'erase':
					break;
				case 'line':
					if (!canvasRef.current || !objRef.current || !e.pointer || !drawingObjRef.current) return;
					(objRef.current as fabric.Line).set({
						x2: e.pointer.x,
						y2: e.pointer.y
					});
					objRef.current.setCoords();
					canvasRef.current.renderAll();
					break;
				case 'circle':
					break;
				case 'select':
					break;
				default:
					if (!canvasRef.current) return;
			}
		});
		canvasRef.current.on('mouse:up', () => {
			mousedownRef.current = false;
			objRef.current = null;
			handleSave();
		});
	}

	const handleBrushColor = (color: string) => {
		if (!canvasRef.current) return;
		canvasRef.current.freeDrawingBrush.color = color;
		setBrushColor(color);
	}

	const handleBrushWidth = (width: number) => {
		if (!canvasRef.current) return;
		canvasRef.current.freeDrawingBrush.width = width;
		setBrushWidth(width)
	}

	const handleDraw = () => {

		if (!canvasRef.current) return;
		drawingObjRef.current = false;
		if (tool === 'draw') {
			canvasRef.current.isDrawingMode = false;
			setTool('')
		}

		else {
			canvasRef.current.isDrawingMode = true;
			objRef.current = null;
			setBrushColor(brushColor);
			setTool('draw');
		}
	}

	const handleClear = () => {

		const isConfirmed = window.confirm('Are you sure? This will completely reset the canvas, color pallette and save state');

		if (!canvasRef.current || !isConfirmed) return;

		else if (isConfirmed) {
			canvasRef.current.getObjects().forEach(o => {
				canvasRef.current?.remove(o);
			})

			localStorage.removeItem('canvasData');
			localStorage.removeItem('colorsData');
			localStorage.removeItem('brushColor');
		}
	}

	const handleToSVG = () => {
		if (!canvasRef.current) return;

		console.log('svg', canvasRef.current.toSVG());
	}

	const handleErase = () => {

		if (!canvasRef.current) return;
		drawingObjRef.current = false;
		if (tool === 'erase') {
			canvasRef.current.isDrawingMode = false;
			setTool('');
			setBrushColor('black');
		}

		else {
			canvasRef.current.isDrawingMode = true;
			setTool('erase')
			// setBrushColor('white')
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

	const handleLine = () => {
		setObjectSelection(false);
		if (!canvasRef.current) return;
		canvasRef.current.isDrawingMode = false;

		if (tool === 'line') {
			setTool('')
			drawingObjRef.current = false;

		}

		else {
			setBrushColor(brushColor);
			setTool('line');
			drawingObjRef.current = true;
		}
	}

	const handleTriangle = () => {
		setObjectSelection(false);
		if (!canvasRef.current) return;
		canvasRef.current.isDrawingMode = false;

		if (tool === 'triangle') {
			setTool('')
			drawingObjRef.current = false;

		}

		else {
			setBrushColor(brushColor);
			setTool('triangle');
			drawingObjRef.current = true;
		}
	}

	const handleCircle = () => {
		setObjectSelection(false);
		if (!canvasRef.current) return;
		canvasRef.current.isDrawingMode = false;

		if (tool === 'circle') {
			setTool('')
			drawingObjRef.current = false;

		}

		else {
			setBrushColor(brushColor);
			setTool('circle');
			drawingObjRef.current = true;
		}
	}

	const handleSquare = () => {
		setObjectSelection(false);
		if (!canvasRef.current) return;
		canvasRef.current.isDrawingMode = false;

		if (tool === 'square') {
			setTool('')
			drawingObjRef.current = false;

		}

		else {
			setBrushColor(brushColor);
			setTool('square');
			drawingObjRef.current = true;
		}
	}

	const handleObjSelection = () => {
		if (!canvasRef.current) return;
		canvasRef.current.isDrawingMode = false;
		drawingObjRef.current = false;

		if (objectSelection) {
			setObjectSelection(false);
			setTool('');
		} else {
			setTool('select')
			setObjectSelection(true);

		}
	}

	const loadBrushColor = () => {
		const loadedBrushColor = localStorage.getItem('brushColor');

		if (!loadedBrushColor) return;

		setBrushColor(loadedBrushColor);
	}

	const handleSave = () => {
		if (!canvasRef.current) return;
		const canvasDataJSON = JSON.stringify(canvasRef.current);
		localStorage.setItem('canvasData', canvasDataJSON);
		localStorage.setItem('brushColor', brushColor);
	};

	const handleLoad = () => {
		const loadedData = localStorage.getItem('canvasData');
		if (!loadedData || !canvasRef.current) return;
		canvasRef.current.loadFromJSON(loadedData, () => canvasRef.current?.renderAll());
	};

	const tempDrawBtnStyle = (toolName: string) => { return { color: tool === toolName ? 'white' : 'black', backgroundColor: tool === toolName ? 'black' : 'white' } }

	return (
		<>
			<button onClick={connectWallet}>connect</button>
			<p>{walletConnected && `Connected as ${walletAddress.slice(0, 10)}...`}</p>
			<div>
				<button onClick={handleDraw} style={tempDrawBtnStyle('draw')}>draw</button>
				<button onClick={() => setColorPicker(!colorPicker)}>color</button>
				<label>
					brush width
					<input type="range" min={1} max={100} value={brushWidth} onChange={(e) => handleBrushWidth(Number(e.target.value))} />
					<input type="number" min={1} max={100} value={brushWidth} onChange={(e) => handleBrushWidth(Number(e.target.value))} />
				</label>
				<button onClick={handleClear}> clear </button>
				<button onClick={handleErase} style={tempDrawBtnStyle('erase')}> erase</button>
				<button onClick={handleToSVG}> to SVG </button>
				<button onClick={handleUndo}> undo </button>
				<button onClick={handleRedo}> redo </button>
				<button onClick={handleLine} style={tempDrawBtnStyle('line')}> line </button>
				<button onClick={handleTriangle} style={tempDrawBtnStyle('triangle')}> triangle </button>
				<button onClick={handleCircle} style={tempDrawBtnStyle('circle')}> circle </button>
				<button onClick={handleSquare} style={tempDrawBtnStyle('square')}> square </button>
				<button onClick={handleObjSelection} style={tempDrawBtnStyle('select')}> select</button>
			</div>
			<br />
			<div style={{ border: 'solid 4px black', height: 640, width: 640 }}>
				<canvas id={'canvas'} />
			</div>
			{<ColorPicker setColor={handleBrushColor} color={brushColor} />}
		</>
	)
}

export default Canvas;
