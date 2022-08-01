import { useDispatch, useSelector } from "react-redux";
import { setBrushColor, setBrushWidth, setIsDrawingMode, setObjectSelection, setShapeFill, setSVG, setTool, showMintModal, updateWalletAddress } from "../../../Redux/appSlice";
import 'fabric-history';
import { ColorPicker } from "../ColorPicker";

interface IProps {
	canvasRef: React.MutableRefObject<fabric.Canvas | null>,
	objRef: React.MutableRefObject<fabric.Line | fabric.Triangle | fabric.Circle | fabric.Rect | null>,
	objOriginRef: React.MutableRefObject<{ x: number, y: number }>,
	mousedownRef: React.MutableRefObject<boolean>;
	drawingObjRef: React.MutableRefObject<boolean>;
}

const RightSideMenu: React.FC<IProps> = ({ canvasRef, drawingObjRef, objRef }) => {

	const dispatch = useDispatch();

	const {
		tool,
		brushColor,
		brushWidth,
		walletAddress,
		objectSelection
	} = useSelector((state: any) => {
		return {
			tool: state.app.tool,
			brushColor: state.app.brushColor,
			brushWidth: state.app.brushWidth,
			walletAddress: state.app.walletAddress,
			objectSelection: state.app.objectSelection
		}
	});


	const connectWallet = () => {

		if ((window as any).ethereum) {

			(window as any).ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: any) => {
				const [account] = accounts;
				(window as any).userWalletAddress = account;
				dispatch(updateWalletAddress(account))

			});
		} else {
			alert('No Web3 Wallet Extension Detected. Please install MetaMask');
		}

	}

	const handleDraw = () => {

		if (!canvasRef.current) return;
		drawingObjRef.current = false;
		if (tool === 'draw') {
			dispatch(setIsDrawingMode(false));
			dispatch(setTool(''));
		}

		else {
			dispatch(setIsDrawingMode(true));
			objRef.current = null;
			dispatch(setBrushColor(brushColor));
			dispatch(setTool('draw'));
		}
	};

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
	};

	const handleErase = () => {
		if (!canvasRef.current) return;
		drawingObjRef.current = false;
		if (tool === 'erase') {

			canvasRef.current.isDrawingMode = false;
			dispatch(setIsDrawingMode)
			dispatch(setTool(''));
			setBrushColor(brushColor);
		}

		else {
			canvasRef.current.isDrawingMode = true;
			dispatch(setTool('erase'));
		}
	};

	const handleUndo = () => {
		if (!canvasRef.current) return;
		(canvasRef.current as any).undo();
	}

	const handleRedo = () => {
		if (!canvasRef.current) return;
		(canvasRef.current as any).redo();
	}


	const handleBrushColor = (color: string) => {
		if (!canvasRef.current) return;
		canvasRef.current.freeDrawingBrush.color = color;
		dispatch(setBrushColor(color));
	};


	const handleToSVG = () => {
		if (!canvasRef.current) return;
		const trimmedSVG = canvasRef.current.toSVG().split('>').slice(2, canvasRef.current.toSVG().split('>').length).join('>');
		dispatch(setSVG(trimmedSVG));
	};

	const handleMint = () => {
		handleToSVG();
		dispatch(showMintModal(true));
	};

	const handleLine = () => {
		dispatch(setObjectSelection(false));
		if (!canvasRef.current) return;
		canvasRef.current.isDrawingMode = false;

		if (tool === 'line') {
			dispatch(setTool(''))
			drawingObjRef.current = false;

		}

		else {
			dispatch(setBrushColor(brushColor));
			dispatch(setTool('line'));
			drawingObjRef.current = true;
		}
	};

	const handleCircle = () => {
		dispatch(setObjectSelection(false));
		if (!canvasRef.current) return;
		canvasRef.current.isDrawingMode = false;

		if (tool === 'circle') {
			dispatch(setTool(''));
			drawingObjRef.current = false;
		}

		else {
			dispatch(setBrushColor(brushColor));
			dispatch(setTool('circle'));
			drawingObjRef.current = true;
		}
	}

	const handleSquare = () => {
		dispatch(setObjectSelection(false));
		if (!canvasRef.current) return;
		canvasRef.current.isDrawingMode = false;

		if (tool === 'square') {
			dispatch(setTool(''));
			drawingObjRef.current = false;
		}

		else {
			dispatch(setBrushColor(brushColor));
			dispatch(setTool('square'));
			drawingObjRef.current = true;
		}
	};

	const handleObjSelection = () => {
		if (!canvasRef.current) return;
		canvasRef.current.isDrawingMode = false;
		drawingObjRef.current = false;

		if (objectSelection) {
			dispatch(setObjectSelection(false));
			dispatch(setTool(''));
		} else {
			dispatch(setTool('select'));
			dispatch(setObjectSelection(true));
		}
	};


	return (
		<div>
			<button onClick={connectWallet}>connect</button>
			<button onClick={handleMint} >mint</button>
			<p>{walletAddress.length && `Connected as ${walletAddress.slice(0, 10)}...`}</p>
			<button onClick={handleDraw}>draw</button>
			<label>
				brush width
				<input type="range" min={1} max={100} value={brushWidth} onChange={(e) => dispatch(setBrushWidth(Number(e.target.value)))} />
				<input type="number" min={1} max={100} value={brushWidth} onChange={(e) => dispatch(setBrushWidth(Number(e.target.value)))} />
			</label>
			<button onClick={handleClear}> clear </button>
			<button onClick={handleErase}> erase</button>
			<button onClick={handleUndo}> undo </button>
			<button onClick={handleRedo}> redo </button>
			<button onClick={() => dispatch(setShapeFill(true))}>shapes filled</button>
			<button onClick={() => dispatch(setShapeFill(false))}>shapes outlined</button>
			<button onClick={handleLine}> line </button>
			<button onClick={handleCircle}> circle </button>
			<button onClick={handleSquare}> square </button>
			<button onClick={handleObjSelection}> select</button>
			<ColorPicker setColor={handleBrushColor} color={brushColor} />
		</div>
	)
}

export default RightSideMenu;