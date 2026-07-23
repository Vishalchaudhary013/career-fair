import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, X, Building } from "lucide-react";
import Navbar from "../section/Navbar";
import Footer from "../section/Footer";
import { getAllEvents } from "../services/eventService";
import { getMediaUrl } from "../services/api";
import { MdKeyboardArrowRight } from "react-icons/md";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Pastel color palette for events (cycles by index)
const EVENT_COLORS = [
  "bg-violet-100 text-violet-800 border-violet-200",
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-pink-100 text-pink-800 border-pink-200",
  "bg-emerald-100 text-emerald-800 border-emerald-200",
  "bg-orange-100 text-orange-800 border-orange-200",
  "bg-cyan-100 text-cyan-800 border-cyan-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-rose-100 text-rose-800 border-rose-200",
];

function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  // Accepts "YYYY-MM-DD" or ISO strings
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  // Return as local date (yyyy, mm, dd)
  const [year, month, day] = dateStr.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

const EventCalendarPage = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null); // { date, fairs }
  const [view, setView] = useState("month"); // "month" | "list"

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Map of "YYYY-MM-DD" → fairs[]
  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((event, idx) => {
      const startStr = event.startDate?.slice(0, 10);
      const endStr = event.endDate?.slice(0, 10) || startStr;
      if (!startStr) return;
      
      const start = parseLocalDate(startStr);
      const end = parseLocalDate(endStr);
      if (!start || !end) return;

      let current = new Date(start);
      let loopCount = 0;
      while (current <= end && loopCount < 365) {
        const y = current.getFullYear();
        const m = String(current.getMonth() + 1).padStart(2, "0");
        const d = String(current.getDate()).padStart(2, "0");
        const dStr = `${y}-${m}-${d}`;
        
        if (!map[dStr]) map[dStr] = [];
        map[dStr].push({ ...event, _colorIdx: idx % EVENT_COLORS.length });
        
        current.setDate(current.getDate() + 1);
        loopCount++;
      }
    });
    return map;
  }, [events]);

  // Days to render for this month grid
  const calendarDays = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const days = [];

    // Pad with prev month days
    for (let i = 0; i < first.getDay(); i++) {
      const d = new Date(year, month, -first.getDay() + i + 1);
      days.push({ date: d, current: false });
    }
    // Current month days
    for (let d = 1; d <= last.getDate(); d++) {
      days.push({ date: new Date(year, month, d), current: true });
    }
    // Pad with next month days to complete 6 rows
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ date: new Date(year, month + 1, d), current: false });
    }
    return days;
  }, [year, month]);

  const currentYear = today.getFullYear();
  const years = Array.from({ length: 16 }, (_, i) => currentYear - 5 + i); // from currentYear - 5 to currentYear + 10

  const prevMonth = () => {
    setMonth((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const nextMonth = () => {
    setMonth((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  const toKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const isToday = (d) => toKey(d) === toKey(today);

  // List view — all fairs this month sorted by date
  const monthEvents = useMemo(() => {
    return events
      .filter(e => {
        const ds = e.startDate?.slice(0, 10);
        if (!ds) return false;
        const [y, m] = ds.split("-").map(Number);
        return y === year && m - 1 === month;
      })
      .sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));
  }, [events, year, month]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      {/* Page container */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-8 pt-28 pb-16">

        {/*  Top Bar  */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">Fair Calendar</h1>
              <p className="text-gray-500 text-sm mt-1">Browse all fairs by date</p>
            </div>

            {/* Select Dropdown Filters */}
            
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View toggle */}

            <div className="flex items-center gap-2 mt-2 sm:mt-0">

              <div className="bg-white border border-gray-200 rounded-lg px-1.5 py-2 text-sm font-semibold text-gray-700 shadow-sm flex items-center gap-1.5 cursor-pointer">
                <Calendar size={18}/>
              <select

                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className=" focus:outline-none focus:border-primary cursor-pointer"
              >
                {MONTHS.map((mName, idx) => (
                  <option key={idx} value={idx}>{mName}</option>
                ))}
              </select>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg px-1.5 py-2 text-sm font-semibold text-gray-700 shadow-sm flex items-center gap-1.5 cursor-pointer">
                 <Calendar size={18}/>
                <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="focus:outline-none focus:border-primary"
              >
                {years.map((yVal) => (
                  <option key={yVal} value={yVal}>{yVal}</option>
                ))}
              </select>
              </div>
            </div>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => setView("month")}
                className={`px-4 py-2 text-sm font-medium transition ${view === "month" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}`}
              >
                Month
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-4 py-2 text-sm font-medium border-l border-gray-200 transition ${view === "list" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}`}
              >
                List
              </button>
            </div>

            {/* Navigation */}
            {/* <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-sm px-2 py-1">
              <button onClick={prevMonth} className="p-1.5 rounded hover:bg-gray-100 transition cursor-pointer">
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
              <button onClick={goToday} className="px-3 py-1 text-sm font-semibold text-primary hover:bg-secondary/5 rounded transition cursor-pointer">
                Today
              </button>
              <button onClick={nextMonth} className="p-1.5 rounded hover:bg-gray-100 transition cursor-pointer">
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            </div> */}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center mt-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : view === "month" ? (

          /*  MONTH VIEW  */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Day headers */}
            {/* <div className="grid grid-cols-7 border-b border-gray-100">
              {DAYS.map(day => (
                <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div> */}

            {/* Day cells — 6 rows × 7 cols */}
            <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
              {calendarDays.map(({ date, current }, i) => {
                const key = toKey(date);
                const dayEvents = eventsByDate[key] || [];
                const todayCell = isToday(date);

                return (
                  <div
                    key={i}
                    onClick={() => dayEvents.length > 0 && setSelectedDay({ date, fairs: dayEvents })}
                    className={`min-h-[110px] p-2 flex flex-col ${current ? "bg-white" : "bg-gray-50/60"} ${dayEvents.length > 0 ? "cursor-pointer hover:bg-blue-50/30 transition-colors" : ""}`}
                  >
                    {/* Date number */}
                    <span className={`text-sm font-semibold self-start w-7 h-7 flex items-center justify-center rounded-full mb-1 transition-colors ${todayCell ? "bg-primary text-white" : current ? "text-gray-800" : "text-gray-400"}`}>
                      {date.getDate()}
                    </span>

                    {/* Fair pills */}
                    <div className="flex flex-col gap-1 flex-1">
                      {dayEvents.slice(0, 2).map((event, ei) => (
                        <div
                          key={event._id}
                          className={`text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded border truncate ${EVENT_COLORS[event._colorIdx]}`}
                        >
                          {event.fairName}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-[10px] text-gray-500 font-medium pl-1">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        ) : (

          /*  LIST VIEW  */
          <div className="space-y-3">
            {monthEvents.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Calendar size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No fairs in {MONTHS[month]} {year}</p>
              </div>
            ) : monthEvents.map((event, idx) => {
              let isOnline = false;
              if (typeof event.venue === 'string') {
                isOnline = true;
              } else if (event.venue) {
                const vn = event.venue.venueName?.toLowerCase() || "";
                const c = event.venue.city?.toLowerCase() || "";
                if (vn.includes("online") || vn.startsWith("http") || c.includes("online")) {
                  isOnline = true;
                }
              }

              let displayCity = "";
              let displayVenue = "";
              if (isOnline) {
                displayVenue = "Online";
              } else if (event.venue && typeof event.venue !== 'string') {
                displayCity = event.venue.city || "";
                displayVenue = event.venue.venueName || "Location TBD";
              } else {
                displayVenue = "Location TBD";
              }

              const date = parseLocalDate(event.startDate);
              const colorClass = EVENT_COLORS[idx % EVENT_COLORS.length];

              let imageUrl = "";
              if (event.fairBanner) imageUrl = event.fairBanner.startsWith("http") ? event.fairBanner : getMediaUrl(event.fairBanner);

              return (
                <Link to={`/event/${event._id}`} key={event._id}>
                  <div className="flex justify-between items-center bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                    <div className="flex gap-4 items-center p-4 flex-1 min-w-0">
                      {/* Date badge */}
                      <div className={`shrink-0 w-16 py-2 rounded-xl flex flex-col items-center justify-center border ${colorClass}`}>
                        <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">{date ? date.toLocaleDateString('en-US', { weekday: 'short' }) : "—"}</span>
                        <span className="text-xl font-black leading-none my-0.5">{date ? date.getDate() : "—"}</span>
                        <span className="text-xs font-bold uppercase">{date ? MONTHS[date.getMonth()].slice(0, 3) : "—"}</span>
                      </div>

                      {/* Thumbnail */}
                      {imageUrl && (
                        <img src={imageUrl} alt={event.fairName} className="hidden sm:block w-17 h-17 rounded-lg object-cover shrink-0" />
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xl text-primary truncate group-hover:text-primary transition-colors" title={event.fairName}>
                          {event.fairName}
                        </h3>

                        {event.category && (
                          <span className="mt-1.5 inline-block text-[10px] font-semibold uppercase tracking-wide bg-primary/8 text-primary px-2 py-0.5 rounded-full">
                            {event.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-stretch self-stretch shrink-0">
                      <div className="hidden md:flex items-center border-l border-gray-200 px-4 w-32 shrink-0">
                        <span className="text-sm text-gray-700 flex items-center gap-1.5 truncate" title={displayCity || (isOnline ? "Online" : "TBD")}>
                          <MapPin size={16} className="shrink-0" />
                          <span className="truncate">{displayCity || (isOnline ? "Online" : "TBD")}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center px-4  w-36 md:w-56 shrink-0">
                        <span className="text-sm text-gray-700 flex items-center gap-1.5 truncate" title={displayVenue}>
                          <Building size={16} className="shrink-0" />
                          <span className="truncate">{displayVenue}</span>
                        </span>
                      </div>

                      <div className="flex items-center pl-2 pr-4">
                        <MdKeyboardArrowRight size={16} className="text-white bg-primary w-5 h-5 rounded-full shrink-0" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/*  Day Detail Modal  */}
      {selectedDay && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedDay(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{DAYS[selectedDay.date.getDay()]}</p>
                <h2 className="text-lg font-bold text-primary">
                  {selectedDay.date.getDate()} {MONTHS[selectedDay.date.getMonth()]} {selectedDay.date.getFullYear()}
                </h2>
              </div>
              <button onClick={() => setSelectedDay(null)} className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Fairs list */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
              {selectedDay.fairs.map((event) => {
                const isOnline = event.venue?.venueOption === "online";
                const location = isOnline ? "Online" : (event.venue?.venueName || event.venue?.city || "Location TBD");
                let imageUrl = "";
                if (event.fairBanner) imageUrl = event.fairBanner.startsWith("http") ? event.fairBanner : getMediaUrl(event.fairBanner);

                return (
                  <Link
                    to={`/event/${event._id}`}
                    key={event._id}
                    onClick={() => setSelectedDay(null)}
                    className="block"
                  >
                    <div className={`rounded-xl border p-3 hover:shadow-md transition-all group ${EVENT_COLORS[event._colorIdx]}`}>
                      <div className="flex gap-3 items-start">
                        {imageUrl && (
                          <img src={imageUrl} alt={event.fairName} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                        )}
                        <div className="flex-1 min-w-0 font-medium">
                          <h3 className="font-bold text-sm truncate group-hover:underline">
                            {event.fairName}
                          </h3>
                          {event.startDate && (
                            <p className="text-xs mt-0.5 flex items-center gap-1 opacity-80">
                              <Clock size={10} />
                              {formatTime(event.startDate?.slice(11, 16))}
                            </p>
                          )}
                          <p className="text-xs mt-0.5 flex items-center gap-1 opacity-80">
                            <MapPin size={10} /> {location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventCalendarPage;
