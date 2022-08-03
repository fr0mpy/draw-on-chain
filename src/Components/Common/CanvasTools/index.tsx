import { useDispatch, useSelector } from "react-redux";
import { setBrushColor, setBrushWidth, setIsDrawingMode, setObjectSelection, setShapeFill, setSVG, setTool, showMintModal, updateWalletAddress } from "../../../Redux/appSlice";
import 'fabric-history';
import { ColorPicker } from "../ColorPicker";
import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, Slider, Typography } from "@mui/material";
import React, { ChangeEvent } from "react";
import CreateIcon from '@mui/icons-material/Create';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Brightness1RoundedIcon from '@mui/icons-material/Brightness1Rounded';
import Brightness1OutlinedIcon from '@mui/icons-material/Brightness1Outlined';
import SquareIcon from '@mui/icons-material/Square';
import SquareOutlinedIcon from '@mui/icons-material/SquareOutlined';
import SwipeVerticalIcon from '@mui/icons-material/SwipeVertical';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { ConnectWalletButton, ToolButton } from '../Buttons';
import { ToolButtonGrid } from "../Containers";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

interface IProps {
	canvasRef: React.MutableRefObject<fabric.Canvas | null>,
	objRef: React.MutableRefObject<fabric.Line | fabric.Triangle | fabric.Circle | fabric.Rect | null>,
	objOriginRef: React.MutableRefObject<{ x: number, y: number }>,
	mousedownRef: React.MutableRefObject<boolean>;
	drawingObjRef: React.MutableRefObject<boolean>;
}

const CanvasTools: React.FC<IProps> = ({ canvasRef, drawingObjRef, objRef }) => {

	const dispatch = useDispatch();

	const {
		tool,
		brushColor,
		brushWidth,
		walletAddress,
		objectSelection,
		shapeFill
	} = useSelector((state: any) => {
		return {
			tool: state.app.tool,
			brushColor: state.app.brushColor,
			brushWidth: state.app.brushWidth,
			walletAddress: state.app.walletAddress,
			objectSelection: state.app.objectSelection,
			shapeFill: state.app.shapeFill
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

	const handleBrushWidth = (event: Event, value: number | number[]) => {
		dispatch(setBrushWidth(value as number));
	};

	const handleShapeFill = (event: ChangeEvent<HTMLInputElement>, value: string) => {
		dispatch(setShapeFill(value));
	};

	return (
		<Grid container >
			<Grid container>

				<ToolButtonGrid container direction={"row"} spacing={1}>
					<Grid item>
						{walletAddress.length
							? <Grid container direction={"column"} >
								<ConnectWalletButton variant={"contained"} onClick={handleMint} disableElevation startIcon={<PriorityHighIcon />} endIcon={<PriorityHighIcon />}>
									<Typography variant={"body1"}>
										Mint Your Drawing
									</Typography>
								</ConnectWalletButton>
								<Typography>
									{walletAddress.length ? `Connected as ${walletAddress.slice(0, 10)}...` : null}
								</Typography>
							</Grid>
							: <ConnectWalletButton variant={'contained'} onClick={connectWallet} disableElevation>
								<Typography variant={"body1"}>
									Connect
								</Typography>
							</ConnectWalletButton>}
					</Grid>
				</ToolButtonGrid>
			</Grid >
			<ToolButtonGrid container direction={"row"} spacing={1} >
				<Grid item>
					<ToolButton variant={'contained'} onClick={handleDraw} disableElevation>
						{/* <Typography variant={"body1"}>
							Draw
						</Typography> */}
						<CreateIcon />
					</ToolButton>
				</Grid>
				<Grid item>
					<ToolButton variant={'contained'} onClick={handleErase} disableElevation>
						{/* <Typography variant={"body1"}>
							Erase
						</Typography> */}
						<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="24px" height="24px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="m16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 0 1-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0M4.22 15.58l3.54 3.53c.78.79 2.04.79 2.83 0l3.53-3.53l-4.95-4.95l-4.95 4.95Z" /></svg>

					</ToolButton>
				</Grid>
				<Grid item>
					<ToolButton variant={"contained"} onClick={handleClear} disableElevation>
						{/* <Typography variant={"body1"}>
							Clear All
						</Typography> */}
						<DeleteForeverIcon />
					</ToolButton>
				</Grid>
			</ToolButtonGrid>
			<Grid item xs={12}>
				<Grid item>
					<Typography>
						Line Width
					</Typography>
					<Slider aria-label="brush width" value={brushWidth} onChange={handleBrushWidth} valueLabelDisplay="auto" />
				</Grid>
			</Grid>
			<ToolButtonGrid container direction={"row"} spacing={1}>
				<Grid item>
					<ToolButton variant={"contained"} onClick={handleUndo} disableElevation>
						<UndoIcon />
					</ToolButton>
				</Grid>
				<Grid item>
					<ToolButton variant={"contained"} onClick={handleRedo} disableElevation>
						<RedoIcon />
					</ToolButton>
				</Grid>
				<Grid item>
					<ToolButton variant={"contained"} onClick={handleObjSelection} disableElevation>
						<SwipeVerticalIcon />
					</ToolButton>
				</Grid>
			</ToolButtonGrid>
			<ColorPicker setColor={handleBrushColor} color={brushColor} />
			<ToolButtonGrid>
				<Typography variant={'body1'}>
					Shapes
				</Typography>
				<ToolButtonGrid container direction={"row"} spacing={1}>
					<Grid item>
						<ToolButton variant={"contained"} onClick={handleLine} disableElevation>

							<ShowChartIcon />
						</ToolButton>
					</Grid>
					<Grid item>
						<ToolButton variant={"contained"} onClick={handleCircle} disableElevation>
							{shapeFill === 'fill' ? <Brightness1RoundedIcon /> : <Brightness1OutlinedIcon />}
						</ToolButton>
					</Grid>
					<Grid item>
						<ToolButton variant={"contained"} onClick={handleSquare} disableElevation>
							{shapeFill === 'fill' ? <SquareIcon /> : <SquareOutlinedIcon />}
						</ToolButton>
					</Grid>
				</ToolButtonGrid>
			</ToolButtonGrid>
			<ToolButtonGrid container direction={"column"}>
				<FormControl>
					<RadioGroup
						aria-labelledby="shapes-fill-ToolButtons-group-label"
						defaultValue={'fill'}
						name="radio-ToolButtons-group"
						onChange={handleShapeFill}
						row
					>
						<FormControlLabel value={'fill'} control={<Radio />} label={<Typography variant={"body1"}>Fill</Typography>} />
						<FormControlLabel value={'outline'} control={<Radio />} label={<Typography variant={"body1"}>Outline</Typography>} />
					</RadioGroup>
				</FormControl>
			</ToolButtonGrid>
		</Grid >
	)
}

export default CanvasTools;