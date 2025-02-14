import React from "react";

export default function AutomaticDoors() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative">
        <img
          src="/automaticdoors.png"
          alt="Automatic Doors"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">AUTOMATIC DOORS</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-10 px-5 grid grid-cols-1 md:grid-cols-2 gap-14">
        {/* Left - Info Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Automatic Doors</h2>
          <p className="mt-4 text-lg text-black">
            <span className="text-green-600 font-semibold">HI-TECH Shopfront</span>{" "}
            provides high-quality **automatic doors** that are designed for 
            seamless entry, security, and energy efficiency in commercial and residential buildings.
          </p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-lg font-bold text-blue-600">Why Choose Automatic Doors?</p>
            <ul className="text-lg text-black list-disc pl-5">
              <li>Convenient and hands-free operation</li>
              <li>Enhanced security and access control</li>
              <li>Energy-efficient and weather-sealed</li>
              <li>Available in sliding, swing, and revolving options</li>
            </ul>
          </div>
        </div>

        {/* Right - Contact Form */}
        <div className="bg-gray-200 p-6 rounded-xl shadow-xl opacity-60">
          <h3 className="text-2xl font-semibold mb-4 text-center text-green-600">
            Get a Free Quote
          </h3>
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
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <textarea
              placeholder="Your Message"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 h-32"
            ></textarea>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-green-600 text-white font-medium text-lg shadow-md hover:bg-green-500 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
