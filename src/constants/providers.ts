import { JsonRpcProvider } from '@ethersproject/providers';
import { ChainId } from '@koyofinance/core-sdk';

export const bobaMainnetReadonlyProvider = new JsonRpcProvider('https://lightning-replica.boba.network/', ChainId.BOBA);
