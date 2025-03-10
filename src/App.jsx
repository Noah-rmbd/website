import './App.css';
import './global.css';
import Terminal from './Terminal';

import { useState, useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

const textToType = "(base) user@google-chrome ~ % ";

export default function PersonalBrandingSite() {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef(null);
  const banner = useRef(null);
  const top = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const handleClick = () => {
    ref.current?.scrollIntoView({behavior: 'smooth'});
  };
  const bannerClick = () => {
    banner.current?.scrollIntoView({behavior: 'smooth'});
  }
  const topClick = () => {
    top.current?.scrollIntoView({behavior: 'smooth'});
  }


  useEffect(() => {
    if (index < textToType.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + textToType[index]);
        setIndex(index + 1);
      }, 100); // Adjust speed as needed
      return () => clearTimeout(timeout);
    }
  }, [index]); // Only re-run when index updates

  // Detect scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > 200) {
        setIsMinimized(true);
      } else {
        setIsMinimized(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={top} className="min-h-screen w-screen bg-black text-white flex-col flex items-center">
      {/* Navbar */}
      <nav className="w-[92%] max-w-400 rounded-[8px] lg:rounded-[14px] bg-black flex justify-between items-center p-1 lg:p-2 lg:p-4 m-8 text-lg shadow-md fixed z-30">
        <h1 onClick={topClick} className="lg:text-[36px] text-2xl ml-2 font-['Familjen_Grotesk'] font-bold">\Noah Raimbaud</h1>
        <div onClick={bannerClick} className="flex items-center gap-4">
          {/* Minimized Terminal */}
          {isMinimized && (
            <motion.div
              className="bg-gray-800 text-gray-300 lg:p-2 p-1 rounded-md text-sm cursor-pointer"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => {setIsMinimized(false); bannerClick;}}
            >
              Terminal
            </motion.div>
          )}
          <Menu size={30} className="cursor-pointer mr-2 size- lg:size-10" />
        </div>
        
      </nav>

      {/* Hero Section */}
      <div ref={banner} className="relative flex-col w-[95%] flex justify-center items-center items-center justify-center text-left lg:mt-36 mt-26 mb-26">
        <motion.div
          className=" rounded-[14px] w-full h-[60vh] gradient-background shadow-2xl mx-6 z-10 noise-bg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
        <div className='w-full h-full p-12 text-white-200'>
          <h2 className="text-[64px]/16 text-white-200 opacity-100 font-HelveticaNeue font-bold">Welcome, I’m Noah Raimbaud</h2>
          <p className="mt-4 lg:text-[20px] text-white opacity-100 text-[16px] font-MonoR">
            Student in computer science and applied mathematics, navigate through the site using the terminal or the nav bar.
          </p>
          {/* Noise Overlay */}
          <div className="absolute grain inset-0 pointer-events-none noise-overlay"></div>
        </div>
        </motion.div>

       

  

        {/* Terminal UI with Minimization Effect */}
        <motion.div
          className="absolute top-[calc(100%-150px)] lg:top-[calc(100%-250px)] mt-8 rounded-lg bg-gray-800 text-gray-300 w-[90%] max-w-4xl font-mono text-lg shadow-lg z-20"
          initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          animate={isMinimized ? { opacity: 0, scale: 0.5, x: 400, y: -300 } : { opacity: 1, scale: 1, x: 0, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className='bg-transparent'>
            <Terminal/>
          </div>
          
        </motion.div>
      </div>

      <p onClick={handleClick} className="lg:text-[20px] text-[16px] text-gray-400 pb-8">Scroll down to show more</p>

      <div ref={ref} className="bg-black text-white rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-start w-[95%] p-8">
        <div className="flex-1 text-left">
          <h2 className="text-[64px]/16 font-bold font-['Familjen_Grotesk'] pb-5 mb-3">\About me</h2>
          <p className="lg:text-[20px] text-[16px]">
            Student in computer science and applied mathematics, navigate through
            the site using the terminal or the nav bar. Lorem ipsum dolor sit amet.
            In and out to the beast with the help of the people who made this
            incredible journey. Using their brain, cats can find alternatives to
            globalization.
          </p>
        </div>
        <div className="w-full max-w-50 md:w-40 h-40 bg-gray-300 mt-4 md:mt-0 md:ml-6 rounded-lg"></div>
      </div>

      <div className="bg-black text-white rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-start w-[95%] p-8">
        <div className="flex-1 text-left">
          <h2 className="text-[64px]/16 font-bold font-['Familjen_Grotesk'] pb-5 mb-3">\Education</h2>
          <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
            <li>
              <div className="timeline-middle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd" />
                </svg>
              </div>
              <div className="timeline-start mb-10 md:text-end">
                <time className="font-mono italic">2024-2027</time>
                <div className="text-lg font-black">Polytech Paris Saclay</div>
                The Apple Macintosh—later rebranded as the Macintosh 128K—is the original Apple Macintosh
                personal computer. It played a pivotal role in establishing desktop publishing as a general
                office function. The motherboard, a 9 in (23 cm) CRT monitor, and a floppy drive were housed
                in a beige case with integrated carrying handle; it came with a keyboard and single-button
                mouse.
              </div>
              <hr />
            </li>
            <li>
              <hr />
              <div className="timeline-middle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd" />
                </svg>
              </div>
              <div className="timeline-end md:mb-10 mb-10">
                <time className="font-mono italic">2025</time>
                <div className="text-lg font-black">Linköping University</div>
                iMac is a family of all-in-one Mac desktop computers designed and built by Apple Inc. It has
                been the primary part of Apple's consumer desktop offerings since its debut in August 1998,
                and has evolved through seven distinct forms
              </div>
              <hr />
            </li>
            <li>
              <hr />
              <div className="timeline-middle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd" />
                </svg>
              </div>
              <div className="timeline-start mb-10 md:text-end">
                <time className="text-gray-300 italic">2022-2024</time>
                <div className="text-[20px] font-Helvetica font-bold">Polytech Angers</div>
                The iPod is a discontinued series of portable media players and multi-purpose mobile devices
                designed and marketed by Apple Inc. The first version was released on October 23, 2001
              </div>
              <hr className="gradient-background"/>
            </li>
            <li>
              <hr className="gradient-background"/>
              <div className="timeline-middle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd" />
                </svg>
              </div>
              <div className="timeline-end md:mb-10">
                <time className="text-gray-300 italic">2019-2022</time>
                <div className="text-lg font-black">Charles-Peguy High School</div>
                iPhone is a line of smartphones produced by Apple Inc. that use Apple's own iOS mobile
                operating system. The first-generation iPhone was announced by then-Apple CEO Steve Jobs on
                January 9, 2007. Since then, Apple has annually
              </div>
            </li>
            
          </ul>
        </div>
        
      </div>
      
      
      
      <div className="bg-black text-white rounded-xl shadow-lg flex flex-col md:flex-row items-start w-[95%] p-8">
        <div className="flex-1 text-left">
          <h2 className="text-[64px]/16 font-bold font-['Familjen_Grotesk'] pb-5 mb-3">\Projects</h2>
          <div
              className={`justify-end relative bg-cover h-[64vh] md:h-[50vh] bg-center text-white rounded-xl shadow-lg cursor-pointer transition-all duration-500 overflow-hidden flex flex-col md:flex-row ${expanded ? "items-start" : "items-center"}`}
              style={{ backgroundImage: "url('src/assets/bannerLogiciel1.png')",
                backgroundPosition: expanded ? "center" : "left center",
              }}
              onClick={() => setExpanded(!expanded)}>
                

                {/* Text Content Box with Blur Effect */}
                <div
                  className={`justify-start transition-all duration-500 backdrop-blur-[56px] bg-[#6c6c6c]/45 p-6 rounded-lg mt-4 md:mt-0 md:px-6 md:h-full  ${expanded ? "w-full md:w-3/5 md:max-w-150" : "w-full md:w-1/2 md:max-w-120"}`}>
                  <h2 className="text-left text-[32px] md:text-[40px] font-bold mb-6 md:mb-10">M/ai/ntenance</h2>
                  <p className="text-left text-[15px] font-mono leading-relaxed mr-2">
                    Creation of a Python application for predictive maintenance, using supervised learning, in destination of renewable energy production systems.
                  </p>
                  {expanded && (
                    <p className="text-left text-[15px] font-mono text-sm leading-relaxed mt-2">
                      With the help of two PhDs from Laris Laboratory, we developed a GUI for easy manipulation of machine learning algorithms from the Sklearn package. Drag and drop your .csv file, visualize/normalize your data, select features, train/test your model, and export your results.
                    </p>
                  )}
                </div>
          </div>
        </div>
      </div>
      





      <div className="bg-black text-white rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-start w-[95%] p-8">
        <div className="flex-1 text-left">
          <h2 className="text-[64px]/16 font-bold font-['Familjen_Grotesk'] pb-5 mb-3">\Contact</h2>
          <p className="lg:text-[20px] text-[16px]">
            Student in computer science and applied mathematics, navigate through
            the site using the terminal or the nav bar. Lorem ipsum dolor sit amet.
            In and out to the beast with the help of the people who made this
            incredible journey. Using their brain, cats can find alternatives to
            globalization.
          </p>
        </div>
        <div className="w-full max-w-50 md:w-40 h-40 bg-gray-300 mt-4 md:mt-0 md:ml-6 rounded-lg"></div>
      </div>

      
    </div>
  );
}