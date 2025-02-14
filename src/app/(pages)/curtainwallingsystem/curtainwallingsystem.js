import Image from "next/image";
import Link from "next/link";

export default function CurtainWallingSystem() {
  return (
    <div className="">
      {/* Banner Section */}
      <div className="relative h-[250px] md:h-[300px] bg-cover bg-center flex items-center justify-center text-white text-3xl font-bold"
        style={{ backgroundImage: "url('/CurtainWallingSystemT.png')" }}>
        <h1 className="backdrop-gray-sm px-4 py-2 bg-black/30 rounded-lg text-center">
        Curtain Walling System
        </h1>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto p-6">
        <div className=" p-6 flex flex-col md:flex-row gap-5 sm:gap-10">
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="sm:text-5xl text-3xl md-3xl font-bold sm:mt-10 sm:mb-10 text-blue-800">Curtain Walling System</h2>
            <p className="text-black text-lg mt-4">
            Discover the ultimate solution for your building’s external cladding with our cutting-edge curtain walling systems.
            </p>
            <p className="text-black text-lg  mt-2">
            Embrace an abundance of natural light streaming through expansive clear glass, creating an airy, spacious ambiance that seamlessly connects your space with the outside world.
            </p>
            <p className="text-black text-lg  mt-2">
            Our carefully designed curtain walling not only enhances aesthetics but also prioritizes the safety, security, and comfort of your building’s internal environment.
            </p>
            <p className="text-black text-lg  mt-2">
            Occupants can relish in a sense of security and tranquility while being surrounded by the beauty of natural light.
            </p>
            <p className="text-black text-lg  mt-2">
            Choose from our range of curtain wall options, including 75 mm and 100 mm transom and mullions, with 22 mm and 28 mm platings, to perfectly suit your project’s requirements. 
            </p>
            <p className="text-black text-lg  mt-2">
            Experience the art of combining form and function with our premium curtain walling systems. Elevate your space today with unmatched quality and performance.
            </p>
          </div>

          {/* Image Section */}
          <div className="sm:mt-10 sm:mb-10">
            <Image 
              src="/curtainWallingSystem.png" 
              alt="Fire Rated Shutters & Doors" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto sm:mb-16 mt-10 bg-gray-200 rounded-lg p-6 max-w-3xl text-center md:text-left">
        <h2 className="text-2xl font-semibold text-blue-800">Any query in mind?</h2>
        <p className="text-black mt-3">
          HI-TECH Shop Fitters Limited have been providing customers great solutions and a fantastic service for many years now. 
          Contact us either by telephone or send us a quick quote form. We are always here to help.
        </p>
        <div className="mt-6">
          <Link href="/contact">
            <button className="bg-teal-600 hover:bg-teal-800 text-white font-semibold py-3 px-6 rounded-full shadow-md transition">
              CONTACT US
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
