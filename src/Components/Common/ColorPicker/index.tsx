import { render } from '@testing-library/react';
import React from 'react';
import { HexColorPicker } from "react-colorful";
// import "react-colorful/dist/index.css";
// import { SketchPicker } from 'react-color';

interface IProps {
	color: any;
	setColor(color: any): void;
}

export const ColorPicker: React.FC<IProps> = ({ color, setColor }) => {
	const [colors, setColors] = React.useState<Array<string>>(['black']);
	const [currentColorIndex, setCurrentColorIndex] = React.useState<number>(0);

	const buttonStyle = (bgColor: string) => {
		return {
			height: '48px',
			width: '48px',
			backgroundColor: bgColor
		}
	}
	const renderColors = () => {
		return colors.map((color, i) => {
			return (
				<button
					style={buttonStyle(color)}
					onClick={() => {
						setCurrentColorIndex(i);
						setColor(color);
					}}>
					{color}
				</button>
			)
		})
	}

	const handleColorUpdate = (color: string) => {
		const updatedColors = colors.map((c, i) => {
			if (i === currentColorIndex) return color;

			return c;
		});

		setColors(updatedColors);
	}

	const handleNewColor = () => {
		setColors([...colors, 'white']);
		setCurrentColorIndex(colors.length);
		setColor(color);
	}

	return (
		<>
			{renderColors()}
			<button onClick={handleNewColor}>+ add +</button>
			<HexColorPicker color={color} onChange={(color) => handleColorUpdate(color)} />;
		</>
	)
}
