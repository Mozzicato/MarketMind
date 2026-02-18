const { ChaosChainSDK, NetworkConfig, getNetworkInfo } = require('@chaoschain/sdk');

const net = NetworkConfig.CELO_TESTNET;
const info = getNetworkInfo(net);
console.log(JSON.stringify(info, null, 2));
