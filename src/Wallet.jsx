import { useState, useEffect } from "react";
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import base58 from "bs58";
import { Buffer } from "buffer";
import Card from "./Card";
import { getSolBalance, transferSol } from "./utils";
import Modal from "./Modal";
window.Buffer = Buffer;

const Wallet = () => {
  const [phrase, setPhrase] = useState("");
  const [keys, setKeys] = useState({ privateKey: "", publicKey: "" });
  const [accounts, setAccounts] = useState([]);
  const [c, setC] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible((prevState) => !prevState);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSendButtonClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSendTransaction = async (sender, receiver, amount) => {
    console.log(`Sending ${amount} SOL from ${sender} to ${receiver}`);
    try {
      const result = await transferSol(
        sender,
        receiver,
        selectedAccount.privateKey,
        amount,
      );
      console.log(result);
    } catch (error) {
      console.log("error occured", error);
    }
    // Close the modal after sending
    setIsModalVisible(false);
  };

  const handleAccountCreation = () => {
    const seed = mnemonicToSeedSync(phrase);
    const path = `m/44'/501'/${c}'/0'`; // This is the derivation path
    setC(c + 1);
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const privateKeyBytes = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey =
      Keypair.fromSecretKey(privateKeyBytes).publicKey.toBase58();
    const privateKey = base58.encode(privateKeyBytes);
    const account = { privateKey, publicKey };
    setAccounts([...accounts, account]);
  };

  const generateKeys = (phrase) => {
    const seed = mnemonicToSeedSync(phrase);
    const path = `m/44'/501'/0'/0'`; // This is the derivation path
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const privateKeyBytes = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey =
      Keypair.fromSecretKey(privateKeyBytes).publicKey.toBase58();
    const privateKey = base58.encode(privateKeyBytes);
    return { privateKey, publicKey };
  };

  const handleCreateWallet = (event) => {
    event.preventDefault();
    let generatedPhrase =
      phrase.split(" ").length < 12 ? generateMnemonic() : phrase;
    const generatedKeys = generateKeys(generatedPhrase);

    setPhrase(generatedPhrase);
    setKeys(generatedKeys);
    setAccounts([generatedKeys]);
    setC(1);
  };

  const fetchBalance = async (publicKey) => {
    const balance = await getSolBalance(publicKey);
    setBalance(balance);
  };

  useEffect(() => {
    if (accounts.length > 0) {
      setSelectedAccount(accounts[0]);
      fetchBalance(accounts[0].publicKey);
    }
  }, [accounts]);

  const handleAccountChange = (index) => {
    const selectedAcc = accounts[index];
    setSelectedAccount(selectedAcc);
    fetchBalance(selectedAcc.publicKey);
    setDropdownVisible(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <form onSubmit={handleCreateWallet} className="space-y-4">
        {/* Wallet Selection and Balance Display */}
        {selectedAccount && (
          <div className="my-6 border-2 border-blue-300 p-10 rounded-xl">
            <div className="flex justify-center">
              <button
                id="dropdownDefaultButton"
                onClick={toggleDropdown}
                data-dropdown-toggle="dropdown"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
              >
                {selectedAccount
                  ? `Wallet ${accounts.indexOf(selectedAccount) + 1}`
                  : "Select Wallet"}
                <svg
                  className="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
            </div>

            {dropdownVisible && (
              <div
                id="dropdown"
                className="z-10 bg-white transition-all divide-y mt-5 divide-gray-100 rounded-lg shadow dark:bg-gray-700 w-full"
              >
                <ul
                  className="py-2 text-sm dark:text-gray-200 block w-full p-3"
                  aria-labelledby="dropdownDefaultButton"
                >
                  {accounts.map((account, index) => (
                    <button
                      key={index}
                      onClick={() => handleAccountChange(index)}
                      className="w-full mt-4 mb-2 inline-flex items-center gap-4"
                    >
                      <div
                        key={index}
                        className="bg-blue-500 text-white text-center font-medium rounded-lg px-2 py-1 w-1/5 sm:w-1/6"
                      >
                        Wallet {index + 1}
                      </div>
                      <div className="inline-flex p-1 truncate w-4/5 sm:w-5/6">
                        {account.publicKey}
                      </div>
                    </button>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between mt-4 w-full border-3 border-blue-600">
              <span className="text-2xl text-center font-bold text-green-500 dark:text-white w-full p-5">
                BALANCE : {balance} SOL
              </span>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="button"
                className="w-full text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
              >
                RECEIVE
              </button>
              <button
                onClick={handleSendButtonClick}
                type="button"
                className="w-full text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
              >
                SEND
              </button>
              <Modal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onSubmit={handleSendTransaction}
                publicKey={selectedAccount.publicKey}
              />
            </div>
          </div>
        )}

        <div className="relative pt-10">
          <input
            type="text"
            id="create-wallet"
            onChange={(e) => setPhrase(e.target.value)}
            className="block w-full p-4 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter phrase or create new"
          />
          <button
            type="submit"
            className="absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            {phrase.split(" ").length < 12 ? "Create Wallet" : "Use Wallet"}
          </button>
        </div>
      </form>

      <div className="my-6">
        <h3 className="text-xl pb-3 pt-5 font-semibold text-gray-900 dark:text-white">
          SECRET PHRASE
        </h3>
        <div
          className="w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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

      <div className="my-6">
        <h3 className="text-xl pb-3 pt-5 font-semibold text-gray-900 dark:text-white">
          CURRENT WALLET
        </h3>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4">
          <div>
            <label
              htmlFor="private-key"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              PRIVATE KEY
            </label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                id="private-key"
                value={selectedAccount?.privateKey}
                className="block w-full p-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                readOnly
              />
              <button
                onClick={toggleVisibility}
                type="button"
                className="absolute inset-y-0 end-0 text-gray-400 cursor-pointer focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {!visible ? (
                    <>
                      <path d="M12 4.5C7.30558 4.5 3.36396 7.18356 1.5 11c1.86396 3.81644 5.80558 6.5 10.5 6.5 4.69442 0 8.63604-2.68356 10.5-6.5-1.86396-3.81644-5.80558-6.5-10.5-6.5zM2 11c1.2 2.2 4.09434 4.5 10 4.5 5.90566 0 8.8-2.3 10-4.5-1.2-2.2-4.09434-4.5-10-4.5C6.09434 6.5 3.2 8.8 2 11z" />
                      <circle cx="12" cy="11" r="3" />
                    </>
                  ) : (
                    <>
                      <path d="M12 4.5c4.69442 0 8.63604 2.68356 10.5 6.5-1.86396 3.81644-5.80558 6.5-10.5 6.5-4.69442 0-8.63604-2.68356-10.5-6.5C3.36396 7.18356 7.30558 4.5 12 4.5zM19.39 19.39a13.526 13.526 0 0 0 4.61-7.39s-3-7-10-7c-5.90566 0-8.8 2.3-10 4.5a13.526 13.526 0 0 0 1.61 5.39" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </>
                  )}
                  {visible && <circle cx="12" cy="12" r="3" />}
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="public-key"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              PUBLIC KEY
            </label>
            <input
              type="text"
              id="public-key"
              value={selectedAccount?.publicKey}
              className="block w-full p-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Create New Account Button */}
      {phrase && keys.privateKey && keys.publicKey && (
        <div className="my-6">
          <button
            onClick={handleAccountCreation}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-4 py-2 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create New Wallet
          </button>
        </div>
      )}

      <div className="my-6">
        <h3
          className={
            phrase
              ? "text-xl font-semibold text-gray-900 dark:text-white"
              : "hidden"
          }
        >
          WALLETS
        </h3>
        <div className="space-y-4">
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
    </div>
  );
};

export default Wallet;
