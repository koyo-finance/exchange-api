import memoize from 'memoizee';
import getPoolUsdFigure from 'utils/data/getPoolUsdFigure';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { augmentedPools, poolIds } from '@koyofinance/swap-sdk';

const initialVolumesValues = Object.fromEntries(augmentedPools.map(({ id }) => [id, [-1, -1]]));

const getAPY = memoize(
	async () => {
		const [stablePoolStats] = await Promise.all([
			fetch<APYStats>('https://indexer.koyo.finance/exchange/stats/apys.json', 'json' as FetchResultTypes.JSON)
		]);
		const volumes = initialVolumesValues;

		for (const [key] of Object.entries(volumes)) {
			if (volumes[key] && volumes[key][0] === -1) {
				const volume = stablePoolStats.volume[key];

				const pool = augmentedPools.find(({ id }) => id === key)!;

				volumes[key][0] = ((await getPoolUsdFigure(volume, pool)) as number) || 0;
				volumes[key][1] = volume || 0;
			}
		}

		const dailyApy: string[] = [];
		const weeklyApy: string[] = [];
		const monthlyApy: string[] = [];
		const apy: string[] = [];

		poolIds.forEach((poolId) => {
			const statsKey = poolId;
			const stats = stablePoolStats;

			dailyApy.push(((stats.apy.day[statsKey] > 0 ? stats.apy.day[statsKey] : 0) * 100).toFixed(2));
			weeklyApy.push((stats.apy.week[statsKey] * 100).toFixed(2));
			monthlyApy.push((stats.apy.month[statsKey] * 100).toFixed(2));
			apy.push((stats.apy.total[statsKey] * 100).toFixed(2));
		});

		return {
			volumes,
			dailyApy,
			weeklyApy,
			monthlyApy,
			apy
		};
	},
	{
		promise: true,
		maxAge: 10 * 60 * 1000 // 10m
	}
);

export interface APYStats {
	apy: {
		day: {
			[k: string]: number;
		};
		week: {
			[k: string]: number;
		};
		month: {
			[k: string]: number;
		};
		total: {
			[k: string]: number;
		};
	};
	volume: {
		[k: string]: number;
	};
}

export default getAPY;
