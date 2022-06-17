import React from 'react';
import { SketchPicker } from 'react-color';

interface IProps {
	color: any;
	setColor(color: any): void;
}

export const ColorPicker: React.FC<IProps> = ({ color, setColor }) => {
	return <SketchPicker color={color} onChange={(color) => setColor(color.hex)} />;
}
