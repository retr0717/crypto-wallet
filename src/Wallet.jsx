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
import { motion, AnimatePresence } from "framer-motion";
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3 }
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const phraseItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  };

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
    <motion.div 
      className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.form 
        onSubmit={handleCreateWallet} 
        className="space-y-4"
        variants={itemVariants}
      >
        {/* Wallet Selection and Balance Display */}
        <AnimatePresence>
          {selectedAccount ? (
            <motion.div 
              className="my-6 border-2 border-purple-500 p-8 rounded-xl bg-slate-800/90 backdrop-blur-sm shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              layout
            >
              <motion.div 
                className="flex justify-center mb-6"
                variants={itemVariants}
              >
                <motion.button
                  onClick={toggleDropdown}
                  className="relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg text-sm text-center inline-flex items-center gap-2 overflow-hidden group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ boxShadow: "0 0 0 rgba(59, 130, 246, 0)" }}
                  animate={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                  transition={{ 
                    boxShadow: { repeat: Infinity, repeatType: "reverse", duration: 2 }
                  }}
                >
                  <motion.div
                    className="h-5 w-5 bg-white/20 rounded-full flex-shrink-0"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      backgroundColor: ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.3)", "rgba(255,255,255,0.2)"]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  
                  <span className="inline-block">
                    {selectedAccount
                      ? `Wallet ${accounts.indexOf(selectedAccount) + 1}`
                      : "Select Wallet"}
                  </span>
                  
                  <motion.svg
                    className="w-3 h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                    animate={{ rotate: dropdownVisible ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </motion.svg>
                  
                  <motion.span 
                    className="absolute inset-0 bg-white/10 rounded-lg"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>

              <AnimatePresence>
                {dropdownVisible && (
                  <motion.div
                    className="z-10 bg-slate-700 rounded-xl shadow-2xl w-full overflow-hidden border border-slate-600 mb-6"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    layout
                  >
                    <motion.div
                      className="p-4 max-h-60 overflow-y-auto"
                      aria-labelledby="dropdownDefaultButton"
                    >
                      {accounts.map((account, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleAccountChange(index)}
                          className="w-full mb-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center gap-3"
                          whileHover={{ 
                            scale: 1.02, 
                            backgroundColor: "rgba(59, 130, 246, 0.2)",
                            borderColor: "#3B82F6"
                          }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <motion.div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center font-medium rounded-lg px-3 py-2 flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                          >
                            {index + 1}
                          </motion.div>
                          <motion.div className="text-left truncate text-gray-100 text-sm">
                            {account.publicKey}
                          </motion.div>
                        </motion.button>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div 
                className="flex items-center justify-center mb-8"
                variants={itemVariants}
              >
                <motion.div
                  className="bg-slate-900/60 py-4 px-8 rounded-xl border border-green-500/30 text-center w-full"
                  whileHover={{ 
                    boxShadow: "0 0 15px rgba(74, 222, 128, 0.3)",
                    borderColor: "rgba(74, 222, 128, 0.6)" 
                  }}
                >
                  <motion.div className="text-sm uppercase tracking-wider mb-1 text-gray-400">Current Balance</motion.div>
                  <motion.div 
                    className="text-3xl font-bold"
                    animate={{ 
                      scale: [1, 1.03, 1],
                      color: ["#4ADE80", "#ffffff", "#4ADE80"] 
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
                  >
                    {balance} <span className="text-green-400">SOL</span>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div 
                className="grid grid-cols-2 gap-6"
                variants={itemVariants}
              >
                <motion.button
                  type="button"
                  className="relative py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-medium rounded-xl overflow-hidden group"
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 4px 12px rgba(74, 222, 128, 0.4)" 
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    RECEIVE
                  </motion.span>
                  <motion.span 
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                </motion.button>
                
                <motion.button
                  onClick={handleSendButtonClick}
                  type="button"
                  className="relative py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-xl overflow-hidden group"
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 4px 12px rgba(248, 113, 113, 0.4)" 
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    SEND
                  </motion.span>
                  <motion.span 
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                </motion.button>
              </motion.div>
              
              {selectedAccount && (
                <Modal
                  isVisible={isModalVisible}
                  onClose={handleCloseModal}
                  onSubmit={handleSendTransaction}
                  publicKey={selectedAccount.publicKey}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              className="my-6 p-6 rounded-xl bg-slate-800/80 backdrop-blur-sm border border-dashed border-blue-500/50 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="text-xl text-gray-300 mb-2"
                animate={{ 
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                No wallet selected
              </motion.div>
              <p className="text-gray-400 text-sm mb-4">Create a wallet or import one using your seed phrase</p>
              <motion.div
                className="w-16 h-16 bg-blue-500/20 rounded-full mx-auto flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  backgroundColor: ["rgba(59, 130, 246, 0.2)", "rgba(59, 130, 246, 0.3)", "rgba(59, 130, 246, 0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="relative pt-10"
          variants={itemVariants}
        >
          <motion.input
            type="text"
            id="create-wallet"
            onChange={(e) => setPhrase(e.target.value)}
            className="block w-full p-4 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter phrase or create new"
            whileFocus={{ scale: 1.01, boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
          <motion.button
            type="submit"
            className="absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            {phrase.split(" ").length < 12 ? "Create Wallet" : "Use Wallet"}
          </motion.button>
        </motion.div>
      </motion.form>

      <AnimatePresence>
        {phrase && (
          <motion.div 
            className="my-6"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.h3 
              className="text-xl pb-3 pt-5 font-semibold text-gray-900 dark:text-white"
              variants={itemVariants}
            >
              SECRET PHRASE
            </motion.h3>
            <motion.div
              className="w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
              variants={itemVariants}
            >
              {phrase.split(" ").map((word, index) => (
                <motion.div
                  key={index}
                  className="bg-blue-500 text-white font-medium rounded-lg px-2 py-1"
                  custom={index}
                  variants={phraseItemVariants}
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: "#2563EB",
                    boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.3)" 
                  }}
                >
                  {`${index + 1}. ${word}`}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedAccount && (
          <motion.div 
            className="my-6"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.h3 
              className="text-xl pb-3 pt-5 font-semibold text-gray-900 dark:text-white"
              variants={itemVariants}
            >
              CURRENT WALLET
            </motion.h3>
            <motion.div 
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4"
              variants={itemVariants}
              whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.div variants={itemVariants}>
                <motion.label
                  htmlFor="private-key"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  PRIVATE KEY
                </motion.label>
                <div className="relative">
                  <motion.input
                    type={visible ? "text" : "password"}
                    id="private-key"
                    value={selectedAccount?.privateKey}
                    className="block w-full p-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    readOnly
                    whileFocus={{ scale: 1.01 }}
                  />
                  <motion.button
                    onClick={toggleVisibility}
                    type="button"
                    className="absolute inset-y-0 end-0 text-gray-400 cursor-pointer focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500 px-3"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      animate={{ rotate: visible ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
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
                    </motion.svg>
                  </motion.button>
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <motion.label
                  htmlFor="public-key"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  PUBLIC KEY
                </motion.label>
                <motion.input
                  type="text"
                  id="public-key"
                  value={selectedAccount?.publicKey}
                  className="block w-full p-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  readOnly
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create New Account Button */}
      <AnimatePresence>
        {phrase && keys.privateKey && keys.publicKey && (
          <motion.div 
            className="my-6"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.button
              onClick={handleAccountCreation}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-4 py-2 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              whileHover={{ 
                scale: 1.02,
                backgroundColor: "#1D4ED8",
                boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.5)" 
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Create New Wallet
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {accounts.length > 0 && (
          <motion.div 
            className="my-6"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.h3
              className="text-xl font-semibold text-gray-900 dark:text-white"
              variants={itemVariants}
            >
              WALLETS
            </motion.h3>
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
            >
              {accounts.map((account, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" 
                  }}
                >
                  <Card
                    index={index + 1}
                    privateKey={account.privateKey}
                    publicKey={account.publicKey}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Wallet;
