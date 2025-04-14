import "./App.css";
import Header from "./Header";
import Wallet from "./Wallet";
import { motion } from "framer-motion";

function App() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-5 w-full flex flex-col justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto w-full"
      >
        <motion.div 
          className="p-8 w-full"
          variants={itemVariants}
        >
          <Header />
        </motion.div>
        
        <motion.div 
          className="w-full"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Wallet />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default App;
