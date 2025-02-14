"use client";

import React, { useState } from "react";
import API from "@/action/axios";
import CustomAlert from "@/utils/customAlert";
import "react-datepicker/dist/react-datepicker.css";
import { useAlert } from "@/components/AlertContext";
import { AiOutlineClose } from "react-icons/ai";

export default function AddUserPage({ onSubmit, onClose, details }) {
  const { alertContent, showAlertContent } = useAlert();
  const [userDetails, setUserDetails] = useState({
    name: "",
    contact: "",
    email: "",
    role: ""
  });

  const [errors, setErrors] = useState({}); 

  const fieldLabels = {
    name: "Name",
    contact: "Contact Number",
    email: "Email",
    role: "Role",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (value.trim()) {
        delete updatedErrors[name];
      }
      return updatedErrors;
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (value) {
        delete updatedErrors[name];
      }
      return updatedErrors;
    });
  };

  const validateFields = () => {
    let newErrors = {};
  
    for (const [key, value] of Object.entries(userDetails)) {
      if (!value.trim()) {
        newErrors[key] = `${fieldLabels[key] || key} is required.`;
      } else if (key === 'contact' && value.length !== 10) {
        newErrors[key] = `Kindly enter a 10-digit number`
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };   

  const handleSubmit = async() => {
    if (!validateFields()) {
      return;
    }
    const formattedData = {
      name: userDetails.name,
      contact: userDetails.contact,
      email: userDetails.email,
      role: userDetails.role,
    };
  
    try {
      const response = await API.post("admin/create_admin", formattedData);   
      if (response.status === 200) {
        alertContent("User created successfully!", "success")
        onSubmit(); 
      } 
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          alertContent(error.response.data.detail, "error"); 
        } else if (status === 401) {
          alertContent("Unauthorized: You are not authorized to perform this action.", "error");
        } else if (status === 500) {
          alertContent("Server Error: There was an issue with the server. Please try again later.", "error");
        } else {
          alertContent(`Unexpected Error occurred!`, "error");
        } 
      }
    }
  };

  return (
    <div className="relative rounded-lg">  
      {showAlertContent && (<CustomAlert message={showAlertContent.message} type={showAlertContent.type}/>)}   
      <div className="flex justify-end">
        <button 
          onClick={onClose} 
          className="fixed text-secondary hover:text-secondary p-5 rounded-full z-20"
          aria-label="Close"
        >
          <AiOutlineClose className='w-6 h-6'/>
        </button>
      </div>
      {/* Page Heading */}
      <h1 className="text-2xl font-semibold py-4 text-center text-secondary sticky top-0 bg-primary z-10">Add User</h1>
        <div className="bg-secondary m-10 border shadow-md rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
            <InputField
              label="Name"
              placeholder="Enter Name"
              name="name"
              value={userDetails.name}
              onChange={handleInputChange}
              error={errors.name}
              required={true}
            />
            <InputField
              label="Contact Number"
              placeholder="Enter contact Number"
              type="tel"
              name="contact"
              value={userDetails.contact}
              onChange={handleInputChange}
              error={errors.contact}
              required={true}
              pattern="^[0-9]{10}$"
              maxLength="10"
              numericOnly={true}
            />
            <InputField 
              label="Email" 
              placeholder="Enter email" 
              type="email"
              name="email" 
              value={userDetails.email}
              onChange={handleInputChange}
              error={errors.email}
              required={true}
            />
            <SelectField
              label="Role"
              options={["Admin", "Accountant", "Father"]}
              name="role"
              value={userDetails.role}
              onChange={handleSelectChange}
              error={errors.role}
              required
            />
          </div>
        </div>

        <div className="flex justify-between py-5 px-10 sticky bottom-0 bg-secondary">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-red-600 text-secondary rounded-md hover:bg-red-800">
            Cancel
          </button>
          <button onClick={handleSubmit} type="submit" className="px-4 py-2 bg-primary text-secondary rounded-md hover:bg-gray-900">
            Submit
          </button>
        </div>
    </div>
  );
}

function InputField({ label, placeholder, type = "text", value, disabled = false, onChange, name, readOnly = false, error, required, pattern, maxLength, numericOnly = false }) {
  const handleKeyPress = (e) => {
    if (numericOnly && !/^\d$/.test(e.key)) {
      e.preventDefault(); // Prevent non-numeric input
    }
  };
  return (
    <div>
      <label className="block text-primary mb-1 font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>      
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength} 
        pattern={pattern}
        onKeyPress={numericOnly ? handleKeyPress : undefined}
        className={`w-full border rounded-lg px-4 py-2 focus:outline-none text-black ${
          error ? "border-red-500" : "border-gray-700"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

function SelectField({ label, options, value, onChange, error, required, name }) {
  return (
    <div>
      <label className="block text-primary mb-1 font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border rounded-lg px-4 py-2 focus:outline-none ${
          error ? "border-red-500" : "border-gray-700"
        } ${!value ? "text-gray-400" : "text-black"}`}
      >
        <option value="" disabled className="text-gray-400">
          Select {label}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option} className="text-black">
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
