import { ChainId } from '@koyofinance/core-sdk';
import { FetchResultTypes, fetch } from '@sapphire/fetch';
import { fn } from 'utils/api';
import { APYStats } from 'utils/data/getAPY';
import { CHAIN_APY_FILE } from '../../../../constants';

/**
 * @swagger
 * /apys/raw/boba:
 *   get:
 *     description: Returns the raw indexed APY values for pools on Boba.
 */
export default fn(
	async () => {
		return fetch<APYStats>(CHAIN_APY_FILE[ChainId.BOBA], 'json' as FetchResultTypes.JSON);
	},
	{
		maxAge: 30 // 30sec
	}
);
