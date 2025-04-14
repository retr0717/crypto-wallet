import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isVisible, onClose, onSubmit, publicKey }) => {
  const [sender, setSender] = useState(publicKey);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState(0);

  const formDataSubmit = (e) => {
    onSubmit(sender, receiver, amount);
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: 30,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div 
            className="bg-slate-800 p-8 rounded-xl shadow-2xl w-96 border border-slate-700"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <motion.h2 
              className="text-2xl font-bold mb-6 text-white flex items-center"
              variants={itemVariants}
            >
              <motion.div
                initial={{ rotate: -5 }}
                animate={{ rotate: 0 }}
                className="bg-gradient-to-r from-purple-500 to-blue-500 w-8 h-8 rounded-full mr-3 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </motion.div>
              SEND SOL
            </motion.h2>
            
            <motion.div variants={itemVariants}>
              <motion.div className="mb-6" variants={itemVariants}>
                <motion.label className="block mb-2 text-sm font-bold text-gray-300">
                  SENDER PUBLIC KEY
                </motion.label>
                <motion.input
                  type="text"
                  name="sender"
                  onChange={(e) => setSender(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  placeholder="SENDER PUBLIC KEY"
                  defaultValue={publicKey}
                  required
                  readOnly
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                />
              </motion.div>
              
              <motion.div className="mb-6" variants={itemVariants}>
                <motion.label className="block mb-2 text-sm font-bold text-gray-300">
                  RECEIVER PUBLIC KEY
                </motion.label>
                <motion.input
                  type="text"
                  name="receiver"
                  onChange={(e) => setReceiver(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  placeholder="RECIPIENT PUBLIC KEY"
                  required
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                />
              </motion.div>
              
              <motion.div className="mb-8" variants={itemVariants}>
                <motion.label className="block mb-2 text-sm font-bold text-gray-300">
                  AMOUNT (SOL)
                </motion.label>
                <motion.input
                  type="number"
                  name="amount"
                  step="0.01"
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  placeholder="SOL"
                  required
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                />
              </motion.div>
              
              <motion.div className="flex justify-end space-x-3" variants={itemVariants}>
                <motion.button
                  onClick={onClose}
                  type="button"
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  CANCEL
                </motion.button>
                <motion.button
                  onClick={formDataSubmit}
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  SEND
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
