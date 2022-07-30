
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.7",
	paths: {
		artifacts: './src/artifacts'
	},
	networks: {
		hardhat: {
			chainId: 1337
		},
		rinkeby: {
			url: 'https://rinkeby.infura.io/v3/0b7cfd3b0b9848acaf89f3658cb452fd',
			accounts: ["90bbd372e69b6e0f0e54dd93963ba334e57a26c683aca7aa7b06f6cf60cdc0c7"]
		}
	}
};
