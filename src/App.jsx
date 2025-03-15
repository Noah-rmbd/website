import './App.css';
import './global.css';
import Terminal from './Terminal';

import { useState, useEffect, useRef } from "react";
import { Menu, Github, Linkedin, Mail } from "lucide-react";
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
    setIsMinimized(false);

  }
  const topClick = () => {
    top.current?.scrollIntoView({behavior: 'smooth'});
  }
  const isChrome = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.indexOf('chrome') > -1 && userAgent.indexOf('safari') > -1;
  };

  const linkedInProfile = () => {
    window.open('https://www.linkedin.com/in/noah-raimbaud-069598272', '_blank');
  };

  const linkedInMaintenance = () => {
    window.open('https://www.linkedin.com/posts/noah-raimbaud-069598272_gr%C3%A2ce-%C3%A0-polytech-angers-ecole-ding%C3%A9nieurs-activity-7205841147305312258-B91T?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEKma1EBMWsJ97MzHRUh8JACm9qKujsT-9g', '_blank');
  };

  const gitHubProfile = () => {
    window.open('https://github.com/Noah-rmbd', '_blank');
  };

  const gitHubMaintenance = () => {
    window.open('https://github.com/Noah-rmbd/PythonPrototypeGUI', '_blank');
  };

  const openMail = () => {
    window.location.href = 'mailto:raimbaudnoah@gmail.com';
  };


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
      if (window.scrollY > 350) {
        setIsMinimized(true);
      } else {
        setIsMinimized(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={top} className="min-h-screen w-screen text-white flex-col flex items-center">
      
      {/* Navbar */}
      <div className="fixed mt-6 lg:mt-8 left-0 right-0 z-30 flex justify-center">
        <nav className="fixed left-1/2 -translate-x-1/2 w-[92%] max-w-[1800px] rounded-[8px] lg:rounded-[14px] bg-black flex justify-between items-center p-1 md:p-2 lg:p-3 text-lg drop-shadow-xl z-30">
          <h1 onClick={topClick} className="lg:text-[36px] text-2xl ml-2 font-['Familjen_Grotesk'] font-bold truncate">\Noah Raimbaud</h1>
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* Minimized Terminal */}
            {isMinimized && (
              <motion.div
                className="absolute right-16 lg:right-20 top-1/2 -translate-y-1/2 bg-gray-800 text-gray-300 lg:p-2 p-1 rounded-md text-sm cursor-pointer flex-shrink-0"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onClick={bannerClick}
              >
                Terminal
              </motion.div>
            )}
            <Menu size={30} className="cursor-pointer mr-2 size- lg:size-10 flex-shrink-0" />
          </div> 
        </nav>
      </div>

    <main className='flex-col flex flex-1'>
      <div className='container-full flex-col flex items-center bg-black gap-4 md:gap-8'>
      {/* Hero Section */}
      <div ref={banner} className="relative flex-col w-[95%] flex justify-center items-center items-center justify-center text-left lg:mt-36 mt-26 mb-26">
        <motion.div
          className=" rounded-[14px] w-full h-[60vh] gradient-background shadow-2xl mx-6 z-10 noise-bg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
        <div className='w-full h-full pt-10 p-8 md:p-12 text-white-200'>
          <h2 className="text-[56px]/13 md:text-[64px]/16 text-white-200 opacity-100 font-['Helvetica'] font-bold">Welcome, I’m Noah Raimbaud</h2>
          <p className="mt-4 lg:text-[20px] md:text-[16px] text-[15px] text-white opacity-100  font-mono">
            Student in computer science and applied mathematics, navigate through the site using the terminal or the nav bar.
          </p>
          {/* Noise Overlay */}
          <div className="absolute grain inset-0 pointer-events-none noise-overlay"></div>
        </div>
        </motion.div>

       

  

        {/* Terminal UI with Minimization Effect */}
        <motion.div
          className="absolute top-[calc(100%-110px)] md:top-[calc(100%-150px)] lg:top-[calc(100%-250px)] mt-8 rounded-lg bg-gray-800 text-gray-300 w-[90%] max-w-4xl font-mono text-lg shadow-lg z-20"
          initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          animate={isMinimized ? { opacity: 0, scale: 0.5, x: 400, y: -300 } : { opacity: 1, scale: 1, x: 0, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className='bg-transparent'>
            <Terminal/>
          </div>
          
        </motion.div>
      </div>

      <p ref={ref} onClick={handleClick} className="lg:text-[20px] text-[16px] text-gray-400 mt-8 sm:mt-0 pb-8">Scroll down to show more</p>

      <div className="bg-black text-white rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-start w-full md:w-[95%] mt-5 p-8">
        <div className="flex-1 text-left">
          <h2 className="text-[64px]/16 font-bold font-['Familjen_Grotesk'] pb-5 mb-3">\About me</h2>
          <p className="lg:text-[20px] text-[16px]">
            I'm a passioned computer science engineering student, my curiosity and willingness to learn by myself pushed me to try a lot of different technologies (Python, Java, Html, C++, Rust, ...) and projects (Youtube channel, ML software, ...) My goal is now to specialize myself in machine learning and applied mathematics.
          </p>
        </div>
        <div className="bg-cover bg-center max-w-50 w-30 md:w-40 h-40 md:h-50 bg-gray-300 mt-4 md:mt-0 md:ml-6 rounded-lg"
        style={{ backgroundImage: "url('src/assets/photo_visage.png')",
          backgroundPosition: expanded ? "center" : "left center",
        }}></div>
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
                Engineering degree in Computer Science and applied Mathematics at the "École Polytechnique de l'université Paris-Saclay", the 12th University in the Shanghai ranking.
                Followed classes in : Software Development, Databases, OS, Machine Learning, Networks, Mathematics, ...
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
                Erasmus semester at the Linköping University. Following CS courses in Artficial Intelligence, Compilers, ...
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
                Preparatory classes specialized in Mathematics, Physics and Computer Science.
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
                High school diploma specialized in Mathematics and Computer Science. I also followed the "Expert Mathematics" option. With the honours.
              </div>
            </li>
            
          </ul>
        </div>
        
      </div>
      
      
      
      <div className="bg-black text-white rounded-xl shadow-lg flex flex-col md:flex-row items-start w-full md:w-[95%] p-8">
        <div className="flex-1 text-left">
          <h2 className="text-[64px]/16 font-bold font-['Familjen_Grotesk'] pb-5 mb-3">\Projects</h2>
          <div
              className={`justify-end relative bg-cover h-[64vh] md:h-[50vh] bg-center text-white rounded-xl shadow-lg cursor-pointer transition-all duration-500 overflow-hidden flex flex-col md:flex-row ${expanded ? "items-start" : "items-center"}`}
              style={{ backgroundImage: "url('src/assets/bannerLogiciel1.png')",
                backgroundPosition: expanded ? "center" : "left center",
              }}
              
              onMouseEnter={() => setExpanded(true)}
              onMouseLeave={() => setExpanded(false)}
              >
                

                {/* Text Content Box with Blur Effect */}
                <div
                  className={`relative transition-all duration-500 backdrop-blur-[56px] bg-[#6c6c6c]/45 p-6 rounded-lg mt-4 md:mt-0 md:px-6 md:h-full  ${expanded ? "w-full md:w-3/5 md:max-w-150" : "w-full md:w-1/2 md:max-w-120"}`}>
                  <div className="h-full flex flex-col justify-between">
                    <div className="flex flex-col justify-start">
                      <h2 className="text-left text-[32px] md:text-[40px] font-bold mb-6 lg:mb-10">M/ai/ntenance</h2>
                      <p className="text-left text-[14px] lg:text-[15px] font-mono leading-relaxed mr-2">
                        Creation of a Python application for predictive maintenance, using supervised learning, in destination of renewable energy production systems.
                      </p>
                      {expanded && (
                        <p className="text-left text-[14px] lg:text-[15px] font-mono text-sm leading-relaxed mt-2">
                          With the help of two PhDs from Laris Laboratory, we developed a GUI for easy manipulation of machine learning algorithms from the Sklearn package. Drag and drop your .csv file, visualize/normalize your data, select features, train/test your model, and export your results.
                        </p>
                      )}
                    </div>
                    <div className='mt-2 w-full  flex justify-end gap-3'>
                      <Linkedin size={28} onClick={linkedInMaintenance} className="cursor-pointer mr-2  flex-shrink-0" />
                      <Github size={28} onClick={gitHubMaintenance} className="cursor-pointer mr-2 flex-shrink-0" />
                    </div>
                  </div>
                </div>
          </div>
        </div>
      </div>

        <div className="bg-black text-white rounded-xl shadow-lg flex flex-col items-start w-full md:w-[95%] p-8">
          <div className="flex-1 text-left">
            <h2 className="text-[64px]/16 font-bold font-['Familjen_Grotesk'] pb-5 mb-3">\Contact</h2>
            <div className='mt-2 w-full flex justify-start gap-3'>
              <Linkedin size={28} onClick={linkedInProfile}className="cursor-pointer mr-2  flex-shrink-0" />
              <Github size={28} onClick={gitHubProfile} className="cursor-pointer mr-2 flex-shrink-0" />
              <Mail size={28} onClick={openMail} className="cursor-pointer mr-2 flex-shrink-0" />
            </div>
          </div>
        </div>

        <div className='w-full items-center mb-4'>
          <p>©2025 Noah Raimbaud. All rights reserved.</p>
        </div>

      </div>
      </main>
    </div>
  );
}
