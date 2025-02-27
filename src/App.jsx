import './App.css';
import './global.css';

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

const textToType = "(base) user@google-chrome ~ % ";

export default function PersonalBrandingSite() {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);


  useEffect(() => {
    if (index < textToType.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + textToType[index]);
        setIndex(index + 1);
      }, 100); // Adjust speed as needed
      return () => clearTimeout(timeout);
    }
  }, [index]); // Only re-run when index updates


  return (
    <div className="min-h-screen w-screen bg-black text-white flex-col flex items-center">
      {/* Navbar */}
      <nav className="w-[92%] max-w-400 rounded-[8px] lg:rounded-[14px] bg-black flex justify-between items-center p-1 lg:p-2 lg:p-4 m-8 text-lg shadow-md fixed">
        <h1 className="lg:text-3xl text-2xl ml-2 font-['Familjen_Grotesk'] font-bold">\Noah Raimbaud</h1>
        <Menu size={30} className="cursor-pointer mr-2 size- lg:size-10" />
      </nav>

      {/* Hero Section */}
      <div className="flex-col w-[95%] flex justify-center items-center items-center justify-center text-center mt-36">
        <motion.div
          className="p-12 rounded-[14px] w-full h-[60vh] bg-gradient-to-r from-orange-500 to-purple-600 shadow-2xl mx-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          
          <h2 className="text-5xl font-helvetica font-bold">Welcome, I’m Noah Raimbaud</h2>
          <p className="mt-4 text-lg">
            Student in computer science and applied mathematics, navigate through the site using the terminal or the nav bar.
          </p>
        </motion.div>

        {/* Terminal UI */}
        <motion.div
          className="mt-8 p-6 rounded-lg bg-gray-800 text-gray-300 w-full max-w-2xl font-mono text-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="flex space-x-2 mb-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
          <p>{displayedText}</p>
        </motion.div>
      </div>

      <p className="mt-10 text-gray-400 text-sm">Scroll down to show more</p>
    </div>
  );
}
