import React from 'react';
import { FaMapMarkerAlt, FaBus, FaPlane, FaTrain } from "react-icons/fa";
import { FaArrowRightLong, FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { MapPin, Navigation } from "lucide-react";

const EventLocation = ({ organizer, dbEvent }) => {
  const venue = dbEvent?.venue || {};
  const contact = dbEvent?.contact || {};
  const socialLinks = dbEvent?.socialLinks || {};
  const whatsappNumber = String(contact.whatsappNumber || contact.primaryNumber || organizer?.contactNumber || "").replace(/\D/g, "");

  const fullAddress = [
    venue.venueName,
    venue.addressLine1,
    venue.addressLine2,
    venue.city,
    venue.pincode
  ].filter(Boolean).join(", ");
  const mapQueryParts = [];
  if (venue.venueName) mapQueryParts.push(venue.venueName);
  if (venue.addressLine1) mapQueryParts.push(venue.addressLine1);
  if (venue.city) mapQueryParts.push(venue.city);

  const mapSearchAddress = mapQueryParts.length > 0 ? mapQueryParts.join(", ") : fullAddress;
  const encodedAddress = encodeURIComponent(mapSearchAddress || "New Delhi, India");

  return (
    <>
      {!dbEvent.isOnline && (
        <div id="venue" className="w-full pb-15 scroll-mt-20">
          <div className="max-w-290 mx-auto bg-white border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.04)] px-6 md:px-10 py-8 rounded-2xl">




            <div className='flex items-center gap-6'>
              <h2 className="text-2xl font-bold text-gray-900">Venue Details</h2>
              {!dbEvent.isOnline && fullAddress && (
                <a href={venue.location || `https://maps.google.com/?q=${encodedAddress}`} target="_blank" rel="noreferrer" className=" flex items-center gap-1.5 text-[13.5px] text-secondary font-medium  bg-[#D3F7E1] py-0.5 px-4 rounded-full">
                  <Navigation size={15} /> Get Directions
                </a>
              )}
            </div>



            <div className="flex flex-col lg:flex-row gap-10 mt-8">


              <div className="flex-1 flex flex-col gap-5">


                <div className="flex items-start gap-5 border-b border-gray-100 pb-5">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary">
                    <FaMapMarkerAlt size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] text-gray-500 font-medium mb-1">Venue</span>
                    <span className="text-[16px] font-bold text-gray-900 leading-snug">
                      {dbEvent.isOnline ? "Online" : (fullAddress || "Venue details not provided")}
                    </span>
                  </div>
                </div>


                {venue.nearestBusStop && (
                  <div className="flex items-center gap-5 border-b border-gray-100 pb-5">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary">
                      <FaBus size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] text-gray-500 font-medium mb-1">Nearest Bus Stop</span>
                      <span className="text-[15px] font-bold text-gray-900">{venue.nearestBusStop}</span>
                    </div>
                  </div>
                )}


                {venue.nearestAirport && (
                  <div className="flex items-center gap-5 border-b border-gray-100 pb-5">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary">
                      <FaPlane size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] text-gray-500 font-medium mb-1">Nearest Airport</span>
                      <span className="text-[15px] font-bold text-gray-900">{venue.nearestAirport}</span>
                    </div>
                  </div>
                )}


                {venue.nearestRailwayStation && (
                  <div className="flex items-center gap-5 ">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary">
                      <FaTrain size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] text-gray-500 font-medium mb-1">Nearest Train Station</span>
                      <span className="text-[15px] font-bold text-gray-900">{venue.nearestRailwayStation}</span>
                    </div>
                  </div>
                )}




              </div>


              {!dbEvent.isOnline && (
                <div className="w-full lg:w-[30%] h-80 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 relative flex items-center justify-center">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full z-0"
                  ></iframe>


                  <div
                    className="absolute z-10 pointer-events-none text-[#ea4335]"
                    style={{ filter: "drop-shadow(0px 3px 2px rgba(0,0,0,0.3))", transform: "translateY(-50%)" }}
                  >
                    <FaMapMarkerAlt size={40} />
                  </div>
                </div>
              )}

            </div>



          </div>
        </div>
      )}


      <div className=' bg-primary text-white'>
        <div className='w-350 mx-auto max-w-full px-5 py-4'>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">


            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-primary font-bold text-lg uppercase shrink-0">
                {(dbEvent?.organizerName || organizer?.hostName || organizer?.name || "O").charAt(0)}
              </div>
              <div className="flex flex-col gap-">
                <h3 className="text-[18px] font-bold text-white">{dbEvent?.organizerName || organizer?.hostName || organizer?.name || "Event Organizer"}</h3>
                {contact.primaryNumber && (
                  <p className="text-[14px] text-white font-semibold">Contact No. : {contact.primaryNumber}</p>
                )}
                {/* {whatsappNumber && (
           <a
             href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I am interested in ${dbEvent?.fairName || "this event"}.`)}`}
             target="_blank"
             rel="noreferrer"
             className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-gray-100"
           >
             Chat with Organizer on WhatsApp
           </a>
         )} */}
              </div>
            </div>


            <div className="flex items-center gap-2.5">
              <span className="mr-2">Follow us on : </span>
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-primary hover:bg-gray-100 transition-colors"><FaFacebookF size={14} /></a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-primary hover:bg-gray-100 transition-colors"><FaInstagram size={14} /></a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-primary hover:bg-gray-100 transition-colors"><FaLinkedinIn size={14} /></a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-primary hover:bg-gray-100 transition-colors"><FaXTwitter size={14} /></a>
              )}
            </div>

          </div>
        </div>
      </div>

    </>
  );
};

export default EventLocation;
