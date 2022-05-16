import { ChainId } from '@koyofinance/core-sdk';
import { fn } from 'utils/api';
import getTVL from 'utils/data/getTVL';

/**
 * @swagger
 * /tvls/boba:
 *   get:
 *     description: Returns TVL of pools on Boba.
 */
export default fn(
	() => {
		return getTVL(ChainId.BOBA);
	},
	{
		maxAge: 10 * 60 // 10m
	}
);
