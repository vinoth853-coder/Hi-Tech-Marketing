"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";

const PortfolioPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Valid email required.";
    if (!formData.message.trim()) errors.message = "Message cannot be empty.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      alert("Thank you! Your inquiry has been sent.");
      setIsSubmitting(false);
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative h-64 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/banner.png')" }}>
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-center">HI-TECH SHOP FITTERS</h1>
          <p className="text-lg md:text-xl mt-3 text-gray-300">Precision, Innovation, Excellence</p>
          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-3xl hover:text-blue-500 transition" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-3xl hover:text-blue-500 transition" />
            </a>
            <a href="mailto:info@hitechshopfitters.com">
              <FaEnvelope className="text-3xl hover:text-blue-500 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* About Us */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-semibold text-blue-800">About Us</h2>
        <p className="mt-4 text-black  text-lg">
          HI-TECH Shop Fitters specializes in **custom retail interiors, innovative shopfitting solutions, and high-quality manufacturing of commercial spaces**.
          With over **20 years of experience**, we transform businesses with **modern and functional designs**.
        </p>
      </section>

      {/* Services */}
      <section className="container mx-auto px-6 py-10 text-center">
        <h2 className="text-4xl font-semibold text-blue-800">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-10 mt-6">
          <motion.div className="bg-gray-200 p-6 rounded-lg "
            whileHover={{ scale: 1.05 }}>
            <h3 className="text-2xl font-bold text-blue-800 mb-4 mt-4">Powder Coating</h3>
            <p className="text-black">Welcome to Kooner Fitters, where excellence meets craftsmanship in every installation we undertake. As specialists in aluminium products, including doors and windows, our skilled fitters ensure a seamless process that culminates in a professional, stylish, and secure finish. With our Fensa certification, we guarantee accurate installations that minimize the likelihood of future issues. Beyond enhanced energy efficiency and security, our properly installed doors and windows optimize functionality, elevating the comfort and aesthetics of your space. Entrust us with your installation needs, and you'll witness the longevity of your investment flourish. Our meticulous approach ensures extended product lifespan, providing lasting value and satisfaction.</p>
          </motion.div>

          <motion.div className="bg-gray-200 p-6 rounded-lg "
            whileHover={{ scale: 1.05 }}>
            <h3 className="text-2xl font-bold text-blue-800 mb-4 mt-4">Installation</h3>
            <p className="text-black">Welcome to Kooner Fitters, your trusted partner for expert installation services, catering to all your aluminium products, including doors and windows. With our team of skilled fitters, rest assured that your installation process will be carried out with precision, resulting in a professional, stylish, and secure finish. As Fensa certified fitters, we take pride in ensuring correct installations, minimizing the chances of future issues. Properly installed doors and windows not only enhance energy efficiency and security but also elevate functionality. By entrusting us with your installation needs, you'll enjoy extended product lifespan, making the most of your investment. Experience the peace of mind that comes with our top-notch installation service, ensuring your doors and windows function safely and reliably, all while adding a touch of elegance to your space.</p>
          </motion.div>

          <motion.div className="bg-gray-200 p-6 rounded-lg "
            whileHover={{ scale: 1.05 }}>
            <h3 className="text-2xl font-bold text-blue-800 mb-4 mt-4">Reliable Delivery Service</h3>
            <p className="text-black">Experience peace of mind with our reliable delivery service, ensuring prompt and pristine delivery of your orders. From carefully packaged products to expertly trained personnel, we guarantee the safe transportation of delicate aluminium and glass items. Our seamless nationwide delivery reaches every corner of the UK, making your high-quality products easily accessible to a wider audience.</p>
          </motion.div>
          
          <motion.div className="bg-gray-200 p-6 rounded-lg "
            whileHover={{ scale: 1.05 }}>
            <h3 className="text-2xl font-bold text-blue-800 mb-4 mt-4">Other Services</h3>
            <p className="text-black">Free Estimation & Quotation <br/>
                                      Supplying Hardware Components  <br />
                                      Fitting Services  <br /> </p>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section className="container mx-auto px-6 py-10">
        <h2 className="text-4xl font-semibold text-blue-800 text-center">Our Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-6">
          {[1, 2, 3, 4, 5, 6].map((project, index) => (
            <motion.div key={index} className="relative group bg-gray-200 p-6 rounded-lg shadow-lg cursor-pointer"
              whileHover={{ scale: 1.05 }}>
              <img src={`/img${project}.jpg`} alt={`Project ${project}`} className="w-full h-48 object-cover rounded-md" />
              <h3 className="mt-4 text-lg font-bold text-blue-800">Project {project}</h3>
              <p className="text-black text-sm">Custom Interior & Shop Fitting</p>
              
            </motion.div>
          ))}
        </div>
      </section>

      <div className="container mx-auto  py-10 flex flex-col md:flex-row items-center  md:items-center gap-14">
    {/* Left Side - About Us Content */}
    <div className="md:w-2/3 text-left p-4">
      <h2 className="text-2xl sm:text-4xl md:text-4xl font-bold mb-8 text-blue-800">
      The complete package
      </h2>

      <p className="text-lg sm:text-xl text-black  leading-relaxed mb-6 text-justify">
      Shop fitters who offer a complete design, fabrication and installation package for shopfront fittings, shop entrance screens, shopfront shutters, all are custom-made to our clients requirements. Professional advice, design & planning with all shopfront fittings, with an extensive colour range and speedy nationwide installation. We guarantee the best quote for your shop. Our shop front fittings are of high standard with quality and an affordable price being our key priorities. Kooner Shop Fitters ensure all our clients receive the best possible service. Our company has extensive experience of shop front fittings and has provided shopfront fittings for many clients nationwide. We offer services from site survey to design and installation to ensure you always get the correct product for the best price.
      </p>
     
    </div>

    {/* Right Side - Submit Your Details Form */}
    <div className="md:w-1/2 w-full  p-4 pt-10 pb-10 rounded-lg ">
    <img
            src="/package.jpg" // Replace with your image URL
            alt="Building"
            className="rounded-lg shadow-lg w-full h-auto md:max-w-xs"
          />
    </div>
    </div>

      {/* Contact */}
      
      <div className="container mx-auto  mb-16 mt-2 bg-gray-200  rounded-lg p-4 md:p-6 max-w-3xl w-full text-center md:text-left">
        <h2 className="text-2xl font-semibold text-blue-800">Any query in mind?</h2>
        <p className="text-black mt-3">
          HI-TECH Shop Fitters Limited have been providing customers great solutions and a fantastic service for many years now. 
          Contact us either by telephone or send us a quick quote form. We are always here to help.
        </p>
        <div className="mt-6">
        <Link href="/contact">
          <button className="bg-teal-600 hover:bg-teal-800 text-white font-semibold py-3 px-6 rounded-full shadow-md transition">
            CONTACT US
          </button>
          </Link>
        </div>
      
    </div>
      
    </div>
  );
};

export default PortfolioPage;
