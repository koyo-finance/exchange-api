import { fn } from 'utils/api';
import getTVL from 'utils/data/getTVL';
import { ACTIVE_CHAINS } from '../../../constants';

/**
 * @swagger
 * /tvls/total:
 *   get:
 *     description: Returns TVL of pools all pools on all chains.
 */
export default fn(
	() => {
		return Object.fromEntries(ACTIVE_CHAINS.map((chain) => [chain, getTVL(chain)]));
	},
	{
		maxAge: 10 * 60 // 10m
	}
);
