import API from '@/action/axios';
import { useAlert } from '@/components/AlertContext';
import useAuthStore from '@/store/authStore';
import CustomAlert from '@/utils/customAlert';
import React, { useEffect, useMemo, useState } from 'react';
import { RxDownload } from "react-icons/rx";
import Spinner from '@/utils/spinner';

const DonationHistoryPage = () => {
  const {role} = useAuthStore();
  const [donationData, setDonationData] = useState([]);
  const [id, setId] = useState('');
  const [headName, setHeadName] = useState('');
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    if (role === "User") {
      const donationHistory = async () => {
        setLoading(true);
        try {
          const response = await API.get("/user/list_donation_history");
          if (response.status === 200) {           
            const { family_id, head_name, email, contact } = response.data;
            setId(family_id || '');
            setHeadName(head_name || '');
            setContact(contact || '');
            setEmail(email || '');
            setDonationData(response.data?.donation);
          }
        } catch (error) {
          console.error("Error fetching donation data:", error);
        } finally {
          setLoading(false);
        }
      };
      donationHistory();
    }
  }, [role]);

  const { alertContent, showAlertContent } = useAlert();

  const [yearFilter, setYearFilter] = useState("All");
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 + 1 }, (_, i) => 2019 + i).reverse();

  const getYear = (dateString) => {
    if (!dateString) return ; 
    const [year] = dateString.split("-");
    return `${year}`;
  };

  const filteredData = useMemo(() => 
    donationData.filter((donation) => 
      (yearFilter === "All" || getYear(donation?.paid_at) === yearFilter) 
    ), 
    [donationData, yearFilter]
  );

  const groupedDonations = filteredData.reduce((acc, donation) => {
    const year = getYear(donation.paid_at);
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(donation);
    return acc;
  }, {});  

  const handleDownload = async (type, receipt, rowIndex) => {
    const invoice_data = {
      family_id: id,
      head_name: headName,
      contact: contact,
      email: email,
      receipt_number: receipt,
      tax_type: type
    };

    setIsLoading((prev) => {
      const updatedLoading = [...prev];
      updatedLoading[rowIndex] = true;
      return updatedLoading;
    });
  
    try {
      const response = await API.post('/user/download_invoice', invoice_data, {
        responseType: 'blob', 
      });
  
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
  
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Invoice_${receipt}.pdf`; 
        
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
  
        alertContent("Receipt downloaded successfully!", "success");
      } else {
        alertContent("Error downloading the receipt.", "error");
      }
    } catch (error) {
      alertContent(error.response?.data?.detail || "An error occurred while downloading the receipt.", "error");
    } finally {
      setIsLoading((prev) => {
        const updatedLoading = [...prev];
        updatedLoading[rowIndex] = false;
        return updatedLoading;
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return; 
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const DownloadSpinner = () => (
    <div className="flex items-center justify-center">
      <div className={`w-4 h-4 border-2 border-blue-500 border-solid rounded-full border-t-transparent animate-spin`}></div>
    </div>
  );

  return (
    <div className="min-h-screen py-5 px-5">
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="10" color="blue-500" />
      </div>
      ) : (
        <>
          {showAlertContent && <CustomAlert message={showAlertContent.message} type={showAlertContent.type}/>}
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Header */}
            <div className="px-6 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Donation History</h1>
                <p className="text-sm text-blue-500">Overview of your payments</p>
              </div>
            </div>
    
            {/* Family Details Section */}
            <div className="bg-gray-800 shadow-lg rounded-xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                  <p className="text-xs lg:text-sm font-medium text-white">Family ID</p>
                  <p className="text-lg lg:text-xl font-bold text-white">{id}</p>
                </div>
                <div>
                  <p className="text-xs lg:text-sm font-medium text-white">Family Head</p>
                  <p className="text-lg lg:text-xl font-bold text-white">{headName}</p>
                </div>
                {/* <div>
                  <p className="text-sm font-medium text-white">Email</p>
                  <p className="text-xl font-bold text-white">{email}</p>
                </div> */}
                <div>
                  <p className="text-xs lg:text-sm font-medium text-white">Contact Number</p>
                  <p className="text-lg lg:text-xl font-bold text-white">{contact}</p>
                </div>
              </div>
            </div>
    
            {/* Filters */}
            <div className="mb-4 flex items-center space-x-4">
              <div>
                <select
                  className="block w-[150px] p-2 border border-gray-700 text-black rounded-md shadow-sm focus:outline-gray-900"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
    
            {filteredData.length === 0 ? (
              <div className="text-center py-10">
                {yearFilter === "All"? (
                  <p className="text-lg font-semibold text-gray-700">No donations have been made yet.</p>
                ):(
                  <p className="text-lg font-semibold text-gray-700">No donations have been made for this year.</p>
                )}
              </div>
            ):(<>
                {Object.keys(groupedDonations).map((year) => (
                  <div key={year}>
                    <h3 className="text-lg font-semibold text-blue-600">{year}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 mb-5">
                      {groupedDonations[year].map((donation, index) => {
                        const { receipt_number, amount, payment_mode, paid_at, cashier_name } = donation;
                        return (
                          <div key={index} className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-indigo-500">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-teal-600">{receipt_number}</h3>
                                <button
                                  onClick={() => handleDownload("Donation", receipt_number, index)}
                                  className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-lg"
                                  disabled={isLoading[index]}
                                >
                                  {isLoading[index] ? <DownloadSpinner /> : <RxDownload className="text-md" />}
                                </button>
                              </div>
                              <div className="text-sm text-gray-500">
                                <p><span className="font-medium">Paid Amount:</span> <span className="font-bold text-green-500">₹{amount}</span></p>
                                <p><span className="font-medium">Payment Method:</span> {payment_mode}</p>
                                <p><span className="font-medium">Paid Date:</span> {formatDate(paid_at)}</p>
                                {payment_mode !== 'Online' && <p><span className="font-medium">Cashier Name:</span> {cashier_name}</p>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>)}  
          </div>
        </>
      )}
    </div>
  );
};

export default DonationHistoryPage;