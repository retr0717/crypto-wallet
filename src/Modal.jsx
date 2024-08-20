import React, { useState } from "react";

const Modal = ({ isVisible, onClose, onSubmit, publicKey }) => {
  if (!isVisible) return null;

  const [sender, setSender] = useState(publicKey);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState(0);

  const formDataSubmit = (e) => {
    onSubmit(sender, receiver, amount);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-slate-500 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-stone-900">SENT SOL</h2>
        <div>
          <div className="mb-6">
            <label htmlFor="success" className="block mb-2 text-sm font-bold">
              SENDER PUBLIC KEY
            </label>
            <input
              type="text"
              name="sender"
              onChange={(e) => setSender(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="SENDER PUBLIC KEY"
              defaultValue={publicKey}
              required
              readOnly
            />
          </div>
          <div className="mb-6">
            <label htmlFor="success" className="block mb-2 text-sm font-bold">
              RECEIVER PUBLIC KEY
            </label>
            <input
              type="text"
              name="receiver"
              onChange={(e) => setReceiver(e.target.value)}
              className="bg-green-50 border text-sm rounded-lg focus:ring-slate-50  block w-full p-2.5 dark:bg-gray-700 dark:border-slate-50"
              placeholder="RECIPIENT PUBLIC KEY"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="success" className="block mb-2 text-sm font-bold">
              AMOUNT (SOL)
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              onChange={(e) => setAmount(e.target.value)}
              className="bg-green-50 border text-sm rounded-lg focus:ring-slate-50  block w-full p-2.5 dark:bg-gray-700 dark:border-slate-50"
              placeholder="SOL"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              type="button"
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              CANCEL
            </button>
            <button
              onClick={formDataSubmit}
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              SEND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
