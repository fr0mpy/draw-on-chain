import React from "react";
import { useDispatch, useSelector } from "react-redux"
import { showMintModal } from "../../../Redux/appSlice"

export const MintModal = () => {
	const dispatch = useDispatch();

	const svgContainerRef = React.useRef<HTMLDivElement | null>(null);

	const [traits, setTraits] = React.useState<Array</*{ trait: string, value: string }*/ any>>([]);
	const [name, setName] = React.useState<string>('');
	const [description, setDescription] = React.useState<string>('');
	const [numberOfForms, setNumberOfForms] = React.useState<number>(1);
	const [activeFormIndex, setActiveFormIndex] = React.useState<number>(0);


	React.useEffect(() => {
		if (SVG && svgContainerRef.current) {
			const svgElement = Array.from(svgContainerRef.current.getElementsByTagName('svg'));
			svgElement[0].style.height = '400px';
			svgElement[0].style.width = '400px';
			svgElement[0].style.border = 'solid 4px black';
		}
	}, []);

	React.useEffect(() => {
		if (SVG && svgContainerRef.current) {
			const svgElement = Array.from(svgContainerRef.current.getElementsByTagName('svg'));
			svgElement[0].style.height = '400px';
			svgElement[0].style.width = '400px';
			svgElement[0].style.border = 'solid 4px black';
		}
	}, [activeFormIndex]);

	const { SVG } = useSelector((state: any) => {
		return { SVG: state.app.SVG }
	});

	const updateTraits = () => {
		return traits.map((trait, i) => trait)
	}

	/*
	 render x number of forms
	 store formsData in array<{trait: '', value: ''}>
	 when rendering forms, check if there is a value stored in formsData at the forms index and use that
	 on form click, set active form index
	 on each forms onChange event if no formData[activeFormIndex] then add new data onto end of formData
	 if there is formData[activeFormIndex] then replace the formData at that index
	*/

	const renderForms = () => {
		return [...Array(numberOfForms)].map((_, i) => {
			return (
				<div onClick={() => setActiveFormIndex(i)}>
					<input type={'text'} value={traits[i] ? traits[i].traitName : ''} placeholder={'Trait Name'} name={'traitName'} onChange={(e) => handleOnChange(e, i)} />
					<input type={'text'} value={traits[i] ? traits[i].traitValue : ''} placeholder={'Trait Value'} name={'traitValue'} onChange={(e) => handleOnChange(e, i)} />
					<button onClick={() => handleRemoveTrait(i)}>X</button>
				</div>
			)
		})
	}

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		if (traits[index]) {
			const updatedTraits = traits.map((trait, i) => {
				if (activeFormIndex === i) {
					Object.assign(trait, { [e.target.name]: e.target.value })
				}

				return trait;
			});

			setTraits(updatedTraits);
		} else {
			setTraits([...traits, { [e.target.name]: e.target.value }]);
		}
	}

	const handleRemoveTrait = (index: number) => {
		setTraits(traits.filter((_, i) => index !== i));
		setNumberOfForms(numberOfForms - 1);
	}

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
			You are about to mint this on chain
			<div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: SVG }} />
			Add your metadata
			<div style={{ display: 'flex', flexFlow: 'column' }}>
				<label >
					<input type={'text'} value={name} placeholder={'Name'} onChange={(e) => setName(e.target.value)} />
				</label>
				<label>
					<input type={'text'} value={description} placeholder={'Description'} onChange={(e) => setDescription(e.target.value)} />
				</label>
				{renderForms()}
				<button onClick={() => setNumberOfForms(numberOfForms + 1)}>+ add another trait +</button>
			</div>
		</div>
	)
}

