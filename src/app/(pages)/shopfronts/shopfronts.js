import Image from "next/image";
import Link from "next/link";

export default function ShopFronts() {
  return (
    <div className="">
      {/* Banner Section */}
      <div className="relative h-[250px] md:h-[300px] bg-cover bg-center flex items-center justify-center text-white text-3xl font-bold"
        style={{ backgroundImage: "url('/shopfrontsB.png')" }}>
        <h1 className="backdrop-gray-sm px-4 py-2 bg-black/30 rounded-lg text-center">
        Shop Fronts
        </h1>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto p-6">
        <div className=" p-6 flex flex-col md:flex-row gap-5 sm:gap-10">
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="sm:text-5xl text-3xl md-3xl font-bold sm:mt-10 sm:mb-10 text-blue-800">Shop Fronts</h2>
            <p className="text-black text-lg mt-4">
            At Kooner Shop Fronts, excellence is our hallmark when it comes to manufacturing high-quality custom-built shutters. With a wealth of experience in this sector, we have earned the trust and satisfaction of numerous delighted customers.
Our commitment to in-house manufacturing guarantees that you receive shop front fittings of the finest quality at a reasonable price. Each product undergoes rigorous quality control to ensure it meets our exacting standards before leaving our workshops.
            </p>
            <p className="text-black text-lg mt-4">
            Elevate your business with our meticulously crafted shop front fittings. Contact us today to discover how our products can enhance your space and make a lasting impression on your customers. Your success is our priority.
            </p>
          </div>

          {/* Image Section */}
          <div className="sm:mt-10 sm:mb-10">
            <Image 
              src="/ShopFronts.png" 
              alt="Shop Fronts" 
              width={400} 
              height={300} 
              className="rounded-lg"
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
