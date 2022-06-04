import Canvas from "./Components/Common/Canvas";
import InitializePixelSize from './Components/Common/InitializePixelSize';

import * as React from 'react';

function App() {
	const [pixelSizeInitialzed, setPixelSizeInitialized] = React.useState(false);
	return (
		<div className="App">
			{/* {!pixelSizeInitialzed ? <InitializePixelSize /> : <Canvas />} */}
			<Canvas />
		</div>
	);
}

export default App;
