"use client";

import API from "@/action/axios";
import { useAlert } from "@/components/AlertContext";
import CustomAlert from "@/utils/customAlert";
import Spinner from "@/utils/spinner";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";

export default function UpdateWeeklyMass() {
  const router = useRouter();
  const { alertContent, showAlertContent } = useAlert();

  const [selectedMrngMassTypes, setSelectedMrngMassTypes] = useState({});
  const [selectedEveMassTypes, setSelectedEveMassTypes] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [massSchedule, setMassSchedule] = useState({
    mass_details: [
      { mass_days: "Sunday", morning_mass: {}, evening_mass: {} },
      { mass_days: "Monday", morning_mass: {}, evening_mass: {} },
      { mass_days: "Tuesday", morning_mass: {}, evening_mass: {} },
      { mass_days: "Wednesday", morning_mass: {}, evening_mass: {} },
      { mass_days: "Thursday", morning_mass: {}, evening_mass: {} },
      { mass_days: "Friday", morning_mass: {}, evening_mass: {} },
      { mass_days: "Saturday", morning_mass: {}, evening_mass: {} },
    ],
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (dayIndex, session, field, value) => {
    setMassSchedule((prev) => {
      const updatedDetails = [...prev.mass_details];
      updatedDetails[dayIndex] = {
        ...updatedDetails[dayIndex],
        [session]: {
          ...updatedDetails[dayIndex][session],
          [field]: value,
        },
      };
      return { mass_details: updatedDetails };
    });

    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      const errorKey = `${session}_${field}_${dayIndex}`;
      delete newErrors[errorKey]; // Remove the specific error for the field
      return newErrors;
    });
  
    if (session === "morning_mass") {
      setSelectedMrngMassTypes((prev) => ({
        ...prev,
        [dayIndex]: value,
      }));
    } else if (session === "evening_mass") {
      setSelectedEveMassTypes((prev) => ({
        ...prev,
        [dayIndex]: value,
      }));
    }
  };  

  const listmassDetails = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/mass/list_mass_days");
      if (response.status === 200) {
        setMassSchedule({ mass_details: response.data.length ? response.data : massSchedule.mass_details });
      }
    } catch (error) {
      setMassSchedule({ mass_details: massSchedule.mass_details });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    listmassDetails();
  }, []);

  const validateFields = () => {
    let errors = {};
    massSchedule.mass_details.forEach((day, index) => {
      // Morning Mass Validation
      if (!day.morning_mass.mass) {
        errors[`morning_mass_mass_${index}`] = "Morning Mass type is required.";
      } 
      
      if(selectedMrngMassTypes[index] !== "No Mass" && day.morning_mass.mass !== "No Mass") {
        if (!day.morning_mass.time) {
          errors[`morning_mass_time_${index}`] = "Time is required.";
        }
        if (!day.morning_mass.location) {
          errors[`morning_mass_location_${index}`] = "Location is required.";
        }
        if (!day.morning_mass.organizers) {
          errors[`morning_mass_organizers_${index}`] = "Organizers is required.";
        }
        if (!day.morning_mass.chief_celebrant) {
          errors[`morning_mass_chief_celebrant_${index}`] = "Chief Celebrant is required.";
        }
        if (!day.morning_mass.oratory) {
          errors[`morning_mass_oratory_${index}`] = "Oratory is required.";
        }
        if (!day.morning_mass.mass_proposal) {
          errors[`morning_mass_mass_proposal_${index}`] = "Mass Proposal type is required.";
        }
      }
      // Evening Mass Validation
      if (!day.evening_mass.mass) {
        errors[`evening_mass_mass_${index}`] = "Evening Mass type is required.";
      }
      if (selectedEveMassTypes[index] !== "No Mass" && day.evening_mass.mass !== "No Mass") {
        if (!day.evening_mass.time) {
          errors[`evening_mass_time_${index}`] = "Time is required.";
        }
        if (!day.evening_mass.location) {
          errors[`evening_mass_location_${index}`] = "Location is required.";
        }
        if (!day.evening_mass.organizers) {
          errors[`evening_mass_organizers_${index}`] = "Organizers is required.";
        }
        if (!day.evening_mass.chief_celebrant) {
          errors[`evening_mass_chief_celebrant_${index}`] = "Chief Celebrant is required.";
        }
        if (!day.evening_mass.oratory) {
          errors[`evening_mass_oratory_${index}`] = "Oratory is required.";
        }
        if (!day.evening_mass.mass_proposal) {
          errors[`evening_mass_mass_proposal_${index}`] = "Mass Proposal type is required.";
        }
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      alertContent("Kindly fill all the fields", "error")
      return; 
    }
    try {
      const response = await API.put("/mass/update_mass_days", massSchedule);
      if (response.status === 200) {
        alertContent("Weekly Mass Schedule Updated Successfully!", "success");
        router.push("/mass");
      }
    } catch (error) {
      // Handle submission errors here
    }
  };

  const handleCancel = () => {
    router.push("/mass");
  };

  const commonInputClass = "w-full border border-gray-700 text-black focus:ring-none focus:ring-gray-800 rounded-lg px-4 py-2";

  return (
    <div className="min-h-screen py-10 px-5">
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="10" color="blue-500" />
      </div>
      ) : (
        <>
          {showAlertContent && (
            <CustomAlert
              message={showAlertContent.message}
              type={showAlertContent.type}
            />
          )}
          <div className="flex justify-start items-center mb-6">
            <button
              onClick={() => router.back()}
              className="absolute top-5 flex items-center gap-2 p-3 bg-primary text-secondary rounded-full hover:bg-gray-900 shadow-lg transition-all"
            >
              <IoMdArrowBack className="text-lg" />
            </button>
          </div>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
              Update Weekly Mass Schedule
            </h1>

            {massSchedule.mass_details.map((day, index) => (
              <div
                key={day.mass_days}
                className="bg-white p-6 mb-6 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-bold text-gray-700 mb-4">
                  {day.mass_days}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-blue-700 mb-3">
                      Morning Schedule
                    </h3>
                    <div className="mt-3">
                      <label className="text-black">Type of Mass</label>
                    </div>
                    <select
                      value={day.morning_mass.mass || ""}
                      onChange={(e) =>
                        handleInputChange(index, "morning_mass", "mass", e.target.value)
                      }
                      className={`${commonInputClass} ${formErrors[`morning_mass_mass_${index}`] ? 'border-red-500' : ''}`}
                    >
                      <option value="" disabled>
                        Select Type of Mass
                      </option>
                      <option value="No Mass">No Mass</option>
                      <option value="Regular Mass">Regular Mass</option>
                      <option value="Sunday Mass">Sunday Mass</option>
                      <option value="Holy Adoration">Holy Adoration</option>
                      <option value="Holy Mass">Holy Mass</option>
                      <option value="Rosary Prayer">Rosary Prayer</option>
                      <option value="First Saturday Holy Adoration & Mass">First Saturday Holy Adoration & Mass</option>
                    </select>
                    {formErrors[`morning_mass_mass_${index}`] && (
                      <p className="text-red-500 text-sm">{formErrors[`morning_mass_mass_${index}`]}</p>
                    )}
                    <div className="mt-3">
                      <label className="text-black">Time</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Time (e.g., 7:00 AM)"
                      value={selectedMrngMassTypes[index] === "No Mass" ? day.morning_mass.time = "" : day.morning_mass.time || ""}
                      disabled={selectedMrngMassTypes[index] === "No Mass" || day.morning_mass.mass === "No Mass"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && value[0] === ' ') {
                          return;
                        }
                        handleInputChange(index, "morning_mass", "time", e.target.value)
                      }}
                      className={`${commonInputClass} ${formErrors[`morning_mass_time_${index}`] ? 'border-red-500' : ''}`}
                    />
                    {formErrors[`morning_mass_time_${index}`] && (
                      <p className="text-red-500 text-sm">{formErrors[`morning_mass_time_${index}`]}</p>
                    )}
                    <div className="mt-3">
                      <label className="text-black">Location</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Location"
                      value={selectedMrngMassTypes[index] === "No Mass" ? day.morning_mass.location = "" : day.morning_mass.location || ""}
                      disabled={selectedMrngMassTypes[index] === "No Mass" || day.morning_mass.mass === "No Mass"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && value[0] === ' ') {
                          return;
                        }
                        handleInputChange(index, "morning_mass", "location", e.target.value)
                      }}
                      className={`${commonInputClass} ${formErrors[`morning_mass_location_${index}`] ? 'border-red-500' : ''}`}
                    />
                    {formErrors[`morning_mass_location_${index}`] && (
                      <p className="text-red-500 text-sm">{formErrors[`morning_mass_location_${index}`]}</p>
                    )}
                    <div className="mt-3">
                      <label className="text-black">Organizers</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Organizers"
                      value={selectedMrngMassTypes[index] === "No Mass" ? day.morning_mass.organizers = "" : day.morning_mass.organizers || ""}
                      disabled={selectedMrngMassTypes[index] === "No Mass" || day.morning_mass.mass === "No Mass"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && value[0] === ' ') {
                          return;
                        }
                        handleInputChange(index, "morning_mass", "organizers", e.target.value)
                      }}
                      className={`${commonInputClass} ${formErrors[`morning_mass_organizers_${index}`] ? 'border-red-500' : ''}`}
                    />
                    {formErrors[`morning_mass_organizers_${index}`] && (
                      <p className="text-red-500 text-sm">{formErrors[`morning_mass_organizers_${index}`]}</p>
                    )}
                    <div className="mt-3">
                      <label className="text-black">Chief Celebrant</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Chief Celebrant"
                      value={selectedMrngMassTypes[index] === "No Mass" ? day.morning_mass.chief_celebrant = "" : day.morning_mass.chief_celebrant || ""}
                      disabled={selectedMrngMassTypes[index] === "No Mass" || day.morning_mass.mass === "No Mass"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && value[0] === ' ') {
                          return;
                        }
                        handleInputChange(index, "morning_mass", "chief_celebrant", e.target.value)
                      }}
                      className={`${commonInputClass} ${formErrors[`morning_mass_chief_celebrant_${index}`] ? 'border-red-500' : ''}`}
                    />
                    {formErrors[`morning_mass_chief_celebrant_${index}`] && (
                      <p className="text-red-500 text-sm">{formErrors[`morning_mass_chief_celebrant_${index}`]}</p>
                    )}
                    <div className="mt-3">
                      <label className="text-black">Oratory</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Oratory"
                      value={selectedMrngMassTypes[index] === "No Mass" ? day.morning_mass.oratory = "" : day.morning_mass.oratory || ""}
                      disabled={selectedMrngMassTypes[index] === "No Mass" || day.morning_mass.mass === "No Mass"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && value[0] === ' ') {
                          return;
                        }
                        handleInputChange(index, "morning_mass", "oratory", e.target.value)
                      }}
                      className={`${commonInputClass} ${formErrors[`morning_mass_oratory_${index}`] ? 'border-red-500' : ''}`}
                    />
                    {formErrors[`morning_mass_oratory_${index}`] && (
                      <p className="text-red-500 text-sm">{formErrors[`morning_mass_oratory_${index}`]}</p>
                    )}
                    <div className="mt-3">
                      <label className="text-black">Mass Proposal</label>
                    </div>
                    <textarea
                      placeholder="Mass Proposal"
                      value={selectedMrngMassTypes[index] === "No Mass" ? day.morning_mass.mass_proposal = "" : day.morning_mass.mass_proposal || ""}
                      disabled={selectedMrngMassTypes[index] === "No Mass" || day.morning_mass.mass === "No Mass"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && value[0] === ' ') {
                          return;
                        }
                        handleInputChange(index, "morning_mass", "mass_proposal", e.target.value)
                      }}
                      className={`${commonInputClass} ${formErrors[`morning_mass_mass_proposal_${index}`] ? 'border-red-500' : ''} h-32`}
                    />
                    {formErrors[`morning_mass_mass_proposal_${index}`] && (
                      <p className="text-red-500 text-sm">{formErrors[`morning_mass_mass_proposal_${index}`]}</p>
                    )}
                  </div>
    
                  {/* Evening Mass */}
                  <div>
                    <h3 className="text-xl font-bold text-blue-700 mb-3">
                      Evening Schedule
                    </h3>
                    <div className="mt-3">
                      <label className="text-black">Type of Mass</label>
                    </div>
                    <select
                      value={day.evening_mass.mass || ""}
                      onChange={(e) =>
                        handleInputChange(index, "evening_mass", "mass", e.target.value)
                      }
                      className={`${commonInputClass} ${formErrors[`evening_mass_mass_${index}`] ? 'border-red-500' : ''}`}
                    >
                      <option value="" disabled>Select Type of Mass</option>
                      <option value="No Mass">No Mass</option>
                      <option value="Holy Adoration">Holy Adoration</option>
                      <option value="Holy Mass">Holy Mass</option>
                      <option value="Rosary Prayer">Rosary Prayer</option>
                      <option value="First Saturday Holy Adoration & Mass">First Saturday Holy Adoration & Mass</option>
                    </select>
                    {formErrors[`evening_mass_mass_${index}`] && (
                      <p className="text-red-500 text-sm">{formErrors[`evening_mass_mass_${index}`]}</p>
                    )}
                    <div className="mt-3">
                      <label className="text-black">Time</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Time (e.g., 7:00 AM)"
                      value={selectedEveMassTypes[index] === "No Mass" ? day.evening_mass.time = "" : day.evening_mass.time || ""}
                      disabled={selectedEveMassTypes[index] === "No Mass" || day.evening_mass.mass === "No Mass"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && value[0] === ' ') {
                          return;
                        }
                        handleInputChange(index, "evening_mass", "time", e.target.value)
                      }}
                      className={`${commonInputClass} ${formErrors[`evening_mass_time_${index}`] ? 'border-red-500' : ''}`}
                    />
                    {formErrors[`evening_mass_time_${index}`] && (
                      <p className="text-red-500 text-sm">{formErrors[`evening_mass_time_${index}`]}</p>
                    )}
                    <div className="mt-3">
                      <label className="text-black">Location</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Location"
                      value={selectedEveMassTypes[index] === "No Mass" ? day.evening_mass.location = "" : day.evening_mass.location || ""}
                      disabled={selectedEveMassTypes[index] === "No Mass" || day.evening_mass.mass === "No Mass"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && value[0] === ' ') {
                          return;
                        }
                        handleInputChange(index, "evening_mass", "location", e.target.value)
                      }}
                      className={`${commonInputClass} ${formErrors[`evening_mass_location_${index}`] ? 'border-red-500' : ''}`}
                    />
                    {formErrors[`evening_mass_location_${index}`] && (
                      <p className="text-red-500 text-sm">{formErrors[`evening_mass_location_${index}`]}</p>
                    )}
                    <div className="mt-3">
                      <label className="text-black">Organizers</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Organizers"
                      value={selectedEveMassTypes[index] === "No Mass" ? day.evening_mass.organizers = "" : day.evening_mass.organizers || ""}
                      disabled={selectedEveMassTypes[index] === "No Mass" || day.evening_mass.mass === "No Mass"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && value[0] === ' ') {
                          return;
                        }
                        handleInputChange(index, "evening_mass", "organizers", e.target.value)
                      }}
                      className={`${commonInputClass} ${formErrors[`evening_mass_organizers_${index}`] ? 'border-red-500' : ''}`}
                    />
                    {formErrors[`evening_mass_organizers_${index}`] && (
                      <p className="text-red-500 text-sm">{formErrors[`evening_mass_organizers_${index}`]}</p>
                    )}
                    <div className="mt-3">
                      <label className="text-black">Chief Celebrant</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Chief Celebrant"
                      value={selectedEveMassTypes[index] === "No Mass" ? day.evening_mass.chief_celebrant = "" : day.evening_mass.chief_celebrant || ""}
                      disabled={selectedEveMassTypes[index] === "No Mass" || day.evening_mass.mass === "No Mass"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && value[0] === ' ') {
                          return;
                        }
                        handleInputChange(index, "evening_mass", "chief_celebrant", e.target.value)
                      }}
                      className={`${commonInputClass} ${formErrors[`evening_mass_chief_celebrant_${index}`] ? 'border-red-500' : ''}`}
                    />
                    {formErrors[`evening_mass_chief_celebrant_${index}`] && (
                      <p className="text-red-500 text-sm">{formErrors[`evening_mass_chief_celebrant_${index}`]}</p>
                    )}
                    <div className="mt-3">
                      <label className="text-black">Oratory</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Oratory"
                      value={selectedEveMassTypes[index] === "No Mass" ? day.evening_mass.oratory = "" : day.evening_mass.oratory || ""}
                      disabled={selectedEveMassTypes[index] === "No Mass" || day.evening_mass.mass === "No Mass"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && value[0] === ' ') {
                          return;
                        }
                        handleInputChange(index, "evening_mass", "oratory", e.target.value)
                      }}
                      className={`${commonInputClass} ${formErrors[`evening_mass_oratory_${index}`] ? 'border-red-500' : ''}`}
                    />
                    {formErrors[`evening_mass_oratory_${index}`] && (
                      <p className="text-red-500 text-sm">{formErrors[`evening_mass_oratory_${index}`]}</p>
                    )}
                    <div className="mt-3">
                      <label className="text-black">Mass Proposal</label>
                    </div>
                    <textarea
                      placeholder="Mass Proposal"
                      value={selectedEveMassTypes[index] === "No Mass" ? day.evening_mass.mass_proposal = "" : day.evening_mass.mass_proposal || ""}
                      disabled={selectedEveMassTypes[index] === "No Mass" || day.evening_mass.mass === "No Mass"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && value[0] === ' ') {
                          return;
                        }
                        handleInputChange(index, "evening_mass", "mass_proposal", e.target.value)
                      }}
                      className={`${commonInputClass} ${formErrors[`evening_mass_mass_proposal_${index}`] ? 'border-red-500' : ''} h-32`}
                    />
                    {formErrors[`evening_mass_mass_proposal_${index}`] && (
                      <p className="text-red-500 text-sm">{formErrors[`evening_mass_mass_proposal_${index}`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-secondary rounded-md hover:bg-red-800"
              >
                Cancel
              </button> 
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary text-secondary rounded-md hover:bg-gray-900"
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}