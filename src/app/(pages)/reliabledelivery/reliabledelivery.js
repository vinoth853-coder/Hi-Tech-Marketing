import React from "react";
import Link from "next/link";
import Image from 'next/image';

const ReliableDelivery = () => {
  return (
    <div className="w-full">
         {/* Hero Section */}
      <div className="relative">
        <Image
          src="/delevery.png"
          alt="Reliable Delivery Service"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold text-center">Reliable Delivery Service
          </h1>
        </div>
      </div>
      <div className="bg-white py-16 px-6 text-center">
      <h2 className="text-2xl font-semibold text-blue-800">
        Elevate Your View - Expert Delivery of Aluminium and Glass Windows
      </h2>
      <p className="text-black mt-2">
        We provide a dependable delivery service, ensuring that customers receive their orders on time and in excellent condition.
      </p>

      <div className="flex justify-center my-8">
        <Image
          src="/truck.jpg" 
          alt="Delivery Truck"
          className="w-fill"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-10 text-left max-w-6xl mx-auto">
        <div>
          <h3 className="text-2xl font-bold text-blue-800">Safe Packaging</h3>
          <p className="text-black mt-2">
            Our products are carefully packaged to prevent any breakage or damage during transportation.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-blue-800">Trained Delivery Personnel</h3>
          <p className="text-black mt-2">
            Our delivery personnel are trained to handle aluminium and glass products safely, reducing the risk of mishandling during delivery.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-blue-800">Nationwide Coverage</h3>
          <p className="text-black mt-2">
            Our delivery service extends nationwide, providing convenience for customers across the UK and making your products accessible to a broader audience.
          </p>
        </div>
      </div>
      {/* Contact Section */}
      <div className="container mx-auto mb-16 mt-10 bg-gray-200 rounded-lg p-6 max-w-3xl text-center md:text-left">
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
    </div>
  );
};

export default ReliableDelivery;
