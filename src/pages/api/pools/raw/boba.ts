import { ChainId } from '@koyofinance/core-sdk';
import { augmentedPools } from '@koyofinance/swap-sdk';
import { fn } from 'utils/api';

export default fn(
	() => {
		return Object.fromEntries(augmentedPools.filter((pool) => pool.chainId === ChainId.BOBA).map((pool) => [pool.id, pool]));
	},
	{
		maxAge: 10 * 60 // 10m
	}
);
