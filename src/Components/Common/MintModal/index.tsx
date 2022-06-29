import React from "react";
import { useDispatch, useSelector } from "react-redux"
import { showMintModal } from "../../../Redux/appSlice"

export const MintModal = () => {
	const dispatch = useDispatch();

	const svgContainerRef = React.useRef<HTMLDivElement | null>(null);

	const { SVG } = useSelector((state: any) => {
		return { SVG: state.app.SVG }
	})

	React.useEffect(() => {
		if (SVG && svgContainerRef.current) {
			const svgElement = Array.from(svgContainerRef.current.getElementsByTagName('svg'));
			console.log("div here", svgElement);
			svgElement[0].style.height = '400px';
			svgElement[0].style.width = '400px';
			svgElement[0].style.border = 'solid 4px black';
		}
	}, []);

	return (
		<div style={{
			height: '600px',
			width: '600px',
			backgroundColor: 'white',
			border: '4px solid black',
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			zIndex: 3
		}}>
			<button onClick={() => dispatch(showMintModal(false))}>X</button>
			<p>You are about to mint this on chain</p>
			<div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: SVG }} />
			<p>hello world</p>
		</div>
	)
}

