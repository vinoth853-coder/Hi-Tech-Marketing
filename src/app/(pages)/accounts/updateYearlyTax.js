"use client";

import API from '@/action/axios';
import CustomAlert from '@/utils/customAlert';
import React, { useEffect, useState } from 'react';
import { useAlert } from "@/components/AlertContext";
import { AiOutlineClose } from "react-icons/ai";

export default function UpdateYearlyTax({ onSubmit, onClose }) {
  const { alertContent, showAlertContent } = useAlert();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTaxType, setSelectedTaxType] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [taxHistory, setTaxHistory] = useState([]); 
  const [isAmountEditable, setIsAmountEditable] = useState(true);
  const [showSubmitButton, setShowSubmitButton] = useState(false);

  const years = Array.from({ length: currentYear - 2019 + 1 }, (_, i) => 2019 + i);

  const isValidAmount = !isNaN(amount) && parseFloat(amount) > 0;

  const validateForm = () => {
    const errors = {};
    
    if (!selectedYear) {
      errors.year = "Year is required";
    }
    
    if (!selectedTaxType) {
      errors.taxType = "Tax type is required";
    }
    
    if (!amount || !isValidAmount) {
      errors.amount = "Please enter a valid amount (greater than 0)";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0; 
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const taxData = {
      year: selectedYear.toString(),
      festival_tax: selectedTaxType === "Festival Tax" ? parseFloat(amount) : 0,
      feast_tax: selectedTaxType === "Feast Tax" ? parseFloat(amount) : 0,
    };

    setIsSubmitting(true);
    try {
      const response = await API.post('/tax/create_yearly_tax', taxData);
      if (response.status === 200) {
        alertContent("Tax updated successfully!", "success");
        setSelectedYear('');
        setSelectedTaxType('');
        setAmount('');
        onSubmit();
      } else {
        const errorData = await response.json();
        alertContent(`Failed to update tax: ${errorData.message || "Unknown error"}`, "error");
      }
    } catch (error) {
      alertContent(`Error: ${error?.response?.data?.message || error.message || "Unknown error"}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const yearlyTaxDetails = async() => {
    try {
      const response = await API.get('/tax/list_tax_history');
      setTaxHistory(response.data);
    } catch (error) {
      console.error("Error fetching tax history:", error);
    }
  };

  const updateAmountField = () => {
    const matchedTax = taxHistory.find(
      (tax) => tax.year === selectedYear && 
      ((selectedTaxType === "Festival Tax" && tax.festival_tax > 0) || 
      (selectedTaxType === "Feast Tax" && tax.feast_tax > 0))
    );

    if (matchedTax) {
      const autoAmount = selectedTaxType === "Festival Tax" ? matchedTax.festival_tax : matchedTax.feast_tax;
      setAmount(autoAmount);
      setIsAmountEditable(autoAmount === 0);
      setShowSubmitButton(autoAmount === 0);
    } else {
      setAmount('');
      setIsAmountEditable(true); 
      setShowSubmitButton(true);
    }
  };

  useEffect(() => {
    yearlyTaxDetails();
  }, []);

  useEffect(() => {
    if (selectedYear && selectedTaxType) {
      updateAmountField();
    } else {
      setShowSubmitButton(false); 
    }
  }, [selectedYear, selectedTaxType]);

  const Spinner = ({ color }) => (
    <div className="flex items-center justify-center">
      <div className={`w-6 h-6 border-4 border-${color}-500 border-solid rounded-full border-t-transparent animate-spin`}></div>
    </div>
  );

  return (
    <div className="relative px-10 bg-secondary rounded-lg">
      {showAlertContent && ( <CustomAlert message={showAlertContent.message} type={showAlertContent.type}/>)}
      <h2 className="text-2xl font-semibold py-6 text-center text-primary sticky top-0 bg-secondary z-10">
        Yearly Tax Amounts
      </h2>
      <button 
        onClick={onClose} 
        className="absolute top-2 right-2 text-primary hover:text-primary p-2 rounded-full"
        aria-label="Close"
      >
        <AiOutlineClose className='w-6 h-6'/>
      </button>
      <div className="mb-4 flex items-center space-x-4">
        <div>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setSelectedTaxType('');
              setAmount('');
              setFormErrors((prev) => ({
                ...prev,
                year: "",
              }));
            }}
            className="block w-[133px] p-2 border border-gray-700 text-black rounded-md shadow-sm focus:border-gray-900"
          >
            <option value="" disabled>Year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {formErrors.year && <p className="text-red-500 text-sm">{formErrors.year}</p>}
        </div>

        <div>
          <select
            id="taxType"
            value={selectedTaxType}
            onChange={(e) => {
              setSelectedTaxType(e.target.value)
              setFormErrors({});
            }}
            className="block w-[134px] p-2 border border-gray-700 text-black rounded-md shadow-sm focus:border-gray-900"
            disabled={!selectedYear}
          >
            <option value="">Tax Type</option>
            <option value="Festival Tax">Festival Tax</option>
            <option value="Feast Tax">Feast Tax</option>
          </select>
          {formErrors.taxType && <p className="text-red-500 text-sm">{formErrors.taxType}</p>}
        </div>
      </div>

      {/* Display the input field when a tax type is selected */}
      {selectedTaxType && ( 
        <div className="mb-4">
          <label htmlFor="amount" className="block text-primary mb-1 font-semibold">
            Enter the tax amount per person
          </label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              setFormErrors((prev) => ({
                ...prev,
                amount: "",
              }));
            }}
            placeholder="Enter the tax amount per person"
            className={`block w-full p-2 border text-black rounded-md shadow-sm focus:border-gray-900 ${formErrors.amount ? 'border-red-500' : 'border-gray-700'}`} 
            disabled={!isAmountEditable}
          />
          {formErrors.amount && <p className="text-red-500 text-sm">{formErrors.amount}</p>}
        </div>
      )}

      {selectedYear && selectedTaxType && (
        <>
          {showSubmitButton ? (
            <div className="flex justify-between mt-6 pb-10">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-red-600 text-secondary rounded-md hover:bg-red-800">
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary text-secondary rounded-md hover:bg-gray-900"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner color="white" /> : "Submit"}
              </button>
            </div>
          ) : (
            <div className="flex justify-center mt-6 pb-10">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-red-600 text-secondary rounded-md hover:bg-red-800">
                Cancel
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
