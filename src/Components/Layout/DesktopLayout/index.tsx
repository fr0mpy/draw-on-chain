
import * as React from 'react';
import Grid from "@mui/material/Grid/Grid";

interface IProps {
	left?: React.ReactNode;
	middle?: React.ReactNode;
	right?: React.ReactNode;
};

const App: React.FC<IProps> = ({ left, middle, right }) => {

	return (
		<Grid container >
			<Grid container direction={"row"}>
				<Grid item xs={3}>
					{left}
				</Grid>
				<Grid item xs={6}>
					{middle}
				</Grid>
				<Grid item xs={3}>
					{right}
				</Grid>
			</Grid>
		</Grid>
	);
}

export default App;
