"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import API from "@/action/axios";
import { useAlert } from "@/components/AlertContext";
import CustomAlert from "@/utils/customAlert";

const ContactUsPage = () => {
  const { alertContent, showAlertContent } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.email.trim()) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Enter a valid email.";
    if (!formData.subject.trim()) errors.subject = "Subject is required.";
    if (!formData.message.trim()) errors.message = "Message cannot be empty.";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await API.post("/marketing/add_contact_details", formData);

      if (response.status === 200) {
        alertContent("Thank you! We&apos;ll respond shortly.", "success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        alertContent("Something went wrong. Try again later.", "error");
      }
    } catch (error) {
      alertContent("Unable to submit your details. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showAlertContent && (
        <CustomAlert message={showAlertContent.message} type={showAlertContent.type} />
      )}

      {/* Video Section */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/contctvd2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            CONTACT US
          </h1>
        </div>
      </div>

      {/* Contact Details & Form */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-10">
        <div className="flex flex-col lg:flex-row items-start gap-10">
          {/* Contact Details */}
          <div className="lg:w-1/2 w-full space-y-4 p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-semibold text-blue-800">Our Details</h3>
            <p className="text-lg text-gray-700"><strong>Address:</strong> HI-TECH, Unit 4A, Tong St Business Park, Holme Lane, Bradford, BD4 OPY</p>
            <p className="text-lg text-gray-700"><strong>Phone:</strong> +44 7479345599</p>
            <p className="text-lg text-gray-700"><strong>Email:</strong> blueshyshopfronts@outlook.com</p>
            <div className="mt-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2357.8575434445474!2d-1.7286289240259052!3d53.77422334262349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487be1206be81277%3A0x7eb2c16c3ff348c4!2sBlue%20Sky%20Aluminium%20Shop%20Fronts%20and%20Shutters!5e0!3m2!1sen!2sin!4v1739708945513!5m2!1sen!2sin"
                width="100%"
                height="250"
                className="rounded-lg shadow-md"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-1/2 w-full bg-gray-200 p-6 rounded-lg ">
            <h3 className="text-2xl font-semibold text-blue-800 text-center">Submit Your Details</h3>
            <form className="mt-4 flex flex-col space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <input
                type="tel"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Your Subject"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800"
              />
              {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 h-32"
              ></textarea>
              {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-lg bg-blue-800 text-white font-medium text-lg shadow-md hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
