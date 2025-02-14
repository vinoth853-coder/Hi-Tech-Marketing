import React, { useState, useEffect } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineClose } from "react-icons/ai";

const CustomAlert = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(true);
  const detail = message?.replace(/^\d+:\s*/, "");
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const alertClasses =
    type === "error"
      ? "bg-red-500"
      : "bg-green-500";

  const icon =
    type === "error" ? (
      <AiOutlineCloseCircle className="w-6 h-6 sm:w-8 sm:h-8 mr-2 text-white" />
    ) : (
      <AiOutlineCheckCircle className="w-6 h-6 sm:w-8 sm:h-8 mr-2 text-white" />
    );

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center justify-between max-w-sm w-full sm:w-auto ${alertClasses} text-white p-2 sm:p-4 rounded-lg shadow-lg z-50 border-l-4 animate-slide-in`}
      style={{
        position: "fixed",
        top: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        maxWidth: "90%", // Max width set to 90% for better responsiveness
        width: "auto", // Width will be auto to fit the message
      }}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex justify-between items-center">
        {icon}
        <span className="text-sm sm:text-xs">{detail}</span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-4 bg-transparent text-white hover:text-gray-200 text-lg font-bold rounded-full focus:outline-none"
        aria-label="Close alert"
      >
        <AiOutlineClose className="px-1 text-lg lg:text-lg" />
      </button>
    </div>
  );
};

export default CustomAlert;
