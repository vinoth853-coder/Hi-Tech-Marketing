import React from "react";
import Link from "next/link";

const PowderCoating = () => {
  return (
    <section className="">
      {/* Header Section */}
      <div
        className="relative w-full h-64 bg-cover bg-center"
        style={{ backgroundImage: "url('/powdercoating.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold text-center">
          Powder Coating
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-3xl text-blue-800 font-medium">
          Let Kooner Shop Fitters provide your business with the best solution.
        </h2>
        <div className="flex flex-col lg:flex-row items-center mt-6">
          <div className="lg:w-1/2 text-left">
            <p className="text-black max-w-xl">
              Kooner Shopfronts have extensive experience in providing an in-house high-quality powder coating facility. 
              This enables us to offer our clients a fully bespoke and individualized product at very competitive prices. 
              We use the best methods and tools in performing all of our powder coating.
            </p>
            <p className="text-black max-w-xl mt-4">
              We can powder coat much more than just shutters, Kooner Shopfronts provide powder coating on a range of products 
              not specific to the shutter industry. Call us to discuss further our services of powder coating.
            </p>
          </div>
          <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
            <img src="/subwaypowder.jpg" alt="Powder Coating Example" className="w-96 h-64 object-cover rounded-lg shadow-md" />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto mb-16 mt-6 bg-gray-200 rounded-lg p-6 max-w-3xl text-center md:text-left">
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

export default PowderCoating;
