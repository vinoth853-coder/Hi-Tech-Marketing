import React from "react";

export default function CurtainWalling() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative">
        <img
          src="/curtainwalling.png"
          alt="Curtain Walling"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">CURTAIN WALLING</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-10 px-5 grid grid-cols-1 md:grid-cols-2 gap-14">
        {/* Left - Info Section */}
        <div>
          <h2 className="text-3xl font-bold text-red-600">Curtain Walling</h2>
          <p className="mt-4 text-lg text-black">
            <span className="text-blue-600 font-semibold">HI- TECH Shopfront</span>{" "}
            specializes in high-quality curtain walling systems that enhance the
            architectural aesthetics and functionality of buildings.
          </p>
          <div className="mt-4 p-4 bg-gray-200 rounded-lg">
            <p className="text-lg font-bold text-blue-600">What is Curtain Walling?</p>
            <p className="text-lg text-black">
              Curtain walling is a non-structural outer covering of a building
              that provides thermal insulation, weather resistance, and a
              sleek, modern appearance.
            </p>
          </div>
        </div>

        {/* Right - Contact Form */}
        <div className="bg-gray-200 p-6 rounded-lg text-white">
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
