"use client";

import API from "@/action/axios";
import { useAlert } from "@/components/AlertContext";
import useAuthStore from "@/store/authStore";
import CustomAlert from "@/utils/customAlert";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Spinner from '@/utils/spinner';

export default function MassTiming() {
  const { role } = useAuthStore();
  const [masses, setMasses] = useState([]);
  const { alertContent, showAlertContent } = useAlert();
  const [isLoading, setIsLoading] = useState(false);

  const listMassDetails = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/mass/list_mass_days");
      if (response.status === 200) {
        setMasses(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch mass details", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    listMassDetails();
  }, []);

  const router = useRouter();

  const handleEdit = () => {
    router.push("/updateMass");
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "Asia/Kolkata",
  });

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getMassByDay = (day) => {
    return masses.find((mass) => mass.mass_days === day) || {
      mass_days: day,
      morning_mass: {},
      evening_mass: {},
    };
  };

  return (
    <div className="mx-auto px-4 py-4 sm:px-6 md:px-8 relative min-h-screen">
      {showAlertContent && (
        <CustomAlert
          message={showAlertContent.message}
          type={showAlertContent.type}
        />
      )}
      <div className="mx-auto sm:mx-20 md:mx-20">
        <div className="flex justify-center items-center pt-12 pb-5">
          <h1 className="text-4xl font-bold mt-[-35px] text-primary drop-shadow-md">Mass Timings</h1>
        </div>
        {(role === "Accountant" || role === "Father")  && (
          <div className="flex items-center justify-end">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-primary text-secondary rounded-md hover:bg-gray-900"
            >
              Update
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="flex h-screen w-full items-center justify-center">
            <Spinner size="10" color="blue-500" />
          </div>
        ) : (
          <div className="relative border-l border-gray-300">
            {weekdays.map((day, index) => {
              const mass = getMassByDay(day);
              return (
                <div key={index} className={"mb-14"}>
                  <div className={`absolute w-6 h-6 ${mass.mass_days === today ? "bg-lime-600" : "bg-blue-600" } rounded-full -left-3.5 border-4 border-white`}></div>
                  <h2
                    className={`text-2xl font-semibold ${mass.mass_days === today ? "text-lime-600 underline" : "text-blue-600"} mb-4 ml-5`}
                    style={mass.mass_days === today ? { textDecorationThickness: '1px' } : {}}
                  >
                    {mass.mass_days}
                  </h2>

                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pl-10 pt-5 flex-wrap">
                    {/* Morning Mass */}
                    <div className="flex-1 w-full lg:w-auto">
                      <h3 className={`text-xl mb-3 font-bold ${mass.mass_days === today ? "text-lime-600" : "text-blue-600"}`}>
                        Morning Schedule 
                      </h3>
                      <div
                        className={`${mass.mass_days === today ? "bg-lime-100 border-lime-600" : "bg-white border-blue-600"} border-l-4 bg-opacity-60 shadow-md rounded-lg p-6 mb-6 lg:mb-0 lg:mr-4`}
                      >
                        
                        {mass.morning_mass.mass && mass.morning_mass.mass !== "No Mass" ? (
                          <>
                            {["mass"].map(
                              (field) => (
                                <p className="text-gray-600" key={field}>
                                  <span className={`text-xl mb-3 font-bold ${mass.mass_days === today ? "text-lime-600" : "text-blue-600"}`}>
                                    {mass.morning_mass[field] || "-"}
                                  </span>
                                </p>
                              )
                            )}
                            {["location", "time", "organizers", "chief_celebrant", "oratory", "mass_proposal"].map(
                              (field) => (
                                <p className={`text-gray-600 mt-2`} key={field}>
                                  <span className="font-semibold capitalize">
                                    {field
                                      .split("_")
                                      .map((word, index) =>
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                      )
                                      .join(" ")}
                                    :
                                  </span>{" "}
                                  {mass.morning_mass[field] || "-"}
                                </p>
                              )
                            )}
                          </>
                        ) : (
                          <p className="text-gray-600 mt-2">No mass</p>
                        )}
                      </div>
                    </div>

                    {/* Evening Mass */}
                    <div className="flex-1 w-full lg:w-auto">
                      <h3 className={`text-xl mb-3 font-bold ${mass.mass_days === today ? "text-lime-600" : "text-blue-600"}`}>
                        Evening Schedule
                      </h3>
                      <div
                        className={`${mass.mass_days === today ? "bg-lime-100 border-lime-600" : "bg-white border-blue-600"} border-l-4 bg-opacity-60 shadow-md rounded-lg p-6 mb-6 lg:mb-0 lg:mr-4`}
                      >
                        {mass.evening_mass.mass && mass.evening_mass.mass !== "No Mass" ? (
                          <>
                            {["mass"].map(
                              (field) => (
                                <p className="text-gray-600" key={field}>
                                  <span className={`text-xl mb-3 font-bold ${mass.mass_days === today ? "text-lime-600" : "text-blue-600"}`}>
                                    {mass.evening_mass[field] || "-"}
                                  </span>
                                </p>
                              )
                            )}
                            {["location", "time", "organizers", "chief_celebrant", "oratory", "mass_proposal"].map(
                              (field) => (
                                <p className="text-gray-600 mt-2" key={field}>
                                  <span className="font-semibold capitalize">
                                    {field
                                      .split("_")
                                      .map((word, index) =>
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                      )
                                      .join(" ")}
                                    :
                                  </span>{" "}
                                  {mass.evening_mass[field] || "-"}
                                </p>
                              )
                            )}
                          </> 
                        ) : (
                          <p className="text-gray-600 mt-2">No mass</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
