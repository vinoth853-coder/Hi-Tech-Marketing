"use client";
import API from "@/action/axios";
import CustomAlert from "@/utils/customAlert";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAlert } from "@/components/AlertContext";
import { AiOutlineClose } from "react-icons/ai";
import Spinner from "@/utils/spinner";
import { useAuth } from "@/components/AuthContext";
import dayjs from "dayjs";

const listTaxDetails = async (details, setTaxDetails, alertContent, setIsLoading) => {
  setIsLoading(true); 
  try {
    const response = await API.get(`/user/list_tax_details?family_id=${details.id}`);
    
    if (response.status === 200) {
      setTaxDetails(response.data);
    } else if (response.status === 404) {
      alertContent("No tax details found for this family.", "error");
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      alertContent("No tax details found for this family.", "error");
    } else {
      alertContent("An error occurred while fetching tax details. Please try again.", "error");
    }
  } finally {
    setIsLoading(false); 
  }
};

export default function DirectPayment({ details, onSubmit, onClose }) {
  const [selectedType, setSelectedType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { alertContent, showAlertContent } = useAlert();
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();
  
  const [selectedYear, setSelectedYear] = useState(null);
  const [formData, setFormData] = useState({
    head_name: details.head_name || "",
    contact: details.contact || "",
    email: details.email || "",
    tax_type: "",
    tax_count: 0,
    amount: "",
    receipt_number: "",
    paid_date: "",
    cashier_name: "",
    tax_year: null,
  });

  const [taxDetails, setTaxDetails] = useState([]);
  const [maxAmount, setMaxAmount] = useState(null);

  const [errors, setErrors] = useState({
    tax_type: "",
    amount: "",
    receipt_number: "",
    tax_year: "",
    paid_date: "",
    cashier_name: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && maxAmount !== null) {
      if (parseFloat(value) > maxAmount) {
        alertContent(`Amount cannot exceed the maximum allowed (${maxAmount}).`, "error");
        return;
      }
    }
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({
      ...prev,
      [name]: "",  
    }));
  };  

  const handleDateChange = (date) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : "";
    setFormData({ ...formData, paid_date: formattedDate });
    setErrors((prev) => ({
      ...prev,
      paid_date: "",
    }));
  };

  const handleTaxTypeChange = (e) => {
    const taxType = e.target.value;
    setSelectedType(taxType);
    setFormData({ ...formData, tax_type: taxType, tax_year: '', tax_count: 0, amount: '' });
    setSelectedYear(null); 
    updateMaxAmount('');
    setErrors((prev) => ({
      ...prev,
      selectedType: "",
    }));
  };
  
  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    setFormData({ ...formData, tax_year: year, tax_count: 0, amount: '' });
    setErrors((prev) => ({
      ...prev,
      tax_year: "",
    }));
  
    if (year && selectedType) {
      const selectedTaxDetail = taxDetails?.tax_details.find((tax) => tax.tax_year === year);
      if (selectedTaxDetail) {
        let taxCount;
        if (selectedType === 'Feast Tax') {
          taxCount = selectedTaxDetail.feast_tax_count;
        } else if (selectedType === 'Festival Tax') {
          taxCount = selectedTaxDetail.festival_tax_count;
        }
        setFormData((prevFormData) => ({
          ...prevFormData,
          tax_count: taxCount,
        }));
        updateMaxAmount(year, selectedType); 
      }
    }
  };  

  const updateMaxAmount = (year, taxType) => {
    const selectedTaxDetail = taxDetails?.tax_details.find((tax) => tax.tax_year === year);
    if (selectedTaxDetail && taxType) {
      setMaxAmount(selectedTaxDetail[taxType.toLowerCase().replace(' ', '_')]);
    } else {
      setMaxAmount(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (!validateForm()) return;

    try {
      const response = await API.put(`/payment/create_direct_payment/${details.id}`, formData);
      if (response.status === 200) {
        alertContent("Payment details updated successfully!", "success"); 
        onSubmit();
      } else {
        console.error("Unexpected response: ", response);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alertContent("Payment details could not be updated. Resource not found.", "error");
      } else {
        alertContent(error.response.data.detail, "error");
      }
    }
  };

  const validateForm = () => {
    const { tax_type, amount, receipt_number, tax_year, paid_date, cashier_name } = formData;
    let formErrors = {};
    if (!selectedType) formErrors.selectedType = "Type is required."; 
    if (!amount) formErrors.amount = "Amount is required.";
    if (!receipt_number) formErrors.receipt_number = "Receipt number is required.";
    if (!tax_year) formErrors.tax_year = "Tax year is required.";
    if (!paid_date) formErrors.paid_date = "Paid date is required.";
    if (!cashier_name) formErrors.cashier_name = "Cashier name is required.";

    return formErrors;
  };

  useEffect(() => {
    listTaxDetails(details, setTaxDetails, alertContent, setIsLoading);
  }, [details]);  

  return (
    <div className="relative px-10 bg-secondary rounded-lg">
      {showAlertContent && (<CustomAlert message={showAlertContent.message} type={showAlertContent.type}/>)}
      <div className="flex justify-end">
        <button 
          onClick={onClose} 
          className="fixed text-primary hover:text-primary py-5 mr-[-25px] rounded-full z-10"
          aria-label="Close"
        >
          <AiOutlineClose className='w-6 h-6'/>
        </button>
      </div>
      <h2 className="text-2xl font-semibold py-6 text-center text-primary sticky top-0 bg-secondary z-5">
        Add Direct Payment Details
      </h2>
      
      {/* Conditionally render form or message based on availability of tax details */}
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-primary rounded-lg p-4 shadow-sm mb-6">
          <div className="flex flex-col col-span-1 md:col-span-2">
            <span className="font-bold text-secondary">Family ID: {details.id}</span>
            <span className="font-bold text-secondary">Family Head Name: {details.head_name}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
        {isLoading ? (
          <div className="flex h-[360px] w-full items-center justify-center">
            <Spinner size="10" color="blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-primary mb-1 font-semibold">Select Type <span className="text-red-500">*</span></label>
              <select
                value={selectedType}
                onChange={handleTaxTypeChange}
                className={`w-full px-4 py-3 border rounded-lg ${errors.selectedType ? 'border-red-500' : 'border-gray-700'} focus:border-gray-900 bg-secondary text-black`}
              >
                <option value="" disabled>Choose an option</option>
                <option 
                  value="Festival Tax" 
                  disabled={taxDetails.tax_details?.length === 0 || taxDetails.tax_details?.every(tax => tax.festival_tax <= 0.0)}
                >Festival Tax
                </option>
                <option 
                  value="Feast Tax" 
                  disabled={taxDetails.tax_details?.length === 0 || taxDetails.tax_details?.every(tax => tax.feast_tax <= 0.0)}
                >Feast Tax</option>
                <option value="Donation">Donation</option>
              </select>
              {errors.selectedType && <p className="text-red-500 text-sm mt-1">{errors.selectedType}</p>}
            </div>
            {/* Year Selector */}
            {selectedType !== "Donation" ? (
              <div>
                <label htmlFor="year" className="block text-primary mb-1 font-semibold">
                  Select Year <span className="text-red-500">*</span>
                </label>
                <select
                  id="year"
                  value={selectedYear || ""}
                  onChange={handleYearChange} 
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.tax_year ? "border-red-500" : "border-gray-700"
                  } focus:border-gray-900 bg-secondary text-black`}
                  disabled={!selectedType}
                >
                  <option value="" disabled>
                    Year
                  </option>
                  {taxDetails?.tax_details &&
                    taxDetails.tax_details
                      .filter((tax) =>
                        selectedType === "Festival Tax" ? tax.festival_tax !== 0 : tax.feast_tax !== 0
                      )
                      .map((tax) => (
                        <option key={tax.tax_year} value={tax.tax_year}>
                          {tax.tax_year}
                        </option>
                  ))}
                </select>
                {errors.tax_year && <p className="text-red-500 text-sm">{errors.tax_year}</p>}
              </div>
            ) : (
              <div>
                <label htmlFor="year" className="block text-primary mb-1 font-semibold">Year</label>
                <input
                  id="year"
                  value={formData.tax_year = String(currentYear)}
                  readOnly 
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none bg-secondary text-black border-gray-700`}
                  disabled={true} 
                />
              </div>
            )}

            {/* Tax count */}
            {selectedType !== "Donation" &&
              <div>
                <label className="block text-primary mb-1 font-semibold">Total Tax Count</label>
                <input
                  name="tax_count"
                  value={formData.tax_count || ""} 
                  readOnly 
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none bg-secondary text-black border-gray-700`}
                  disabled={true} 
                />
              </div>
            }

            {/* Amount Input */}
            <div>
              <label className="block text-primary mb-1 font-semibold">Enter the Amount <span className="text-red-500">*</span></label>
              <input
                name="amount"
                type="text"
                value={formData.amount}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:border-gray-700 bg-secondary text-black ${errors.amount? 'border-red-500' : 'border-gray-700'}`}
                placeholder={maxAmount ? `Max amount: ${maxAmount}` : "Enter the amount"}
              />
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
            </div>

            {/* Receipt Number */}
            <div>
              <label className="block text-primary mb-1 font-semibold">Receipt Number <span className="text-red-500">*</span></label>
              <input
                name="receipt_number"
                type="text"
                value={formData.receipt_number}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:border-gray-700 bg-secondary text-black ${errors.receipt_number? 'border-red-500' : 'border-gray-700'}`}
                placeholder="Enter receipt number"
              />
              {errors.receipt_number && <p className="text-red-500 text-sm">{errors.receipt_number}</p>}  
            </div>

            {/* Cashier Name */}
            <div>
              <label className="block text-primary mb-1 font-semibold">Cashier Name <span className="text-red-500">*</span></label>
              <input
                name="cashier_name"
                type="text"
                value={formData.cashier_name = user.head_name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:border-gray-700 bg-secondary text-black ${errors.receipt_number? 'border-red-500' : 'border-gray-700'}`}
                placeholder="Enter cashier name"
                readOnly={user.head_name}
              />
              {errors.cashier_name && <p className="text-red-500 text-sm">{errors.cashier_name}</p>}
            </div>

            {/* Paid Date */}
            <div>
              <label className="block text-primary mb-1 font-semibold">Paid Date <span className="text-red-500">*</span></label>
              <DatePicker
                selected={formData.paid_date ? new Date(formData.paid_date) : null}
                onChange={handleDateChange}
                maxDate={new Date()}
                className={`w-full border ${errors.paid_date? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 focus:border-gray-900 text-black`}
                placeholderText="Select Paid Date"
                showYearDropdown
                showMonthDropdown
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                dateFormat="dd-MM-yyyy"
              />
              {errors.paid_date && <p className="text-red-500 text-sm">{errors.paid_date}</p>}
            </div>
          </div>
          )}

          {/* Buttons  */}
          <div className="flex justify-between mt-6 pb-10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-secondary rounded-md hover:bg-red-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-secondary rounded-md hover:bg-gray-900"
            >
              Submit
            </button>
          </div>
        </form>
      </>
    </div>
  );
}