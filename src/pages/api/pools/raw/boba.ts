import { ChainId } from '@koyofinance/core-sdk';
import { augmentedPools } from '@koyofinance/swap-sdk';
import { fn } from 'utils/api';

/**
 * @swagger
 * /pools/raw/boba:
 *   get:
 *     description: Returns raw pools present on Boba as exported by "@koyofinance/swap-sdk".
 */
export default fn(
	() => {
		return Object.fromEntries(augmentedPools.filter((pool) => pool.chainId === ChainId.BOBA).map((pool) => [pool.id, pool]));
	},
	{
		maxAge: 10 * 60 // 10m
	}
);
