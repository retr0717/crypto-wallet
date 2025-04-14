import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      className="py-4 px-6 bg-gradient-to-r from-purple-800 to-blue-800 text-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-2xl font-bold tracking-wider"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              CRYPTO
            </motion.span>{" "}
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-green-400"
            >
              WALLET
            </motion.span>
          </motion.h1>
        </motion.div>
        
        <motion.div 
          className="flex space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Optional navigation items could go here */}
          <motion.div 
            className="w-8 h-8 bg-green-400 rounded-full"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0px 0px 8px rgba(34, 197, 94, 0.6)" 
            }}
            whileTap={{ scale: 0.9 }}
          />
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
