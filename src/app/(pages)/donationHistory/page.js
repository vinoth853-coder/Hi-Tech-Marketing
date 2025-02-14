"use client";

import API from '@/action/axios';
import { useAlert } from '@/components/AlertContext';
import CustomAlert from '@/utils/customAlert';
import { downloadExcel } from '@/utils/downloadTableData';
import { Export } from '@/utils/export';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { IoMdArrowBack } from "react-icons/io";
import { RxDownload } from "react-icons/rx";
import Spinner from '@/utils/spinner';

const DonationHistoryPage = () => {
  const router = useRouter();
  const [donationData, setDonationData] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const [isLoading, setIsLoading] = useState([]);
  const [loading, setLoading] = useState(true);
  const donationHistory = async () => {
    setLoading(true);
    try {
      const response = await API.get("/user/list_donation_history");
      if (response.status === 200) {
        setTotalAmount(response.data?.total_amt);
        setDonationData(response.data?.donation);
      }
    } catch (error) {
      console.error("Error fetching tax data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    donationHistory();
  }, []);

  const { alertContent, showAlertContent } = useAlert();

  const [yearFilter, setYearFilter] = useState("All");
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2024 + 1 }, (_, i) => 2024 + i).reverse();
  const [searchQuery, setSearchQuery] = useState("");

  const getYear = (dateString) => {
    if (!dateString) return "N/A"; 
    const [year] = dateString.split("-");
    return `${year}`;
  };

  const filteredData = useMemo(() => {
    return donationData.filter((item) => {
      const matchesSearch = searchQuery
        ? item.head_name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesYear = yearFilter === "All" || getYear(item.paid_at) === yearFilter;

      return matchesSearch && matchesYear;
    });
  }, [donationData, searchQuery, yearFilter]);

  const handleDownload = async (tax, receipt, row, rowIndex) => {
    const invoice_data = {
      family_id: row.family_id,
      head_name: row.head_name,
      contact: row.contact,
      email: row.email,
      receipt_number: receipt,
      tax_type: tax
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
    if (!dateString) return "N/A"; // Handle empty or undefined dates
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const DownloadSpinner = () => (
    <div className="flex items-center justify-center">
      <div className={`w-4 h-4 border-2 border-black border-solid rounded-full border-t-transparent animate-spin`}></div>
    </div>
  );

  const columns = [
    {
      name: "Receipt No.",
      selector: (row) => row.receipt_number,
      sortable: true,
    },
    {
      name: "Family ID",
      selector: (row) => row.family_id,
      sortable: true,
    },
    {
      name: "Head Name",
      selector: (row) => row.head_name,
      sortable: true,
    },
    {
      name: "Contact No.",
      selector: (row) => row.contact,
      sortable: true,
    },
    {
      name: "Amount Paid",
      selector: (row) => `₹${row.amount}`,
      sortable: true,
    },
    {
      name: "Payment Mode",
      selector: (row) => row.payment_mode,
      sortable: true,
    },
    {
      name: "Paid At",
      selector: (row) => formatDate(row.paid_at),
      sortable: true,
      center: 'true',
    },
    {
      name: "Download",
      sortable: false,
      cell: (row, rowIndex) => (
        <button
          onClick={() => handleDownload("Donation", row.receipt_number, row, rowIndex)}
          className="text-black px-2 py-1 rounded-lg"
          disabled={isLoading[rowIndex]} 
        >
          {isLoading[rowIndex] ? <DownloadSpinner /> : <RxDownload className="text-md" />}
        </button>
      ),
      center: 'true',
    },
    ,    
  ];

  return (
    <div className="px-4 py-4 sm:px-6 md:px-8 relative min-h-screen">
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="10" color="blue-500" />
      </div>
      ) : (
        <>
          {showAlertContent && <CustomAlert message={showAlertContent.message} type={showAlertContent.type}/>}
          <button
            className='absolute top-5 flex items-center gap-2 p-3 bg-primary text-secondary rounded-full hover:bg-gray-900 shadow-lg transition-all'
            onClick={() => router.back()}
          >
            <IoMdArrowBack className="text-lg" />
          </button>
          <div className="flex justify-center items-center py-12">
            <h1 className="text-4xl font-bold mt-[-35px] text-primary drop-shadow-md">Donation History</h1>
          </div>
          <div className="mb-4 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by Name..."
              className="border rounded p-2 w-64 text-black border-gray-700 focus:border-gray-900"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                if (value && value[0] === ' ') {
                  return;
                }
                if (/^[A-Za-z]*$/.test(value)) {
                  setSearchQuery(value);
                }
              }}
            />
          </div>
    
          {/* Filters */}
          <div className='flex justify-between'>
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
            <Export onExport={() => {
              if (filteredData.length !== 0) {
                downloadExcel(filteredData, yearFilter, "Donation", 2);
              } else {
                alertContent("No data available to export.", "error");
              }
            }} />
          </div>
          <div>
            <h2 className='text-lg font-semibold text-primary'>Total Donation Amount: <span className='text-green-500'>₹{totalAmount}</span></h2>
          </div>
          </div>
    
          {/* Grouped Tax Records */}
          {filteredData.length === 0 ? (
            <div className="text-center py-10">
              {yearFilter === "All"? (
                <p className="text-lg font-semibold text-gray-700">No donation records found.</p>
              ):(
                <p className="text-lg font-semibold text-gray-700">No donations have been made for this year.</p>
              )}
            </div>
          ):(
            <>
              <div className='rounded-lg bg-secondary'>
                <DataTable
                  columns={columns}
                  className='custom-scrollbar pb-[100px]'
                  data={filteredData}
                  customStyles={{
                    headCells: { style: { backgroundColor: 'rgb(31 41 55)', color: 'white', fontSize: '16px', fontWeight: 'bold', whiteSpace: 'normal',
                      wordBreak: 'break-word', } },
                    cells: { style: { fontSize: '17px' } },
                  }}
                  fixedHeader
                  fixedHeaderScrollHeight='calc(100vh - 200px)'
                  persistTableHead
                  pagination
                />
              </div>            
            </>
          )}  
        </>
      )}
    </div>
  );
};

export default DonationHistoryPage;