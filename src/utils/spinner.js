import React from 'react';

const Spinner = ({ size = '5', color = 'red-500' }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`w-${size} h-${size} border-4 border-${color} border-solid rounded-full border-t-transparent animate-spin`}
      ></div>
    </div>
  );
};

export default Spinner;