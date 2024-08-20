import axios from "axios";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Connection,
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";

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

export const transferSol = async (
  fromPublicKeyString,
  toPublicKeyString,
  privateKeyString,
  amount,
) => {
  // Create a connection to the Solana network
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed",
  );

  // Convert the string public keys to PublicKey objects
  const fromPublicKey = new PublicKey(fromPublicKeyString);
  const toPublicKey = new PublicKey(toPublicKeyString);

  // Decode the Base58 private key string to a Uint8Array
  const privateKeyUint8Array = bs58.decode(privateKeyString);

  // Create a Keypair from the private key
  const fromKeypair = Keypair.fromSecretKey(privateKeyUint8Array);

  // Verify the public key derived from the private key matches the provided public key
  if (!fromPublicKey.equals(fromKeypair.publicKey)) {
    throw new Error("The provided public key does not match the private key.");
  }

  // Create a transaction
  const transferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toPublicKey, // Use the PublicKey object directly
      lamports: amount * LAMPORTS_PER_SOL,
    }),
  );

  // Send and confirm the transaction
  try {
    const result = await sendAndConfirmTransaction(
      connection,
      transferTransaction,
      [fromKeypair],
    );
    console.log("Transaction confirmed. Signature: ", result);
    return result;
  } catch (error) {
    console.error("Transaction failed:", error);
    return error;
  }
};
