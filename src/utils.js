import axios from "axios";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const getSolBalance = async (address) => {
  const url = "https://api.devnet.solana.com";
  const response = await axios({
    method: "post",
    url: url,
    data: {
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [address],
    },
  });

  return (
    Math.round(
      (response.data.result.value / LAMPORTS_PER_SOL + Number.EPSILON) * 100,
    ) / 100
  );
};
