import API from '@/action/axios';
import CustomAlert from '@/utils/customAlert';
import React, { useState } from 'react';
import { useAlert } from "@/components/AlertContext";
import { AiOutlineClose } from "react-icons/ai";

function DeactivateUser({ details, onClose, onDeactivate }) {
  const { alertContent, showAlertContent } = useAlert();
  const [reason, setReason] = useState('');

  const handleAction = async (isDeactivation) => {
    if (reason.trim() === '') {
      alertContent("Please provide a reason for the action.", "error");
      return;
    }
    const endpoint = isDeactivation
      ? `/admin/deactivate_admin/${details.id}`
      : `/admin/reactivate_admin/${details.id}`;
    const successMessage = isDeactivation
      ? 'User successfully deactivated!'
      : 'User successfully reactivated!';
    const errorMessage = isDeactivation
      ? "Error! Couldn't deactivate the user."
      : "Error! Couldn't reactivate the user.";

    try {
      const response = await API.put(endpoint, { reason });
      if (response.status === 200) {
        onDeactivate(details.id, reason);
        alertContent(successMessage, 'success');
        onClose();
      } else {
        alertContent(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      alertContent('An error occurred. Please try again later.', "error");
    }
  };

  return (
    <div className="relative px-10 bg-secondary rounded-lg">
      {showAlertContent && showAlertContent.message && (
        <CustomAlert message={showAlertContent.message} type={showAlertContent.type} />
      )}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-primary hover:text-primary p-2 rounded-full"
        aria-label="Close"
      >
        <AiOutlineClose className="w-6 h-6" />
      </button>
      <h2 className="text-2xl font-semibold py-6 text-center text-primary sticky top-0 bg-secondary z-10">
        {details.is_active ? 'Deactivate' : 'Reactivate'} User
      </h2>
      <div className="flex justify-between bg-primary rounded-lg p-4 shadow-sm mb-6">
        <div className="flex flex-col">
          <span className="font-bold text-secondary">Family ID: {details.id}</span>
          <span className="font-bold text-secondary">Family Head Name: {details.name}</span>
        </div>
      </div>

      {/* Reason for action */}
      <div className="mb-4">
        <label
          htmlFor="actionReason"
          className="block text-primary mb-1 font-semibold"
        >
          Reason for {details.is_active ? 'Deactivation' : 'Reactivation'}:
        </label>
        <textarea
          id="actionReason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows="4"
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="flex justify-between mt-6 pb-10">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-red-600 text-secondary rounded-md hover:bg-red-800"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => handleAction(details.is_active)}
          className="px-4 py-2 bg-primary text-secondary rounded-md hover:bg-gray-900"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default DeactivateUser;
