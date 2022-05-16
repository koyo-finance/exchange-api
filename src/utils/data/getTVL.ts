import { ERC20PermitWithMint__factory } from '@elementfi/elf-council-typechain';
import { ChainId } from '@koyofinance/core-sdk';
import { AugmentedPool, augmentedPools, getPoolById } from '@koyofinance/swap-sdk';
import { bobaMainnetReadonlyProvider } from 'constants/providers';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import memoize from 'memoizee';
import getAssetsPrices from './getAssetsPrices';

const getTVL = memoize(
	async (chain: ChainId = ChainId.BOBA) => {
		const pools = augmentedPools.filter((pool) => pool.chainId === chain);

		const poolCoinPricesPromises = pools.map(async (pool) => {
			return [pool.id, await getAssetsPrices(pool.coins.map((coin) => coin.coingeckoId))];
		});
		const poolCoinPrices = Object.fromEntries(await Promise.all(poolCoinPricesPromises)) as { [k: string]: { [k: string]: number } };

		const poolBalancesPromises = pools.map(async (pool) => {
			const balancePromises = pool.coins.map(async (coin) => {
				// TODO: don't hardcode provider
				const coinContract = ERC20PermitWithMint__factory.connect(coin.address, bobaMainnetReadonlyProvider);
				const balance = await coinContract['balanceOf(address)' as 'balanceOf'](pool.addresses.swap);

				return [coin.coingeckoId, { balance, decimals: coin.decimals }];
			});
			const balances = (await Promise.all(balancePromises)) as [coingeckoId: string, balanceData: { balance: BigNumber; decimals: 18 | 6 }][];

			return [
				pool.id,
				Object.fromEntries(balances.map((balance) => [balance[0], Number(formatUnits(balance[1].balance, balance[1].decimals))]))
			];
		});
		const poolBalances = Object.fromEntries(await Promise.all(poolBalancesPromises)) as { [k: string]: { [k: string]: number } };

		const poolUSDBalance = Object.fromEntries(
			Object.entries(poolBalances).map(([pool, balances]) => [
				pool,
				Object.entries(balances)
					.map(([coingeckId, balance]) => balance * poolCoinPrices[pool][coingeckId])
					.reduce((acc, curr) => acc + curr, 0)
			])
		);

		const tvl = Object.entries(poolUSDBalance)
			.map(([, poolTvl]) => poolTvl)
			.reduce((acc, curr) => acc + curr, 0);

		return {
			tvl,
			pools: Object.fromEntries(
				Object.entries(poolUSDBalance).map(([poolId, tvl]) => {
					const pool = getPoolById(poolId) as AugmentedPool;

					return [
						pool.id,
						{
							id: pool.id,
							address: pool.addresses.swap,
							coins: pool.coins.length,
							decimals: pool.coins.map((coin) => coin.decimals),
							tvl
						}
					];
				})
			)
		};
	},
	{
		promise: true,
		maxAge: 10 * 60 * 1000 // 10m
	}
);

export default getTVL;
