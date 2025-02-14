import Image from "next/image";
import Link from "next/link";

export default function Doors() {
  return (
    <div className="">
      {/* Banner Section */}
      <div className="relative h-[250px] md:h-[300px] bg-cover bg-center flex items-center justify-center text-white text-3xl font-bold"
        style={{ backgroundImage: "url('/doorsBanner.png')" }}>
        <h1 className="backdrop-blur-md px-4 py-2 bg-black/30 rounded-lg">
        Doors
        </h1>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto p-6">
        <div className=" p-6 flex flex-col md:flex-row gap-10">
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold sm:mt-10 sm:mb-10 text-blue-800">Doors</h2>
            <p className="text-black text-lg mt-4">
            Residential insulated roller shutter and doors. <br />
            Fire door. <br />
            Security steel doors. Patio door up to 3m height and 14meter wide. <br />
            French doors. <br />
            Automatic swing doors. <br />
            Automatic sliding doors. <br />
            Automated gate system. Bifolding door up to 3m height and 14m wide, Residential French doors with options of Glass and aluminium panels
            </p>
          </div>

          {/* Image Section */}
          <div className="sm:mt-10 ">
            <Image 
              src="/Doors.png" 
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
              src="/Automatedgatesystem.png" 
              alt="Automated gate system" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold mb-5 sm:mb-10 text-red-500">Automated gate system</h2>
            <p className="text-black text-lg mt-4">
            The Automated Gate System is a modern and advanced solution that provides effortless and secure access control for properties. Utilizing motorized technology, this system automatically opens and closes gates, offering convenient entry and exit for vehicles and pedestrians. With features like remote controls, keypads, and safety sensors, it enhances convenience, security, and safety, making it an ideal choice for residential, commercial, and industrial settings. Upgrade your property with this sophisticated system, combining efficiency and peace of mind for seamless access control.
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
              src="/slidingdoor.png" 
              alt="sliding Door" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold  mt-5 mb-5 sm:mt-10 sm:mb-10 text-red-500">Automatic sliding doors</h2>
            <p className="text-black text-lg sm:text-lg mt-4">
            Automatic sliding doors bring modernity and convenience to any space. With their smooth and silent operation, these doors effortlessly glide open and closed, creating a seamless entry and exit experience for users. Equipped with motion sensors or push buttons, they automatically detect movement and provide hands-free access, making them ideal for busy areas.
            </p>
            <p className="text-black text-lg mt-2">
            These doors are popular in commercial buildings, shopping malls, airports, hospitals, and other public places due to their space-saving design and efficient traffic flow. Their automatic features enhance accessibility for people with disabilities and create a welcoming and inclusive environment for all.
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
              src="/Automaticswingdoors.png" 
              alt="Automatic swing doors" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold  mt-5 mb-5 sm:mt-10 sm:mb-10 text-red-500">Automatic swing doors</h2>
            <p className="text-black text-lg sm:text-lg mt-4">
            Automatic swing doors offer a convenient and efficient solution for smooth and hands-free access to buildings. With their motorized mechanism, these doors automatically swing open and close when detecting movement, making them ideal for high-traffic areas. They enhance accessibility for people with mobility challenges and provide a seamless entry and exit experience for everyone. Automatic swing doors are widely used in commercial, public, and healthcare settings, providing a modern and welcoming entrance while ensuring a safe and efficient flow of people. Enjoy the convenience and accessibility of automatic swing doors, transforming your space into an efficient and user-friendly environment.
            </p>
          </div>
        </div>
      </div>
      {/* Content Section */}
      <div className="max-w-6xl mx-auto p-6">
        <div className=" p-6 flex flex-col md:flex-row gap-5 sm:gap-10">
            
          {/* Image Section */}
          <div className=" sm:mt-20">
            <Image 
              src="/Bi-FoldDoorsAbsolute.png" 
              alt="Bi-Fold Doors Absolute" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold  mt-5 mb-5 sm:mt-10 sm:mb-10 text-red-500">Bifolding door up to 3m height and 14m wide</h2>
            <p className="text-black text-lg sm:text-lg mt-4">
            Introducing our remarkable Bifolding Door, a stunning and functional addition to elevate your living space. Standing up to 3 meters tall and spanning an impressive width of up to 14 meters, this door effortlessly blurs the boundaries between indoor and outdoor living. Embrace the beauty of natural light as it floods your interior, while enjoying breathtaking panoramic views of your surroundings. Engineered for smooth operation, the Bifolding Door glides open and closed with ease, offering both convenience and elegance. With energy-efficient features, it helps maintain comfortable indoor temperatures, contributing to reduced heating and cooling costs. Customize this door to your preference with various finishes, colors, and configurations, ensuring a seamless fit with your property’s style. Upgrade your lifestyle with the captivating design and functionality of our Bifolding Door, creating a space that embraces the beauty of the outdoors while providing luxurious comfort within your home.
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
              src="/Frenchdoors.png" 
              alt="French doors" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold  mt-5 mb-5 sm:mt-10 sm:mb-10 text-red-500">French doors</h2>
            <p className="text-black text-lg sm:text-lg mt-4">
            French doors are a timeless and elegant addition to any home. With their classic design and double-hinged panels, they create a seamless transition between indoor and outdoor spaces, allowing natural light to flood your interiors. These versatile doors add charm and sophistication to your living area, while providing easy access to your patio, garden, or balcony. Enhance your home with the beauty and functionality of French doors, bringing a touch of European elegance to your space.
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
              src="/Patiodoor.png" 
              alt="Patio door" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold  mt-5 mb-5 sm:mt-10 sm:mb-10 text-red-500">Patio door up to 3m height and 14meter wide</h2>
            <p className="text-black text-lg sm:text-lg mt-4">
            Experience the grandeur of our Patio Door, reaching heights of up to 3 meters and spanning an impressive width of up to 14 meters. This expansive and elegant door floods your interior with natural light while offering unobstructed views of the outdoors. Crafted with high-quality materials and customizable options, it seamlessly integrates with your space, creating a seamless transition between indoors and outdoors. Upgrade your living area with this striking and functional Patio Door, elevating your home to new levels of style and sophistication.
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
              src="/reflecting.png" 
              alt="reflecting" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold  mt-5 mb-5 sm:mt-10 sm:mb-10 text-red-500">Residential French doors with options of Glass and aluminium panels</h2>
            <p className="text-black text-lg sm:text-lg mt-4">
            Experience the perfect blend of elegance and versatility with our Residential French Doors, designed to elevate the aesthetics and functionality of your home. These doors exude timeless charm, providing a seamless connection between your indoor and outdoor spaces. With customizable options of Glass and Aluminium panels, you can create a personalized look that suits your style and preferences.
            </p>
            <p className="text-black text-lg mt-2">
            The Glass panels allow natural light to fill your interior, brightening up your living space while maintaining privacy with various glass options like clear, frosted, or textured. On the other hand, the Aluminium panels offer a modern and sleek appearance, adding a touch of sophistication to contemporary designs.
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
              src="/metallichouse.png" 
              alt="metallic house" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold  mt-5 mb-5 sm:mt-10 sm:mb-10 text-red-500">Residential insulated roller shutter and doors</h2>
            <p className="text-black text-lg sm:text-lg mt-4">
            Our Residential Insulated Roller Shutter and Doors offer the perfect combination of comfort, security, and energy efficiency for homeowners. These high-performance products are designed to regulate indoor temperatures, reduce energy consumption, block external noise, and enhance security. With a wide range of styles and colors available, they complement any home’s aesthetics while providing smooth and quiet operation. Elevate your living experience with our expertly crafted solutions that prioritize your comfort and peace of mind.
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
              src="/Securitysteeldoors.png" 
              alt="Security steel doors" 
              width={400} 
              height={300} 
              className="rounded-lg "
            />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-5xl font-bold  mt-5 mb-5 sm:mt-10 sm:mb-10 text-red-500">Security steel doors</h2>
            <p className="text-black text-lg sm:text-lg mt-4">
            Security steel doors are fortified entryways built to provide maximum protection against break-ins and unauthorized access. Constructed with heavy-duty steel and equipped with multiple locking systems, these doors are highly resistant to physical attacks and tampering. With fire resistance and weather durability, they are ideal for commercial and residential properties seeking enhanced security and peace of mind. Choose from various designs and finishes to match any architectural style while ensuring a robust defense against potential threats.
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
