import useSWR from "swr";
import { getAddress, getClient, getSigningClient } from "../lib/client";
import { getContractAddr } from "../lib/state";

export const getCount = async () => {
  const client = await getClient();
  return await client.queryContractSmart(getContractAddr(), { get_count: {} });
};

export const getPoolInfo = async (poolId: number) => {
  const client = await getClient();

  return await client.queryContractSmart(getContractAddr(), { get_pool_info: {pool_id: poolId}});
}

export const increase = async () => {
  try {
    const client = await getSigningClient();
    return await client.execute(
      await getAddress(), // 연결된 지갑 address, senderAddress
      getContractAddr(), // 우리가 작성한 contract address, contractAddress
      { increment: {} }, // message
      "auto" // fee
    );
  } catch (error) {
    console.error(error);
  }
};

export const useCount = () => {
  const { data, error, mutate } = useSWR("/counter/count", getCount);
  return {
    count: data?.count,
    error,
    increase: () => mutate(increase),
  };
};
