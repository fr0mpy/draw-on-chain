import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IAppState {
	value: number;
	height: number;
	width: number;
	showModal: boolean;
	SVG: string;
	walletAddress: string;
	contractAddress: string;
}

export const initialState: IAppState = {
	value: 0,
	height: 22,
	width: 22,
	showModal: false,
	SVG: '',
	walletAddress: '',
	contractAddress: '0x412010E39d2825Fb899391c73004d1217fa92BF5'
}

export const appSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		updateCanvasHeight: (state, action: PayloadAction<number>) => {
			state.height = action.payload;
		},
		updateCanvasWidth: (state, action: PayloadAction<number>) => {
			state.width = action.payload;
		},
		updatePencilColor: (state, action: PayloadAction<string>) => {
			// state.pencilColor = action.payload;
		},
		updateBackgroundColor: (state, action: PayloadAction<string>) => {
			// state.backgroundColor = action.payload;
		},
		showPencilColorPicker: (state, action: PayloadAction<boolean>) => {
			// state.showPencilColorPicker = action.payload;
			// state.showBackgroundColorPicker = false;

		},
		showBackgroundColorPicker: (state, action: PayloadAction<boolean>) => {
			// state.showBackgroundColorPicker = action.payload;
			// state.showPencilColorPicker = false;
		},
		showMintModal: (state, action: PayloadAction<boolean>) => {
			state.showModal = action.payload;
			console.log('state', state.showModal)
		},
		setSVG: (state, action: PayloadAction<string>) => {
			state.SVG = action.payload;
		},
		updateWalletAddress: (state, action: PayloadAction<string>) => {
			state.walletAddress = action.payload;
		}
	},
})

export const {
	updateCanvasHeight,
	updateCanvasWidth,
	updatePencilColor,
	updateBackgroundColor,
	showPencilColorPicker,
	showBackgroundColorPicker,
	showMintModal,
	setSVG,
	updateWalletAddress
} = appSlice.actions;

export default appSlice.reducer;