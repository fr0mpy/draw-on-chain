import createTheme from "@mui/material/styles/createTheme";

export const theme = createTheme({
	palette: {
		primary: {
			main: '#5141f1'
		},
		secondary: {
			main: '#3effdb'
		},
	},
	typography: {
		fontFamily: ['Anton, sans-serif', 'Roboto Slab, serif'].join(','),
		body1: {
			fontFamily: 'Roboto Slab, serif',
			fontWeight: 900
		},
		body2: {
			fontFamily: 'Anton, sans-serif',
			fontWeight: 900
		}
	}
});