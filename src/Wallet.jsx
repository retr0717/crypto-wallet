import { useState } from "react";
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import base58 from "bs58";
import { Buffer } from "buffer";
import Card from "./Card";
window.Buffer = Buffer;

const Wallet = () => {
  const [phrase, setPhrase] = useState("");
  const [keys, setKeys] = useState({ privateKey: "", publicKey: "" });
  const [accounts, setAccounts] = useState([]);
  let c = 0;
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible((prevState) => !prevState);
  };

  const generateKeys = (phrase) => {
    // Replace this with actual key generation logic
    const seed = mnemonicToSeedSync(phrase);
    const path = `m/44'/501'/${c++}'/0'`; // This is the derivation path
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const privateKeyBytes = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey =
      Keypair.fromSecretKey(privateKeyBytes).publicKey.toBase58();
    const privateKey = base58.encode(privateKeyBytes);
    return { privateKey, publicKey };
  };

  const handleCreateWallet = (event) => {
    event.preventDefault();
    let generatedPhrase = "";
    generatedPhrase =
      phrase.split(" ").length < 12 ? generateMnemonic() : phrase;
    console.log(generatedPhrase);
    const generatedKeys = generateKeys(generatedPhrase);
    console.log(generatedKeys);

    setPhrase(generatedPhrase);
    setKeys(generatedKeys);
    setAccounts([...accounts, generatedKeys]);
  };

  const handleCreateAccount = () => {
    const newAccount = generateKeys(phrase);
    setAccounts([...accounts, newAccount]);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleCreateWallet}>
        <label
          htmlFor="create-wallet"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Enter the phrase to create a wallet
        </label>
        <div className="relative mb-4">
          <input
            type="text"
            id="create-wallet"
            onChange={(e) => setPhrase(e.target.value)}
            className="block gap-4 w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter phrase or create new"
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create
          </button>
        </div>
      </form>

      <div className="mb-4">
        <label className="block mb-2 pt-4 text-xl font-semibold text-gray-900 dark:text-white">
          SECRET PHRASE
        </label>
        <div
          className="w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
        >
          {phrase.split(" ").map((word, index) => (
            <div
              key={index}
              className="bg-blue-500 text-white font-medium rounded-lg px-2 py-1"
            >
              {`${index + 1}. ${word}`}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="pt-5 pb-2 text-xl font-semibold text-gray-900 dark:text-white">
          CURRENT ACCOUNT
        </h3>
        <div className="p-4 overflow-y-hidden bg-white dark:bg-gray-800 rounded-lg shadow">
          <p>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              PRIVATE KEY
            </label>
            <div className="relative w-full">
              <input
                type={visible ? "text" : "password"}
                value={keys.privateKey}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                readOnly
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute end-0 inset-y-0 text-gray-400 cursor-pointer focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {visible ? (
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                  ) : (
                    <>
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </>
                  )}
                  {visible && <circle cx="12" cy="12" r="3" />}
                </svg>
              </button>
            </div>
          </p>
          <p>
            <label
              htmlFor="password"
              className="block pt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              PUBLIC KEY
            </label>
            <input
              type="text"
              id="public-key"
              value={keys.publicKey}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              readOnly
            />
          </p>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={handleCreateAccount}
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Create New Account
        </button>
      </div>

      <div className="">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          ACCOUNTS
        </h3>
        {accounts.map((account, index) => (
          <Card
            key={index}
            index={index + 1}
            privateKey={account.privateKey}
            publicKey={account.publicKey}
          />
        ))}
      </div>
    </div>
  );
};

export default Wallet;
