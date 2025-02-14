"use client";
import { useState, useEffect } from "react";
import API from "@/action/axios";
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

export default function DonationScreen() {
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const amountToPay = donationAmount || customAmount;
  const { alertContent, showAlertContent } = useAlert();
  const [isLoading, setIsLoading] = useState(false);

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
    if (!donationAmount && !customAmount) {
      newErrors.amount = 'Please select or enter a donation amount.';
    } else if (isNaN(customAmount) && customAmount <= 0) {
      newErrors.amount = 'Please enter a valid donation amount.';
    } else if (customAmount && customAmount < 100) {
      newErrors.amount = 'Donation Amount must be greater than or equal to 100.';
    }
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email address';
    if (!/^\d{10}$/.test(contact)) newErrors.contact = 'Contact number should be 10 digits';
    if(!message) newErrors.message = 'Reason for Donation is required.'

    setErrors(newErrors)
  
    return newErrors;
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
      message,
    };
    
    setIsLoading(true);
  
    try {
      const response = await API.post('/payment/donation_payment', paymentData);
  
      if (response.status === 200) { 
        const { order_id, payment_session_id } = response.data.response;

        let checkoutOptions = {
          paymentSessionId: payment_session_id,
          redirectTarget: "_modal",
        }

        cashfree.checkout(checkoutOptions)
        .then((response) => {
          if (response?.error) {
            alertContent(response.error.message, "error");
            resetForm();
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
      } else {
        alertContent(`Failed to create payment order: ${response.status}`, "error");
      }
    } catch (error) {
      alertContent(error?.response?.data?.detail, "error");
    } finally {
      setIsLoading(false);
    }
  }; 
  
  const verifyPayment = async (orderId, paymentData) => {
    try {
      const verificationResponse = await API.post(`/payment/verify_donation/${orderId}`, paymentData);

      if (verificationResponse.status === 200) {
        alertContent('Payment verified successfully!', "success");
        resetForm();
      } else {
        alertContent('Payment verification failed! Please contact support.', "error");
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
            <h1 className="text-4xl font-bold text-center mb-10 text-primary drop-shadow-md">Make a Donation</h1>
              {/* Donation Amount */}
              <div className="mb-4">
                <label className="block text-primary font-bold mb-2">Select a Donation Amount (INR)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-2">
                  {['100', '500', '1000', '5000'].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setDonationAmount(amount);
                        setCustomAmount('');
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
                <div className="my-2 mt-4">
                  <input
                    type="text"
                    placeholder="Enter custom amount (INR)"
                    value={customAmount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setCustomAmount(value);
                      setDonationAmount('');
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
                    className={`border w-full text-black px-4 py-2 rounded focus:border-gray-900 ${
                      errors.amount ? 'border-red-500' : 'border-gray-700'
                    }`} 
                  />
                </div>
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>

            {/* Personal Information */}
            <div className="mb-4">
              <label className="block text-primary font-bold mt-2 mb-2">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleInputChange('name', e.target.value)}
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
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  handleInputChange("contact", value);
                }}
                onKeyDown={(e) => {
                  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                  if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className={`bg-white border w-full text-black px-4 py-2 rounded focus:border-gray-900 ${
                  errors.contact ? "border-red-500" : "border-gray-700"
                }`} 
                placeholder="Enter your contact number"
                maxLength="10"
              />
              {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
            </div>

            {/* Optional Message */}
            <div className="mb-4">
              <label className="block text-primary font-bold mt-2 mb-2">Reason for the Donation</label>
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  setErrors((prev) => ({
                    ...prev,
                    message: ""
                  }))
                }}
                className={`border w-full text-black px-4 py-2 rounded focus:border-gray-900 ${
                  errors.message ? 'border-red-500' : 'border-gray-700'
                }`} 
                placeholder="Leave a message"
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

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
