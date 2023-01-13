export const Framework = require("@superfluid-finance/sdk-core");
export const ethers = require("ethers");

// Ethers.js provider initialization
export const url =
  "https://eth-goerli.alchemyapi.io/v2/zfWv3pEito9Wi7gDUSLsand11To5VEjN";
export const customHttpProvider = new ethers.providers.JsonRpcProvider(url);

// export const walletPrivateKey = "0xd2ebfb1517ee73c4bd3d209530a7e1c25352542843077109ae77a2c0213375f1";

export const walletPrivateKey = '4cdea544b29908f582c69914567cf213e8386e9145826e182886f5bb62634596'; 
//address: 0x1604c0a98E86e2529DE1a4ea6121246dF21cBC23
