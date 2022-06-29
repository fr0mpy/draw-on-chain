import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IAppState {
	value: number;
	height: number;
	width: number;
	showModal: boolean;
	SVG: string;
}

export const initialState: IAppState = {
	value: 0,
	height: 22,
	width: 22,
	showModal: false,
	SVG: ''
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
	setSVG
} = appSlice.actions;

export default appSlice.reducer;