import { ChainId } from '@koyofinance/core-sdk';

export const CHAIN_APY_FILE: { [chainId in ChainId]: string } = {
	[ChainId.ETHEREUM]: '',
	[ChainId.MOONBEAM]: '',
	[ChainId.RINKEBY]: '',
	[ChainId.MOONBASE]: '',
	[ChainId.BOBA]: 'https://indexer.koyo.finance/exchange/stats/apys.json',
	[ChainId.BOBABEAM]: '',
	[ChainId.BOBA_RINKEBY]: '',
	[ChainId.BOBABASE]: ''
};
