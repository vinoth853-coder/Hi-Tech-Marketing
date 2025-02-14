"use client";

import useAuthStore from '@/store/authStore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  const { role } = useAuthStore();
  
  return (
    <footer className="bg-barcolor py-6 px-4 sm:px-6 md:px-12 lg:px-24">
      {/* Main Content Section */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pb-6">
        
        {/* Quick Links Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg text-secondary md:text-xl font-bold">Quick Links</h2>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="text-base text-secondary hover:text-blue-500 transition duration-300">Home</Link>
            <Link href="/doors" className="text-base text-secondary hover:text-blue-500 transition duration-300">Doors</Link>
            <Link href="/reliabledelivery" className="text-base text-secondary hover:text-blue-500 transition duration-300">Reliable Delivery</Link>
            <Link href="/shopfronts" className="text-base text-secondary hover:text-blue-500 transition duration-300">Shop Fronts</Link>
            <Link href="/portfolio" className="text-base text-secondary hover:text-blue-500 transition duration-300">Portfolio</Link>
            <Link href="/contact" className="text-base text-secondary hover:text-blue-500 transition duration-300">Contact Us</Link>
          </nav>
        </div>

        {/* Get In Touch Section */}
        <div className="flex flex-col gap-3 border-t border-gray-700 pt-4 sm:pt-0 sm:border-0">
          <h2 className="text-lg text-secondary md:text-xl font-bold">Get In Touch</h2>
          <p className="text-sm text-secondary md:text-base">
            <strong>Address:</strong><br />
            HI-Tech, Thailapuram, Nazareth,<br />
            Tamil Nadu - 628617
          </p>
          <a href="mailto:hitech@gmail.com" className="text-sm md:text-base text-blue-500 hover:text-blue-300">hitech@gmail.com</a>
          <a href="tel:+917598981500" className="text-sm md:text-base text-blue-500 hover:text-blue-300">+91 7598981500</a>
        </div>

        {/* Developer Info Section */}
        <div className="flex flex-col items-start gap-3 border-t border-gray-700 pt-4 sm:pt-0 sm:border-0">
          {/* <Image src="/ideatech.ico" alt="IDEA TECH Logo" width={100} height={80} className="rounded-md" /> */}
          <h2 className="text-lg text-secondary md:text-xl font-bold">Developer Info</h2>
          <p className="text-sm text-secondary">Developed by <strong>IDEA TECH</strong></p>
          <p className="text-sm text-secondary">For <strong>Hi-TECH</strong></p>
          <p className="text-sm text-secondary">
            Contact Developer:&nbsp;
            <a href="mailto:Ideatechenquiry@gmail.com" className="text-blue-500 hover:text-blue-300">ideatechenquiry@gmail.com</a>
          </p>
          <a href="tel:+447553433151" className="text-sm md:text-base text-blue-500 hover:text-blue-300">+44 7553433151</a>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="container mx-auto text-center border-t border-gray-700 py-4 text-sm text-blue-400">
        <p className="text-secondary">
          &copy; {new Date().getFullYear()} Hi-TECH, UK | Crafted with ❤️ by&nbsp;
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-500 font-semibold hover:text-blue-300">
            IDEA TECH
          </a> ✨
        </p>
      </div>
    </footer>
  );
};

export default Footer;
