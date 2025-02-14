import React from "react";

export default function SecurityFireDoors() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative">
        <img
          src="/securityfiredoors.jpg"
          alt="Security & Fire Exit Doors"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold text-center">
            SECURITY & FIRE EXIT DOORS
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-10 px-5 grid grid-cols-1 md:grid-cols-2 gap-14">
        {/* Left - Information Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Security & Fire Exit Doors</h2>
          <p className="mt-4 text-lg text-black">
            <span className="text-red-600 font-semibold">HI-TECH Shopfront</span>{" "}
            specializes in high-quality **security & fire exit doors** designed for maximum 
            protection, durability, and safety compliance.
          </p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-lg font-bold text-red-600">Why Choose Our Doors?</p>
            <ul className="text-lg text-black list-disc pl-5">
              <li>Fire-resistant and secure against break-ins</li>
              <li>Durable steel and aluminum construction</li>
              <li>Customizable sizes, colors, and locking mechanisms</li>
              <li>Certified safety standards for commercial and industrial use</li>
            </ul>
          </div>
        </div>

        {/* Right - Contact Form */}
        <div className="bg-gray-200 p-6 rounded-lg shadow-lg opacity-80">
          <h3 className="text-2xl font-semibold mb-4 text-center text-red-600">
            Get a Free Quote
          </h3>
          <form className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
            <input
              type="tel"
              placeholder="Your Contact Number"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
            <textarea
              placeholder="Your Message"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 h-32"
            ></textarea>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-red-600 text-white font-medium text-lg shadow-md hover:bg-red-500 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
