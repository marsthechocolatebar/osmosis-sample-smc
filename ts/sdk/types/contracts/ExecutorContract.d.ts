/**
* This file was automatically generated by cosmwasm-typescript-gen@0.3.9.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the cosmwasm-typescript-gen generate command to regenerate this file.
*/
import { CosmWasmClient, ExecuteResult, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
export declare type ExecuteMsg = {
    increment: {
        [k: string]: unknown;
    };
} | {
    reset: {
        count: number;
        [k: string]: unknown;
    };
};
export declare type SwapAmount = {
    in: Uint128;
} | {
    out: Uint128;
};
export declare type Uint128 = string;
export interface GetEstimateSwapResponse {
    amount: SwapAmount;
    [k: string]: unknown;
}
export interface GetPoolInfoResponse {
    denom_in: string;
    denom_out: string;
    [k: string]: unknown;
}
export declare type Decimal = string;
export interface GetSpotPriceResponse {
    price: Decimal;
    [k: string]: unknown;
}
export interface InstantiateMsg {
    count: number;
    [k: string]: unknown;
}
export declare type QueryMsg = {
    get_estimate_swap: {
        amount: Uint128;
        denom_in: string;
        denom_out: string;
        pool_id: number;
        [k: string]: unknown;
    };
} | {
    get_spot_price: {
        swap: Swap;
        with_swap_fee: boolean;
        [k: string]: unknown;
    };
} | {
    get_pool_info: {
        pool_id: number;
        [k: string]: unknown;
    };
};
export interface Swap {
    denom_in: string;
    denom_out: string;
    pool_id: number;
    [k: string]: unknown;
}
export declare type Addr = string;
export interface State {
    count: number;
    owner: Addr;
    [k: string]: unknown;
}
export interface ExecutorReadOnlyInterface {
    contractAddress: string;
    getEstimateSwap: ({ amount, denomIn, denomOut, poolId }: {
        amount: string;
        denomIn: string;
        denomOut: string;
        poolId: number;
    }) => Promise<GetEstimateSwapResponse>;
    getSpotPrice: ({ swap, withSwapFee }: {
        swap: Swap;
        withSwapFee: boolean;
    }) => Promise<GetSpotPriceResponse>;
    getPoolInfo: ({ poolId }: {
        poolId: number;
    }) => Promise<GetPoolInfoResponse>;
}
export declare class ExecutorQueryClient implements ExecutorReadOnlyInterface {
    client: CosmWasmClient;
    contractAddress: string;
    constructor(client: CosmWasmClient, contractAddress: string);
    getEstimateSwap: ({ amount, denomIn, denomOut, poolId }: {
        amount: string;
        denomIn: string;
        denomOut: string;
        poolId: number;
    }) => Promise<GetEstimateSwapResponse>;
    getSpotPrice: ({ swap, withSwapFee }: {
        swap: Swap;
        withSwapFee: boolean;
    }) => Promise<GetSpotPriceResponse>;
    getPoolInfo: ({ poolId }: {
        poolId: number;
    }) => Promise<GetPoolInfoResponse>;
}
export interface ExecutorInterface extends ExecutorReadOnlyInterface {
    contractAddress: string;
    sender: string;
    increment: (fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
    reset: ({ count }: {
        count: number;
    }, fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
}
export declare class ExecutorClient extends ExecutorQueryClient implements ExecutorInterface {
    client: SigningCosmWasmClient;
    sender: string;
    contractAddress: string;
    constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string);
    increment: (fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
    reset: ({ count }: {
        count: number;
    }, fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
}
//# sourceMappingURL=ExecutorContract.d.ts.map