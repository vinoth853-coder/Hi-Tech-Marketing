"use client";
import React, { useState } from "react";
import API from "@/action/axios";
import CustomAlert from "@/utils/customAlert";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlinePersonRemoveAlt1 } from "react-icons/md";
import DatePicker from "react-datepicker";
import { useAlert } from "@/components/AlertContext";
import dayjs from "dayjs";

export default function ViewEditFamilyPage({ onSubmit, onClose, details }) {
  const { alertContent, showAlertContent } = useAlert();
  const currentYear = new Date().getFullYear();
  const [familyData, setFamilyData] = useState(details);
  const [familyMembers, setFamilyMembers] = useState(
    details.family_members?.map((member) => ({
      ...member,
      fromResponse: member.deceased || false, // Track if deceased is from the response
    })) || []
  );
  const [errors, setErrors] = useState({});
  const [selectedRelationship, setSelectedRelationship] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const handleInputChange = (e, key) => {
    const { value } = e.target;
    setFamilyData((prev) => ({ ...prev, [key]: value }));

    setErrors((prevErrors) => {
      const { [key]: _, ...remainingErrors } = prevErrors;
      return remainingErrors;
    });

    if (key === "head_name" && familyMembers.length > 0) {
      setFamilyMembers((prevMembers) => {
        const updatedMembers = [...prevMembers];
        updatedMembers[0].name = value;
        return updatedMembers;
      });
    }
  };

  const handleMemberChange = (e, index, key) => {
    const { value } = e.target;
    setFamilyMembers((prevMembers) => {
      const updatedMembers = [...prevMembers];
      updatedMembers[index] = { ...updatedMembers[index], [key]: value };
      return updatedMembers;
    });
  
    setErrors((prevErrors) => {
      const errorKey = `member_${index}_${key}`;
      const { [errorKey]: _, ...remainingErrors } = prevErrors;
      return remainingErrors;
    });
  };

  const handleAddMember = () => {
    if (selectedRelationship) {
      setFamilyMembers((prevMembers) => [
        ...prevMembers,
        { name: "", dob: "", age: "", aadhaar_number: "", gender: "", role: selectedRelationship, marital_status: "", deceased: false, deceased_year: "", tax_option: "" },
      ]);
      setSelectedRelationship("");
      setShowWarning(false);
    } else {
      setShowWarning(true);
    }
  };
  
  const [showYearPrompt, setShowYearPrompt] = useState(false);
  const [yearToRemove, setYearToRemove] = useState(""); // Store the selected year
  const [memberToRemove, setMemberToRemove] = useState([]); 
  const [selectedOption, setSelectedOption] = useState("");
  const [removedMembers, setRemovedMembers] = useState([]);  

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.radio; 
      return updatedErrors;
    });
  };

  const handleRemoveMember = (role, index) => {
    const member = familyMembers[index];
    if (role !== 'Son' && role !== 'Wife') {
      setFamilyMembers((prev) => prev.filter((_, i) => i !== index));
    }
    setMemberToRemove(member);
    setShowYearPrompt(role === 'Son' || role === 'Wife');
  };  

  const handleConfirmRemoval = () => {
    let validationErrors = {};
    if (!yearToRemove) {
      validationErrors.year = "Please enter a valid year.";
    } else if (parseInt(yearToRemove) > currentYear) {
      validationErrors.year = "Year should not be in the future.";
    } 
    if (!selectedOption) {
      validationErrors.radio = "Please select a tax option.";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } 
      setRemovedMembers((prevRemovedMembers) => [
        ...prevRemovedMembers,
        {
          role: memberToRemove.role,
          aadhaar_number: memberToRemove.aadhaar_number,
          tax_year: yearToRemove,
          update_tax: selectedOption,
        },
      ]);
  
      setFamilyMembers((prev) => prev.filter((member) => member.aadhaar_number !== memberToRemove.aadhaar_number));
      setShowYearPrompt(false);
      setMemberToRemove(null);
      setYearToRemove('');
      setSelectedOption('');
      setErrors({});
  };

  const handleMarriageDateChange = (date) => {
  
    setFamilyData((prevDetails) => ({
      ...prevDetails,
      marriage_date: date,
    }));
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
  
    setFamilyMembers((prevMembers) => {
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

  const handleDeceasedYearChange = (value, index) => {
    setFamilyMembers((prevMembers) => {
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
    setFamilyMembers((prevMembers) => {
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
    setFamilyMembers((prevMembers) => {
      const updatedMembers = [...prevMembers];
      const currentMember = updatedMembers[index];
      updatedMembers[index] = {
        ...currentMember,
        deceased: !currentMember.deceased,
        deceased_year: !currentMember.deceased ? "" : currentMember.deceased_year,
        tax_option: !currentMember.deceased ? "" : currentMember.tax_option,
        fromResponse: currentMember.fromResponse
      };
      return updatedMembers;
    });
  
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[`member_${index}_deceased_year`];
      return updatedErrors;
    });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!familyData.head_name) newErrors.head_name = "Head Name is required.";
    if (!familyData.contact) newErrors.contact = "Contact Number is required.";
    if (familyData.members === '' || familyData.members === null || familyData.members === undefined || familyData.members < 0) {
      newErrors.members = "Total no. of members is required.";
    } else if (familyMembers.filter(member => !member.deceased).length !== Number(familyData.members)) {
      newErrors.members = "Total Members count must match the number of alive members.";
    }    
    if (!familyData.email) newErrors.email = "Email is required.";
    if (!familyData.marriage_date) newErrors.marriage_date = "Marriage Date is required.";
    // if (!familyData.tax_year) newErrors.tax_year = "Tax Year is required.";
    if (familyData.contact && familyData.contact.length !== 10) newErrors.contact = "Kindly enter a 10-digit number";

    familyMembers.forEach((member, index) => {
      for (const [key, value] of Object.entries(member)){
        if (member.deceased && !member.deceased_year) {
          newErrors[`member_${index}_deceased_year`] = "Deceased Year is required.";
        } else if (member.deceased_year && parseInt(member.deceased_year) > currentYear) {
          newErrors[`member_${index}_deceased_year`] = "Deceased Year cannot be in the future.";
        } 
        if (member.deceased && !member.tax_option) {
          newErrors[`member_${index}_tax_option`] = "Please select from which tax the tax count should be reduced."
        }
        if (key !== "deceased_year") {
          if (!member.name) newErrors[`member_${index}_name`] = "Name is required.";
          if (!member.dob) newErrors[`member_${index}_dob`] = "DOB is required.";
          if (!member.aadhaar_number) newErrors[`member_${index}_aadhaar_number`] = "Aadhaar Number is required.";
          if (!member.gender) newErrors[`member_${index}_gender`] = "Gender is required.";
          if (!member.role) newErrors[`member_${index}_role`] = "Relationship is required.";
          if (!member.marital_status) newErrors[`member_${index}_marital_status`] = "Marital Status is required.";
          if (member.aadhaar_number && member.aadhaar_number.length !== 12) newErrors[`member_${index}_aadhaar_number`] = "Kindly enter a 12-digit number";
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    const formattedData = {
      family_id: familyData.id,
      head_name: familyData.head_name,
      contact: familyData.contact,
      members: parseInt(familyData.members, 10),
      marriage_date: familyData.marriage_date,
      email: familyData.email,
      family_members: familyMembers.map((member, index) => ({
        name: member.name,
        deceased: member.deceased,
        deceased_year: member.deceased ? member.deceased_year : "",
        tax_option: member.deceased ? member.tax_option : "",
        gender: member.gender,
        role: member.role,
        aadhaar_number: member.aadhaar_number,
        dob: member.dob,
        age: parseInt(member.age),
        marital_status: member.marital_status,
      })),
      remove_user: removedMembers,
    };

    try {
      const response = await API.put(`/user/update_user/${familyData.id}`, formattedData);
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
          disabled={showYearPrompt}
        >
          <AiOutlineClose className='w-6 h-6'/>
        </button>
      </div>
      {/* Page Heading */}
      <h1 className="text-2xl font-semibold py-4 text-center text-secondary sticky top-0 bg-primary z-10">View/Edit Family</h1>

      {/* Family Details Card */}
        <div className="bg-secondary mx-10 border shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">Family Details</h2>
          <div  className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-lg font-bold text-blue-500 flex justify-between items-center">
            Family Basic Details
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
          <InputField
            label="Family ID"
            value={familyData.id || ""}
            readOnly={true}
            required={true}
          />
          <InputField
            label="Head Name"
            placeholder="Enter Family Head Name"
            value={familyData.head_name || ""}
            onChange={(e) => handleInputChange(e, "head_name")}
            error={errors.head_name}
            required={true}
          />
          <InputField
            label="Contact Number"
            placeholder="Enter contact Number"
            value={familyData.contact || ""}
            onChange={(e) => handleInputChange(e, "contact")}
            error={errors.contact}
            required={true}
            pattern="^[0-9]{10}$"
            maxLength="10"
            numericOnly={true}
          />
          <InputField
            label="Total Members"
            type="text"
            value={familyData.members ?? ""}
            onChange={(e) => handleInputChange(e, "members")}
            error={errors.members}
            required={true}
          />
          <InputField
            label="Email"
            type="email"
            value={familyData.email || ""}
            onChange={(e) => handleInputChange(e, "email")}
            error={errors.email}
            required={true}
          />
          <div>
            <label className="block text-primary mb-1 font-semibold">
              Marriage Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={familyData.marriage_date}
              onChange={handleMarriageDateChange}
              maxDate={new Date()}
              className="w-full border border-gray-700 rounded-lg px-2 py-2 focus:border-gray-900 text-black"
              placeholderText="Select Marriage Date"
              showYearDropdown
              showMonthDropdown
              yearDropdownItemNumber={100}
              scrollableYearDropdown
              dateFormat="dd-MM-YYYY"
            />
            {errors.marriage_date && <p className="text-red-500 text-sm mt-1">{errors.marriage_date}</p>}
          </div>
        </div>
      </div>

      {/* Family Members Card */}
      <div className="bg-secondary mx-10 shadow-md border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-primary mb-4">Family Members</h2>
        {familyMembers.map((member, index) => (
          <div key={index} className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-bold text-blue-500 flex justify-between items-center">
              {member.role} Details
              {index > 0 && (
                <button
                  type="button"
                  className="text-red-500 text-2xl hover:text-red-800 font-medium"
                  onClick={() => handleRemoveMember(member.role,index)}
                >
                  <MdOutlinePersonRemoveAlt1 />
                </button>
              )}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
              <InputField
                label="Name"
                value={member.name}
                onChange={(e) => handleMemberChange(e, index, "name")}
                error={errors[`member_${index}_name`]}
                readOnly={index === 0}
                required={true}
              />
              <InputField
                label="Aadhaar Number"
                value={member.aadhaar_number}
                onChange={(e) => handleMemberChange(e, index, "aadhaar_number")}
                error={errors[`member_${index}_aadhaar_number`]}
                required={true}
                pattern="^[0-9]{10}$"
                maxLength="12"
                numericOnly={true}
              />
              <div>
                <label className="block text-primary mb-1 font-semibold">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={member.dob ? new Date(member.dob) : null}
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
                value={member.age}
                readOnly={true}
              />
              {member.role === 'Son' || member.role === 'Daughter' ? (
                <InputField
                  label="Gender"
                  value={member.gender = member.role === 'Son' ? 'Male' : 'Female'}
                  disabled
                  readOnly={true}
                />
              ):(
                <SelectField
                  label="Gender"
                  options={["Male", "Female", "Other"]}
                  value={member.gender}
                  onChange={(e) => handleMemberChange(e, index, "gender")}
                  error={errors[`member_${index}_gender`]}
                  required={true}
                />
              )}
              <InputField 
                label="Relationship" 
                value={member.role} 
                readOnly={true}
                disabled 
              />
              {member.role === 'Head' || member.role === 'Wife'?(
                <InputField
                  label="Marital Status"
                  value={member.marital_status = 'Married'}
                  disabled
                  readOnly={true}
                />
              ):(
                <InputField
                  label="Marital Status"
                  value={member.marital_status = 'Single'}
                  disabled
                  readOnly={true}
                />
              )}
              <div className="flex items-center space-x-2 pt-5">
                <input
                  type="checkbox"
                  id={`deceased-checkbox-${index}`}
                  checked={member.deceased || false}
                  onChange={() => handleDeceasedChange(index)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                  disabled={member.deceased && member.fromResponse}
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
                    disabled={member.deceased && member.fromResponse}
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
                        disabled={member.deceased && member.fromResponse}
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
                        disabled={member.deceased && member.fromResponse}
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

      <div className="mx-10">
        <div className="py-6 flex items-center space-x-4 mt-2">
          <select
            value={selectedRelationship}
            onChange={(e) => {
              setSelectedRelationship(e.target.value);
              setShowWarning(false);
            }}
            className="w-2/4 border border-gray-700 rounded-lg px-4 py-2 focus:border-gray-700 text-black"
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
        </div>
        {showWarning && (
          <p className="text-red-500 text-sm mt-1">Please select a relationship before adding a member.</p>
        )}
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
      {showYearPrompt && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold text-center mb-4">Confirm Year</h3>
            <div className="mb-4">
              <h2 htmlFor="year" className="block text-primary font-semibold">Enter Year <span className="text-red-500">*</span></h2>
              <input
                type="number"
                id="year"
                value={yearToRemove}
                onChange={(e) => {
                  setYearToRemove(e.target.value);
                  setErrors((prevErrors) => {
                    const updatedErrors = { ...prevErrors };
                    delete updatedErrors.year; 
                    return updatedErrors;
                  });;
                }}
                className={`w-full border rounded-lg px-4 py-2 ${errors.year ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter the year"
              />
              {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
            </div>
            <div className="mb-4">
              <h2 className="block text-primary font-semibold">Tax Option <span className="text-red-500">*</span></h2>
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
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowYearPrompt(false);
                  setMemberToRemove(null);
                  setYearToRemove('');
                  setSelectedOption('');
                  setErrors({});
                }} 
                className="px-4 py-2 bg-red-600 text-secondary rounded-md hover:bg-red-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemoval}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-gray-900"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}
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

function SelectField({ label, options, value, onChange, error, required }) {
  return (
    <div>
      <label className="block text-primary mb-1 font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
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
