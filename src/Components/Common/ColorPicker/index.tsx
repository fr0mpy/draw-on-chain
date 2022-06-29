import React from 'react';
import { HexColorPicker } from "react-colorful";


interface IProps {
	color: any;
	setColor(color: any): void;
}

export const ColorPicker: React.FC<IProps> = ({ color, setColor }) => {
	const [colors, setColors] = React.useState<Array<string>>(['black']);
	const [currentColorIndex, setCurrentColorIndex] = React.useState<number>(0);
	const [loaded, setLoaded] = React.useState<boolean>(false);

	React.useEffect(() => {
		handleLoadColors();
	}, []);

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

	const handleSaveColors = () => {
		const colorsData = JSON.stringify(colors);
		localStorage.setItem('colorsData', colorsData);
	}

	const handleLoadColors = async () => {
		const colorsData = await localStorage.getItem('colorsData');

		if (!colorsData) return setLoaded(true);

		setColors(JSON.parse(colorsData));
		setLoaded(true);
	}

	const handleNewColor = () => {
		setColors([...colors, 'white']);
		setCurrentColorIndex(colors.length);
		setColor(color);
		handleSaveColors();
	}

	const handleRemoveColor = () => {
		const newColorIndex = currentColorIndex - 1 <= 0 ? 0 : + 1;
		setColor(colors[newColorIndex]);
		const updatedColors = colors.filter((c, i) => i !== currentColorIndex);
		setColors(updatedColors);
		handleSaveColors();
	}

	return (
		<>
			{loaded && renderColors()}
			<button onClick={handleNewColor}>+ add +</button>
			<div>
				{colors.length > 1 ? <button onClick={handleRemoveColor}>X</button> : null}
				<HexColorPicker color={color} onChange={(color) => handleColorUpdate(color)} />;
			</div>
		</>
	)
}
