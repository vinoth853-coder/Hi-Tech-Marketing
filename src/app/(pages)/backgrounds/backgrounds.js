"use client";

import React from "react";

export default function Backgrounds() {
  return (
    <div className="absolute inset-0 -z-10 bg-white overflow-hidden flex items-center justify-center">
      {/* Stylish White Background with Elegant Details */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 opacity-90"></div>
      
      {/* Floating Decorative Elements with Soft Glow */}
      <div className="absolute top-10 left-16 w-32 h-32 bg-yellow-300 opacity-15 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-20 w-36 h-36 bg-blue-300 opacity-15 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-pink-300 opacity-15 blur-3xl rounded-full animate-pulse"></div>

      {/* Abstract Soft Grid with Minimalist Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" stroke="rgba(200, 200, 200, 0.2)" strokeWidth="1">
          <path d="M0,120 L1440,120" />
          <path d="M0,280 L1440,280" />
          <path d="M0,440 L1440,440" />
          <path d="M0,600 L1440,600" />
          <path d="M0,760 L1440,760" />
          <path d="M200,0 L200,900" />
          <path d="M500,0 L500,900" />
          <path d="M800,0 L800,900" />
          <path d="M1100,0 L1100,900" />
        </g>
      </svg>
    </div>
  );
}
