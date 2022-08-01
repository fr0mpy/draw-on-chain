import Canvas from "./Components/Common/Canvas";
// import InitializePixelSize from './Components/Common/InitializePixelSize';

import * as React from 'react';
import { MintModal } from "./Components/Common/MintModal";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid/Grid";
import RightSideMenu from "./Components/Common/RightSideMenu";

function App() {


	const canvasRef = React.useRef<fabric.Canvas | null>(null);
	const objRef = React.useRef<fabric.Line | fabric.Triangle | fabric.Circle | fabric.Rect | null>(null);
	const objOriginRef = React.useRef<{ x: number, y: number }>({ x: 0, y: 0 });

	const mousedownRef = React.useRef<boolean>(false);
	const drawingObjRef = React.useRef<boolean>(false);

	const { showModal } = useSelector((state: any) => {
		return { showModal: state.app.showModal }
	})

	return (
		<>
			<Grid container >
				<h1>Draw On Chain (Beta)</h1>
				<Grid container direction={"row"}>
					<Grid item xs={8}>
						<Canvas
							canvasRef={canvasRef}
							objRef={objRef}
							objOriginRef={objOriginRef}
							mousedownRef={mousedownRef}
							drawingObjRef={drawingObjRef}
						/>
					</Grid>
					<Grid item xs={4}>
						<RightSideMenu
							canvasRef={canvasRef}
							objRef={objRef}
							objOriginRef={objOriginRef}
							mousedownRef={mousedownRef}
							drawingObjRef={drawingObjRef}
						/>
					</Grid>
				</Grid>

			</Grid>
			{showModal && <MintModal />}
		</>
	);
}

export default App;
