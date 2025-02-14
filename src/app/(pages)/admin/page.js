"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MdPersonAdd, MdEdit } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import API from '@/action/axios';
import CustomAlert from '@/utils/customAlert';
import DataTable from 'react-data-table-component';
import { useAlert } from '@/components/AlertContext';
import Spinner from '@/utils/spinner';
import AddUserPage from './addUser';
import ViewEditUserPage from './viewEditUser';
import DeactivateUser from './deactivateUser';

const Admin = () => {
  const selectedFilter = "All";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showViewEditUserModal, setShowViewEditUserModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [details, setDetails] = useState([]); 
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false);

  const listUsers = async () => {
    setIsLoading(true); 
    try {
      const response = await API.get('/admin/list_admin');
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
  
  useEffect(() => {
    listUsers();
  }, []);

  const getFilteredDetails = () => {
    const filteredByStatus = selectedFilter === "All" ? details : details.filter(user => user.is_active === selectedFilter);
    const filteredBySearchQuery = filteredByStatus.filter(user => user.id.toLowerCase().includes(searchQuery.toLowerCase()));

    return filteredBySearchQuery;
  };

  const openAddUserModal = (user) => {
    setSelectedUser(user);
    setShowAddUserModal(true);
  };

  const submitAddUserModal = () => {
    setShowAddUserModal(false);
    setSelectedUser(null);
    listUsers();
  };

  const openViewEditUserModal = (user) => {
    setSelectedUser(user);
    setShowViewEditUserModal(true);
  };

  const submitViewEditUserModal = () => {
    setShowViewEditUserModal(false);
    setSelectedUser(null);
    listUsers();
  };

  const openDeactivateModal = (user) => {
    setSelectedUser(user);
    setShowDeactivateModal(true);
  };

  const closeDeactivateModal = () => {
    setShowDeactivateModal(false);
    setSelectedUser(null);
  };

  const handleDeactivate = (id, reason) => {
    setDetails((prev) => {
      return prev.map((user) =>
        user.id === id
          ? { ...user, status: 'Inactive', deactivationReason: reason }
          : user
      );
    });
    listUsers();
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowAddUserModal(false);
    setShowViewEditUserModal(false);
  }

  useEffect(() => {
    if (selectedUser) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedUser]);
  
  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="relative text-sm">
          <button
            className="p-2 rounded-full hover:bg-gray-100 text-lg"
            onClick={() => openViewEditUserModal(row)}
            aria-label="More actions"
          >
            <MdEdit className="text-xl mr-2 text-black" />
          </button>
        </div>
      ),
      center: "true",
      width: '100px'
    },
    {
      name: "User ID",
      selector: (row) => row.id,
      sortable: true,
      width: '130px'
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Contact Number",
      selector: (row) => row.contact,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      width: '150px'
    },
    {
      name: "Status",
      selector: (row) => (row.is_active ? "Active" : "Inactive"),
      sortable: true,
      center: 'true',
      cell: (row) => (
        <div className={`px-4 py-2 ${row.is_active ? 'text-green-500' : 'text-red-500'}`}>
          <button
            onClick={() => openDeactivateModal(row)}
            className="flex items-center text-sm text-black hover:text-red-500"
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
          <div className="flex justify-center items-center py-12">
            <h1 className="text-4xl font-bold mt-[-35px] text-primary drop-shadow-md">Users Management</h1>
          </div>

          {/* Add User Button */}
          <button
            className="absolute top-6 right-6 p-3 bg-primary text-secondary rounded-lg shadow-lg hover:bg-gray-900 flex items-center space-x-2"
            onClick={openAddUserModal}
          >
            <MdPersonAdd className="text-2xl" />
            <span>Add User</span>
          </button>

          {/* Search Bar */}
          <div className="mb-4 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by User ID.."
              className="border rounded p-2 w-64 text-black border-gray-700 focus:border-gray-900"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                if (value && value[0] === ' ') {
                  return;
                }
                setSearchQuery(value); 
              }}
            />
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

          {/* View/Edit User Modal */}
          {showViewEditUserModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-secondary rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-[600px] custom-scrollbar overflow-y-auto">
                <ViewEditUserPage 
                  details = {selectedUser} 
                  onSubmit = {submitViewEditUserModal}
                  onClose={closeModal} 
                />
              </div>
            </div>
          )}

          {/* Add User Modal */}
          {showAddUserModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-secondary rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-[500px] custom-scrollbar overflow-y-auto">
                <AddUserPage 
                  details = {selectedUser} 
                  onSubmit = {submitAddUserModal}
                  onClose={closeModal} 
                />
              </div>
            </div>
          )}

          {/* Deactive User */}
          {showDeactivateModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-secondary rounded-lg p-2 w-1/4">
                <DeactivateUser 
                  details = {selectedUser} 
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

export default Admin;