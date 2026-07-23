import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../section/Navbar';
import Footer from '../section/Footer';
import EventFairsCard from '../cards/EventFairsCard';
import { getAllEvents } from '../services/eventService';
import { FiFilter, FiCalendar, FiMonitor, FiTag, FiChevronDown, FiMenu, FiGrid, FiList } from 'react-icons/fi';
import { GalleryVertical, LucideListFilter, Globe } from 'lucide-react';
import { IoPricetagOutline } from 'react-icons/io5';
import { MdSort } from "react-icons/md";
const CATEGORIES = [
  "All Categories",
  "Internship ",
  "Job ",
  "Apprenticeship "
];

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchParams] = useSearchParams();
  const filterType = searchParams.get('type');
  const filterParam = searchParams.get('filter');

  const initialCategory = React.useMemo(() => {
    if (filterType === "Internship") return "Internship ";
    if (filterType === "Job") return "Job ";
    if (filterType === "Apprenticeship") return "Apprenticeship ";
    return "All Categories";
  }, [filterType]);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    if (filterType === "Internship") setSelectedCategory("Internship ");
    else if (filterType === "Job") setSelectedCategory("Job ");
    else if (filterType === "Apprenticeship") setSelectedCategory("Apprenticeship ");
    else setSelectedCategory("All Categories");
  }, [filterType]);
  const [sortOrder, setSortOrder] = useState('newToOld');
  const [viewMode, setViewMode] = useState('grid');

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedMode, setSelectedMode] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data || []);
      } catch (error) {
        console.error("Failed to load fairs:", error);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = React.useMemo(() => {
    let filtered = fairs;

    if (selectedCategory && selectedCategory !== "All Categories") {
      const typeMap = {
        "Internship ": "Internship",
        "Job ": "Job",
        "Apprenticeship ": "Apprenticeship"
      };
      const typeToFilter = typeMap[selectedCategory];
      if (typeToFilter) {
        filtered = filtered.filter(e => e.fairType === typeToFilter);
      }
    } else if (filterType) {
      filtered = filtered.filter(e => e.fairType === filterType);
    }

    if (filterParam === 'upcoming') {
      const now = new Date();
      filtered = filtered.filter(e => {
        const dateStr = e.endDate || e.startDate || e.basicInfo?.endDate || e.basicInfo?.startDate;
        const dateToCheck = dateStr ? new Date(dateStr) : null;
        return !dateToCheck || dateToCheck >= now;
      });
    } else if (filterParam === 'past') {
      const now = new Date();
      filtered = filtered.filter(e => {
        const dateStr = e.endDate || e.startDate || e.basicInfo?.endDate || e.basicInfo?.startDate;
        const dateToCheck = dateStr ? new Date(dateStr) : null;
        return dateToCheck && dateToCheck < now;
      });
    }


    if (selectedMonth) {
      filtered = filtered.filter(e => {
        if (!e.startDate) return false;
        const eventMonth = new Date(e.startDate).getMonth() + 1;
        return eventMonth.toString() === selectedMonth;
      });
    }


    if (selectedDateRange && selectedDateRange !== 'all') {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      filtered = filtered.filter(e => {
        if (!e.startDate) return false;
        const eventDate = new Date(e.startDate);

        switch (selectedDateRange) {
          case 'today':
            return eventDate >= todayStart && eventDate < todayEnd;
          case 'last7':
            const sevenDaysAgo = new Date(todayStart);
            sevenDaysAgo.setDate(todayStart.getDate() - 7);
            return eventDate >= sevenDaysAgo && eventDate < todayEnd;
          case 'thisYear':
            return eventDate.getFullYear() === now.getFullYear();
          case 'lastYear':
            return eventDate.getFullYear() === now.getFullYear() - 1;
          default:
            return true;
        }
      });
    }


    if (selectedPrice) {
      filtered = filtered.filter(e => {
        const hasTickets = e.tickets && e.tickets.length > 0;


        if (!hasTickets) return selectedPrice === 'free';

        const hasPaid = e.tickets.some(t => t.category === "Paid" && t.price > 0);

        if (selectedPrice === 'paid') return hasPaid;
        if (selectedPrice === 'free') return !hasPaid;
        return true;
      });
    }


    if (selectedMode) {
      filtered = filtered.filter(e => {
        let isOnline = false;
        if (typeof e.venue === 'string') {
          isOnline = true;
        } else if (e.venue && e.venue.city) {
          let locStr = e.venue.city;
          if (e.venue.venueName && e.venue.venueName !== "Online Meeting") {
            locStr = `${e.venue.venueName}, ${locStr}`;
          }
          if (locStr.toLowerCase().includes("online")) {
            isOnline = true;
          }
        }

        if (selectedMode === 'online') return isOnline;
        if (selectedMode === 'offline') return !isOnline;
        return true;
      });
    }


    if (sortOrder === 'newToOld') {
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortOrder === 'oldToNew') {
      filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    }

    return filtered;
  }, [events, filterType, filterParam, selectedCategory, sortOrder, selectedMonth, selectedDateRange, selectedPrice, selectedMode]);

  const pageTitle = filterType
    ? `${filterType} Fairs`
    : filterParam === 'past'
      ? 'Past Fairs'
      : 'Upcoming Fairs';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Navbar />
      <div className="flex-grow pt-30 pb-20">
        <div className="w-full max-w-[1400px] mx-auto px-4 ">

          <div className="flex-shrink-0 mb-8">
            <h1 className="text-3xl font-bold text-primary mb-1">{pageTitle}</h1>
            <p className="text-sm text-gray-500">Showing {filteredEvents.length} fairs</p>
          </div>


          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-gray-200">
            <div className="flex flex-col xl:flex-row xl:items-center gap-6 xl:gap-10">


              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-700 font-semibold whitespace-nowrap mr-1">
                  <LucideListFilter size={20} />
                  Quick Filters :
                </div>

                <div className="relative">
                  <select
                    className="appearance-none pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none  cursor-pointer w-36 "
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="">Month</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                <div className="relative ">
                  <select
                    className="appearance-none pl-9 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none  cursor-pointer w-40 "
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="today">Today</option>
                    <option value="last7">Last 7 days</option>
                    <option value="thisYear">This year (2026)</option>
                    <option value="lastYear">Last year (2025)</option>
                  </select>
                  <GalleryVertical size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    className="appearance-none pl-9 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none  cursor-pointer w-32"
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                  >
                    <option value="">Price</option>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                  <IoPricetagOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    className="appearance-none pl-9 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none cursor-pointer w-32"
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                  >
                    <option value="">Mode</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="relative">
                <select
                  className="appearance-none pl-9 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none  cursor-pointer "
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="sort">Sort</option>
                  <option value="newToOld">New to old</option>
                  <option value="oldToNew">Old to new</option>
                </select>
                <MdSort className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>

              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1 ">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  <FiGrid className="text-lg" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  <FiList className="text-lg" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">


            <div className="w-full md:w-[260px] flex-shrink-0">
              <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-gray-800">
                    <FiFilter className="text-xl" />
                    <h2 className="text-lg font-bold">Filters</h2>
                  </div>

                  {(selectedCategory !== "All Categories" || selectedMonth !== '' || selectedDateRange !== 'all' || selectedPrice !== '' || selectedMode !== '') && (
                    <button
                      onClick={() => {
                        setSelectedCategory("All Categories");
                        setSelectedMonth('');
                        setSelectedDateRange('all');
                        setSelectedPrice('');
                        setSelectedMode('');
                      }}
                      className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-500 tracking-wider mb-4 uppercase">Category</h3>
                  <div className="space-y-3.5">
                    {CATEGORIES.map((cat) => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          checked={selectedCategory === cat}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4 text-primary bg-gray-100 border-gray-300  cursor-pointer accent-primary"
                        />
                        <span className={`text-[14px] ${selectedCategory === cat ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>


            <div className="flex-grow">
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2' : 'grid-cols-1'}`}>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map(event => (
                    <EventFairsCard key={event._id} event={event} viewMode={viewMode} />
                  ))
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 col-span-full flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <i className="bi bi-calendar-x text-2xl text-gray-400"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No fairs found</h3>
                    <p className="text-gray-500">We couldn't find any fairs matching your selected filters.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory("All Categories");
                        setSelectedMonth('');
                        setSelectedDateRange('all');
                        setSelectedPrice('');
                        setSelectedMode('');
                      }}
                      className="mt-4 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllEventsPage;
