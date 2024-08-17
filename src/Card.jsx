import React, { useState } from "react";

// eslint-disable-next-line react/prop-types
const Card = ({ index, privateKey, publicKey }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible((prevState) => !prevState);
  };

  return (
    <div className="p-4 my-2 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-sm font-medium pb-4 text-gray-900 dark:text-white">
        ACCOUNT {index}
      </h3>
      <p>
        <label
          htmlFor={`password-${index}`}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          PRIVATE KEY
        </label>
        <div className="relative w-full">
          <input
            type={visible ? "text" : "password"}
            id={`password-${index}`}
            value={privateKey}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            readOnly
          />
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute inset-y-0 end-px right-1 text-gray-400 cursor-pointer focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
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
          htmlFor={`public-key-${index}`}
          className="block mb-2 pt-4 text-sm font-medium text-gray-900 dark:text-white"
        >
          PUBLIC KEY
        </label>
        <input
          type="text"
          id={`public-key-${index}`}
          value={publicKey}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          readOnly
        />
      </p>
    </div>
  );
};

export default Card;
