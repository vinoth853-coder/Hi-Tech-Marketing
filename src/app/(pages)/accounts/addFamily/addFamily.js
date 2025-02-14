"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import API from "@/action/axios";
import CustomAlert from "@/utils/customAlert";
import { MdOutlinePersonRemoveAlt1 } from "react-icons/md";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAlert } from "@/components/AlertContext";
import { IoMdArrowBack } from "react-icons/io";

export default function AddFamilyPage() {
  const { alertContent, showAlertContent } = useAlert();
  const currentYear = new Date().getFullYear();
  const [familyDetails, setFamilyDetails] = useState({
    head_name: "",
    contact: "",
    family_id: "",
    members: "",
    marriage_date: "",
    email: "",
    tax_year: ""
  });
  const [members, setMembers] = useState([
    {
      name: "",
      dob: "",
      age: "",
      aadhaar_number: "",
      gender: "",
      role: "Head",
      marital_status: "",
      deceased: false,
      deceased_year: ''
    },
  ]);

  const [selectedOption, setSelectedOption] = useState(""); 
  const [errors, setErrors] = useState({}); 
  const [selectedRelationship, setSelectedRelationship] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const router = useRouter();

  const fieldLabels = {
    family_id: "Family ID",
    head_name: "Family Head Name",
    contact: "Contact Number",
    members: "Total Members",
    marriage_date: "Marriage Date",
    email: "Email",
    tax_year: "Tax Year",
    name: "Name",
    dob: "Date of Birth",
    age: "Age",
    aadhaar_number: "Aadhaar Number",
    gender: "Gender",
    role: "Relationship",
    marital_status: "Marital Status",
    deceased_year: "Deceased Date"
  };

  useEffect(() => {
    setMembers((prevMembers) => {
      const updatedMembers = [...prevMembers];
      updatedMembers[0] = {
        ...updatedMembers[0],
        name: familyDetails.head_name,
      };
      return updatedMembers;
    });
  }, [familyDetails.head_name]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFamilyDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (value.trim()) {
        delete updatedErrors[name];
      }
      return updatedErrors;
    });
  };

  const handleMemberChange = (index, field, value) => {
    setMembers((prevMembers) => {
      const updatedMembers = [...prevMembers];
      updatedMembers[index] = { ...updatedMembers[index], [field]: value };
      return updatedMembers;
    });
  
    // Clear errors dynamically
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (value.trim()) {
        delete updatedErrors[`member_${index}_${field}`];
      }
      return updatedErrors;
    });
  };

  const handleMarriageDateChange = (date) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : "";
  
    setFamilyDetails((prevDetails) => ({
      ...prevDetails,
      marriage_date: formattedDate,
    }));

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (formattedDate) {
        delete updatedErrors.marriage_date;
      }
      return updatedErrors;
    });
  };

  const handleDeceasedYearChange = (value, index) => {
    setMembers((prevMembers) => {
      const updatedMembers = [...prevMembers];
      updatedMembers[index] = {
        ...updatedMembers[index],
        deceased_year: value,
      };
      return updatedMembers;
    });
  
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (value.trim() === "" || isNaN(value) || value.length !== 4) {
        updatedErrors[`member_${index}_deceased_year`] =
          "Please enter a valid year (YYYY).";
      } else {
        delete updatedErrors[`member_${index}_deceased_year`];
      }
      return updatedErrors;
    });
  };  

  const handleTaxOptionChange = (value, index) => {
    setMembers((prevMembers) => {
      const updatedMembers = [...prevMembers];
      updatedMembers[index] = {
        ...updatedMembers[index],
        tax_option: value, 
      };
      return updatedMembers;
    });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[`member_${index}_tax_option`];
      return updatedErrors;
    });
  };
  
  const handleDeceasedChange = (index) => {
    setMembers((prevMembers) => {
      const updatedMembers = [...prevMembers];
      updatedMembers[index] = {
        ...updatedMembers[index],
        deceased: !updatedMembers[index].deceased,
        deceased_year: !updatedMembers[index].deceased ? "" : updatedMembers[index].deceased_year,
        tax_option: !updatedMembers[index].deceased ? "" : updatedMembers[index].tax_option,
      };
      return updatedMembers;
    });
  
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[`member_${index}_deceased_year`];
      return updatedErrors;
    });
  };

  const handleDOBDateChange = (date, index) => {
    if (!date) return; 
  
    const formattedDate = dayjs(date).format("YYYY-MM-DD");

    const birthDate = new Date(formattedDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
  
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--; 
    }
  
    setMembers((prevMembers) => {
      const updatedMembers = [...prevMembers];
      updatedMembers[index] = {
        ...updatedMembers[index],
        dob: formattedDate, 
        age: age, 
      };
      return updatedMembers;
    });

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (formattedDate) {
        delete updatedErrors[`member_${index}_dob`];
      }
      return updatedErrors;
    });
  };

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.radio; 
      return updatedErrors;
    });
  };

  const validateFields = () => {
    let newErrors = {};
  
    for (const [key, value] of Object.entries(familyDetails)) {
      if (!value.trim()) {
        newErrors[key] = `${fieldLabels[key] || key} is required`;
      } else if (key === 'contact' && value.length !== 10) {
        newErrors[key] = `Kindly enter a 10-digit number`
      } else if (key === 'members' && isNaN(parseInt(value, 10))) {
        newErrors[key] = `Total Members must be a valid number`;
      } else if (key === 'members' && parseInt(value, 10) !== members.length) {
        newErrors[key] = `Total Members count must match the number of added members`;
      }
    }

    if (!selectedOption) {
      newErrors.radio = "Please select a tax option.";  
    }
  
    members.forEach((member, index) => {
      for (const [key, value] of Object.entries(member)) {
        if (key === "deceased_year" && member.deceased && !value.trim()) {
          newErrors[`member_${index}_deceased_year`] = "Deceased Date is required";
        } else if (key === "deceased_year" && member.deceased_year && parseInt(member.deceased_year) > currentYear) {
          newErrors[`member_${index}_deceased_year`] = "Deceased Year cannot be in the future.";
        }
        if (member.deceased && !member.tax_option) {
          newErrors[`member_${index}_tax_option`] = "Please select from which tax the tax count should be reduced."
        }
        if (key !== "deceased_year") {
          if (!member.name) {
            newErrors[`member_${index}_name`] = `Name is required.`;
          } 
          if (!member.aadhaar_number) {
            newErrors[`member_${index}_aadhaar_number`] = `Aadhaar Number is required.`;
          }
          if (!member.dob) {
            newErrors[`member_${index}_dob`] = `Date of Birth is required.`;
          } 
          if (!member.gender) {
            newErrors[`member_${index}_gender`] = `Gender is required.`;
          } 
          if (key === `aadhaar_number` && member.aadhaar_number && value.length !== 12) {
            newErrors[`member_${index}_aadhaar_number`] = 'Kindly enter a 12-digit number.';
          }
        }
      }
    });
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };   

  const handleAddMember = () => {
    if (selectedRelationship) {
      setMembers((prevMembers) => [
        ...prevMembers,
        {
          name: "",
          dob: "",
          age: "",
          aadhaar_number: "",
          gender: "",
          role: selectedRelationship,
          marital_status: "",
          deceased: false,
          deceased_year:'',
          tax_option: ''
        },
      ]);
      setSelectedRelationship("");
      setShowWarning(false);
    } else {
      setShowWarning(true);
    }
  };

  const handleRemoveMember = (index) => {
    setMembers((prevMembers) => prevMembers.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async() => {
    if (!validateFields()) {
      return;
    }
    if (parseInt(familyDetails.members, 10) !== members.length) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        members: `Total Members count (${familyDetails.members}) does not match added members (${members.length})`,
      }));
      return;
    }
    const formattedData = {
      family_id: familyDetails.family_id,
      head_name: familyDetails.head_name,
      contact: familyDetails.contact,
      members: parseInt(familyDetails.members, 10),
      marriage_date: familyDetails.marriage_date,
      email: familyDetails.email,
      tax_year: familyDetails.tax_year,
      update_tax: selectedOption,
      family_members: members.map((member, index) => ({
        name: member.name,
        deceased: member.deceased,
        deceased_year: member.deceased ? member.deceased_year : '',
        tax_option: member.deceased ? member.tax_option : '',
        gender: member.gender,
        role: member.role,
        aadhaar_number: member.aadhaar_number,
        dob: member.dob,
        age: member.age,
        marital_status: member.marital_status,
      })),
    };
  
    try {
      const response = await API.post("user/create_user", formattedData);   
      if (response.status === 200) {
        alertContent("User created successfully!", "success")
        handleCancel(); 
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
    <div className="min-h-screen py-8 px-6">  
      {showAlertContent && (<CustomAlert message={showAlertContent.message} type={showAlertContent.type}/>)}   
      <div className="flex justify-start items-center mb-6">
        <button
          onClick={() => router.back()}
          className="absolute top-5 flex items-center gap-2 p-3 bg-primary text-secondary rounded-full hover:bg-gray-900 shadow-lg transition-all"
        >
          <IoMdArrowBack className="text-lg" />
        </button>
      </div>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center">Add Family</h1>

        <div className="bg-secondary shadow-md border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-primary mb-4">Family Details</h2>
          <div  className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-bold text-blue-500 flex justify-between items-center">
              Family Basic Details
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
            <InputField 
              label="Family ID" 
              placeholder="Enter Family ID" 
              type="text"
              name="family_id"
              value={familyDetails.family_id}
              onChange={handleInputChange}
              error={errors.family_id}
              required={true}
            />
            <InputField
              label="Family Head Name"
              placeholder="Enter Family Head Name"
              name="head_name"
              value={familyDetails.head_name}
              onChange={handleInputChange}
              error={errors.head_name}
              required={true}
            />
            <InputField
              label="Contact Number"
              placeholder="Enter contact Number"
              type="tel"
              name="contact"
              value={familyDetails.contact}
              onChange={handleInputChange}
              error={errors.contact}
              required={true}
              pattern="^[0-9]{10}$"
              maxLength="10"
              numericOnly={true}
            />
            <InputField 
              label="Total Members" 
              placeholder="Enter Total Members" 
              type="text" 
              name="members"
              value={familyDetails.members}
              onChange={handleInputChange}
              error={errors.members}
              required={true}
            />
            <InputField 
              label="Email" 
              placeholder="Enter email" 
              type="email"
              name="email" 
              value={familyDetails.email}
              onChange={handleInputChange}
              error={errors.email}
              required={true}
            />
            <div>
              <label className="block text-primary mb-1 font-semibold">
                Marriage Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={familyDetails.marriage_date ? new Date(familyDetails.marriage_date) : null}
                onChange={handleMarriageDateChange} 
                dateFormat="dd-MM-yyyy"
                className={`w-full border rounded-lg px-4 py-2 ${errors.marriage_date ? "border-red-500" : "border-gray-700"}`}
                maxDate={new Date()}
                placeholderText="Select Marriage Date"
                showYearDropdown
                showMonthDropdown
                yearDropdownItemNumber={100}
                scrollableYearDropdown
              />
              {errors.marriage_date && <p className="text-red-500 text-sm mt-1">{errors.marriage_date}</p>}
            </div>
            <SelectField
              label="Tax Year"
              options={Array.from({ length: currentYear - 2018 }, (_, i) => (2019 + i).toString()).reverse()}
              value={familyDetails.tax_year}
              onChange={(e) => {
                const value = e.target.value;
                setFamilyDetails((prev) => ({ ...prev, tax_year: value }));
                if (value.trim()) {
                  setErrors((prevErrors) => {
                    const updatedErrors = { ...prevErrors };
                    delete updatedErrors.tax_year; 
                    return updatedErrors;
                  });
                }
              }}
              error={errors.tax_year}
              required={true}
            />
            <div>
              <h2 className="block text-primary mb-3 font-semibold">Tax Option <span className="text-red-500">*</span></h2>
              <div className={`flex flex-col-1 space-x-6 ${ errors.radio ? "border-red-500" : "border-gray-300" }`}>
                {/* Option 1 */}
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="options"
                    value="Both Tax"
                    checked={selectedOption === "Both Tax"}
                    onChange={handleRadioChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-primary">From Feast Tax</span>
                </label>

                {/* Option 2 */}
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="options"
                    value="Festival Tax"
                    checked={selectedOption === "Festival Tax"}
                    onChange={handleRadioChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-primary">Only Festival Tax</span>
                </label>
              </div>
              {errors.radio && <p className="text-red-500 text-sm mt-1">{errors.radio}</p>}
            </div>
          </div>
        </div>

        <div className="bg-secondary shadow-md border rounded-lg p-6">
          <h2 className="text-xl font-bold text-primary mb-4">Family Members Details</h2>
          {members.map((member, index) => (
            <div key={index} className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-lg font-bold text-blue-500 flex justify-between items-center">
                {member.role} Details
                {index > 0 && (
                  <button
                    type="button"
                    className="text-red-500 text-2xl hover:text-red-700 font-medium"
                    onClick={() => handleRemoveMember(index)}
                  >
                    <MdOutlinePersonRemoveAlt1 />
                  </button>
                )}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                <InputField
                  label="Name"
                  placeholder={index === 0 ? "Name" : "Enter Name"}
                  value={member.name}
                  readOnly={index === 0}
                  error={index!==0 ? errors[`member_${index}_name`]:''}
                  onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                  required={true}
                />
                <InputField
                  label="Aadhaar Number"
                  placeholder="Enter Aadhaar Number"
                  onChange={(e) => handleMemberChange(index, "aadhaar_number", e.target.value)}
                  error={errors[`member_${index}_aadhaar_number`]}
                  required={true}
                  maxLength="12"
                  numericOnly={true}
                />
                <div>
                  <label className="block text-primary mb-1 font-semibold">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={members[index].dob ? new Date(members[index].dob) : null} 
                    onChange={(date) => handleDOBDateChange(date, index)} 
                    dateFormat="dd-MM-yyyy" 
                    className={`w-full border rounded-lg px-4 py-2 ${
                      errors[`member_${index}_dob`] ? "border-red-500" : "border-gray-700"
                    }`}
                    placeholderText="Select Date of Birth"
                    maxDate={new Date()}
                    showYearDropdown
                    showMonthDropdown
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                  />
                  {errors[`member_${index}_dob`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`member_${index}_dob`]}</p>
                  )}
                </div>
                <InputField 
                  label="Age" 
                  placeholder="Age" 
                  type="text" 
                  value={member.age} 
                  disabled 
                />
                {member.role === 'Son' || member.role === 'Daughter' ? (
                  <InputField
                    label="Gender"
                    value={members[index].gender = member.role === 'Son' ? 'Male' : 'Female'}
                    disabled 
                  />
                ) : (
                <SelectField
                  label="Gender"
                  options={["Male", "Female", "Other"]}
                  value={members[index].gender}
                  onChange={(e) => handleMemberChange(index, "gender", e.target.value)}
                  error={errors[`member_${index}_gender`]}
                  required={true}
                />)}
                <InputField 
                  label="Relationship" 
                  placeholder="Enter Relationship" 
                  value={member.role} 
                  disabled 
                />
                {member.role === 'Head' || member.role === 'Wife'? (
                  <InputField
                    label="Marital Status"
                    value={members[index].marital_status = 'Married'}
                    disabled
                  />
                ) : (
                  <InputField
                    label="Marital Status"
                    value={members[index].marital_status = 'Single'}
                    disabled
                  />
                )}
                {/* Deceased Checkbox */}
                <div className="flex items-center space-x-2 pt-5">
                  <input
                    type="checkbox"
                    id={`deceased-checkbox-${index}`}
                    checked={member.deceased || false}
                    onChange={() => handleDeceasedChange(index)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`deceased-checkbox-${index}`}
                    className="text-md font-medium text-primary"
                  >
                    Deceased
                  </label>
                </div>
                {/* Show Deceased Year Input If Deceased */}
                {member.deceased && (
                  <div className="mb-4">
                    <label
                      htmlFor={`deceased-year-${index}`}
                      className="block text-primary font-semibold"
                    >
                      Deceased Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`deceased-year-${index}`}
                      type="text"
                      value={member.deceased_year || ""}
                      onChange={(e) => handleDeceasedYearChange(e.target.value, index)}
                      className={`w-full border rounded-lg px-4 py-2 ${
                        errors[`member_${index}_deceased_year`]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter Year of Death"
                    />
                    {errors[`member_${index}_deceased_year`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`member_${index}_deceased_year`]}
                      </p>
                    )}
                  </div>
                )}
                {member.deceased && (
                  <div>
                    <h2 className="block text-primary mb-3 font-semibold">Tax Option <span className="text-red-500">*</span></h2>
                    <div className="flex flex-col-1 space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`tax-option-${index}`}
                          value="Both Tax"
                          checked={member.tax_option === "Both Tax"}
                          onChange={() => handleTaxOptionChange("Both Tax", index)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-primary">From Feast Tax</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`tax-option-${index}`}
                          value="Festival Tax"
                          checked={member.tax_option === "Festival Tax"}
                          onChange={() => handleTaxOptionChange("Festival Tax", index)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-primary">Only Festival Tax</span>
                      </label>
                    </div>
                    {errors[`member_${index}_tax_option`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`member_${index}_tax_option`]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="py-6 flex items-center space-x-4 mt-2">
          <select
            value={selectedRelationship}
            onChange={(e) => {
              setSelectedRelationship(e.target.value);
              setShowWarning(false);
            }}
            className="w-1/4 border border-gray-700 rounded-lg px-4 py-2 focus:border-gray-700 focus:outline-none text-black"
          >
            <option value="" disabled>Select Relationship</option>
            <option value="Wife">Wife</option>
            <option value="Son">Son</option>
            <option value="Daughter">Daughter</option>
          </select>
          <button
            type="button"
            className="bg-primary text-secondary px-4 py-2 rounded-lg hover:bg-gray-900 transition"
            onClick={handleAddMember}
          >
            + Add Member
          </button>
          {showWarning && (
            <p className="text-red-500 text-sm mt-1">Please select a relationship before adding a member.</p>
          )}
        </div>

        <div className="flex justify-between mt-6 pb-10">
          <button type="button" onClick={handleCancel} className="px-4 py-2 bg-red-600 text-secondary rounded-md hover:bg-red-800">
            Cancel
          </button>
          <button onClick={handleSubmit} type="submit" className="px-4 py-2 bg-primary text-secondary rounded-md hover:bg-gray-900">
            Submit
          </button>
        </div>
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

function SelectField({ label, options, value, onChange, error, required }) {
  return (
    <div>
      <label className="block text-primary mb-1 font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full border rounded-lg px-4 py-2 focus:outline-none ${
          error ? "border-red-500" : "border-gray-700"
        } ${value === "" ? "text-gray-400" : "text-black"}`}
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
