import { AugmentedPool } from '@koyofinance/swap-sdk';
import { BigNumber } from 'ethers';
import getRefAssetPrice from './getRefAssetPrice';

const getPoolUsdFigure = async (balance: WeakBigNumberish, pool: AugmentedPool) => {
	const refAssetPrice = await getRefAssetPrice(pool.referenceAsset);

	return balance instanceof BigNumber ? balance.mul(refAssetPrice) : balance * refAssetPrice;
};

export type WeakBigNumberish = number | BigNumber;

export default getPoolUsdFigure;
