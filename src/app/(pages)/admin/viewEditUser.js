"use client";
import React, { useState} from "react";
import API from "@/action/axios";
import CustomAlert from "@/utils/customAlert";
import { AiOutlineClose } from "react-icons/ai";
import { useAlert } from "@/components/AlertContext";

export default function ViewEditUserPage({ onSubmit, onClose, details }) {
  const { alertContent, showAlertContent } = useAlert();
  const [userData, setUserData] = useState(details);
  
  const [errors, setErrors] = useState({});

  const handleInputChange = (e, key) => {
    const { value } = e.target;
    setUserData((prev) => ({ ...prev, [key]: value }));

    setErrors((prevErrors) => {
      const { [key]: _, ...remainingErrors } = prevErrors;
      return remainingErrors;
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (value) {
        delete updatedErrors[name];
      }
      return updatedErrors;
    });
  }; 

  const validateForm = () => {
    let newErrors = {};
    if (!userData.name) newErrors.name = "Head Name is required.";
    if (!userData.contact) newErrors.contact = "Contact Number is required.";  
    if (userData.contact && userData.contact.length !== 10) newErrors.contact = "Kindly enter a 10-digit number";
    if (!userData.email) newErrors.email = "Email is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    const formattedData = {
      family_id: userData.id,
      name: userData.name,
      contact: userData.contact,
      email: userData.email,
      role: userData.role,
    };

    try {
      const response = await API.put(`/admin/update_admin/${userData.id}`, formattedData);
      if (response.status === 200) {
        alertContent("Updated successfully!", "success");
        onSubmit();
      } else {
        alertContent("Error updating the user.", "error");
      }
    } catch (error) {
      console.error("Error updating the user:", error);
      alertContent(error.response.data.detail, "error");
    }
  };

  return (
    <div className="relative rounded-lg">
      {showAlertContent && (<CustomAlert message={showAlertContent.message} type={showAlertContent.type} />)}
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
      <h1 className="text-2xl font-semibold py-4 text-center text-secondary sticky top-0 bg-primary z-10">View/Edit User</h1>

      {/* User Details Card */}
      <div className="bg-secondary m-10 border shadow-md rounded-lg p-6 mb-8">          
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
          <InputField
            label="User ID"
            value={userData.id || ""}
            readOnly={true}
            required={true}
          />
          <InputField
            label="Head Name"
            placeholder="Enter Name"
            value={userData.name || ""}
            onChange={(e) => handleInputChange(e, "name")}
            error={errors.name}
            required={true}
          />
          <InputField
            label="Contact Number"
            placeholder="Enter contact Number"
            value={userData.contact || ""}
            onChange={(e) => handleInputChange(e, "contact")}
            error={errors.contact}
            required={true}
            pattern="^[0-9]{10}$"
            maxLength="10"
            numericOnly={true}
          />
          <InputField
            label="Email"
            type="email"
            value={userData.email || ""}
            onChange={(e) => handleInputChange(e, "email")}
            error={errors.email}
            required={true}
          />
          <SelectField
            label="Role"
            options={["Admin", "Accountant", "Father"]}
            value={userData.role || ""}
            name="role"
            onChange={handleSelectChange}
            error={errors.role}
            required
          />
        </div>
      </div>      

      {/* Action Buttons */}
      <div className="flex justify-between py-5 px-10 sticky bottom-0 bg-secondary">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-red-600 text-secondary rounded-md hover:bg-red-800">
          Cancel
        </button>
        <button onClick={handleUpdate} type="submit" className="px-4 py-2 bg-primary text-secondary rounded-md hover:bg-gray-900">
          Update
        </button>
      </div>
    </div>
  );
}

function InputField({ label, placeholder, type, value, onChange,disabled = false, readOnly = false,  error, pattern, maxLength, required, numericOnly = false }) {
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
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength} 
        pattern={pattern}
        onKeyPress={numericOnly ? handleKeyPress : undefined}
        className={`w-full border border-gray-700 rounded-lg px-4 py-2 focus:border-gray-900 ${readOnly ? 'bg-gray-100' : ''} ${error ? "border-red-500" : "border-gray-700"}`}
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
        value={value}
        name={name}
        onChange={onChange}
        className={`w-full border rounded-lg px-4 py-2 focus:outline-none 
          ${error ? "border-red-500" : "border-gray-700"} 
          ${value === "" ? "text-gray-400" : "text-black"}`}
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
