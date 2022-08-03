import Canvas from "./Components/Common/Canvas";

import * as React from 'react';
import { MintModal } from "./Components/Common/MintModal";
import { useSelector } from "react-redux";
import CanvasTools from "./Components/Common/CanvasTools";
import DesktopLayout from "./Components/Layout/DesktopLayout";
// import Navigation from "./Components/Common/Navigation";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { theme } from './Theme'
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
			<ThemeProvider theme={theme}>
				<DesktopLayout
					// left={ }
					middle={<Canvas
						canvasRef={canvasRef}
						objRef={objRef}
						objOriginRef={objOriginRef}
						mousedownRef={mousedownRef}
						drawingObjRef={drawingObjRef}
					/>}
					right={<CanvasTools
						canvasRef={canvasRef}
						objRef={objRef}
						objOriginRef={objOriginRef}
						mousedownRef={mousedownRef}
						drawingObjRef={drawingObjRef}
					/>}
				/>
				{showModal && <MintModal />}
			</ThemeProvider>
		</>
	);
}

export default App;
