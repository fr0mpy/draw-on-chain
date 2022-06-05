import React from 'react';
import { SketchPicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import { updateBackgroundColor } from '../../Redux/appSlice';


export const BackgroundColorPicker = () => {
	const dispatch = useDispatch();

	const color = useSelector((state: any) => {
		return state.app.backgroundColor;
	});

	return <SketchPicker color={color} onChange={(color) => dispatch(updateBackgroundColor(color.hex))} />;
}
