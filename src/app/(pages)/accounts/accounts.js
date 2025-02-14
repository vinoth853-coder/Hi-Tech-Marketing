"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MdPersonAdd, MdEditDocument, MdOutlineDriveFolderUpload } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ViewEditFamily from '../accounts/viewEditFamily';
import UpdateYearlyTax from './updateYearlyTax';
import DeactivateUser from './deactivateUser';
import { useRouter } from 'next/navigation';
import API from '@/action/axios';
import CustomAlert from '@/utils/customAlert';
import DataTable from 'react-data-table-component';
import { useAlert } from '@/components/AlertContext';
import DirectPayment from './directPayment';
import { Export } from '@/utils/export';
import { downloadExcel } from '@/utils/downloadTableData';
import PaymentHistoryPage from '../taxDetails/taxDetails';
import Spinner from '@/utils/spinner';
import { BiRupee } from 'react-icons/bi';


const listUsers = async (setDetails, alertContent, router, setIsLoading) => {
  setIsLoading(true); 
  try {
    const response = await API.get('/user/list_users_history');
    if (response.status === 200) {
      setDetails(response.data);      
    } else {
      alertContent(`Unexpected response status: ${response.status}`, "error");
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403) {
        router.push("/");
      } else if (error.response.status === 500) {
        alertContent("Server Error: Please try again later.", "error");
      } else if (error.response.status === 400) {
        setDetails([]); 
      } else {
        alertContent(`Error: ${error.response.status}`, "error");
      }
    } else {
      alertContent("An unexpected error occurred. Please try again.", "error");
    }
  } finally {
    setIsLoading(false); 
  }
};

const Accounts = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showActions, setShowActions] = useState(false);
  const [actionFamilyId, setActionFamilyId] = useState(null);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTaxType, setSelectedTaxType] = useState('');
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [showViewEditFamilyModal, setShowViewEditFamilyModal] = useState(false);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [showUpdateYearlyTaxModal, setShowUpdateYearlyTaxModal] = useState(false);
  const [showDirectPaymentModal, setShowDirectPaymentModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [details, setDetails] = useState([]); 
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    listUsers(setDetails, alertContent, router, setIsLoading);
  }, []);

  const actionMenuRef = useRef(null);

  const getFilteredDetails = () => {
    const filteredByStatus = selectedFilter === "All" ? details : details.filter(family => family.is_active === selectedFilter);
    const filteredBySearchQuery = filteredByStatus.filter(family => family.id.toLowerCase().includes(searchQuery.toLowerCase()));

    const filteredByYear = filteredBySearchQuery.filter(family => {
      if (selectedYear) {
        const hasFeastTaxForYear = family.tax.some(t => t.feast_tax?.tax_year === String(selectedYear));
        const hasFestivalTaxForYear = family.tax.some(t => t.festival_tax?.tax_year === String(selectedYear));
        return hasFeastTaxForYear || hasFestivalTaxForYear;
      }
      return true; // No year selected, include all details
    });

    return filteredByYear;
  };

  const toggleActions = (id) => {
    setShowActions(actionFamilyId === id ? !showActions : true);
    setActionFamilyId(id);
  };

  const handleClickOutside = (event) => {
    if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
      setShowActions(false);
    }
  };

  const years = Array.from({ length: currentYear - 2019 + 1 }, (_, i) => 2019 + i);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openAddFamilyModal = () => {
    router.push('/accounts/addFamily')
  }

  const openUpdateYearlyTaxModal = () => {
    setShowUpdateYearlyTaxModal(true);
  };

  const submitUpdateYearlyTaxModal = () => {
    setShowUpdateYearlyTaxModal(false);
    listUsers(setDetails, alertContent, router, setIsLoading);
  };

  const openDirectPaymentModal = (family) => {
    setShowActions(false)
    setSelectedFamily(family);
    setShowDirectPaymentModal(true);
  };

  const submitDirectPaymentModal = () => {
    setShowDirectPaymentModal(false);
    setSelectedFamily(null);
    listUsers(setDetails, alertContent, router, setIsLoading);
  };

  const openViewEditFamilyModal = (family) => {
    setShowActions(false)
    setSelectedFamily(family);
    setShowViewEditFamilyModal(true);
  };

  const submitViewEditFamilyModal = () => {
    setShowViewEditFamilyModal(false);
    setSelectedFamily(null);
    listUsers(setDetails, alertContent, router, setIsLoading);
  };

  const openPaymentHistoryModal = (family) => {
    setShowActions(false)
    setSelectedFamily(family);
    setShowPaymentHistoryModal(true);
  };

  const closePaymentHistoryModal = () => {
    setShowPaymentHistoryModal(false);
    setSelectedFamily(null);
  };

  const openDeactivateModal = (family) => {
    setSelectedFamily(family);
    setShowDeactivateModal(true);
  };

  const closeDeactivateModal = () => {
    setShowDeactivateModal(false);
    setSelectedFamily(null);
  };

  const handleDeactivate = (familyId, reason) => {
    setDetails((prevFamilies) => {
      return prevFamilies.map((family) =>
        family.id === familyId
          ? { ...family, status: 'Inactive', deactivationReason: reason }
          : family
      );
    });
    listUsers(setDetails, alertContent, router, setIsLoading);
  };

  const closeModal = () => {
    setSelectedFamily(null);
    setShowUpdateYearlyTaxModal(false);
    setShowDirectPaymentModal(false);
    setShowViewEditFamilyModal(false);
  }

  useEffect(() => {
    if (selectedFamily || showDeactivateModal || showUpdateYearlyTaxModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedFamily, showDirectPaymentModal, showUpdateYearlyTaxModal,]);
  
  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="relative text-sm">
          <button
            className="p-2 rounded-full hover:bg-gray-100 text-lg"
            onClick={() => toggleActions(row.id)}
            aria-label="More actions"
          >
            &#8942;
          </button>
  
          {showActions && actionFamilyId === row.id && (
            <div
              ref={actionMenuRef}
              className={`absolute w-[200px] left-7 top-[15px] z-[9999] flex flex-col bg-secondary shadow-lg rounded-lg fade-in border border-gray-200`}
            >
              {/* Direct Payment */}
              <button
                onClick={() => openDirectPaymentModal(row)}
                className="flex items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-100 border-b border-gray-200"
              >
                <MdOutlineDriveFolderUpload className="text-xl mr-2 text-black" />
                <span className="text-black">Direct Payment</span>
              </button>
  
              {/* View/Edit Details */}
              <button
                onClick={() => openViewEditFamilyModal(row)}
                className="flex items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-100 border-b border-gray-200"
              >
                <MdEditDocument className="text-xl mr-2 text-black" />
                <span className="text-black">View/Edit Details</span>
              </button>
  
              {/* Payment History */}
              <button
                onClick={() => openPaymentHistoryModal(row)}
                className="flex items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                <GrView className="text-xl mr-2 text-black" />
                <span className="text-black">Payment History</span>
              </button>
            </div>
          )}
        </div>
      ),
      center: "true",
      width: '100px'
    },
    {
      name: "Family ID",
      selector: (row) => row.id,
      sortable: true,
      minWidth: '130px'
    },
    {
      name: "Head Name",
      selector: (row) => row.head_name,
      sortable: true,
      minWidth: '140px'
    },
    ...(selectedTaxType === "Both Tax"
      ? [  
          {
            name: "Determined Feast Tax",
            selector: (row) =>
              `₹${row.tax.find((t) => t.feast_tax.tax_year === String(selectedYear))?.feast_tax.total_feast_tax.toFixed(2) || 0}`,
            sortable: true,
            minWidth: '220px'
          },
          {
            name: "Pending Feast Tax",
            selector: (row) =>
              `₹${row.tax.find((t) => t.feast_tax.tax_year === String(selectedYear))?.feast_tax.feast_pending_amount?.toFixed(2) || 0}`,
            sortable: true,
            minWidth: '200px',
            cell: row => (
              <span style={{ color: row.tax.find((t) => t.feast_tax.tax_year === String(selectedYear))?.feast_tax.feast_pending_amount > 0 ? 'red' : 'inherit' }}>
                ₹{row.tax.find((t) => t.feast_tax.tax_year === String(selectedYear))?.feast_tax.feast_pending_amount?.toFixed(2) || 0}
              </span>
            ),
          }, 
          {
            name: "Determined Festival Tax",
            selector: (row) =>
              `₹${row.tax.find((t) => t.festival_tax.tax_year === String(selectedYear))?.festival_tax.total_festival_tax?.toFixed(2) || 0}`,
            sortable: true,
            minWidth: '235px'
          },
          {
            name: "Pending Festival Tax",
            selector: (row) =>
              `₹${row.tax.find((t) => t.festival_tax.tax_year === String(selectedYear))?.festival_tax.festival_pending_amount?.toFixed(2) || 0}`,
            sortable: true,
            minWidth: '210px',
            cell: row => (
              <span style={{ color: row.tax.find((t) => t.festival_tax.tax_year === String(selectedYear))?.festival_tax.festival_pending_amount > 0 ? 'red' : 'inherit' }}>
                ₹{row.tax.find((t) => t.festival_tax.tax_year === String(selectedYear))?.festival_tax.festival_pending_amount?.toFixed(2) || 0}
              </span>
            ),
          },
        ]
      : selectedTaxType === "Festival Tax"
      ? [
          { 
            name: "Festival Tax Count",
            selector: (row) => `${row.tax.find((t) => t.festival_tax.tax_year === String(selectedYear))?.festival_tax.total_tax_count || 0}`,
            sortable: true,
            minWidth: '130px'
          },  
          {
            name: "Determined Festival Tax",
            selector: (row) =>
              `₹${row.tax.find((t) => t.festival_tax.tax_year === String(selectedYear))?.festival_tax.total_festival_tax?.toFixed(2) || 0}`,
            sortable: true,
            minWidth: '235px'
          },
          {
            name: "Pending Festival Tax",
            selector: (row) =>
              `₹${row.tax.find((t) => t.festival_tax.tax_year === String(selectedYear))?.festival_tax.festival_pending_amount?.toFixed(2) || 0}`,
            sortable: true,
            minWidth: '210px',
            cell: row => (
              <span style={{ color: row.tax.find((t) => t.festival_tax.tax_year === String(selectedYear))?.festival_tax.festival_pending_amount > 0 ? 'red' : 'inherit' }}>
                ₹{row.tax.find((t) => t.festival_tax.tax_year === String(selectedYear))?.festival_tax.festival_pending_amount?.toFixed(2) || 0}
              </span>
            ),
          },
        ]
      : selectedTaxType === "Feast Tax"
      ? [
          { 
            name: "Feast Tax Count",
            selector: (row) => `${row.tax.find((t) => t.feast_tax.tax_year === String(selectedYear))?.feast_tax.total_tax_count || 0}`,
            sortable: true,
            minWidth: '130px'
          },  
          {
            name: "Determined Feast Tax",
            selector: (row) =>
              `₹${row.tax.find((t) => t.feast_tax.tax_year === String(selectedYear))?.feast_tax.total_feast_tax.toFixed(2) || 0}`,
            sortable: true,
            minWidth: '220px'
          },
          {
            name: "Pending Feast Tax",
            selector: (row) =>
              `₹${row.tax.find((t) => t.feast_tax.tax_year === String(selectedYear))?.feast_tax.feast_pending_amount?.toFixed(2) || 0}`,
            sortable: true,
            minWidth: '200px',
            cell: row => (
              <span style={{ color: row.tax.find((t) => t.feast_tax.tax_year === String(selectedYear))?.feast_tax.feast_pending_amount > 0 ? 'red' : 'inherit' }}>
                ₹{row.tax.find((t) => t.feast_tax.tax_year === String(selectedYear))?.feast_tax.feast_pending_amount?.toFixed(2) || 0}
              </span>
            ),
          },
        ]
      : [
        ...(selectedYear
          ? [
              {
                name: `Pending Amount (${selectedYear})`,
                selector: (row) => {
                  const tax = row.tax.find((t) => t.feast_tax.tax_year === String(selectedYear) || t.festival_tax.tax_year === String(selectedYear));
                  return `₹${tax ? tax.remaining_amount : 0}`;
                },
                sortable: true,
                minWidth: '200px',
                cell: (row) => {
                  const tax = row.tax.find((t) => t.feast_tax.tax_year === String(selectedYear) || t.festival_tax.tax_year === String(selectedYear));
                  return (
                    <span style={{ color: tax && tax.remaining_amount > 0 ? 'red' : 'inherit' }}>
                      ₹{tax ? tax.remaining_amount : 0}
                    </span>
                  );
                }
              },
            ]
          : [
              {
                name: "Overall Pendings",
                selector: (row) => row.remaining_amount,
                sortable: true,
                minWidth: '150px',
                cell: (row) => (
                  <span style={{ color: row.remaining_amount > 0 ? 'red' : 'inherit' }}>
                    ₹{row.remaining_amount}
                  </span>
                ),
              },
            ]),
        {
          name: "Contact Number",
          selector: (row) => row.contact,
          sortable: true,
          minWidth: '180px'
        },
      ]),   
    {
      name: "Status",
      selector: (row) => (row.is_active ? "Active" : "Inactive"),
      sortable: true,
      center: 'true',
      width: '140px',
      cell: (row) => (
        <div className={`px-4 py-2 ${row.is_active ? 'text-green-500' : 'text-red-500'}`}>
          <button
            onClick={() => openDeactivateModal(row)}
            className="flex items-center text-sm text-black hover:text-red-500"
            disabled={!row.is_active} // Disable button if is_active is false
          >
            {row.is_active ? (
              <>
                <FaCheckCircle className="mr-2 text-green-500" /> Active
              </>
            ) : (
              <>
                <FaTimesCircle className="mr-2 text-red-500" /> Inactive
              </>
            )}
          </button>
        </div>
      ),
    },
  ];
  
  const { alertContent, showAlertContent } = useAlert();

  return (
    <div className="relative min-h-screen p-6">
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="10" color="blue-500" />
      </div>
      ) : (
        <>
          {showAlertContent && <CustomAlert message={showAlertContent.message} type={showAlertContent.type}/>}
          <h2 className="text-2xl text-primary font-bold mb-4">Families List</h2>

          <button
            className="absolute top-6 right-48 p-3 bg-primary text-secondary rounded-lg shadow-lg hover:bg-gray-900 flex items-center space-x-2"
            onClick={() => router.push('/donationHistory')}
          >
            <BiRupee className="text-2xl" />
            <span>Donations</span>
          </button>

          {/* Add Family Button */}
          <button
            className="absolute top-6 right-6 p-3 bg-primary text-secondary rounded-lg shadow-lg hover:bg-gray-900 flex items-center space-x-2"
            onClick={openAddFamilyModal}
          >
            <MdPersonAdd className="text-2xl" />
            <span>Add Family</span>
          </button>

          {/* Search Bar */}
          <div className="mb-4 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by Family ID.."
              className="border rounded p-2 w-64 text-black border-gray-700 focus:border-gray-900"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                if (value && value[0] === ' ') {
                  return;
                }
                if (/^\d*$/.test(value)) { 
                  setSearchQuery(value);
                }
              }}
            />
            <button
              className="absolute top-[125px] right-6 p-3 bg-primary text-secondary rounded-lg shadow-lg hover:bg-gray-900 flex items-center space-x-2"
              onClick={openUpdateYearlyTaxModal}
            >
              <span>Update yearly tax</span>
            </button>
          </div>

          {/* Drop downs*/}
          <div className='mb-4 flex items-center space-x-4'>
            <div>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value); 
                  setSelectedTaxType(''); 
                }}
                className="block w-[150px] p-2 border border-gray-700 text-black rounded-md shadow-sm focus:outline-gray-900"
              >
                <option value="">All</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                id="taxType"
                value={selectedTaxType}
                onChange={(e) => setSelectedTaxType(e.target.value)}
                className="block w-[150px] p-2 border border-gray-700 text-black rounded-md shadow-sm focus:border-gray-900" disabled={!selectedYear}
              >
                <option value="">Tax Type</option>
                <option value="Festival Tax">Festival Tax</option>
                <option value="Feast Tax">Feast Tax</option>
                <option value="Both Tax">Both Tax</option>
              </select>
            </div>
            <Export onExport={() => downloadExcel(getFilteredDetails(), selectedYear, selectedTaxType, 1)} />
          </div>

          <div className='rounded-lg bg-secondary'>
            <DataTable
              columns={columns}
              className='custom-scrollbar pb-[100px]'
              data={getFilteredDetails()}
              customStyles={{
                headCells: { style: { backgroundColor: 'rgb(31 41 55)', color: 'white', fontSize: '16px', fontWeight: 'bold', whiteSpace: 'normal', // Allows text wrapping
                  wordBreak: 'break-word', } },
                cells: { style: { fontSize: '17px' } },
              }}
              fixedHeader
              fixedHeaderScrollHeight='calc(100vh - 200px)'
              persistTableHead
              pagination
            />
          </div>

          {/* update Yearly Tax Modal */}
          {showUpdateYearlyTaxModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-secondary rounded-lg p-2 w-1/4">
                <UpdateYearlyTax 
                  onSubmit={submitUpdateYearlyTaxModal}
                  onClose={closeModal} 
                />
              </div>
            </div>
          )}

          {/* Direct Payment Modal */}
          {showDirectPaymentModal && selectedFamily && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-secondary rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-[650px] custom-scrollbar overflow-y-auto">
                <DirectPayment
                  details = {selectedFamily} 
                  onSubmit={submitDirectPaymentModal}
                  onClose={closeModal} 
                />
              </div>
            </div>
          )}

          {/* View/Edit Family Modal */}
          {showViewEditFamilyModal && selectedFamily && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-secondary rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-[674px] custom-scrollbar overflow-y-auto">
                <ViewEditFamily 
                  details = {selectedFamily} 
                  onSubmit = {submitViewEditFamilyModal}
                  onClose={closeModal} 
                />
              </div>
            </div>
          )}

          {/* Payment history Modal */}
          {showPaymentHistoryModal && selectedFamily && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-secondary rounded-lg p-2 w-3/4 h-[90vh] custom-scrollbar overflow-y-auto">
                <PaymentHistoryPage
                  details = {selectedFamily} 
                  onClose={closePaymentHistoryModal}
                />
              </div>
            </div>
          )}

          {/* Deactive User */}
          {showDeactivateModal && selectedFamily && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-secondary rounded-lg p-2 w-1/4">
                <DeactivateUser 
                  details = {selectedFamily} 
                  onClose={closeDeactivateModal} 
                  onDeactivate={handleDeactivate}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Accounts;