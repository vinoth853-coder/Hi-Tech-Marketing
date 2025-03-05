"use client";


import { RiAdminLine } from "react-icons/ri";
import { SiElectronbuilder } from "react-icons/si";
import { MdCurrencyRupee, MdOutlineSchedule, MdContactPhone, MdRollerShades, MdWindow, MdOutlineBuild, } from "react-icons/md";
import { FaHome, FaBoxOpen, FaBriefcase, FaDumpsterFire, FaBuilding, FaDoorClosed, FaStore, FaShippingFast } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { GrBlog } from "react-icons/gr";
import { GiPaintRoller } from "react-icons/gi";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useLayoutEffect } from "react";
import Image from 'next/image';

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState(pathname);
  const dropdownRef = useRef(null);

  useLayoutEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  const handleClickOutside = useCallback(
    (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    },[]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  

  const links = [
    { href: "/", label: "HOME", icon: <FaHome />, key: "home" },
    
    
    {
      href: "#products",
      label: "PRODUCTS",
      icon: <FaBoxOpen />,
      isDropdown: true,
      subLinks: [
        { href: "/shopfronts", label: "Shop Fronts", icon: <FaStore />, key: "shop-fronts" },
        { href: "/shuttersections", label: "Shutter Sections", icon: <MdRollerShades />, key: "shutter-sections" },
        { href: "/doors", label: "Doors", icon: <FaDoorClosed />, key: "doors" },
        { href: "/firerateddoors", label: "Fire Rated Shutters & Doors", icon: <FaDumpsterFire />, key: "fire-rated-shutters-and-doors" },
        { href: "/windows", label: "Windows", icon: <MdWindow />, key: "windows" },
        { href: "/curtainwallingsystem", label: "Curtain Walling System", icon: <FaBuilding />, key: "curtain-walling-system" },
        
      ],
      key: "products",
      
    },
    {
      href: "#services",
      label: "SERVICES",
      icon: <SiElectronbuilder />,
      isDropdown: true,
      subLinks: [
        { href: "/installation", label: "Installation", icon: <MdOutlineBuild />, key: "installation" },
       // { href: "/powdercoating", label: "Powder Coating", icon: <GiPaintRoller />, key: "powder-coating" },
        { href: "/reliabledelivery", label: "Reliable delivery service", icon: <FaShippingFast />, key: "reliable-delivery-service" },
      ],
      key: "services",
    },
    
    { href: "/portfolio", label: "PORTFOLIO", icon: <FaBriefcase />, key: "portfolio" },
    { href: "/contact", label: "CONTACT", icon: <MdContactPhone />, key: "contact" },
   
  ];    

  const [activeSubLinks, setActiveSubLinks] = useState({}); // State to track active sublinks

  const handleLinkClick = (href) => {
    setActiveSubLinks((prev) => ({
      ...prev,
      [href]: !prev[href], // Toggle the visibility of sublinks for this link
    }));
  };

  return (
    <>
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex justify-between items-center px-6 py-4 sm:px-8 sm:py-[10px] bg-barcolor shadow-lg w-full">
        <div className="flex items-center group">
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo-transparent-svg.svg"
              alt="Company Logo"
              width={200}
              height={100}
               className="bg-white"
            />
            
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-secondary focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              ></path>
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 lg:space-x-6 text-sm lg:text-base items-center">
          {links.map(({ href, label, icon, isDropdown, subLinks }) => {
            if (isDropdown) {
              return (
                <div key={label} className="relative group ">
                  <button className="flex items-center text-secondary space-x-2 text-[18px] rounded-lg px-2 hover:text-highlight">
                    {icon}
                    <span>{label}</span>
                  </button>
                  <div className="relative group">
                  <div className="absolute left-0 min-w-[210px] hidden group-hover:block hover:block bg-barcolor shadow-md rounded-md">
                      <ul className="space-y-2 py-2 px-4">
                        {subLinks.map(({ href, label, icon }) => (
                          <li key={href}>
                            <Link
                              href={href}
                              className={`flex items-left  space-x-2 block text-lg text-secondary hover:text-highlight ${
                                activePath === href ? "text-highlight" : "text-secondary"
                              }`}
                            >
                              <span className="text-[14px] ">{label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-2 text-lg rounded-lg px-2 hover:text-highlight  transition duration-300 transform hover:scale-105 ${
                    activePath === href ? "text-highlight" : "text-secondary"
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              );
            }
          })}

          
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-blue-500/50 z-10" />
          <div className="fixed inset-0 z-20 pt-10 bg-primary flex flex-col space-y-4 p-4 transition-transform duration-300 ease-in-out w-[75%] h-full top-16 left-0 slide-in-left">
            {links.map(({ href, label, icon, subLinks, isDropdown }) => (
              <div key={href}>
                {/* Only render the main link if it&apos;s not a dropdown */}
                {!isDropdown && (
                  <Link
                    href={href}
                    className={`flex items-center space-x-2 text-md hover:text-highlight ${
                      activePath === href ? "text-highlight" : "text-secondary"
                    }`}
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                  >
                    {icon}
                    <span>{label}</span>
                  </Link>
                )}
        
                {/* If it has subLinks, render only the subLinks */}
                {isDropdown && subLinks && (
                  <div className="space-y-4">
                    {subLinks.map(({ href, label, icon }) => (
                      <div key={href}>
                        <Link
                          href={href}
                          className={`flex items-center space-x-2 text-md hover:text-highlight ${
                            activePath === href ? "text-highlight" : "text-secondary"
                          }`}
                          onClick={() => {
                            setIsMenuOpen(false);
                          }}
                        >
                          {icon}
                          <span>{label}</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        
            
          </div>
        </>      
      )}
    </>
  );
};

export default Navbar;