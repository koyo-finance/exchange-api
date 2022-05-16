import memoize from 'memoizee';
import { fetch, FetchResultTypes } from '@sapphire/fetch';

const getAssetsPrices = memoize(
	async (assetCoingeckoIds: string[]) => {
		const prices = await fetch<{ [k: string]: { usd?: number } }>(
			`https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=${assetCoingeckoIds.join(',')}`,
			'json' as FetchResultTypes.JSON
		);

		return Object.fromEntries(assetCoingeckoIds.map((id) => [id, id === 'dollar' ? 1 : prices[id]?.usd || 0]));
	},
	{
		promise: true,
		maxAge: 2 * 60 * 1000, // 2 min
		primitive: true
	}
);

export default getAssetsPrices;
