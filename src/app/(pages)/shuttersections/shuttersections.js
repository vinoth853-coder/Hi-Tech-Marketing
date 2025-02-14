import Image from "next/image";
import Link from "next/link";

export default function ShutterSections() {
  return (
    <div className="">
      {/* Banner Section */}
      <div className="relative h-[250px] md:h-[300px] bg-cover bg-center flex items-center justify-center text-white text-3xl font-bold"
        style={{ backgroundImage: "url('/firerated.png')" }}>
        <h1 className="backdrop-blur-md px-4 py-2 bg-black/30 rounded-lg">
        Shutter Sections
        </h1>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto p-6">
        <div className=" p-6 flex flex-col md:flex-row gap-10">
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold sm:mt-10 sm:mb-10 text-blue-800">Shutter Sections</h2>
            <p className="text-black text-lg mt-4">
            Discover a diverse selection of roller shutter sections tailored to your every need. At HI-TECH Shop Fronts, we proudly manufacture these sections in our UK-based factory, ensuring top-notch quality and precision. Our shop fronts, commercial shutters, and other products are crafted to exacting standards, utilizing only the finest materials available.
            </p>
            <p className="text-black text-lg  mt-2">
            With years of experience in manufacturing and fitting shop fronts, we bring unmatched expertise to every project. Trust in HI-TECH Shop Fitters for exceptional service and superior products, as we strive to deliver the best solutions for your requirements. Your satisfaction is our commitment.
            </p>
          </div>

          {/* Image Section */}
          <div className="sm:mt-10 ">
            <Image 
              src="/shuttersection.png" 
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
          <div className=" ">
            <Image 
              src="/anglesection.jpg" 
              alt="Angle Section" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold mb-5 sm:mb-10 text-red-500">Angle Section</h2>
            <p className="text-black text-lg mt-4">
            All our angles are supplied in galvanized or self colour mild steel. Our angles are produced to a 90 degree angle supplied in 3 mm and 5 mm thickness.
            </p>
            <p className="text-black text-lg mt-2">
             3 mm Galvanized Angle Channels <br/>
             50 mm X 50 mm (2″ X 2″) <br />
             75 mm X 50 mm (3″ X 2″) <br />
             100 mm X 50 mm (4″ X 2″) <br />
             Stocked in 6 and 8 metre lengths. <br />
             We also offer powder coating service on these products. 
            </p>
          </div>
        </div>
      </div>
       {/* Content Section */}
       <div className="max-w-6xl mx-auto p-6">
        <div className=" p-6 flex flex-col md:flex-row gap-5 sm:gap-10">
            
          {/* Image Section */}
          <div className="sm:mb-10 sm:mt-10">
            <Image 
              src="/guidesection.jpg" 
              alt="Fire Rated Shutters" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold  mt-5 mb-5 sm:mt-10 sm:mb-10 text-red-500">Guide Section</h2>
            <p className="text-black text-lg sm:text-lg mt-4">
            All our guide channels are produced in 3 mm thickness available in galvanized or self colour mild steel.
            </p>
            <p className="text-black text-lg mt-2">
            3 mm Galvanized Guide Channels <br/>
            32 mm Base X 50 mm Leg (1″ X 2″) <br/>
            32 mm Base X 65 mm Leg (1″ X 2½”) <br/>
            32 mm Base X 75 mm Leg (1″ X 3″) <br/>
            32 mm Base X 100 mm Leg (1″ X 4″) <br/>
            Stocked in 6 and 8 metre lengths. <br/>
            We also offer powder coating service on these products
            </p>
          </div>
        </div>
      </div>
       {/* Content Section */}
       <div className="max-w-6xl mx-auto p-6">
        <div className=" p-6 flex flex-col md:flex-row gap-5 sm:gap-10">
            
          {/* Image Section */}
          <div className="sm:mb-10 sm:mt-10">
            <Image 
              src="/shutterbox.jpg" 
              alt="shutterbox" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold  mt-5 mb-5 sm:mt-10 sm:mb-10 text-red-500">Hoods / Canopy</h2>
            <p className="text-black text-lg sm:text-lg mt-4">
            Our shutters canopies are produced in 20swg. Standard size canopies are stocked in 6 meter lengths. We also produce to various sizes to suit our customers’ requirement.
            </p>
            <p className="text-black text-lg mt-2">
            We offer powder coating service on these products.
            </p>
          </div>
        </div>
      </div>
      {/* Content Section */}
      <div className="max-w-6xl mx-auto p-6">
        <div className=" p-6 flex flex-col md:flex-row gap-5 sm:gap-10">
            
          {/* Image Section */}
          <div className="sm:mb-10 sm:mt-10">
            <Image 
              src="/lath.jpg" 
              alt="lath" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold  mt-5 mb-5 sm:mt-10 sm:mb-10 text-red-500">Laths Section</h2>
            <p className="text-black text-lg sm:text-lg mt-4">
            We offer three types of galvanized 75 mm traditional laths:
            </p>
            <p className="text-black text-lg mt-2">
            Solid. <br />
            Perforated. <br />
            Punched. 
            </p>
            <p className="text-black text-lg sm:text-lg mt-2">
            These sections are available in 18swg, 20swg and 22swg, cut to customers specification. We also offer a powder coating service on these products.
            </p>
          </div>
        </div>
      </div>
      {/* Content Section */}
      <div className="max-w-6xl mx-auto p-6">
        <div className=" p-6 flex flex-col md:flex-row gap-5 sm:gap-10">
            
          {/* Image Section */}
          <div className="sm:mb-10 sm:mt-10">
            <Image 
              src="/plate.jpg" 
              alt="plate" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold  mt-5 mb-5 sm:mt-10 sm:mb-10 text-red-500">Plate</h2>
            <p className="text-black text-lg sm:text-lg mt-4">
            We offer a range of different shutter plates. Please call us for further information
            </p>
           
          </div>
        </div>
      </div>
      {/* Content Section */}
      <div className="max-w-6xl mx-auto p-6">
        <div className=" p-6 flex flex-col md:flex-row gap-5 sm:gap-10">
            
          {/* Image Section */}
          <div className="sm:mb-10 sm:mt-10">
            <Image 
              src="/bottomT.jpg" 
              alt="bottomT" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold  mt-5 mb-5 sm:mt-10 sm:mb-10 text-red-500">T & L Section</h2>
            <p className="text-black text-lg sm:text-lg mt-4">
            T and L section both are only available in galvanized steel. Produced in light to heavy gauge depending on customer requirements.
            </p>
            <p className="text-black text-lg mt-2">
            Stocked in 6 and 8 metre lengths. 
            </p>
            <p className="text-black text-lg sm:text-lg mt-2">
            We offer powder coating service on these products.
            </p>
          </div>
        </div>
      </div>
       {/* Content Section */}
       <div className="max-w-6xl mx-auto p-6">
        <div className=" p-6 flex flex-col md:flex-row gap-5 sm:gap-10">
            
          {/* Image Section */}
          <div className="sm:mb-10 sm:mt-10">
            <Image 
              src="/tube.jpg" 
              alt="tube" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold  mt-5 mb-5 sm:mt-10 sm:mb-10 text-red-500">Tube Section</h2>
            <p className="text-black text-lg sm:text-lg mt-4">
            We offer tube section in 8 metre lengths.
            </p>
            <p className="text-black text-lg mt-2">
            4” 16SWS <br />
            4” 9SWG <br />
            4” 10SWG 
            </p>
          </div>
        </div>
      </div>
      {/* Contact Section */}
      <div className="container mx-auto sm:mb-16 sm:mt-10 bg-gray-200 rounded-lg p-6 max-w-3xl text-center md:text-left">
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
