import memoize from 'memoizee';
import { NextApiRequest, NextApiResponse } from 'next';

const formatJsonSuccess = (data: Record<string, unknown>) => ({
	success: true,
	data
});

const formatJsonError = (err: any) => ({
	success: false,
	err: err.toString ? err.toString() : err
});

const addGeneratedTime = async (res: any) => ({
	...(await res),
	generatedTimeMs: Number(Date.now())
});

const fn = (cb: (query: any) => any, options: { maxAge?: number } = {}) => {
	const { maxAge: maxAgeSec = null } = options;

	const callback =
		maxAgeSec === null
			? async (query: any) => addGeneratedTime(cb(query))
			: memoize(async (query) => addGeneratedTime(cb(query)), {
					promise: true,
					maxAge: maxAgeSec * 1000,
					normalizer: ([query]) => JSON.stringify(query)
			  });

	const apiCall = async (req: NextApiRequest, res: NextApiResponse) =>
		Promise.resolve(callback(req.query))
			.then((data) => {
				if (maxAgeSec !== null) res.setHeader('Cache-Control', `max-age=0, s-maxage=${maxAgeSec}, stale-while-revalidate`);
				res.status(200).json(formatJsonSuccess(data));
			})
			.catch((err) => {
				res.status(500).json(formatJsonError(err));
			});

	apiCall.straightCall = callback;

	return apiCall;
};

export { fn, formatJsonError };
