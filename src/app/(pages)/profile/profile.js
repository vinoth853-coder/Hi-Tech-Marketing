"use client";

import API from "@/action/axios";
import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import Spinner from '@/utils/spinner';

const formatDate = (dateString) => {
  if (!dateString) return "N/A"; // Handle empty or undefined dates
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/user/list_user_details");
        if (response && response.data) {
          const formattedData = {
            ...response.data,
            marriage_date: formatDate(response.data.marriage_date),
            family_members: response.data.family_members.map((member) => ({
              ...member,
              dob: formatDate(member.dob),
            })),
          };
          setUserData(formattedData);
        } else {
          console.error("Error fetching user details: No data");
        }
      } catch (error) {
        console.error("Error getting the details: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="max-w-6xl w-full p-6 space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-800 text-center">Profile Details</h1>
      {isLoading ? (
        <Spinner color="blue" />
      ) : (
        userData && (
          <>
            {/* Profile Overview Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-extrabold text-blue-500">Family Basic Details</h2>
              <div className="mt-5 text-white">
                <p className="text-lg">
                  <strong>Family ID:</strong> {userData.family_id}
                </p>
                <p className="text-lg">
                  <strong>Head of Family:</strong> {userData.head_name}
                </p>
                <p className="text-lg">
                  <strong>Contact:</strong> {userData.contact}
                </p>
                <p className="text-lg">
                  <strong>Email:</strong> {userData.email}
                </p>
                <p className="text-lg">
                  <strong>Members:</strong> {userData.members}
                </p>
                <p className="text-lg">
                  <strong>Marriage Date:</strong> {userData.marriage_date}
                </p>
              </div>
            </div>

            {/* Family Members Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-2xl font-extrabold text-blue-500 mb-6">Family Members</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userData.family_members.map((member, index) => (
                <div
                  key={index}
                  className="p-6 border-2 bg-white border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-500 transition duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <FaUser className="text-gray-400 text-xl" />
                      <span className="text-xl font-semibold text-blue-500">{member.name}</span>
                      <span className="font-semibold">{member.deceased === true && '(Died)'}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-800">
                      <strong>Relationship:</strong> {member.role}
                    </p>
                    <p className="text-sm text-gray-800">
                      <strong>Aadhaar:</strong> {member.aadhaar_number}
                    </p>
                    <p className="text-sm text-gray-800">
                      <strong>DOB:</strong> {member.dob}
                    </p>
                    <p className="text-sm text-gray-800">
                      <strong>Age:</strong> {member.age}
                    </p>
                    <p className="text-sm text-gray-800">
                      <strong>Marital Status:</strong> {member.marital_status}
                    </p>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </>
        )
      )}
      </div>
    </div>
  );
}