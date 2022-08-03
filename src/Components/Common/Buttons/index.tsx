import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

export const ConnectWalletButton = styled(Button)(({ theme }) => ({
	height: 48,
	minWidth: 140,
	width: 'fit-content',
	backgroundColor: theme.palette.secondary.main,
	color: 'black',
	margin: theme.spacing(1, 0),
	border: 'solid 5px black',
	borderRadius: theme.spacing(1)
}))

export const ToolButton = styled(Button)(({ theme }) => ({
	height: 44,
	minWidth: 80,
	width: 'fit-content',
	border: 'solid 5px black',
	borderRadius: theme.spacing(1)
}))

export const AddColorButton = styled(Button)(({ theme }) => ({
	height: 40,
	width: 40,
	padding: 0
}))