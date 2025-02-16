import React from "react";
import Link from 'next/link';
import Image from 'next/image';

const Installation = () => {
  return (
    <section className="">
      {/* Header Section */}
      <div className="relative w-full h-72 bg-cover bg-center" 
        style={{ backgroundImage: "url('/installman.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-5xl font-bold tracking-wide">INSTALLATION</h1>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-3xl text-blue-800 font-medium">
          Quality Installed <span className="font-bold">Satisfaction Guaranteed</span>
        </h2>
        <p className="text-black max-w-2xl mx-auto mt-4">
          HI- TECH fitters provide installation services for all your aluminium products, including doors and windows. Our skilled fitters ensure that the installation process is carried out with precision and expertise, resulting in a professional and secure finish.
        </p>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-6 pb-12 flex flex-col lg:flex-row items-center">
        <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="font-semibold text-xl text-blue-800">Quality installation</h3>
            <p className="text-black">Skilled fitters ensure correct installation, reducing future issues.</p>
          </div>
          <div>
            <h3 className="font-semibold text-blue-800 text-xl">Enhanced performance</h3>
            <p className="text-black">Properly installed doors and windows provide better efficiency and security.</p>
          </div>
          <div>
            <h3 className="font-semibold text-blue-800 text-xl">Longevity</h3>
            <p className="text-black">Professional installation extends the product&apos;s lifespan.</p>
          </div>
          <div>
            <h3 className="font-semibold text-blue-800 text-xl">Safety</h3>
            <p className="text-black">Proper installation ensures safe and reliable function.</p>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
          <Image src="/installsm.jpg" alt="Worker" className="w-80 h-80 rounded-full object-cover shadow-lg" />
        </div>
      </div>
      
      {/* Contact */}
      <div className="container mx-auto mb-16 mt-2 bg-gray-200 rounded-lg p-4 md:p-6 max-w-3xl w-full text-center md:text-left">
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
    </section>
  );
};

export default Installation;
