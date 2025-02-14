import Image from "next/image";
import Link from "next/link";

export default function FireRatedDoors() {
  return (
    <div className="">
      {/* Banner Section */}
      <div className="relative h-[250px] md:h-[300px] bg-cover bg-center flex items-center justify-center text-white text-3xl font-bold"
        style={{ backgroundImage: "url('/fireshutters.png')" }}>
        <h1 className="backdrop-gray-sm px-4 py-2 bg-black/30 rounded-lg text-center">
          Fire Rated Shutters & Doors
        </h1>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto p-6">
        <div className=" p-6 flex flex-col md:flex-row gap-5 sm:gap-10">
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="sm:text-5xl text-3xl md-3xl font-bold sm:mt-10 sm:mb-10 text-blue-800">Fire Rated Shutters & Doors</h2>
            <p className="text-black text-lg mt-4">
              HI-TECH Shop Fitters proudly presents Warringtonfire-certified Fire-Doors and 
              fire-rated roller shutters. Fire-rated doors and shutters are specialized safety solutions meticulously designed 
              to curtail the rapid expansion of fires.
            </p>
            <p className="text-black text-lg  mt-2">
              Constructed with fire-resistant materials and engineered for robustness, these installations act as vital barriers, 
              effectively containing flames, smoke, and heat.
            </p>
            <p className="text-black text-lg  mt-2">
            Certified for their durability and performance, fire-rated doors and shutters offer essential time for evacuation while safeguarding structures and occupants from the devastating effects of fire emergencies.
            </p>
          </div>

          {/* Image Section */}
          <div className="sm:mt-10 sm:mb-10">
            <Image 
              src="/fireratedshutters.jpg" 
              alt="Fire Rated Shutters & Doors" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto p-6">
        <div className=" p-6 flex flex-col md:flex-row gap-10">
            
          {/* Image Section */}
          <div className=" sm:mb-10">
            <Image 
              src="/firedoors2.png" 
              alt="Fire Doors" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="sm:text-5xl text-3xl  font-bold  sm:mt-10 sm:mb-10 text-red-500">Fire Doors</h2>
            <p className="text-black text-lg mt-4">
            Introducing Warringtonfire-certified Fire-Doors by HI-TECH Shop Fitters. Our fire-doors stand as specialized barriers strategically crafted to swiftly curtail fire propagation. Crafted from premium fire-resistant materials and bolstered by certified components, these doors effectively confine flames, smoke, and intense heat for a defined period. This feature not only facilitates secure evacuations but also shields properties from the dire consequences of emergencies.
            </p>
          </div>
        </div>
      </div>
       {/* Content Section */}
       <div className="max-w-6xl mx-auto p-6">
        <div className=" p-6 flex flex-col md:flex-row gap-10">
            
          {/* Image Section */}
          <div className=" sm:mb-10">
            <Image 
              src="/fireshutters2.jpg" 
              alt="Fire Rated Shutters" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="sm:text-5xl text-3xl font-bold  sm:mt-10 sm:mb-10 text-red-500">Fire-Rated Roller Shutters</h2>
            <p className="text-black text-lg mt-4">
            HI-TECH Shop Fitters proudly presents Warringtonfire-certified fire-rated roller shutters, offering fire resistance from 30 to 240 minutes. A fire-rated roller shutter serves as a dedicated protective barrier, purpose-built to halt the progression of fire. Crafted from fire-resistant materials and engineered to endure elevated temperatures, it offers essential moments for secure evacuation and fire containment.
            </p>
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
