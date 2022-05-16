import { ChainId } from '@koyofinance/core-sdk';
import { augmentedPools } from '@koyofinance/swap-sdk';
import { fn } from 'utils/api';
import getAPY from 'utils/data/getAPY';

/**
 * @swagger
 * /apys/boba:
 *   get:
 *     description: Returns the APY for pools on Boba.
 */
export default fn(
	async () => {
		const [{ weeklyApy: baseApys }] = await Promise.all([getAPY(ChainId.BOBA)]);

		return Object.fromEntries(
			augmentedPools.map((pool, index) => [
				pool.id,
				{
					baseApy: baseApys[index]
				}
			])
		);
	},
	{
		maxAge: 10 * 60 // 10m
	}
);
