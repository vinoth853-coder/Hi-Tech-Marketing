"use client";
 
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaTiktok } from "react-icons/fa";

const itemsLeft = [
  "Aluminium Shop fronts",
  "Roller (Electric) shutters",
  "Thermal Break Aluminium Windows",
  "Non Thermal Break Aluminium Windows",
  "Curtain walling",
  "Toughened Glass Shop fronts",
  "Automatic Sliding/Open In/Open Out entrance doors",
  "Bi-folding doors (with or without removable corner post)",
  "Fire Doors (Fire Rated Roller Shutters Upto 4 Hours With Certificate)",
  "Magnet Locks, Remote Control for Shutters, Digital Pad Locks",
];

const itemsRight = [
  "Security Shutters.",
  "Security Grills.",
  "Glass Shop Front Fittings.",
  "Insulated Shutters",
  "Custom Build Shutters",
  "Custom Build Shop Fronts",
  "Pitched Glass Roof, Pergola, Roof Lantern",
  "Glazing glass in 6.40mm, 8.8 mm, 10.8 mm, 12 mm (Safety Laminated, Double Glazed Units).",
  "Glazing Options in Acoustic Glass (Sound Proof), Toughened Laminated, Active Blue self Cleaning Glass.",
];

const items = [
  { name: "Toughened Glass Shop fronts", image: "/img1.jpg" },
  { name: "Commercial Electric & Manual Shutters", image: "/img2.jpg" },
  { name: "Aluminium Doors & Window", image: "/img3.jpg" },
  { name: "Shop Fronts", image: "/img4.jpg" },
  { name: "Roller Shutters", image: "/img5.jpg" },
  { name: "Fire-Rated Shutters & Doors", image: "/img6.png" },
];

const testimonials = [
  {
    text: "We gave HI-Tech Shop Fitters the work for our new outlet in Manchester, and they did an excellent job. The work was within the time requirements, and we were kept up to date with all work and the price was on the mark.",
    name: "Charlie Brown",
  },
  {
    text: "If you want a professional job done then call HI-Tech Shop Fitters as they can do all types of work like security grills to interior fittings. Fantastic.",
    name: "Subway",
  },
  {
    text: "We had a large project and wanted a company who would manage the whole project from start to end. HI-Tech Shop Fitters did just that and within the budget requirements. We will be using HI-Tech Shop Fitters in the future.",
    name: "Select And Save",
  },
  {
    text: "We had a large project and wanted a company who would manage the whole project from start to end. HI-Tech Shop Fitters did just that and within the budget requirements. We will be using HI-Tech Shop Fitters in the future.",
    name: "Select And Save"
  },
  {
    text: "HI-Tech Shop Fitters have really done a great job. Totally professional and above all the price and quality was outstanding.",
    name: "Islamic Impressions"
  },
  {
    text: "Very good work and everything was completed on time with no issues at all. Top Job.",
    name: "Lahore"
  },
];

 
const Home = () => {
  // Refs for scrolling
  const aboutSectionRef = useState(null);
 
  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };
 
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.2, ease: "easeInOut" } },
  };
 
  const slideIn = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
  };
 
  // Scroll handler
  const handleScrollToHistory = () => {
    aboutSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [startIndex, setStartIndex] = useState(0);
  const visibleItems = 3; // Show 3 testimonials at a time

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Auto-scroll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

 
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/homevd.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent"></div>
 
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 sm:px-10">
          
 
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
           <span className="bg-clip-text mt-2 text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"> HI- TECH </span> 
            <br />
            <span className="bg-clip-text mt-2 text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
              SHOPFRONT AND SHUTTERS LTD
            </span>
            
          </motion.h1>
          <motion.h2
            className="text-lg sm:text-xl md:text-2xl font-light italic mb-4 mt-4"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
           MEET CUSTOMER EXPECTATIONS
          </motion.h2>

        <div className="flex space-x-4 mt-4">
                    <a href="https://www.facebook.com/share/1A7hwDfTeP/" target="_blank" rel="noopener noreferrer">
                      <FaFacebook className="text-3xl hover:text-blue-500 transition" />
                    </a>
                    <a href="https://www.instagram.com/hitech_shopfronts_ltd?igsh=Z3BhZnNrNjNteTc0" target="_blank" rel="noopener noreferrer">
                      <FaInstagram className="text-3xl hover:text-blue-500 transition" />
                    </a>
                    <a href="https://www.tiktok.com/@hitech_shopfronts_ltd?_t=ZN-8txSngXoGDm&_r=1" target="_blank" rel="noopener noreferrer">
                      < FaTiktok className="text-3xl hover:text-blue-500 transition" />
                    </a>
                    <a href="mailto:blueshyshopfronts@outlook.com">
                      <FaEnvelope className="text-3xl hover:text-blue-500 transition" />
                    </a>
                    <a href="tel:+447479345599">
                      <FaPhone className="text-3xl hover:text-blue-500 transition" />
                    </a>
                  </div>  
 
          {/* <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1.5, delay: 0.5 } }}
          >
            <button
              onClick={handleScrollToHistory}
              className="px-6 py-3 rounded-full bg-green-600 text-secondary font-medium text-lg shadow-md hover:bg-green-400 transition duration-300"
            >
              Get a quote
            </button>
          </motion.div> */}
        </div>
      </div>
 
      {/* About Section */}
      <motion.div
  ref={aboutSectionRef}
  className="py-20 px-6 sm:px-10 lg:px-20 text-primary"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  <div className="max-w-flex mx-auto flex flex-col md:flex-row items-start md:items-center gap-14">
    {/* Left Side - About Us Content */}
    <div className="md:w-2/3 text-left">
      <motion.h2 className="text-2xl sm:text-4xl md:text-4xl font-bold mb-8 text-blue-800" variants={fadeUp}>
      Who we are?
      </motion.h2>

      <motion.p className="text-lg sm:text-xl leading-relaxed mb-6 text-justify" variants={slideIn}>
      At Hi- Tech Shop Fitters, we take pride in providing a comprehensive nationwide service for roller shutters and shop fronts. From Scotland to Northern Ireland, Wales to the rest of Great Britain, our reach extends far and wide, ensuring your business gets the attention it deserves. we are committed to delivering the highest standard of shop fronts and roller shutters. Quality is our priority, and we offer unbeatable prices without compromising on excellence.
      </motion.p>
    </div>

    {/* Right Side - Submit Your Details Form */}
    <div className="md:w-1/2 w-full bg-gray-200 p-4 pt-10 pb-10 rounded-lg ">
      <h3 className="text-2xl font-semibold mb-4 text-center text-blue-800">Submit Your Details</h3>
      <form className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
        <input
          type="tel"
          placeholder="Your Contact Number"
          className="p-3 border border-gray-300 rounded-lg  focus:ring-blue-800"
        />
        <textarea
  placeholder="Message"
  className="p-3 border border-gray-300 rounded-lg  focus:ring-blue-800 h-32"
></textarea>
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-blue-800 text-white font-medium text-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
  <motion.p className="text-lg sm:text-xl leading-relaxed mt-8  text-justify" variants={slideIn}>
  Our reputation is a testament to our exceptional workmanship, which is why we confidently offer a 12-month free parts and labor guarantee on all our products. You can trust us to stand behind our craft, ensuring your peace of mind and complete satisfaction.
      </motion.p>
      <motion.p className="text-lg sm:text-xl leading-relaxed mt-6  text-justify" variants={slideIn}>
      Let Hi- Tech Shop Fitters elevate your business with premium shop fronts and roller shutters that exude style, security, and reliability. Experience our commitment to excellence firsthand, as we work together to bring your vision to life. Your success is our passion.
      </motion.p>

      <motion.h2 className="text-2xl sm:text-4xl md:text-4xl mt-14 font-bold mb-8 text-blue-800" variants={fadeUp}>
      Hi- Tech Shop Fitters offer a wide range of solutions to meet any shopfront requirement.
      </motion.h2>

      <div className="w-full max-w-flex grid grid-cols-1 md:grid-cols-3 gap-10 items-center mb-10">
        {/* Left Column */}
        <div className="space-y-4">
          {itemsLeft.map((item, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-teal-600">✔</span> 
              <p className="text-gray-800">{item}</p>
            </div>
          ))}
        </div>

        {/* Center Image */}
        <div className="flex justify-center">
          <Image
            src="/centerimagehome.jpg" // Replace with your image URL
            alt="Building"
            className="rounded-lg shadow-lg w-full h-auto md:max-w-xs"
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {itemsRight.map((item, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-teal-600">✔</span> 
              <p className="text-gray-800">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1  mt-20 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-flex">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative bg-white rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 hover:bg-teal-700 hover:text-white text-gray-800"
          >
            <Image
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center font-semibold">
              {item.name}
            </div>
          </div>
        ))}
      </div>

      <div className="relative w-full h-screen flex items-center justify-center text-center text-white mt-16">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/contactvd.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-semibold italic">
          Join Hundreds Of Satisfied Customers.
        </h1>
        <p className="mt-4 text-lg max-w-2xl">
          HI- TECH Shop Fitters Limited has been providing customers great solutions and fantastic service for many years now. Contact us and see how we can help your business.
        </p>
        <Link href="/contact">
          <button className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-lg transition duration-300">
            CONTACT US
          </button>
        </Link>
      </div>
    </div>

      <h2 className="text-2xl sm:text-4xl md:text-4xl mt-14 font-bold mb-8 text-blue-800">
        What our customers say
      </h2>

       {/* Desktop Swiper: Shows 3 Cards */}
       <div className="hidden md:flex justify-center space-x-10 w-full max-w-flex overflow-hidden">
        {testimonials.slice(startIndex, startIndex + visibleItems).map((testimonial, index) => (
          <div key={index} className="bg-gray-200 text-black rounded-lg shadow-lg p-6 w-1/3 text-center transition duration-300 hover:bg-teal-700 hover:text-white">
            <p className="mb-6 mt-10 text-lg sm:text-xl md:text-xl">{testimonial.text}</p>
            <strong className="font-bold mb-16 text-xl sm:text-2xl md:text-2xl">{testimonial.name}</strong>
          </div>
        ))}
      </div>

      {/* Mobile Swiper: Shows 1 Card */}
      <div className="md:hidden relative w-full max-w-md">
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 text-center transition duration-300 hover:bg-teal-700 hover:text-white">
          <p className="mb-4">{testimonials[startIndex].text}</p>
          <strong className="font-bold">{testimonials[startIndex].name}</strong>
        </div>
      </div>

      {/* Navigation Buttons */}
      {/* <div className="flex space-x-4 mt-6">
        <button onClick={handlePrev} className="bg-gray-700 text-white px-4 py-2 rounded-full shadow-md">◀</button>
        <button onClick={handleNext} className="bg-gray-700 text-white px-4 py-2 rounded-full shadow-md">▶</button>
      </div> */}

      {/* Swiper Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: testimonials.length }).map((_, index) => (
          <span key={index} className={`h-3 w-3 rounded-full ${index === startIndex ? "bg-teal-700" : "bg-gray-400"}`} onClick={() => setStartIndex(index)}></span>
        ))}
      </div>
     
</motion.div>
  </div>
  );
};
 
export default Home;

