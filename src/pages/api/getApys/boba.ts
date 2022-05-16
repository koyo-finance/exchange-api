import { augmentedPools } from '@koyofinance/swap-sdk';
import getAPY from 'utils/data/getAPY';
import { fn } from 'utils/api';

export default fn(
	async () => {
		const [{ weeklyApy: baseApys }] = await Promise.all([getAPY()]);

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
