// import * as React from 'react';
// import { createUseStyles } from 'react-jss';
// import About from './About/';
// import Roadmap from './Roadmap/';
// import Team from './Team/';
// import FAQ from './FAQ/';
// // import SocialLinks from '../SocialLinks/';

// const useStyles = createUseStyles({
// 	root: {
// 		height: '100vh',
// 		backgroundColor: 'white',
// 		// borderRight: 'solid 5px #5141f1',
// 		borderTopRightRadius: '8px',
// 		borderBottomRightRadius: '8px',
// 		boxSizing: 'border-box',
// 		display: 'flex',
// 		flexFlow: 'column',
// 		fontFamily: 'Roboto Slab, serif',
// 		padding: '16px',
// 		transition: 'background-color .4s linear',
// 		zIndex: 1,

// 		'@media screen and (max-width: 1024px)': {
// 			border: 'solid 5px #5141f1',
// 			borderRadius: '8px',
// 			height: '72%',
// 			lineHeight: 'normal',
// 			width: '80%',
// 			left: '50%',
// 			position: 'absolute',
// 			top: '50%',
// 			transform: 'translate(-50%, -50%)'
// 		},

// 		'@media screen and (max-width: 600px)': {
// 			height: '68%',
// 			top: '48%',
// 			width: '88%'
// 		},
// 		'@media screen and (max-width: 380px)': {
// 			height: '58%'
// 		}
// 	},
// 	root_width: {
// 		'@media screen and (min-width: 1024px) and (max-width: 1240px)': {
// 			width: '400px'
// 		}
// 	},
// 	root_night_mode: {
// 		backgroundColor: 'black',
// 		color: 'white',
// 		transition: 'background-color .4s linear',
// 	},
// 	text: {
// 		color: 'black',
// 		textAlign: 'center',
// 		transition: 'background-color .4s linear',
// 		margin: '24px 0'
// 	},
// 	unconnected_text: {
// 		opacity: 0,
// 	},
// 	connected_text_container: {
// 		height: '16px',
// 	},
// 	connected_text: {
// 		fontSize: '12px',
// 		opacity: 1,
// 		transition: 'opacity .2s ease-in-out'
// 	},
// 	nav_title: {
// 		margin: '0 0 4px',
// 		fontSize: '28px',

// 		'@media screen and (max-width: 600px)': {
// 			fontSize: '24px'
// 		}
// 	},
// 	nav_caption: {
// 		margin: '8px 0 26px 0',
// 		fontSize: '18px',

// 		'@media screen and (max-width: 600px)': {
// 			fontSize: '14px',
// 			marginBottom: '18px'
// 		}
// 	},
// 	night_mode_text: {
// 		color: 'white',
// 		transition: 'background-color .4s linear',
// 	},
// 	heading_button: {
// 		backgroundColor: 'transparent',
// 		border: 'none',
// 		borderBottom: 'solid 3px transparent',
// 		color: 'grey',
// 		cursor: 'pointer',
// 		fontSize: '20px',
// 		fontFamily: 'Roboto Slab, serif',
// 		padding: '0 2.5px',
// 		maxWidth: '95px',

// 		'&:hover': {
// 			borderBottom: 'solid 3px #5141f1'
// 		},

// 		'@media screen and (min-width: 1025px)': {
// 			padding: '0 8px',
// 		},

// 		'@media screen and (max-width: 380px)': {
// 			fontSize: '18px'
// 		}
// 	},
// 	heading_button_active: {
// 		color: '#5141f1',
// 		maxWidth: '95px',
// 		padding: '0 2.5px',
// 		opacity: 1,

// 		'&:hover': {
// 			borderBottom: 'solid 3px transparent'
// 		}
// 	},
// 	headings_container: {
// 		margin: '0 auto 16px auto',

// 		'@media screen and (max-width: 380px)': {
// 			maxWidth: '265px'
// 		}
// 	},
// 	section_container: {
// 		flex: 1,
// 		height: '50%',
// 		overflowY: 'auto',

// 		'&::-webkit-scrollbar': {
// 			width: '0.4em',
// 			height: '10px !important'
// 		},

// 		'&::-webkit-scrollbar-track': {
// 			padding: '0 16px'
// 		},

// 		'&::-webkit-scrollbar-thumb': {
// 			backgroundColor: '#5141f1',
// 			borderRadius: '8px',
// 			border: 'solid 2px black',
// 			marginLeft: '10px',
// 			transition: 'border .4s linear',
// 		},

// 		'@media screen and (max-width: 1200px)': {
// 			height: '60%',
// 			overflowY: 'auto',
// 		},

// 		'@media screen and (max-width: 600px)': {
// 			height: '50%',
// 			overflowY: 'auto',
// 		},

// 	},
// 	section: {
// 		textAlign: 'center',
// 		padding: '0 16px',
// 		boxSizing: 'border-box',
// 		display: 'flex',
// 		flexFlow: 'column',
// 		justifyContent: 'center',
// 	},
// 	section_night_mode: {
// 		'&::-webkit-scrollbar-thumb': {
// 			backgroundColor: '#5141f1',
// 			borderRadius: '8px',
// 			border: 'solid 2px white',
// 			marginLeft: '10px',
// 			transition: 'border .4s linear',
// 		}
// 	},
// 	dotted_line: {
// 		borderBottom: 'dotted 5px black',
// 		width: '80%',
// 		margin: '0 auto 18px auto',
// 		transition: 'border-bottom .4s linear',

// 	},
// 	dotted_line_night_mode: {
// 		borderBottom: 'dotted 5px white',
// 		transition: 'border-bottom .4s linear',
// 	},
// 	seed: {
// 		margin: '4px 0',
// 		textAlign: 'center',
// 		fontSize: '28px',

// 		'@media screen and (max-width: 600px)': {
// 			fontSize: '24px'
// 		},

// 		'@media screen and (max-width: 380px)': {
// 			display: 'none'
// 		}
// 	}
// });

// enum Sections {
// 	About = 0,
// 	Roadmap = 1,
// 	Team = 2,
// 	Faq = 3,
// 	DontClick = 4
// }

// const Navigation = () => {
// 	const classes = useStyles();

// 	const [section, setSection] = React.useState<number>(0);
// 	const sectionRef = React.useRef<HTMLDivElement>(null);
// 	const headings = ['About', 'RoadMap', 'Team', 'FAQ'];

// 	React.useEffect(() => {
// 		if (sectionRef.current) {
// 			sectionRef.current.scrollTop = 0;
// 		}
// 	}, [section])

// 	const renderSection = () => {
// 		switch (section) {
// 			case Sections.About:
// 				return <About />;
// 			case Sections.Roadmap:
// 				return <Roadmap />;
// 			case Sections.Team:
// 				return <Team />;
// 			case Sections.Faq:
// 				return <FAQ />;
// 			default:
// 				return;
// 		}
// 	}

// 	const renderHeadings = () => {
// 		return headings.map((heading, i) => {
// 			const active = i === section;
// 			return (
// 				<button
// 					className={`${classes.heading_button} ${active ? classes.heading_button_active : ''}`}
// 					onClick={() => setSection(i)}
// 				>
// 					{heading}
// 				</button>
// 			)
// 		})
// 	}

// 	return (
// 		<div className={`${classes.root}`}>
// 			<div>
// 				<p className={`${classes.text} ${classes.nav_title} `}>
// 					Welcome To pxplots!
// 				</p>
// 			</div>
// 			<div className={classes.dotted_line} />
// 			<div className={classes.headings_container}>
// 				{renderHeadings()}
// 			</div>
// 			<div className={classes.section_container} ref={sectionRef}>
// 				<div className={classes.section}>
// 					{renderSection()}
// 				</div>
// 			</div>
// 			{/* <SocialLinks /> */}
// 		</div>
// 	);
// };

// export default Navigation;
export { }