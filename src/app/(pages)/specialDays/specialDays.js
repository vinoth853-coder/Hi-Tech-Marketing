import React from 'react';

const CalendarEmbed = () => {
  return (
    <div className="mx-auto px-4 py-4 sm:px-6 md:px-8 relative min-h-screen">
      <div className="flex justify-center items-center pt-12 pb-5">
        <h1 className="text-4xl font-bold mt-[-35px] text-primary drop-shadow-md">Special Days Calendar</h1>
      </div>
      <div className="flex justify-center mt-[20px]">
        <iframe
          src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&bgcolor=%23ffffff&title=General%20Roman%20Calendar&src=bXljYXRob2xpYy5saWZlXzZlZGdmMWYxMGJnbGkxNTltZ3M0dWMwcjkwQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&src=bXljYXRob2xpYy5saWZlX3Fpbmk3bjI3bjRmZ2I4MG00bHFlYmxyNTdvQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&src=bXljYXRob2xpYy5saWZlXzJjaG9lbGU4YTN2dGpkNWNmNWpwMTZnMmM4QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&src=bXljYXRob2xpYy5saWZlXzhjdmM4OGo3YzJvZHRzcmpyZ3NiZXR1cTk4QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&color=%230B8043&color=%23D50000&color=%238E24AA&color=%23E4C441"
          style={{ border: 'solid 1px #777' }}
          width="100%"
          height="800"
          frameBorder="0"
          scrolling="no"
        ></iframe>
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Source: <a href="https://mycatholic.life/liturgy/liturgical-calendar/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mycatholic.life</a>
        </p>
      </div>
    </div>
  );
};

export default CalendarEmbed;
