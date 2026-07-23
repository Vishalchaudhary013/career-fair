/**
 * Job Fair List with Filters + Chips + 3 Tabs (Upcoming / Registration Closed / Past Events)
 */
import { useEffect, useState } from "react";

import { Search } from "lucide-react";
import axios from "axios";
import { SERVER_URL } from "../../config";
import JobFairCard from "../cards/JobFairCard";

// CHIP VALUES
const fairTypes = [
  "All",
  "Career Fair",
  "Education Fair",
  "Career & Education Fair",
  "Conference",
];

const JobFairList = () => {
  const [jobFairs, setJobFairs] = useState([]);
  const [filteredFairs, setFilteredFairs] = useState([]);

  // filters
  const [searchName, setSearchName] = useState("");
  const [selectedFairType, setSelectedFairType] = useState("All");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [searchYear, setSearchYear] = useState("");

  // Tabs: upcoming | registrationClosed | past
  const [activeTab, setActiveTab] = useState("upcoming");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobFairsPerPage = 15;

  const today = new Date();

  const isRegistrationClosed = (regDate) => new Date(regDate) < today;

  const isPastEvent = (endDate) => new Date(endDate) < today;

  /** ---------------------------
   * Fetch job fairs
   ----------------------------*/
  useEffect(() => {
    const fetchJobFairs = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/jobFair/all`);
        setJobFairs(res.data);
        setFilteredFairs(res.data);
      } catch (err) {
        console.error("Error fetching job fairs:", err);
      }
    };
    fetchJobFairs();
  }, []);

  /** ---------------------------
   * APPLY ALL FILTERS
   ----------------------------*/
  useEffect(() => {
    let events = [...jobFairs];

    // FILTER: Search by Name events = events.filter((event) =>
      event.jobFairName.toLowerCase().includes(searchName.toLowerCase())
  

    // FILTER: Fair Type Chip
    if (selectedFairType !== "All") { events = events.filter(
        (event) => event.fairType?.trim() === selectedFairType
      );
    }

    // FILTER: Location
    if (searchLocation.trim() !== "") { events = events.filter((event) =>
        event.venue?.city?.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // FILTER: Month
    if (searchMonth) { events = events.filter(
        (event) =>
          new Date(event.jobFairStart).getMonth() + 1 === parseInt(searchMonth)
      );
    }

    // FILTER: Year
    if (searchYear) { events = events.filter(
        (event) =>
          new Date(event.jobFairStart).getFullYear() === parseInt(searchYear)
      );
    }

    // ---------------------------
    // TABS LOGIC (FINAL)
    // ---------------------------
    if (activeTab === "upcoming") { events = events.filter(
        (event) =>
          !isRegistrationClosed(event.registrationDateTime) && // registration open
          !isPastEvent(event.jobFairEnd) // fair not ended
      );
    }

    if (activeTab === "registrationClosed") { events = events.filter(
        (event) =>
          isRegistrationClosed(event.registrationDateTime) && // registration closed
          !isPastEvent(event.jobFairEnd) // fair NOT ended
      );
    }

    if (activeTab === "past") { events = events.filter((event) => isPastEvent(event.jobFairEnd)); // fair ended
    }

    setFilteredFairs(events);
    setCurrentPage(1);
  }, [
    searchName,
    selectedFairType,
    searchLocation,
    searchMonth,
    searchYear,
    activeTab,
    jobFairs,
  ]);

  /** Pagination Logic */
  const totalPages = Math.ceil(filteredFairs.length / jobFairsPerPage);
  const indexOfLast = currentPage * jobFairsPerPage;
  const indexOfFirst = indexOfLast - jobFairsPerPage;
  const currentFairs = filteredFairs.slice(indexOfFirst, indexOfLast);

  const months = [
    { num: 1, name: "January" },
    { num: 2, name: "February" },
    { num: 3, name: "March" },
    { num: 4, name: "April" },
    { num: 5, name: "May" },
    { num: 6, name: "June" },
    { num: 7, name: "July" },
    { num: 8, name: "August" },
    { num: 9, name: "September" },
    { num: 10, name: "October" },
    { num: 11, name: "November" },
    { num: 12, name: "December" },
  ];

  const years = Array.from(
    new Set(jobFairs.map((jf) => new Date(jf.jobFairStart).getFullYear()))
  );

  return (
    <div className="job-fair-list">
      {/* 🔵 HEADER */}
      <div className="job-fair-header">
        <div className="wave-bg"></div>
        <h2 className="section-title">Upcoming Job Fairs</h2>
        <p className="section-subtitle">
          Discover opportunities that match your career goals
        </p>

        <div className="search-container">
          <div className="search-input flex border border-gray-300 rounded overflow-hidden">
            <span className="search-icon px-3 flex items-center bg-gray-50 text-gray-500 border-r border-gray-300">
              <Search size={20} />
            </span>
            <input
              type="text"
              placeholder="Search by Job Fair Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="search-field w-full px-3 py-2 outline-none"
            />
          </div>
        </div>
      </div>

      {/* FILTER CHIPS */}
   <div className="mt-4">

  <div className="d-flex flex-wrap gap-2 items-center justify-between">

    {/* Chips */}
    <div className="flex gap-[10px]">
      {fairTypes.map((type) => (
        <button
          key={type}
          onClick={() => setSelectedFairType(type)}
          className={`
            px-[20px] py-[6px] rounded-pill fw-semibold transition-all duration-200
            border 
            ${
              selectedFairType === type
                ? "bg-primary text-white border-primary shadow-md"
                : "bg-white text-dark border-gray-300 hover:border-primary hover:bg-[#eef5ff] hover:shadow-sm"
            }
          `}
        >
          {type}
        </button>
      ))}
    </div>

    {/* ⭐ BETTER TABS */}
    <div className="d-flex justify-content-end gap-3">

      {[
        { key: "upcoming", label: "Upcoming" },
        { key: "registrationClosed", label: "Registration Closed" },
        { key: "past", label: "Past Fairs" },
      ].map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`
            relative px-4 py-2 fw-semibold rounded transition-all duration-200 border
            ${
              activeTab === tab.key
                ? "bg-white border-primary text-primary shadow-sm"
                : "bg-white text-dark border-gray-300 hover:border-primary hover:shadow-sm"
            }
          `}
        >
          {tab.label}

          {/* active underline */}
          {activeTab === tab.key && (
            <span className="position-absolute start-50 translate-middle-x" style={{
              bottom: "-4px",
              width: "55%",
              height: "3px",
              backgroundColor: "#0d6efd",
              borderRadius: "50px"
            }} />
          )}
        </button>
      ))}

    </div>
  </div>

  {/* FILTER BAR ROW */}
  <div
    className="
      d-flex align-items-center justify-content-between flex-wrap 
      mt-4 gap-3 
      bg-white w-[1000px] mx-auto 
      px-[30px] py-[14px] rounded-[40px] 
      shadow-[0_4px_12px_rgba(0,0,0,0.08)]
      border border-gray-200
    "
  >

    {/* LEFT: FILTER TITLE */}
    <div className="d-flex align-items-center gap-2">
      <i className="bi bi-funnel fs-5 text-primary"></i>
      <h6 className="m-0 fw-semibold">Filters</h6>
    </div>

    {/* CENTER FILTERS */}
    <div className="d-flex flex-wrap gap-3 flex-grow-1 justify-content-center">

      {/* Location */}
      <input
        type="text"
        placeholder="Location"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
        className="w-auto text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
        style={{
          minWidth: "170px",
          height: "38px",
          borderColor: "#d0d5dd"
        }}
      />

      {/* Month */}
      <select
        value={searchMonth}
        onChange={(e) => setSearchMonth(e.target.value)}
        className="w-auto text-sm px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary"
        style={{
          minWidth: "150px",
          height: "38px",
          borderColor: "#d0d5dd"
        }}
      >
        <option value="">Month</option>
        {months.map((m) => (
          <option key={m.num} value={m.num}>{m.name}</option>
        ))}
      </select>

      {/* Year */}
      <select
        value={searchYear}
        onChange={(e) => setSearchYear(e.target.value)}
        className="w-auto text-sm px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary"
        style={{
          minWidth: "130px",
          height: "38px",
          borderColor: "#d0d5dd"
        }}
      >
        <option value="">Year</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

    </div>

    {/* RIGHT: CLEAR FILTERS BUTTON */}
    <button
      onClick={() => {
        setSearchLocation("");
        setSearchMonth("");
        setSearchYear("");
        setSelectedFairType("All");
        setSearchName("");
      }}
      className="text-danger fw-semibold border-0 bg-transparent px-2"
      style={{ fontSize: "14px" }}
    >
      Clear Filters
    </button>

  </div>
</div>


      {/* GRID */}
      <div className="row mt-4">
        {currentFairs.length > 0 ? (
          currentFairs.map((jobFair) => (
            <div
              key={jobFair.jobFairId}
              className="col-12 col-md-6 col-lg-3 mb-4"
            >
              <JobFairCard
                jobFair={jobFair}
                isInactive={isPastEvent(jobFair.jobFairEnd)}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <p>No job fairs match your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobFairList;
