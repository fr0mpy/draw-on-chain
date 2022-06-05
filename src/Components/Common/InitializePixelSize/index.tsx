import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { IAppState, updateCanvasHeight, updateCanvasWidth } from '../../../Redux/appSlice';

const InitializePixelSize = () => {
	const { height, width } = useSelector((state: IAppState) => {
		return { height: state.height, width: state.width }
	})

	const dispatch = useDispatch()

	return (
		<div>
			<label>
				height
				<input
					type="range"
					min="1"
					max="100"
					value={height}
					id="myRange"
					onChange={(e) => dispatch(updateCanvasHeight(Number(e.target.value)))} />
			</label>
			<label>
				width
				<input
					type="range"
					min="1"
					max="100"
					value={width}
					id="myRange"
					onChange={(e) => dispatch(updateCanvasWidth(Number(e.target.value)))} />
			</label>
		</div>
	)
}

export default InitializePixelSize;