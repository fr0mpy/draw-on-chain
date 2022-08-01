/* eslint-disable react-hooks/exhaustive-deps */

import React from 'react'
import { fabric } from 'fabric';
import { useDispatch, useSelector } from 'react-redux';
import { setBrushColor } from '../../../Redux/appSlice';

interface IProps {
	canvasRef: React.MutableRefObject<fabric.Canvas | null>,
	objRef: React.MutableRefObject<fabric.Line | fabric.Triangle | fabric.Circle | fabric.Rect | null>,
	objOriginRef: React.MutableRefObject<{ x: number, y: number }>,
	mousedownRef: React.MutableRefObject<boolean>;
	drawingObjRef: React.MutableRefObject<boolean>;
}

const Canvas: React.FC<IProps> = ({ canvasRef, drawingObjRef, mousedownRef, objOriginRef, objRef }) => {

	const dispatch = useDispatch();

	const {
		tool,
		isDrawingMode,
		brushWidth,
		objectSelection,
		brushColor,
		shapeFill
	} = useSelector((state: any) => {
		return {
			showModal: state.app.showModal,
			walletAddress: state.app.walletAddress,
			contractAddress: state.app.contractAddress,
			tool: state.app.tool,
			isDrawingMode: state.app.isDrawingMode,
			brushWidth: state.app.brushWidth,
			objectSelection: state.app.objectSelection,
			brushColor: state.app.brushColor,
			shapeFill: state.app.shapeFill
		}
	});

	React.useEffect(() => {
		if (!canvasRef.current) return;
		canvasRef.current.isDrawingMode = isDrawingMode;
		handleLoad();
		loadBrushColor();
	}, []);

	React.useEffect(() => {
		setCanvas();
	}, [
		canvasRef,
		tool,
		brushWidth,
		brushColor,
		shapeFill
	]);

	const setCanvas = () => {
		if (!canvasRef.current) {
			canvasRef.current = new fabric.Canvas('canvas', { width: 640, height: 640, backgroundColor: 'white' });
			canvasRef.current.renderAll();
		}

		canvasRef.current.forEachObject(o => { o.selectable = objectSelection; o.evented = objectSelection });
		canvasRef.current.freeDrawingBrush.width = brushWidth;
		canvasRef.current.freeDrawingBrush.color = tool === 'erase' ? 'white' : brushColor;

		console.log('setting canvas', canvasRef.current.freeDrawingBrush.color)
		canvasRef.current.on('mouse:down', (e) => {

			if (!canvasRef.current) return;
			mousedownRef.current = true;

			switch (tool) {
				case 'line':
					if (!e.pointer || !drawingObjRef.current) return;
					canvasRef.current.selection = objectSelection;

					objRef.current = new fabric.Line(
						[e.pointer?.x, e.pointer?.y, e.pointer?.x, e.pointer.y],
						{ stroke: brushColor, strokeWidth: brushWidth, selectable: objectSelection, evented: objectSelection, fill: shapeFill ? brushColor : '' }
					)
					canvasRef.current.add(objRef.current);
					canvasRef.current.renderAll();
					break;
				case 'circle':
					if (!e.pointer || !drawingObjRef.current || !objOriginRef.current) return;
					canvasRef.current.selection = objectSelection;
					objOriginRef.current = { x: e.pointer.x, y: e.pointer.y };

					objRef.current = new fabric.Circle(
						{
							left: objOriginRef.current.x,
							top: objOriginRef.current.y,
							originX: 'left',
							originY: 'top',
							radius: e.pointer.x - objOriginRef.current.x,
							angle: 0,
							fill: shapeFill ? brushColor : '',
							stroke: brushColor,
							strokeWidth: brushWidth,
							selectable: objectSelection,
							evented: objectSelection
						}
					)
					canvasRef.current.add(objRef.current);
					canvasRef.current.renderAll();
					break;
				case 'square':
					if (!e.pointer || !drawingObjRef.current || !objOriginRef.current) return;
					objOriginRef.current = { x: e.pointer.x, y: e.pointer.y };

					objRef.current = new fabric.Rect({
						left: objOriginRef.current.x,
						top: objOriginRef.current.y,
						originX: 'left',
						originY: 'top',
						width: e.pointer.x - objOriginRef.current.x,
						height: e.pointer.y - objOriginRef.current.y,
						angle: 0,
						fill: shapeFill ? brushColor : '',
						transparentCorners: false,
						stroke: brushColor,
						strokeWidth: brushWidth
					});
					canvasRef.current.add(objRef.current);
					break;
				case 'select':
					break;
				default:
					return;
			}

		});

		canvasRef.current.on('mouse:move', (e) => {
			if (!mousedownRef.current) return;
			console.log('drawing')
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
					if (!canvasRef.current || !e.pointer || !objRef.current) return;

					let radius = Math.abs(objOriginRef.current.y - e.pointer.y) / 2;
					if (objRef.current.strokeWidth && radius > objRef.current.strokeWidth) {
						radius -= objRef.current.strokeWidth / 2;
					}

					(objRef.current as fabric.Circle).set({ radius: radius });

					if (objOriginRef.current.x > e.pointer.x) {
						(objRef.current as fabric.Circle).set({ originX: 'right' });
					} else {
						(objRef.current as fabric.Circle).set({ originX: 'left' });
					}
					if (objOriginRef.current.y > e.pointer.y) {
						(objRef.current as fabric.Circle).set({ originY: 'bottom' });
					} else {
						(objRef.current as fabric.Circle).set({ originY: 'top' });
					}

					canvasRef.current.renderAll();
					break;
				case 'square':
					if (!canvasRef.current || !e.pointer || !objRef.current) return;

					if (objOriginRef.current.x > e.pointer.x) {
						(objRef.current as fabric.Rect).set({ left: Math.abs(e.pointer.x) });
					}
					if (objOriginRef.current.y > e.pointer.y) {
						(objRef.current as fabric.Rect).set({ top: Math.abs(e.pointer.y) });
					}

					(objRef.current as fabric.Rect).set({ width: Math.abs(objOriginRef.current.x - e.pointer.x) });
					(objRef.current as fabric.Rect).set({ height: Math.abs(objOriginRef.current.y - e.pointer.y) });

					canvasRef.current.renderAll();
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
			objOriginRef.current = { x: 0, y: 0 };
		});
	};

	const loadBrushColor = () => {
		const loadedBrushColor = localStorage.getItem('brushColor');

		if (!loadedBrushColor) return;

		dispatch(setBrushColor(loadedBrushColor));
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

	// const getTokenURI = async () => {
	// 	const provider = new ethers.providers.Web3Provider((window as any).ethereum);
	// 	const contract = new ethers.Contract(contractAddress, contractABI.abi, provider)
	// 	const token = await contract.tokenURI(0)
	// 	console.log("TOKEN:", token);
	// }

	// const getTokenMetadata = async () => {
	// 	console.log('getting metadata')
	// 	const provider = new ethers.providers.Web3Provider((window as any).ethereum);
	// 	const contract = new ethers.Contract(contractAddress, contractABI.abi, provider)
	// 	const token = await contract.getTokenMetaData(0)
	// 	console.log("TOKEN:", token);
	// }


	return (
		<>
			<div style={{ display: 'flex', flexFlow: 'row' }}>
				<div style={{ border: 'solid 4px black', height: 640, width: 640 }}>
					<canvas id={'canvas'} />
				</div>
			</div>
		</>
	)
}

export default Canvas;
