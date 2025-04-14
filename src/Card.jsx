import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSolBalance } from "./utils";

// eslint-disable-next-line react/prop-types
const Card = ({ index, privateKey, publicKey }) => {
  const [visible, setVisible] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleVisibility = () => {
    setVisible((prevState) => !prevState);
  };

  const getBalance = async () => {
    setIsRefreshing(true);
    const balance = await getSolBalance(publicKey);
    setBalance(balance);
    setIsRefreshing(false);
  };

  useEffect(() => {
    getBalance();
  }, []);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    },
    hover: { 
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  const balanceVariants = {
    hidden: { opacity: 0.6, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    updating: { 
      opacity: [0.6, 1, 0.6], 
      scale: [0.98, 1.02, 1], 
      transition: { repeat: Infinity, duration: 1.5 } 
    }
  };

  return (
    <motion.div 
      className="p-6 my-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layout
    >
      <motion.div 
        className="flex justify-between items-center mb-4"
        variants={itemVariants}
      >
        <motion.h3 
          className="text-sm font-semibold py-1 px-3 bg-blue-600 text-white rounded-full inline-flex items-center"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        >
          WALLET {index}
        </motion.h3>
        <motion.button
          onClick={getBalance}
          className="text-blue-400 hover:text-blue-300 p-1 rounded-full"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          disabled={isRefreshing}
        >
          <motion.svg 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </motion.svg>
        </motion.button>
      </motion.div>

      <motion.div 
        className="flex items-center justify-between mb-4"
        variants={itemVariants}
      >
        <motion.span 
          className="text-xl font-bold text-white flex items-center gap-2"
          variants={balanceVariants}
          animate={isRefreshing ? "updating" : "visible"}
        >
          <motion.span 
            className="text-green-400"
            animate={{ 
              color: isRefreshing ? ["#4ade80", "#ffffff", "#4ade80"] : "#4ade80" 
            }}
            transition={{ duration: 1.5, repeat: isRefreshing ? Infinity : 0 }}
          >
            {balance}
          </motion.span> 
          <span>SOL</span>
        </motion.span>
      </motion.div>

      <motion.div className="space-y-4" variants={itemVariants}>
        <motion.div variants={itemVariants}>
          <motion.label
            htmlFor={`password-${index}`}
            className="block mb-2 text-sm font-medium text-white flex items-center gap-2"
          >
            <motion.svg 
              className="h-4 w-4 text-yellow-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </motion.svg>
            PRIVATE KEY
          </motion.label>
          <div className="relative w-full">
            <motion.input
              type={visible ? "text" : "password"}
              id={`password-${index}`}
              value={privateKey}
              className="bg-slate-700 border border-slate-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 pr-10"
              readOnly
              whileFocus={{ scale: 1.01 }}
            />
            <motion.button
              type="button"
              onClick={toggleVisibility}
              className="absolute inset-y-0 end-0 px-3 text-gray-400 cursor-pointer focus:outline-none hover:text-blue-400"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ rotate: visible ? 0 : 180 }}
                transition={{ duration: 0.3 }}
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
              </motion.svg>
            </motion.button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.label
            htmlFor={`public-key-${index}`}
            className="block mb-2 text-sm font-medium text-white flex items-center gap-2"
          >
            <motion.svg 
              className="h-4 w-4 text-blue-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </motion.svg>
            PUBLIC KEY
          </motion.label>
          <motion.input
            type="text"
            id={`public-key-${index}`}
            value={publicKey}
            className="bg-slate-700 border border-slate-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            readOnly
            whileFocus={{ scale: 1.01 }}
          />
        </motion.div>

        <motion.div 
          className="pt-2 flex justify-end"
          variants={itemVariants}
        >
          <motion.button
            type="button"
            className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Card;
