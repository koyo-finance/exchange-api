import { ChainId } from '@koyofinance/core-sdk';
import { FetchResultTypes, fetch } from '@sapphire/fetch';
import { fn } from 'utils/api';
import { APYStats } from 'utils/data/getAPY';
import { CHAIN_APY_FILE } from '../../../../constants';

export default fn(
	async () => {
		const data = await fetch<APYStats>(CHAIN_APY_FILE[ChainId.BOBA], 'json' as FetchResultTypes.JSON);

		return Object.fromEntries(Object.entries(data.apy.day).map(([pool, dailyApy]) => [pool, dailyApy * 100]));
	},
	{
		maxAge: 30 // 30sec
	}
);
