import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IAppState {
	value: number;
	height: number;
	width: number;
	showModal: boolean;
	SVG: string;
	walletAddress: string;
	contractAddress: string;
	tool: string;
	brushColor: string;
	isDrawingMode: boolean;
	brushWidth: number;
	shapeFill: boolean;
	objectSelection: boolean;
}

export const initialState: IAppState = {
	value: 0,
	height: 22,
	width: 22,
	showModal: false,
	SVG: '',
	walletAddress: '',
	contractAddress: '0x412010E39d2825Fb899391c73004d1217fa92BF5',
	tool: 'draw',
	brushColor: 'black',
	isDrawingMode: true,
	brushWidth: 4,
	shapeFill: true,
	objectSelection: false
}

export const appSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		showMintModal: (state, action: PayloadAction<boolean>) => {
			state.showModal = action.payload;
			console.log('state', state.showModal)
		},
		setSVG: (state, action: PayloadAction<string>) => {
			state.SVG = action.payload;
		},
		updateWalletAddress: (state, action: PayloadAction<string>) => {
			state.walletAddress = action.payload;
		},
		setTool: (state, action: PayloadAction<string>) => {
			state.tool = action.payload
		},
		setBrushColor: (state, action: PayloadAction<string>) => {
			state.brushColor = action.payload
		},
		setIsDrawingMode: (state, action: PayloadAction<boolean>) => {
			state.isDrawingMode = action.payload
		},
		setBrushWidth: (state, action: PayloadAction<number>) => {
			state.brushWidth = action.payload;
		},
		setShapeFill: (state, action: PayloadAction<boolean>) => {
			state.shapeFill = action.payload
		},
		setObjectSelection: (state, action: PayloadAction<boolean>) => {
			state.objectSelection = action.payload;
		}
	},
})

export const {
	showMintModal,
	setSVG,
	updateWalletAddress,
	setTool,
	setBrushColor,
	setIsDrawingMode,
	setBrushWidth,
	setShapeFill,
	setObjectSelection
} = appSlice.actions;

export default appSlice.reducer;