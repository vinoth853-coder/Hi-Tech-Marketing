"use client";

import React from "react";
import Image from 'next/image';

export default function UpvcWindow() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative">
        <Image
          src="/upvcwindow.jpeg"
          alt="UPVC Window"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">UPVC WINDOW</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-10 px-5 grid grid-cols-1 md:grid-cols-2 gap-14">
        {/* Left - Info Section */}
        <div>
          <h2 className="text-3xl font-bold text-black">UPVC Windows</h2>
          <p className="mt-4 text-lg text-black">
            <span className="text-blue-600 font-semibold">United Shopfront</span>{" "}
            has been providing clients with exceptional UPVC windows. Our staff
            have over 30 years of combined experience in producing and
            installing premium quality UPVC double-glazed windows.
          </p>
          <div className="mt-4 p-4 bg-gray-200 rounded-lg">
            <p className="text-lg font-bold text-blue-600">What is UPVC?</p>
            <p className="text-lg text-black">
              UPVC stands for unplasticized polyvinyl chloride, a durable and
              weather-resistant material widely used in construction. It is
              resistant to UV rays and environmental factors, making it an
              excellent choice for windows.
            </p>
          </div>
        </div>

        {/* Right Side - Submit Your Details Form */}
    <div className="bg-gray-200 p-10 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-center text-green-500">Submit Your Details</h3>
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
  placeholder="Message"
  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 h-32"
></textarea>
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-green-500 text-white font-medium text-lg shadow-md hover:bg-green-400 transition duration-300"
        >
          Submit
        </button>
      </form>
        </div>
      </div>
    </div>
  );
}