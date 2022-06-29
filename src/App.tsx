import Canvas from "./Components/Common/Canvas";
// import InitializePixelSize from './Components/Common/InitializePixelSize';

import * as React from 'react';
import { MintModal } from "./Components/Common/MintModal";
import { useSelector } from "react-redux";
import { IAppState } from "./Redux/appSlice";

function App() {
	const { showModal } = useSelector((state: any) => {
		return { showModal: state.app.showModal }
	})

	console.log(showModal, 'mm')
	return (
		<div className="App">
			<h1>Draw On Chain (Beta)</h1>
			<Canvas />
			{showModal && <MintModal />}
		</div>
	);
}

export default App;
