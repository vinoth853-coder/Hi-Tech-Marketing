import React from "react";
import Image from 'next/image';

export default function BiFoldingDoors() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative">
        <Image
          src="/bifoldingdoors.jpg"
          alt="Bi-Folding Doors"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">BI-FOLDING DOORS</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-10 px-5 grid grid-cols-1 md:grid-cols-2 gap-14">
        {/* Left - Info Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Bi-Folding Doors</h2>
          <p className="mt-4 text-lg text-black">
            <span className="text-blue-600 font-semibold">HI-TECH Shopfront</span>{" "}
            offers **bi-folding doors** that maximize space, provide natural light, 
            and create a seamless connection between indoor and outdoor areas.
          </p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-lg font-bold text-green-600">Why Choose Bi-Folding Doors?</p>
            <ul className="text-lg text-black list-disc pl-5">
              <li>Elegant and space-saving design</li>
              <li>Seamless indoor-outdoor transition</li>
              <li>Secure, durable, and energy-efficient</li>
              <li>Available in various colors and finishes</li>
            </ul>
          </div>
        </div>

        {/* Right - Contact Form */}
        <div className="bg-gray-200 p-6 rounded-lg shadow-xl opacity-60">
          <h3 className="text-2xl font-semibold mb-4 text-center text-blue-600">
            Get a Free Quote
          </h3>
          <form className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Your Contact Number"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Your Message"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
            ></textarea>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium text-lg shadow-md hover:bg-blue-500 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
