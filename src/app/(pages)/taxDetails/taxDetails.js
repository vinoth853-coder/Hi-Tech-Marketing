"use client";

import API from "@/action/axios";
import { useAlert } from "@/components/AlertContext";
import useAuthStore from "@/store/authStore";
import CustomAlert from "@/utils/customAlert";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdNotifications, IoMdArrowBack } from "react-icons/io";
import { RxDownload } from "react-icons/rx";
import DonationHistoryPage from "./donationHistory";
import Spinner from "@/utils/spinner";

const PaymentHistoryPage = ({ details, onClose }) => {
  const {role} = useAuthStore();
  const router = useRouter();
  const [selected, setSelected] = useState("Tax");

  return (
    <div className="min-h-screen py-5 px-5">            
      {role!== 'Accountant' &&
        <div className="flex justify-between items-center">
          <div className="flex justify-start items-center mb-6">
            <button
              onClick={() => router.back()}
              className="absolute top-5 flex items-center gap-2 p-3 bg-primary text-secondary rounded-full hover:bg-gray-900 shadow-lg transition-all"
            >
              <IoMdArrowBack className="text-lg" />
            </button>
          </div>
          <div className="flex justify-center items-center w-full">
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                className={`px-4 py-1 lg:px-6 lg:py-2 text-sm lg:text-lg ${
                  selected === "Tax"
                    ? "bg-primary text-white"
                    : "bg-white text-primary"
                } transition-colors`}
                onClick={() => setSelected("Tax")} // Set state to "Tax"
              >
                Tax History
              </button>
              <button
                className={`px-4 py-1 lg:px-6 lg:py-2 text-sm lg:text-lg ${
                  selected === "Donation"
                    ? "bg-primary text-white"
                    : "bg-white text-primary"
                } transition-colors`}
                onClick={() => setSelected("Donation")} // Set state to "Donation"
              >
                Donations
              </button>
            </div>
          </div>
        </div>
      }        

      {role === 'Accountant' && (
        <div className="flex justify-end items-center">
          <button
            onClick={onClose}
            className="flex justify-end text-primary hover:text-primary rounded-full z-10"
            aria-label="Close"
          >
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>
      )}
  
      <div>
        {selected === "Tax" ? (
          <TaxHistoryPage details={details} />
        ) : (
          <DonationHistoryPage />
        )}
      </div>
    </div>
  );  
};

const TaxHistoryPage = ({ details }) => {
  const {role} = useAuthStore();
  const [taxData, setTaxData] = useState(role === "Accountant" ? details?.tax || [] : []);
  const [id, setId] = useState(details?.id || '');
  const [headName, setHeadName] = useState(details?.head_name || '');
  const [members, setMembers] = useState(details?.members || '');
  const [email, setEmail] = useState(details?.email || '')
  const [remainingAmount, setRemainingAmount] = useState(details?.remaining_amount || '');
  const [contact, setContact] = useState(details?.contact || '');
  const [isLoading, setIsLoading] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role === "User") {
      const taxDataApi = async () => {
        setLoading(true);
        try {
          const response = await API.get("/user/list_users_history");
          if (response.status === 200) {
            const { tax, id, head_name, members, email, remaining_amount, contact } = response.data[0];
            setTaxData(tax || []);
            setId(id || '');
            setHeadName(head_name || '');
            setMembers(members || '');
            setEmail(email || '')
            setRemainingAmount(remaining_amount || 0);
            setContact(contact || '');
          }
        } catch (error) {
          console.error("Error fetching tax data:", error);
        } finally {
          setLoading(false);
        }
      };
      taxDataApi();
    }
  }, [role]);

  const { alertContent, showAlertContent } = useAlert();

  const [yearFilter, setYearFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 + 1 }, (_, i) => 2019 + i).reverse();

  const mapTaxData = () => {
    let formattedData = [];

    taxData.forEach((tax) => {
      if (tax.feast_tax) {
        tax.feast_tax.feast_tax_history.forEach((entry) => {
          formattedData.push({
            year: parseInt(tax.feast_tax.tax_year),
            taxType: "Feast Tax",
            receiptNumber: entry.feast_tax_receipt_number,
            paidAmount: entry.feast_paid_amount,
            paymentMethod: entry.payment_mode,
            paidDate: entry.feast_tax_paid_date,
            cashierName: entry.feast_cashier_name
          });
        });
      }

      if (tax.festival_tax) {
        tax.festival_tax.festival_tax_history.forEach((entry) => {
          formattedData.push({
            year: parseInt(tax.festival_tax.tax_year),
            taxType: "Festival Tax",
            receiptNumber: entry.festival_tax_receipt_number,
            paidAmount: entry.festival_paid_amount,
            paymentMethod: entry.payment_mode,
            paidDate: entry.festival_tax_paid_date,
            cashierName: entry.festival_cashier_name
          });
        });
      }
    });

    return formattedData;
  };

  const formattedTaxData = mapTaxData();

  const filteredData = useMemo(() => 
    formattedTaxData.filter((tax) => 
      (yearFilter === "All" || tax.year.toString() === yearFilter) &&
      (typeFilter === "All" || tax.taxType === typeFilter)
    ), 
    [formattedTaxData, yearFilter, typeFilter]
  );
 
  // Function to get the determined tax based on year and tax type
  const getDeterminedTax = (taxType, year) => {
    const taxDetails = taxData.find((tax) =>
      taxType === "Feast Tax"
        ? tax.feast_tax?.tax_year === year.toString()
        : tax.festival_tax?.tax_year === year.toString()
    );

    if (taxType === "Feast Tax") {
      return taxDetails?.feast_tax?.total_feast_tax || 0;
    }
    if (taxType === "Festival Tax") {
      return taxDetails?.festival_tax?.total_festival_tax || 0;
    }
    return 0; // Default case
  };
 
  const groupByTaxType = (data) => {
    return data.reduce((acc, curr) => {
      const { taxType, year } = curr;
      if (!acc[taxType]) {
        acc[taxType] = {};
      }
      if (!acc[taxType][year]) {
        acc[taxType][year] = {
          records: [],
          determinedTax: 0,
          paidAmount: 0,
          pendingAmount: 0,
        };
      }
      acc[taxType][year].records.push(curr);
 
      // Get the determined tax for this tax type and year
      acc[taxType][year].determinedTax = getDeterminedTax(taxType, year);
      acc[taxType][year].paidAmount += curr.paidAmount;
      acc[taxType][year].pendingAmount = acc[taxType][year].determinedTax - acc[taxType][year].paidAmount;
 
      return acc;
    }, {});
  };
 
  const groupedData = groupByTaxType(filteredData);

  const sendNotification = async() => {
    try{
      const response = await API.post(`/user/send_notification?head_name=${headName}&contact=${contact}&pending_amount=${remainingAmount}`);
      if(response.status === 200){
        alertContent("Message sent successfully!", "success")
      } else {
        alertContent("Something went wrong. Tray again later.", "error")
      }
    }
    catch (error) {
      console.error("Failed to send notification:", error);
      alertContent("Failed to send notification. Please try again later.", "error");
    }    
  }

  // const handleDownload = async(tax, receipt) => {
  //   const invoice_data = {
  //     family_id: id,
  //     head_name: headName,
  //     contact: contact,
  //     email: email,
  //     receipt_number: receipt,
  //     tax_type: tax
  //   }

  //   try {
  //     const response = await API.post('/user/download_invoice', invoice_data);
  //     if(response.status === 200){
  //       alertContent("Receipt downloaded successfully!", "success");
  //     } else {
  //       alertContent("Error downloading the receipt.", "error");
  //     }
  //   }
  //   catch(error) {
  //     alertContent(error.response.data.detail, "error");
  //   }    
  // }

  const handleDownload = async (tax, receipt, index) => {
    const invoice_data = {
      family_id: id,
      head_name: headName,
      contact: contact,
      email: email,
      receipt_number: receipt,
      tax_type: tax
    };

    setIsLoading(index);
  
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
      setIsLoading(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle empty or undefined dates
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
                <h1 className="text-3xl font-bold text-gray-800">Tax History</h1>
                <p className="text-sm text-blue-500">Overview of your payments</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">Pending Amount</p>
                <p className="text-2xl font-bold text-red-600">₹{remainingAmount}</p>
                {role === 'Accountant' &&
                  <button 
                    className={`p-3 text-secondary rounded-lg shadow-lg flex items-center space-x-2 ${(remainingAmount === '' || remainingAmount <= 0) ? 'bg-gray-400' : 'hover:bg-gray-900 bg-primary'}`}
                    disabled = {remainingAmount === '' || remainingAmount <= 0}
                    onClick = {sendNotification}
                  >
                    <IoMdNotifications />
                    <span>Send Pending Notification</span>
                  </button>
                }
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
            <div className="p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800">Filter by Year</label>
                <select
                  className="mt-2 w-full rounded-lg border text-black border-gray-300 bg-gray-50 py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800">Filter by Tax</label>
                <select
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-black focus:ring-indigo-500 focus:border-indigo-500"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Feast Tax">Feast Tax</option>
                  <option value="Festival Tax">Festival Tax</option>
                </select>
              </div>
            </div>
    
            {/* Grouped Tax Records */}
            {filteredData.length === 0 ? (
              <div className="text-center py-10">
                {yearFilter === "All"? (
                  <p className="text-lg font-semibold text-gray-700">No payment has been made yet.</p>
                ):(
                  <p className="text-lg font-semibold text-gray-700">No payment has been made yet for this year.</p>
                )}
              </div>
            ):(<>
                {Object.keys(groupedData).map((taxType) => (
                  <div key={taxType}>
                    <h2 className="text-2xl font-extrabold text-gray-800 mb-4">{taxType}</h2>
                    {Object.keys(groupedData[taxType]).sort((a, b) => b - a).map((year) => {
                      const { records, determinedTax, paidAmount, pendingAmount } = groupedData[taxType][year];
                      return (
                        <div key={year}>
                          <h3 className="text-lg font-semibold text-blue-600">{year} - {taxType}</h3>
                          <div className="text-sm text-gray-500">
                            <p><span className="font-medium">Determined tax:</span> <span className="font-bold text-black">₹{determinedTax}</span></p>
                            <p><span className="font-medium">Paid Amount:</span> <span className="font-bold text-green-500">₹{paidAmount}</span></p>
                            <p><span className="font-medium">Pending Amount:</span> <span className={`${pendingAmount>0 ?'font-bold text-red-500' : ''}`}>₹{pendingAmount}</span></p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 mb-5">
                          {records.map((tax, index) => {
                            const loadingKey = `${taxType}-${year}-${index}`;
                            return (
                              <div key={index} className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-indigo-500">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-teal-600">{tax.receiptNumber}</h3>
                                    <button 
                                      onClick={() => handleDownload(taxType, tax.receiptNumber, loadingKey)} 
                                      className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-lg" 
                                      disabled={isLoading === loadingKey} 
                                    >
                                      {isLoading === loadingKey ? <DownloadSpinner /> : <RxDownload className="text-md" />}
                                    </button>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    <p><span className="font-medium">Paid Amount:</span> <span className="font-bold text-green-500">₹{tax.paidAmount}</span></p>
                                    <p><span className="font-medium">Payment Method:</span> {tax.paymentMethod}</p>
                                    <p><span className="font-medium">Paid Date:</span> {formatDate(tax.paidDate)}</p>
                                    {tax.paymentMethod !== 'Online' && <p><span className="font-medium">Cashier Name:</span> {tax.cashierName}</p>}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </>)}  
          </div>
        </>
      )}
    </div>
  );
};
 
export default PaymentHistoryPage;