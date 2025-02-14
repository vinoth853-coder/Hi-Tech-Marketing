"use client";

import API from "@/action/axios";
import { useAuth } from "@/components/AuthContext";
import { setCookie } from 'cookies-next';
import useAuthStore from "@/store/authStore";
import { useAlert } from "@/components/AlertContext";
import CustomAlert from "@/utils/customAlert";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import SnowCanvas from "./snowCanvas";
import Image from 'next/image';
import './style.css';

export default function LoginPage() {
  const [input, setInput] = useState(""); // Email or Phone
  const otpLength = 6;
  const [otp, setOtp] = useState(new Array(otpLength).fill("")); // 6 OTP inputs
  const inputRefs = useRef([]);
  const [isResendOtp, setIsResendOtp] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isResendOtpLoading, setIsResendOtpLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  
  const [timerActive, setTimerActive] = useState(false);
  const defaultMinutes = 4;
  const defaultSeconds = 59;
  const [minutes, setMinutes] = useState(defaultMinutes);
  const [seconds, setSeconds] = useState(defaultSeconds);
  const timerStartTimeRef = useRef(null);
  const intervalRef = useRef(null);

  const { setRole } = useAuthStore();
  const { login } = useAuth();
  const router = useRouter();

  const { alertContent, showAlertContent } = useAlert();

  useEffect(() => {
    if (!timerActive) return;

    const updateTimer = () => {
      const elapsed = Math.floor((performance.now() - timerStartTimeRef.current) / 1000);
      const remainingTime = (defaultMinutes * 60 + defaultSeconds) - elapsed;

      if (remainingTime <= 0) {
        setMinutes(0);
        setSeconds(0);
        clearInterval(intervalRef.current);
        setTimerActive(false);
      } else {
        setMinutes(Math.floor(remainingTime / 60));
        setSeconds(remainingTime % 60);
      }
    };

    intervalRef.current = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timerActive]);

  const startTimer = () => {
    timerStartTimeRef.current = performance.now();
    setMinutes(defaultMinutes);
    setSeconds(defaultSeconds);
    setTimerActive(true);
  };

  const handleSendOtp = async(event) => {
    setIsLoading(true);
    setIsResendOtpLoading(true);
    setIsOtpLoading(false)
    if (event && event.preventDefault && event !== 'resend') {
      event.preventDefault();
    }
    const isEmail = /\S+@\S+\.\S+/.test(input);
    const isPhone = /^\d{10}$/.test(input);
    if (!isEmail && !isPhone) {
      setIsLoading(false)
      setIsResendOtpLoading(false)
      alertContent("Please enter a valid phone number.", "error");
      return;
    }

    try {
      const payload = isEmail
      ? { email: input } 
      : { contact: input };
      const response = await API.post('/get_otp', payload);
      if (response.status === 200) {
        setIsLoading(false)
        setIsResendOtpLoading(false)
        setIsOtpSent(true);
        alertContent(response.data.message, "success");
        startTimer();
        if (event === 'resend') {
          setTimeout(() => {
              setIsResendOtp(true);
          }, 1000);
        }
      } else {
        setIsLoading(false);
        setIsResendOtpLoading(false)
        alertContent(response.statusText, "error")
      }
    } catch (error) {
      setIsLoading(false)
      setIsResendOtpLoading(false)
      if (error.response) {
        if (error.response.status === 404) {
          alertContent("User not found.", "error");
        } else {
          alertContent(error.response.data.detail, "error");
        }
      } else {
        console.error('GET OTP API EXCEPTION:', error);
        alertContent("An unexpected error occurred. Please try again later.","error");
      }
    } finally {
      setIsLoading(false);
      setIsResendOtpLoading(false);
    }    
  };

  const handleVerifyOtp = async(e) => {
    const enteredOtp = otp.join("");

    if (!isOtpSent) {
      alertContent("OTP has not been sent yet. Please request an OTP.", "error");
      return;
    }

    if (!enteredOtp) {
      alertContent("Please enter the OTP.", "error");
      return;
    }
  
    if (!/^\d{6}$/.test(enteredOtp)) {
      alertContent("Please enter a valid 6-digit OTP.", "error");
      return;
    }
  
    setIsOtpLoading(true);

    const isEmail = /\S+@\S+\.\S+/.test(input); 
    const isPhone = /^\d{10}$/.test(input);

    try {
      const payload = isEmail
      ? { email: input, otp: enteredOtp } 
      : { contact: input, otp: enteredOtp }; 

      const response = await API.post('/verify_otp', payload );
      
      if (response.status === 200) {  
        if (response.data.is_verified) {
          const isAdmin = response.data.admin;
          setRole(isAdmin ? 'admin' : 'user');
          setCookie('isAuthenticated', response.data.is_verified === 'yes' ? 'true' : 'false', { maxAge: 60 * 60 * 24 * 7 });
          setCookie('token', response.data.jwt_token, { maxAge: 60 * 60 * 24 * 7 });
          setCookie('head_name', response.data.head_name, { maxAge: 60 * 60 * 24 * 7 });
          setCookie('role', response.data.admin ? 'admin' : 'user', { maxAge: 60 * 60 * 24 * 7 });
          setTimeout(() => {
            router.push('/');
          }, 100);
          login({ head_name: response.data.head_name, admin: isAdmin });
        } else {
          alertContent("OTP expired. Please request a new OTP.", "error");
          setOtp(new Array(otpLength).fill(""));
        }
      } else {
        alertContent(response.data.message || "Failed to verify OTP. Please try again.", "error");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alertContent("Invalid OTP. Please try again.", "error");
        } else if (error.response.status === 400) {
          alertContent("Invalid OTP. Please try again.", "error");
        } else {
          alertContent(error.response.data.message || "Verification failed. Please try again.", "error");
        }
      } else {
        console.error("OTP verification failed:", error);
        alertContent("An error occurred during verification. Please check your network and try again.", "error");
      }
      setOtp(new Array(otpLength).fill(""));
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtp(new Array(6).fill(""));
    setIsResendOtpLoading(true);
    handleSendOtp('resend');
  };

  const handleChangeNumberOrEmail = () => {
    setTimerActive(false);
    setIsOtpSent(false);
    setInput("");
    setOtp(new Array(6).fill(""));
  };

  useEffect(() => {
    if ('OTPCredential' in window) {
      const ac = new AbortController();
      navigator.credentials
        .get({
          otp: { transport: ['sms'] },
          signal: ac.signal,
        })
        .then((otp) => {
          console.log(otp?.code);
          const receivedOtp = otp?.code.split('');
          setOtp(receivedOtp); 
          inputRefs.current[receivedOtp.length - 1]?.focus();
          ac.abort();
        })
        .catch((err) => {
          ac.abort();
          console.error(err);
        });
    }
  }, []);

  const handleOTPChange = (index, value) => {
    const newOtp = [...otp];
    if (/^\d$/.test(value)) {
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < otpLength - 1 && value !== '') {
        inputRefs.current[index + 0].focus();
      }
    } else if (value === '') {
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0) inputRefs.current[index - 1].focus();
    }
  };

  const handleBackspaceAndEnter = (index, event) => {
    const newOtp = [...otp];
    if (event.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1].focus();
      }
      newOtp[index] = '';
    } else if (/^\d$/.test(event.key)) {
      newOtp[index] = event.key;
      if (index < otpLength - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
    setOtp(newOtp);
    if (event.key === 'Enter') {
      event.preventDefault();
      if (index < otpLength - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleInputClick = (index) => {
    inputRefs.current[index].select();
  };

  const handlePaste = (event) => {
    let pasteData = event.clipboardData.getData('text/plain').replace(/\s+/g, '');
    pasteData = pasteData.slice(0, otpLength);
    const isValidPaste = /^\d+$/.test(pasteData);
    if (isValidPaste) {
      const newOtp = pasteData.split('');
  
      setOtp((prevOtp) => {
        const updatedOtp = [...prevOtp];
        newOtp.forEach((digit, index) => {
          updatedOtp[index] = digit;
        });
        return updatedOtp;
      });
  
      newOtp.forEach((digit, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = digit;
          // inputRefs.current[index].setSelectionRange(0, 0);
        }
      });
      const nextIndex = newOtp.length < otpLength ? newOtp.length : otpLength - 1;
      setTimeout(() => {
        if (inputRefs.current[nextIndex]) {
          inputRefs.current[nextIndex].focus();
        }
      }, 50);
    } 
    event.preventDefault();
  };

  const handleKeyDown = (type, event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (type === "otp") handleSendOtp();
      if (type === "verify") handleVerifyOtp();
    }
  };

  useEffect(() => {
    if (isOtpSent) {
      inputRefs.current[0]?.focus(); 
    }
  }, [isOtpSent]);

  const Spinner = ({ color }) => (
    <div className="flex items-center justify-center">
      <div className={`w-6 h-6 border-4 border-${color}-500 border-solid rounded-full border-t-transparent animate-spin`}></div>
    </div>
  );

  return (
    <div className="relative h-full">
      {showAlertContent && <CustomAlert message={showAlertContent.message} type={showAlertContent.type} />}
      {/* Background Section */}
      <SnowCanvas/>
      <section className="absolute top-0 left-0 z-0 h-full lg:h-screen">
        <div className="air air1"></div>
        <div className="air air2"></div>
        <div className="air air3"></div>
        <div className="air air4"></div>
      </section>

      {/* Main Content */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 h-full">
        {/* Left Content (Welcome Back) */}
        <div className="flex justify-center text-secondary px-6 py-4 md:px-8 md:py-10">
          <div className="text-center max-w-lg bg-opacity-50 bg-gray-800 p-6 rounded-lg shadow-lg">
            <Image
              src="/RansomLady.png"
              alt="Our Lady of Ransom"
              className="mx-auto mb-6 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain rounded-full"
              width={224} 
              height={224} 
            />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-yellow-300">Welcome Back!</h2>
            <p className="text-base sm:text-lg mb-6 leading-relaxed">
              We&apos;re happy to see you again. This portal is exclusively for <span className="font-semibold">&quot;Our Lady of Ransom Church&quot;</span> members. Log in to:
            </p>
            <ul className="list-disc list-inside text-left text-sm sm:text-base mb-4 space-y-2">
              <li>Pay your church-related taxes securely.</li>
              <li>Access tax statements and receipts.</li>
              <li>Manage your tax-related details.</li>
            </ul>
            <p className="text-xs sm:text-sm italic">
              <strong>Note:</strong> Only registered members can access this service.
            </p>
          </div>
        </div>

        {/* Right Content (Login Box) */}
        <div className="flex justify-center items-center w-full h-full px-6 py-4 md:px-8 md:py-10">
          <div className="w-full max-w-md bg-secondary p-6 rounded-lg shadow-lg">
            <h1 className="text-xl sm:text-2xl font-bold text-center text-primary mb-6">Login</h1>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-primary text-sm font-bold mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown('otp', e)}
                  className="w-full px-4 py-2 text-black border rounded-lg focus:border-blue-500"
                  disabled={isOtpSent}
                  required
                />
                {isOtpSent && (
                  <p
                    className="text-sm mt-1 text-blue-500 mt-1 cursor-pointer"
                    onClick={handleChangeNumberOrEmail}
                  >
                    Change Phone Number
                  </p>
                )}
              </div>

              {!isOtpSent ? (
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full py-2 px-4 rounded-lg bg-blue-500 text-secondary hover:bg-blue-600 focus:outline-none"
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner color="white" /> : "Send OTP"}
                  </button>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-primary text-sm font-bold mb-2">Enter OTP</label>
                  <div className="flex justify-between mb-2 space-x-1 sm:space-x-4">
                    {Array.isArray(otp) && otp.map((digit, index) => (
                      <input
                        key={index}
                        type="tel"
                        // maxLength="1"
                        value={digit}
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-center text-black border rounded-lg focus:border-gray-900"
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        required
                        onClick={() => handleInputClick(index)}
                        onKeyUp={(e) => handleBackspaceAndEnter(index, e)}
                        onPaste={handlePaste}
                        onKeyDown={(e) => handleKeyDown("verify", e)}
                      />
                    ))}
                  </div>
                  {seconds > 0 || minutes > 0 ? (
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="mt-2 w-full bg-green-500 text-secondary py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:border-green-500"
                    >
                      {isOtpLoading ? <Spinner color="white" /> : "Verify OTP"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="mt-2 w-full bg-green-500 text-secondary py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:border-green-500"
                    >
                      {isResendOtpLoading ? <Spinner color="white" /> : "Resend OTP"}
                    </button>
                  )}
                </div>
              )}

              {timerActive && (
                <p className="text-sm text-gray-600 text-center mt-4">
                  Time remaining:{" "}
                  {`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}