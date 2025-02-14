"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/action/axios";
import { useAuth } from "@/components/AuthContext";
import { load } from "@cashfreepayments/cashfree-js";
import { useAlert } from '@/components/AlertContext';
import CustomAlert from "@/utils/customAlert";

const benefits = [
  { title: 'Church Operations', description: 'Cover essential costs to keep the church running.' },
  { title: 'Worship Services', description: 'Fund worship materials, music, and services.' },
  { title: 'Staff Support', description: 'Support pastors and staff who lead and serve.' },
  { title: 'Outreach & Missions', description: 'Support local and international missions and aid.' },
  { title: 'Community Services', description: 'Fund food banks, clothing drives, and community support.' },
  { title: 'Facility Maintenance', description: 'Maintain and enhance the church building.' },
];

export default function PayTaxScreen() {
  const [selectedType, setSelectedType] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const amountToPay = donationAmount || customAmount || taxAmount;
  const { alertContent, showAlertContent } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [isNameDisabled, setIsNameDisabled] = useState(false);
  const [isEmailDisabled, setIsEmailDisabled] = useState(false);
  const [isContactDisabled, setIsContactDisabled] = useState(false);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState('');
  const [taxDetails, setTaxDetails] = useState([]);
  const [orderId, setOrderId] = useState('');

  const { isAuthenticated } = useAuth();

  const [cashfree, setCashfree] = useState(null);
  useEffect(() => {
    const initializeSDK = async () => {
      const sdkInstance = await load({ mode: "sandbox" });
      setCashfree(sdkInstance);
    };

    initializeSDK();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedType) {
      newErrors.selectedType = 'Please select a payment type!';
    }
  
    if (!donationAmount && !customAmount && !taxAmount) {
      newErrors.amount = 'Please select or enter a donation amount.';
    } else if (isNaN(customAmount) && customAmount <= 0) {
      newErrors.amount = 'Please enter a valid donation amount.';
    } else if (selectedType === 'Donation' && customAmount && customAmount < 100) {
      newErrors.amount = 'Donation Amount must be greater than or equal to 100.';
    }
  
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email address';
    if (!/^\d{10}$/.test(contact)) newErrors.contact = 'Contact number should be 10 digits';
    if(selectedType === 'Donation' && !message) newErrors.message = 'Reason for donation is required'

    setErrors(newErrors)
  
    return newErrors;
  };

  const handleTypeChange = (e) => {
    setDonationAmount('')
    setTaxAmount('')
    setSelectedType(e.target.value);
    setSelectedYear('')
    setErrors({});
    setCustomAmount(''); 
  };

  const handleInputChange = (field, value) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[field];
      return newErrors;
    });
  
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    if (field === 'contact') setContact(value);
  };

  const handleViewTax = () => {
    router.push('/taxDetails')
  }

  const listTaxDetails = async () => {
    try {
      const response = await API.get(`/user/list_tax_details`);
      
      if (response.status === 200) {
        setTaxDetails(response.data);
      } 
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alertContent("No tax details found for this family.", "error");
      } else if (error.response && error.response.status === 403) {
        setIsNameDisabled(false);
        setIsEmailDisabled(false);
        setIsContactDisabled(false);
      } else {
        alertContent(error.response.data.detail, "error");
      }
    }
  };

  useEffect(() => {
    if (taxDetails) {
      const details = taxDetails; 
      setName(details.head_name || '');
      setEmail(details.email || '');
      setContact(details.contact || '');
      setIsNameDisabled(true);
      setIsEmailDisabled(true);
      setIsContactDisabled(true);
    }
  }, [taxDetails]);

  useEffect(() => {
    listTaxDetails();
  }, [])

  const handleSubmit = async () => {
    
    if (!cashfree) {
      console.error("Cashfree SDK not initialized yet.");
      return;
    }
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const paymentData = {
      amount: parseInt(amountToPay), 
      name,
      email,
      contact,
      type: selectedType,
      message,
      year: String(selectedYear),
    };

    setIsLoading(true);
    
    try {
      const response = await API.post('/payment/create_payment', paymentData);
  
      if (response.status === 200) { 
        const { order_id, payment_session_id } = response.data.response;

        setOrderId(response.data.response.order_id)

        let checkoutOptions = {
          paymentSessionId: payment_session_id,
          redirectTarget: "_modal",
        }

        cashfree.checkout(checkoutOptions)
        .then((response) => {
          if (response?.error) {
            alertContent(response.error.message, "error");
            resetForm();
            listTaxDetails();
          } else if ( response?.paymentDetails?.paymentMessage === "Payment finished. Check status." ) {
            verifyPayment(order_id, paymentData);
          } else {
            console.warn("Unexpected response:", response);
          }
        })
        .catch((error) => {
          console.error("Checkout failed:", error);
          alertContent("Something went wrong during checkout. Please try again.", "error");
        });
        listTaxDetails();
      } else {
        alertContent(`Failed to create payment order: ${response.status}`, "error");
      }
    } catch (error) {
      alertContent(error.response.data.detail, "error");
    } finally {
      setIsLoading(false);
    }
  }; 
  
  const verifyPayment = async (orderId, paymentData) => {
    try {
      const response = await API.post(`/payment/verify_payment/${orderId}`, paymentData);

      if (response.status === 200) {
        alertContent('Payment verified successfully!', "success");
        resetForm();
        listTaxDetails();
      } else {
        alertContent('Payment verification failed! Please contact support.', "error");
        listTaxDetails();
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alertContent('An error occurred during payment verification.', "error");
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setContact('');
    setMessage('');
    setDonationAmount('');
    setCustomAmount('');
    setTaxAmount('');
    setSelectedType('');
  };

  const Spinner = ({ color }) => (
    <div className="flex items-center justify-center">
      <div className={`w-6 h-6 border-4 border-${color}-500 border-solid rounded-full border-t-transparent animate-spin`}></div>
    </div>
  );

  return (
    <div className="relative h-full p-2 sm:p-6">
      {showAlertContent && <CustomAlert message={showAlertContent.message} type={showAlertContent.type}/>}
      <div className="relative">
        {isAuthenticated && (
          <div className="flex justify-end">
            <button
              onClick={handleViewTax}
              className="p-3 bg-primary text-secondary rounded-lg shadow-lg hover:bg-gray-900 flex items-center space-x-2"
            >
              View Tax History
            </button>
          </div>
        )}  
        <div className="container mx-auto p-2 lg:p-6 flex flex-col md:flex-row max-w-full max-h-full rounded-lg">
          {/* Support Our Cause Section */}
          <div className="p-6 md:w-1/3 bg-secondary rounded-lg border shadow-xl">
            <h2 className="text-2xl text-center font-semibold mb-2 pb-5 text-primary">Support Our Cause</h2>
            <p className="text-primary mb-2">Your donations help us provide essential services and support to those in need.</p>
            <p className="text-primary mb-2">Every contribution, big or small, makes a difference!</p>
            <p className="text-primary mb-2">We appreciate your generosity and commitment to our mission.</p>
            <p className="text-primary mb-2">Together, we can bring hope and support to those who need it most.</p>
            <h2 className="text-2xl font-semibold mb-5 pt-5 text-primary">Note:</h2>
            <p className="text-primary mb-2">If you belong to Thailapuram town/village, please log in before donating so that the donation is directly recorded to your account.</p>
          </div>

          {/* Donation Form Section */}
          <div className="md:w-1/3 flex flex-col py-6 px-2 lg:px-4 lg:p-6">  
            <h1 className="text-4xl font-bold text-center mb-10 text-primary drop-shadow-md">Payment</h1>
            <div className="mb-4">
              <label className="text-primary block font-bold mb-2">Select Payment Type</label>
              <select
                value={selectedType}
                onChange={handleTypeChange}
                className={`border w-full px-4 py-2 text-black rounded focus:border-gray-900 ${
                  errors.selectedType ? 'border-red-500' : 'border-gray-700'
                }`} 
                required 
              >
                <option value="" disabled>Choose an option</option>
                <option value="Festival Tax">Festival Tax</option>
                <option value="Feast Tax">Feast Tax</option>
                <option value="Donation">Donation</option>
              </select>
              {errors.selectedType && <p className="text-red-500 text-sm mt-1">{errors.selectedType}</p> }
            </div>
            {/* Conditionally Render Donation Amount */}
            {selectedType ==='Donation' ? (
              <>
                <div className="mb-4">
                  <label className="block text-primary font-bold mb-2">Select a {selectedType} Amount (INR)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-2">
                    {['100', '500', '1000', '5000'].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setDonationAmount(amount);
                          setCustomAmount('');
                          setSelectedYear(currentYear)
                          setErrors((prev) => ({
                            ...prev,
                            amount: "", 
                          }));
                        }}
                        className={`w-full px-4 py-2 rounded transition duration-300 ${donationAmount === amount ? 'bg-primary text-secondary' : 'bg-secondary text-black hover:bg-gray-400'}`}
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <input
                    type="text"
                    placeholder="Enter custom amount (INR)"
                    value={customAmount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setCustomAmount(value);
                      setDonationAmount('');
                      setSelectedYear(currentYear)
                      setErrors((prev) => ({
                        ...prev,
                        amount: "", 
                      }));
                    }}
                    onKeyDown={(e) => {
                      const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                      if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="border border-gray-700 w-full text-black px-4 py-2 rounded focus:border-gray-900 mt-2"
                  />
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>
              </>
            ):selectedType ==='Festival Tax' || selectedType ==='Feast Tax' ? (
              <>
                {(selectedType === 'Feast Tax' || selectedType === 'Festival Tax') && 
                (
                  taxDetails?.tax_details.length === 0 ||
                  taxDetails.tax_details.every(tax =>
                    (selectedType === 'Feast Tax' && tax.feast_tax <= 0) ||
                    (selectedType === 'Festival Tax' && tax.festival_tax <= 0)
                  )
                ) ? (
                  <div className="text-center text-red-500 font-bold">
                    No pending {selectedType} for you!
                  </div> 
                ):(
                  <div className="flex flex-col gap-4">
                    {/* Row 1: Select Year and Amount Button */}
                    <div className="flex items-center gap-4">
                      {/* Select Year */}
                      <div className="flex-1">
                        <label htmlFor="year" className="text-black font-bold mb-2 block">
                          Select Year:
                        </label>
                        <select
                          id="year"
                          value={selectedYear || ''}
                          onChange={(e) => {
                            const year = e.target.value;
                            setSelectedYear(year);
                            const selectedYearData = taxDetails.tax_details.find((tax) => tax.tax_year === year);
                            const amount = selectedType === 'Festival Tax'
                                ? Math.abs(selectedYearData?.festival_tax ?? 0)
                                : Math.abs(selectedYearData?.feast_tax ?? 0);
                            setTaxAmount(amount);
                            setCustomAmount('');
                          }}
                          className="block w-full p-2 border border-gray-700 text-black rounded-md shadow-sm focus:outline-gray-900"
                        >
                          <option value="" disabled>Year</option>
                          {taxDetails.tax_details
                            .filter((tax) =>
                              selectedType === 'Festival Tax' ? tax.festival_tax !== 0 : tax.feast_tax !== 0
                            ).map((tax) => (
                            <option key={tax.tax_year} value={tax.tax_year}>
                              {tax.tax_year}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Amount Button */}
                      <div className="flex-1">
                        <label className="text-black font-bold mb-2 block">
                          {selectedType} Amount (INR):
                        </label>
                          <button
                            className={`flex-1 px-4 py-2 rounded transition duration-300 ${
                              taxAmount && !customAmount
                                ? "bg-primary text-secondary"
                                : "bg-gray-200 text-black hover:bg-gray-400"
                            }`}
                            disabled
                          >
                            ₹{taxAmount}
                          </button>
                      </div>
                    </div>

                    {/* Row 2: Custom Amount Field */}
                    <div>
                      <input
                        type="text"
                        placeholder="Enter custom amount (INR)"
                        value={customAmount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          if (value && parseInt(value, 10) > (taxAmount || 0)) {
                            alertContent(`Amount cannot exceed the maximum allowed (${taxAmount}).`, "error"); 
                          } else {
                            setCustomAmount(value);
                            setErrors((prev) => ({
                              ...prev,
                              amount: "", 
                            }));
                          }
                        }}
                        onKeyDown={(e) => {
                          const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                          if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className="border border-gray-700 w-full text-black px-4 py-2 rounded focus:border-gray-900"
                      />
                      {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                    </div>
                  </div>
                )}
              </>
            ) : (<></>)}

            {/* Personal Information */}
            <div className="mb-4">
              <label className="block text-primary font-bold mt-2 mb-2">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                readOnly={isNameDisabled}
                className={`bg-white border w-full text-black px-4 py-2 rounded focus:border-gray-900 ${
                  errors.name ? 'border-red-500' : 'border-gray-700'
                }`} 
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-primary font-bold mt-2 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                readOnly={isEmailDisabled}
                className={`bg-white border w-full text-black px-4 py-2 rounded focus:border-gray-900 ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                }`} 
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Contact Number */}
            <div className="mb-4">
              <label className="block text-primary font-bold mt-2 mb-2">Contact Number</label>
              <input
                type="text"
                value={contact}
                readOnly={isContactDisabled}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  handleInputChange('contact', value)
                }}
                onKeyDown={(e) => {
                  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                  if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className={`bg-white border w-full text-black px-4 py-2 rounded focus:border-gray-900 ${
                  errors.contact ? 'border-red-500' : 'border-gray-700'
                }`} 
                placeholder="Enter your contact number"
              />
              {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
            </div>

            {/* Optional Message */}
            {(!isAuthenticated || selectedType === 'Donation') &&
              <div className="mb-4">
                <label className="block text-primary font-bold mt-2 mb-2">Reason for the Donation</label>
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                    setErrors((prev) => ({
                      ...prev,
                      message: "", 
                    }))
                  }}
                  className={`border w-full px-4 text-black py-2 rounded focus:border-gray-900 ${
                    errors.message ? 'border-red-500' : 'border-gray-700'
                  }`} 
                  placeholder="Leave a message"
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p> }
              </div>
            }

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className={`bg-primary text-secondary w-full py-2 rounded font-bold ${!amountToPay ? 'bg-gray-400' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? <Spinner color="white" /> : "Pay"}
            </button>
          </div>
          
          <div className="md:w-1/3 border p-6 bg-secondary rounded-lg shadow-xl">
            <h1 className="text-2xl font-semibold text-center mb-2 pb-5 text-primary">How Donation helps Us</h1>
              <ul className="space-y-6">
                {benefits.map((benefit, index) => (
                  <li key={index}>
                    <h3 className="text-lg font-semibold text-primary mb-4">{benefit.title}</h3>
                    <ul className="list-disc pl-6 text-primary">
                      <li>{benefit.description}</li>
                    </ul>
                  </li>
                ))}
              </ul>                
          </div>
        </div>
      </div>
    </div>
  );
}
