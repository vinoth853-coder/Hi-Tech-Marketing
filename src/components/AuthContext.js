"use client";

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import useAuthStore from '@/store/authStore';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

const INACTIVITY_TIMEOUT = 900000; 

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ head_name: '', role: '' });
  const [loading, setLoading] = useState(true);
  const clearState = useAuthStore((state) => state.clearState);
  const router = useRouter();

  const inactivityTimerRef = useRef(null);

  useEffect(() => {
    // Check for authentication cookie when the component mounts
    const token = getCookie('token');
    
    if (token) {
      const head_name = getCookie('head_name');
      const role = getCookie('role');
      if (head_name && role) {
        setIsAuthenticated(true);
        setUser({ head_name, role });
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser({ head_name: userData.head_name, role: userData.admin?'admin':'user' });
  };

  const logout = () => {
    
    setIsAuthenticated(false);
    setUser({ head_name: '', role: '' });

    setCookie('token', '', { maxAge: -1 });  
    setCookie('head_name', '', { maxAge: -1 });
    setCookie('role', '', { maxAge: -1 });
    
    clearState(); 
    localStorage.removeItem('auth-store'); 
    router.push('/');
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {      
      logout();
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    // Monitor user activity globally
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    resetInactivityTimer(); // Start the timer when the app loads

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);