import { useState, useEffect } from "react";
import { MapPin, RotateCcw, ExternalLink, CheckCircle2 } from "lucide-react";

const extractCoordsFromUrl = (url) => {
  if (!url) return null;
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return { lat: parseFloat(atMatch[1]), lon: parseFloat(atMatch[2]) };

  const dMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (dMatch) return { lat: parseFloat(dMatch[1]), lon: parseFloat(dMatch[2]) };

  const qMatch = url.match(/(?:q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) return { lat: parseFloat(qMatch[1]), lon: parseFloat(qMatch[2]) };

  return null;
};

const LocationTab = ({
  venueOption,
  setVenueOption,
  venueName,
  setVenueName,
  street1,
  setStreet1,
  street2, setStreet2,
  city, setCity,
  pinCode, setPinCode,
  nearestBusStop, setNearestBusStop,
  nearestAirport,
  setNearestAirport,
  nearestTrainStation,
  setNearestTrainStation,
  locationLink,
  setLocationLink,
  resetLocation,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [venueSuggestions, setVenueSuggestions] = useState([]);
  const [showVenueSuggestions, setShowVenueSuggestions] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lon: 77.5946 }); // Default to Bangalore
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!locationLink || !locationLink.trim()) return;

    const coords = extractCoordsFromUrl(locationLink);
    if (coords) {
      setMapCenter(coords);
    } else {
      const placeMatch = locationLink.match(/\/place\/([^\/@\?]+)/);
      if (placeMatch) {
        const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`)
          .then(res => res.json())
          .then(data => {
            if (data && data[0]) {
              setMapCenter({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) });
            }
          })
          .catch(err => console.error("Error geocoding place from link:", err));
      }
    }
  }, [locationLink]);

  useEffect(() => {
    if (city.length < 2) {
      setSuggestions([]);
      return;
    }
    if (!showSuggestions) return;

    const delay = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=5`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data);
        })
        .catch(err => console.error("Error fetching cities:", err));
    }, 500);

    return () => clearTimeout(delay);
  }, [city, showSuggestions]);

  useEffect(() => {
    if (venueName.length < 3) {
      setVenueSuggestions([]);
      return;
    }
    if (!showVenueSuggestions) return;

    const delay = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(venueName)}&format=json&addressdetails=1&limit=5`)
        .then(res => res.json())
        .then(data => {
          setVenueSuggestions(data);
        })
        .catch(err => console.error("Error fetching venues:", err));
    }, 500);

    return () => clearTimeout(delay);
  }, [venueName, showVenueSuggestions]);

  const handleCitySelect = (s) => {
    const cityName = s.name || s.display_name.split(',')[0];
    setCity(cityName);
    setMapCenter({ lat: parseFloat(s.lat), lon: parseFloat(s.lon) });
    setShowSuggestions(false);
  };

  const handleVenueSelect = (s) => {
    const vName = s.name || s.display_name.split(',')[0];
    setVenueName(vName);
    
    const address = s.address || {};
    const extractedCity = address.city || address.town || address.village || address.county || address.state_district || "";
    if (extractedCity) {
      setCity(extractedCity);
    }
    
    setMapCenter({ lat: parseFloat(s.lat), lon: parseFloat(s.lon) });
    setShowVenueSuggestions(false);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setShowSuggestions(true);
  };

  const lat = mapCenter.lat;
  const lon = mapCenter.lon;
  const bbox = `${lon - 0.05},${lat - 0.05},${lon + 0.05},${lat + 0.05}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;

  return (
  <div className="w-full space-y-7 animate-in fade-in duration-200">
    <div>
      <h3 className="text-sm font-semibold text-primary mb-3">Venue Details</h3>
      <div className="flex flex-wrap items-center gap-6 sm:gap-8">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="venueOption" value="address" checked={venueOption === "address"} onChange={() => setVenueOption("address")} className="w-4 h-4 accent-primary cursor-pointer" />
          <span className="text-sm font-medium text-gray-700">Add Venue Address</span>
        </label>
        {/* <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="venueOption" value="online" checked={venueOption === "online"} onChange={() => { setVenueOption("online"); setCity("Online"); }} className="w-4 h-4 accent-primary cursor-pointer" />
          <span className="text-sm font-medium text-gray-700">Online / Virtual Fair</span>
        </label> */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="venueOption" value="not-decided" checked={venueOption === "not-decided"} onChange={() => setVenueOption("not-decided")} className="w-4 h-4 accent-primary cursor-pointer" />
          <span className="text-sm font-medium text-gray-700">Venue not decided</span>
        </label>
      </div>
    </div>

    {venueOption === "address" && (
      <>
        <div>
          <h3 className="text-sm font-semibold text-primary mb-3">Fair Venue</h3>
          <div className="space-y-3 w-full">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Fair Venue Name</label>
              <div className="relative">
                <input type="text" placeholder="Venue Name (Search to locate on map)" value={venueName} onChange={(e) => { setVenueName(e.target.value); setShowVenueSuggestions(true); }} onFocus={() => setShowVenueSuggestions(true)} onBlur={() => setTimeout(() => setShowVenueSuggestions(false), 200)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
                {showVenueSuggestions && venueSuggestions.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {venueSuggestions.map((s) => (
                      <div key={s.place_id} onClick={() => handleVenueSelect(s)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                        {s.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Address Line 1</label>
              <input type="text" placeholder="Address Line 1" value={street1} onChange={(e) => setStreet1(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Address Line 2</label>
              <input type="text" placeholder="Address Line 2" value={street2} onChange={(e) => setStreet2(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                <div className="relative">
                  <input type="text" placeholder="City" value={city} onChange={handleCityChange} onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {suggestions.map((s) => (
                        <div key={s.place_id} onClick={() => handleCitySelect(s)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                          {s.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Pin Code / Zip Code</label>
                <input type="text" placeholder="Pin Code / Zip Code" value={pinCode || ""} onChange={(e) => setPinCode(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
              </div>
            </div>
            <div className="w-full space-y-2 mb-5">
              <label className="block text-xs font-semibold text-gray-700">Location Link (Google Maps URL)</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Location Link (e.g., https://maps.google.com/...)" 
                  value={locationLink || ""} 
                  onChange={(e) => { 
                    setLocationLink(e.target.value);
                    setIsVerified(false);
                  }} 
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" 
                />
                {locationLink && (
                  <a 
                    href={locationLink.startsWith("http") ? locationLink : `https://${locationLink}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-4 py-2.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition shrink-0"
                  >
                    <ExternalLink size={14} /> Open in Maps
                  </a>
                )}
              </div>

              {locationLink && (
                <label className="flex items-center gap-2 mt-1.5 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={isVerified} 
                    onChange={(e) => setIsVerified(e.target.checked)} 
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500 cursor-pointer accent-green-600" 
                  />
                  <span className={`text-xs font-semibold flex items-center gap-1 ${isVerified ? "text-green-700" : "text-gray-600"}`}>
                    {isVerified ? (
                      <>
                        <CheckCircle2 size={14} className="text-green-600 inline" /> Location verified on Map
                      </>
                    ) : (
                      "Verify location on map and mark tick"
                    )}
                  </span>
                </label>
              )}
            </div>
            <button onClick={resetLocation} className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline cursor-pointer">
          <RotateCcw size={13} /> Reset Location
        </button>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nearest Bus Stop</label>
                <input type="text" placeholder="Nearest Bus Stop" value={nearestBusStop || ""} onChange={(e) => setNearestBusStop(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nearest Airport</label>
                <input type="text" placeholder="Nearest Airport" value={nearestAirport || ""} onChange={(e) => setNearestAirport(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nearest Train Station</label>
                <input type="text" placeholder="Nearest Train Station" value={nearestTrainStation || ""} onChange={(e) => setNearestTrainStation(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
              </div>
            </div>
            
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-primary mb-3">Location Map</h3>
          <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 w-full h-[280px]">
            {(!city || !city.trim()) && (!venueName || !venueName.trim()) && (!locationLink || !locationLink.trim()) && (
              <div className="absolute inset-0 z-10 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                <MapPin size={52} className="text-secondary mb-3 drop-shadow-lg" fill="currentColor" />
                <span className="text-2xl font-black text-secondary drop-shadow-md tracking-wider uppercase">Location Not Selected</span>
                <span className="text-sm font-medium mt-2 opacity-90">Please enter a City or Venue above</span>
              </div>
            )}
            <iframe title="location-map" src={mapSrc} width="100%" height="100%" style={{ border: 0, display: "block" }} loading="lazy" />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-primary">
            <MapPin size={13} /> Drag and drop marker to adjust location
          </p>
        </div>
      </>
    )}

    {venueOption === "online" && (
      <div className="w-full space-y-5 animate-in fade-in duration-200">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Meeting/Streaming Platform (Optional)</label>
          <input 
            type="text" 
            placeholder="e.g. Zoom, Microsoft Teams, YouTube Live, etc." 
            value={venueName} 
            onChange={(e) => setVenueName(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Virtual fair Location / Region (For local targeting)</label>
          <input 
            type="text" 
            placeholder="e.g. Online, India, Bengaluru" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" 
          />
        </div>
        <p className="text-xs text-gray-500 font-medium">
          Note: This is an online event. The streaming details can be updated anytime before the fair starts.
        </p>
      </div>
    )}

    {venueOption === "not-decided" && (
      <div className="w-full">
        <label className="block text-sm font-semibold text-gray-800 mb-2">City</label>
        <div className="relative">
          <input type="text" placeholder="Enter City" value={city} onChange={handleCityChange} onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {suggestions.map((s) => (
                <div key={s.place_id} onClick={() => handleCitySelect(s)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                  {s.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
  );
};

export default LocationTab;
