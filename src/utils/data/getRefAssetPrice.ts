import { uniqueArray } from '@koyofinance/core-sdk';
import { augmentedPools } from '@koyofinance/swap-sdk';
import memoize from 'memoizee';
import getAssetsPrices from './getAssetsPrices';

const poolsReferenceAssetsCoingeckoIds = uniqueArray(augmentedPools.map(({ coingeckoInfo: { referenceAssetId } }) => referenceAssetId));

const getRefAssetPrice = memoize(
	async (refAsset) => {
		const prices = await getAssetsPrices(poolsReferenceAssetsCoingeckoIds);
		const referenceAssetCoingeckoId = augmentedPools.find((pool) => pool.referenceAsset === refAsset)?.coingeckoInfo.referenceAssetId;
		return referenceAssetCoingeckoId ? prices[referenceAssetCoingeckoId] || 0 : 0;
	},
	{
		promise: true,
		maxAge: 10 * 1000 // 10s
	}
);

export default getRefAssetPrice;
