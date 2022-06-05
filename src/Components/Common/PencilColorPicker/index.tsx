import React from 'react';
import { SketchPicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import { updatePencilColor } from '../../../Redux/appSlice';


export const PencilColorPicker = () => {
	const dispatch = useDispatch();
	const color = useSelector((state: any) => {
		return state.app.pencilColor;
	});

	return <SketchPicker color={color} onChange={(color) => dispatch(updatePencilColor(color.hex))} />;
}
