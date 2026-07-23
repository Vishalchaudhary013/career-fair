/**
 * 📋 StudentDetailList.jsx — FINAL POLISHED VERSION
 * ✅ Professional applied filters dropdown
 * ✅ Row-wise filter tags + no results message
 */

import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaFilter, FaTimes, FaTrash } from "react-icons/fa";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx-js-style";
import axios from "axios";
import { SERVER_URL } from "../../config";

function StudentDetailList() {
  const { jobFairId: jobFairParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { job } = location.state || {};
  const jobFairId = job?.jobFairId || jobFairParam;

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAppliedFilters, setShowAppliedFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
const [showModal, setShowModal] = useState(false);
const handleViewDetails = (student) => {
  setSelectedStudent(student);
  setShowModal(true);
};
// 🗑️ Delete a specific student
const handleDeleteStudent = async (studentId) => {
  if (!window.confirm("Are you sure you want to delete this student record? This action cannot be undone.")) {
    return;
  }

  try {
    await axios.delete(`${SERVER_URL}/api/studentDetail/students/${studentId}`);
    setStudents((prev) => prev.filter((s) => s._id !== studentId));
    setFilteredStudents((prev) => prev.filter((s) => s._id !== studentId));
    alert("✅ Student record deleted successfully!");
  } catch (error) {
    console.error("❌ Delete Error:", error);
    alert("Failed to delete student. Please try again.");
  }
};

// 📦 Convert students array → flat structure for export
const formatStudentData = (data) =>
  data.map((s, index) => ({
    "S.No": index + 1,
    "Full Name": s.personalDetails?.fullName || "-",
    "Email": s.personalDetails?.email || "-",
    "Contact Number": s.personalDetails?.contactNumber || "-",
    "Gender": s.personalDetails?.gender || "-",
    "City": s.personalDetails?.currentCity || "-",
    "Date of Birth": s.personalDetails?.dob
      ? new Date(s.personalDetails?.dob).toLocaleDateString()
      : "-",

    "Highest Qualification": s.academicDetails?.highestQualification || "-",
    "Discipline": s.academicDetails?.discipline || "-",
    "College / University": s.academicDetails?.collegeOrUniversity || "-",
    "College City": s.academicDetails?.collegeCity || "-",
    "Year of Graduation": s.academicDetails?.yearOfGraduation || "-",
    "Aggregate": s.academicDetails?.aggregate || "-",

    "Preferred Industries": s.careerPreferences?.preferredIndustry?.join(", ") || "-",
    "Desired Job Roles": s.careerPreferences?.desiredJobRole?.join(", ") || "-",
    "Preferred Locations": s.careerPreferences?.preferredLocations?.join(", ") || "-",
    "Willing to Relocate": s.careerPreferences?.willingToRelocate || "-",

    "LinkedIn": s.documentsAndLinks?.linkedinProfile || "-",
    "Portfolio / GitHub": s.documentsAndLinks?.portfolioOrGithub || "-",
    "Resume Link": s.documentsAndLinks?.resume
      ? `${SERVER_URL}/${s.documentsAndLinks.resume}`
      : "-",
    "Registration PDF": s.documentsAndLinks?.registrationPDF
      ? `${SERVER_URL}/${s.documentsAndLinks.registrationPDF}`
      : "-",

    "Heard From": s.declarationAndConsent?.heardFrom?.join(", ") || "-",
    "Attended Previous Fair": s.declarationAndConsent?.attendedPreviousFair || "-",
    "Declaration Confirmed": s.declarationAndConsent?.declarationConfirmed ? "Yes" : "No",
    "Consent to Share Profile": s.declarationAndConsent?.consentToShareProfile ? "Yes" : "No",
    "Date of Submission": s.declarationAndConsent?.dateOfSubmission
      ? new Date(s.declarationAndConsent?.dateOfSubmission).toLocaleDateString()
      : "-",
  }));

// 💾 Download as CSV
const handleDownloadCSV = () => {
  if (!filteredStudents.length) {
    alert("No student data available to download.");
    return;
  }

  const formattedData = formatStudentData(filteredStudents);
  const headers = Object.keys(formattedData[0]).join(",");
  const rows = formattedData.map((row) =>
    Object.values(row)
      .map((val) => `"${String(val).replace(/"/g, '""')}"`) // escape commas/quotes
      .join(",")
  );

  const csvContent = [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `Registered_Students_${jobFairId}.csv`);
};

// 📊 Download as Excel
// 📊 Download as Excel (Styled)
const handleDownloadExcel = () => {
  if (!filteredStudents.length) {
    alert("No student data available to download.");
    return;
  }

  const formattedData = formatStudentData(filteredStudents);

  // Create worksheet + workbook
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  // 🎨 Apply header styling
  const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
  const headerRow = headerRange.s.r; // First row index (0)
  for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
    const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: C });
    const cell = worksheet[cellAddress];
    if (cell) {
      cell.s = {
        fill: { fgColor: { rgb: "CCE5FF" } }, // Light Blue Background
        font: { bold: true, color: { rgb: "000000" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "AAAAAA" } },
          bottom: { style: "thin", color: { rgb: "AAAAAA" } },
          left: { style: "thin", color: { rgb: "AAAAAA" } },
          right: { style: "thin", color: { rgb: "AAAAAA" } },
        },
      };
    }
  }

  // 🧩 Auto column width
  const colWidths = Object.keys(formattedData[0]).map((key) => ({
    wch: Math.max(key.length + 5, 20), // Adjust width dynamically
  }));
  worksheet["!cols"] = colWidths;

  // 💾 Export file
  const excelFileName = `Registered_Students_${jobFairId}.xlsx`;
  XLSX.writeFile(workbook, excelFileName, { bookSST: true, type: "binary" });
};



  const dropdownRef = useRef(null);

  // Static options
  const qualificationsList = [
     "Bachelor of Technology (B.Tech)",
    "Bachelor of Science (B.Sc)",
    "Bachelor of Commerce (B.Com)",
    "Bachelor of Business Administration (BBA)",
    "Bachelor of Arts (BA)",
    "Bachelor of Computer Applications (BCA)",
    "Master of Technology (M.Tech)",
    "Master of Science (M.Sc)",
    "Master of Business Administration (MBA)",
    "Master of Arts (MA)",
    "Master of Computer Applications (MCA)",
    "Diploma in Engineering",
    "Diploma in Business Management",
    "Diploma in Hotel Management",
    "PG Diploma in Management",
    "PG Diploma in Data Science",
    "PG Diploma in Computer Applications",
    "PG Diploma in Journalism",
    "Science Stream",
    "Commerce Stream",
    "Vocational Training in IT",
    "Vocational Training in Healthcare",
    "Vocational Training in Retail Operations",
    "Other",
  ];

  const industriesList = [ 
      "IT Services",
      "Product Development",
      "Fintech",
      "Telecom",
      "E-commerce",
      "Automobile",
      "Manufacturing",
      "Aerospace",
      "Energy",
      "Construction",
      "Infrastructure",
      "Real Estate",
      "Urban Development",
      "Utilities",
      "Electronics",
      "Semiconductors",
      "Telecom",
      "Consumer Electronics",
      "Automation",
      "Tech",
      "Healthcare",
      "Finance",
      "Consulting",
      "Education",
      "Banking",
      "General Industry",
      "Pharma",
      "Agriculture",
      "Research",
      "Corporate",
      "Financial Services",
      "Government",
      "Policy Think Tanks",
      "FMCG",
      "Advertising",
      "Media",
      "Insurance",
      "Startups",
      "Retail",
      "Technology",
      "Services",
      "Publishing",
      "NGOs",
      "Defence",
      "Diagnostics"
  ];

  const jobRolesList = [
    "Software Developer",
    "Data Analyst",
    "Web Developer",
    "AI Engineer",
    "System Administrator",
    "Mechanical Engineer",
    "Design Engineer",
    "Maintenance Engineer",
    "Production Supervisor",
    "Civil Engineer",
    "Structural Engineer",
    "Site Engineer",
    "Project Manager",
    "Electrical Engineer",
    "Power Systems Engineer",
    "Automation Engineer",
    "Electronics Engineer",
    "Embedded Systems Engineer",
    "Testing Engineer",
    "Data Scientist",
    "ML Researcher",
    "IT Support Specialist",
    "Network Administrator",
    "Database Manager",
    "General Professional Role",
    "Biotech Researcher",
    "Lab Technician",
    "Clinical Data Analyst",
    "General Professional Role",
    "Software Engineer",
    "Accountant",
    "Tax Consultant",
    "Auditor",
    "Financial Analyst",
    "Investment Advisor",
    "Economic Analyst",
    "Research Associate",
    "Marketing Executive",
    "Brand Manager",
    "Digital Marketing Specialist",
    "HR Executive",
    "Talent Acquisition Specialist",
    "Training Coordinator",
    "Startup Founder",
    "Business Consultant",
    "Operations Manager",
    "Content Writer",
    "Editor",
    "Teacher",
    "Counselor",
    "HR Specialist",
    "Research Assistant",
    "Security Analyst",
    "Penetration Tester",
    "Information Security Manager",
    "Business Intelligence Analyst",
    "Biotech Researcher",
    "Lab Technician",
    "Clinical Data Analyst",
    "Economic Analyst",
    "Research Associate",
    "Chef",
    "Sous Chef",
    "Kitchen Manager",
    "General Professional Role",
    "Hotel Manager",
    "Front Office Executive",
    "Fair Coordinator",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Pathology Technician",
    "Sales Executive",
    "Store Manager",
    "Inventory Controller"
  ];

  const [filters, setFilters] = useState({
    qualification: "",
    discipline: "",
    college: "",
    year: "",
    industries: [],
    jobRoles: [],
  });

  const [filterOptions, setFilterOptions] = useState({
    qualifications: qualificationsList,
    disciplines: [],
    colleges: [],
    years: [],
    industries: industriesList,
    jobRoles: jobRolesList,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowAppliedFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch students
  useEffect(() => {
    if (jobFairId) fetchStudents();
  }, [jobFairId]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/studentDetail/students/${jobFairId}`);
      const fetched = res.data.students || [];
      setStudents(fetched);
      setFilteredStudents(fetched);
      setError(fetched.length ? "" : "No students registered yet.");

      const qualifications = [...new Set(fetched.map((s) => s.academicDetails?.highestQualification))].filter(Boolean);
      const disciplines = [...new Set(fetched.map((s) => s.academicDetails?.discipline))].filter(Boolean);
      const colleges = [...new Set(fetched.map((s) => s.academicDetails?.collegeOrUniversity))].filter(Boolean);
      const years = [...new Set(fetched.map((s) => s.academicDetails?.yearOfGraduation))].filter(Boolean).sort();

      setFilterOptions((prev) => ({
        ...prev,
        qualifications,
        disciplines,
        colleges,
        years,
      }));
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    if (students.length > 0) {
      const filtered = students.filter((s) => {
        const matchQualification = !filters.qualification || s.academicDetails?.highestQualification === filters.qualification;
        const matchDiscipline = !filters.discipline || s.academicDetails?.discipline === filters.discipline;
        const matchCollege = !filters.college || s.academicDetails?.collegeOrUniversity === filters.college;
        const matchYear = !filters.year || String(s.academicDetails?.yearOfGraduation) === filters.year;
        const matchIndustries =
          filters.industries.length === 0 ||
          filters.industries.some((ind) => s.careerPreferences?.preferredIndustry?.includes(ind));
        const matchRoles =
          filters.jobRoles.length === 0 ||
          filters.jobRoles.some((role) => s.careerPreferences?.desiredJobRole?.includes(role));
        return matchQualification && matchDiscipline && matchCollege && matchYear && matchIndustries && matchRoles;
      });
      setFilteredStudents(filtered);
    }
  }, [filters, students]);

  const appliedFiltersArray = Object.entries(filters).flatMap(([key, val]) =>
    Array.isArray(val)
      ? val.map((v) => ({ key, value: v }))
      : val
      ? [{ key, value: val }]
      : []
  );

  const appliedCount = appliedFiltersArray.length;

  const removeFilter = (key, value = null) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (Array.isArray(prev[key])) {
        updated[key] = prev[key].filter((v) => v !== value);
      } else {
        updated[key] = "";
      }
      return updated;
    });
  };

  const clearFilters = () =>
    setFilters({
      qualification: "",
      discipline: "",
      college: "",
      year: "",
      industries: [],
      jobRoles: [],
    });

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center text-danger mt-4">{error}</p>;

  return (
    <div className="w-full font-inter p-4 md:p-6 lg:p-8 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-blue-600 font-bold text-2xl">Registered Students</h3>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <button 
            className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors flex items-center gap-1"
            onClick={handleDownloadCSV}
          >
            📥 CSV
          </button>
          <button 
            className="px-4 py-2 text-white bg-cyan-500 hover:bg-cyan-600 rounded-md transition-colors flex items-center gap-1"
            onClick={handleDownloadExcel}
          >
            📊 Excel
          </button>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-200" ref={dropdownRef}>
        <div className="flex justify-between items-center mb-4 relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowAppliedFilters(!showAppliedFilters)}
          >
            <FaFilter className="text-blue-600" />
            <h6 className="font-semibold text-blue-600 m-0 flex items-center">
              Filters{" "}
              {appliedCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {appliedCount}
                </span>
              )}
            </h6>

            {/* Applied Filters Dropdown */}
            {showAppliedFilters && (
              <div
                className="absolute left-0 mt-10 w-[550px] bg-white border border-gray-200 shadow-lg rounded-md p-3 max-h-[220px] overflow-y-auto z-50"
                style={{ top: "25px" }}
              >
                {appliedCount === 0 ? (
                  <p className="text-gray-500 text-sm text-center italic mb-0">
                    No filters applied
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {appliedFiltersArray.map(({ key, value }) => (
                      <div
                        key={key + value}
                        className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded text-sm"
                      >
                        <span className="text-blue-600 font-semibold">{value}</span>
                        <FaTimes
                          className="text-red-500 cursor-pointer hover:text-red-700"
                          onClick={() => removeFilter(key, value)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button 
            className="px-3 py-1.5 text-sm border border-gray-400 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

        {/* Filter Dropdown Fields */}
        <div className="flex flex-wrap -mx-2 gap-y-3">
          <div className="w-full md:w-1/2 lg:w-1/6 px-2">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.qualification}
              onChange={(e) => setFilters({ ...filters, qualification: e.target.value })}
            >
              <option value="">Qualification</option>
              {filterOptions.qualifications.map((q) => <option key={q}>{q}</option>)}
            </select>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/6 px-2">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.discipline}
              onChange={(e) => setFilters({ ...filters, discipline: e.target.value })}
            >
              <option value="">Discipline</option>
              {filterOptions.disciplines.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/6 px-2">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.college}
              onChange={(e) => setFilters({ ...filters, college: e.target.value })}
            >
              <option value="">College</option>
              {filterOptions.colleges.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/6 px-2">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            >
              <option value="">Year</option>
              {filterOptions.years.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/6 px-2">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.industries.length > 0 ? filters.industries[0] : ""}
              onChange={(e) => {
                const val = e.target.value;
                setFilters({ ...filters, industries: val ? [val] : [] });
              }}
            >
              <option value="">Industry</option>
              {filterOptions.industries.map((ind) => <option key={ind}>{ind}</option>)}
            </select>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/6 px-2">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.jobRoles.length > 0 ? filters.jobRoles[0] : ""}
              onChange={(e) => {
                const val = e.target.value;
                setFilters({ ...filters, jobRoles: val ? [val] : [] });
              }}
            >
              <option value="">Job Role</option>
              {filterOptions.jobRoles.map((role) => <option key={role}>{role}</option>)}
            </select>
          </div>
        </div>
      </div>

       <p className="text-muted mb-3">👉 Click a <strong>Candidate Name</strong> to view details.</p>

      {/* Table */}
      <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-xl">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <strong>No students found for the selected filters.</strong>
          </div>
        ) : (
          <table className="min-w-full text-left bg-white">
            <thead className="bg-blue-50 border-b border-gray-200 text-center">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700 border-r">S.No</th>
                <th className="px-4 py-3 font-semibold text-gray-700 border-r">Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700 border-r">Qualification</th>
                <th className="px-4 py-3 font-semibold text-gray-700 border-r">Discipline</th>
                <th className="px-4 py-3 font-semibold text-gray-700 border-r">College</th>
                <th className="px-4 py-3 font-semibold text-gray-700 border-r">Year</th>
                <th className="px-4 py-3 font-semibold text-gray-700 border-r">Consent</th>
                <th className="px-4 py-3 font-semibold text-gray-700 border-r">Resume</th>
                <th className="px-4 py-3 font-semibold text-gray-700 border-r">Registration PDF</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-center">
              {filteredStudents.map((s, i) => (
                <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 border-r">{i + 1}</td>
                  <td
                    className="px-4 py-3 text-blue-600 font-semibold cursor-pointer border-r hover:underline"
                    onClick={() => handleViewDetails(s)}
                  >
                    {s.personalDetails?.fullName}
                  </td>
                  <td className="px-4 py-3 border-r">{s.academicDetails?.highestQualification}</td>
                  <td className="px-4 py-3 border-r">{s.academicDetails?.discipline}</td>
                  <td className="px-4 py-3 border-r">{s.academicDetails?.collegeOrUniversity}</td>
                  <td className="px-4 py-3 border-r">{s.academicDetails?.yearOfGraduation}</td>
                  <td className="px-4 py-3 border-r">
                    {s.declarationAndConsent?.consentToShareProfile ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-600 font-medium">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 border-r">
                    {s.documentsAndLinks?.resume ? (
                      <a href={`${SERVER_URL}/${s.documentsAndLinks.resume}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                        View
                      </a>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-3 border-r">
                    {s.documentsAndLinks?.registrationPDF ? (
                      <a href={`${SERVER_URL}/${s.documentsAndLinks.registrationPDF}`} target="_blank" rel="noreferrer" className="text-green-600 hover:underline">
                        View PDF
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-red-500 border border-red-500 rounded p-1.5 hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete Student"
                      onClick={() => handleDeleteStudent(s._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🧾 Candidate Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h5 className="font-bold text-blue-600 text-xl m-0">Candidate Details</h5>
              <button
                type="button"
                className="text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg w-8 h-8 flex justify-center items-center text-xl"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 overflow-y-auto flex-1">
              {selectedStudent ? (
                <>
                  <h5 className="text-blue-600 mb-4 text-xl font-medium">
                    {selectedStudent.personalDetails?.fullName}
                  </h5>

                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                      <h6 className="text-gray-600 font-bold mb-3">1. Personal Information</h6>
                      <p className="mb-2 text-sm text-gray-700"><strong>Email:</strong> {selectedStudent.personalDetails?.email}</p>
                      <p className="mb-2 text-sm text-gray-700"><strong>Contact:</strong> {selectedStudent.personalDetails?.contactNumber}</p>
                      <p className="mb-2 text-sm text-gray-700"><strong>City:</strong> {selectedStudent.personalDetails?.currentCity}</p>
                      <p className="mb-2 text-sm text-gray-700"><strong>Gender:</strong> {selectedStudent.personalDetails?.gender}</p>
                      <p className="mb-0 text-sm text-gray-700">
                        <strong>Date of Birth:</strong>{" "}
                        {new Date(selectedStudent.personalDetails?.dob).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="w-full md:w-1/2 px-3">
                      <h6 className="text-gray-600 font-bold mb-3">2. Academic Details</h6>
                      <p className="mb-2 text-sm text-gray-700"><strong>Highest Qualification:</strong> {selectedStudent.academicDetails?.highestQualification}</p>
                      <p className="mb-2 text-sm text-gray-700"><strong>Discipline:</strong> {selectedStudent.academicDetails?.discipline}</p>
                      <p className="mb-2 text-sm text-gray-700"><strong>Year of Graduation:</strong> {selectedStudent.academicDetails?.yearOfGraduation}</p>
                      <p className="mb-2 text-sm text-gray-700"><strong>Aggregate:</strong> {selectedStudent.academicDetails?.aggregate}</p>
                      <p className="mb-2 text-sm text-gray-700"><strong>College / University:</strong> {selectedStudent.academicDetails?.collegeOrUniversity}</p>
                      <p className="mb-0 text-sm text-gray-700"><strong>College City:</strong> {selectedStudent.academicDetails?.collegeCity}</p>
                    </div>
                  </div>

                  <hr className="my-4 border-gray-200" />

                  <h6 className="text-gray-600 font-bold mb-3">3. Career Preferences</h6>
                  <p className="mb-2 text-sm text-gray-700"><strong>Preferred Industries:</strong> {selectedStudent.careerPreferences?.preferredIndustry?.join(", ") || "N/A"}</p>
                  <p className="mb-2 text-sm text-gray-700"><strong>Desired Job Roles:</strong> {selectedStudent.careerPreferences?.desiredJobRole?.join(", ") || "N/A"}</p>
                  <p className="mb-2 text-sm text-gray-700"><strong>Preferred Locations:</strong> {selectedStudent.careerPreferences?.preferredLocations?.join(", ") || "N/A"}</p>
                  <p className="mb-0 text-sm text-gray-700"><strong>Willing to Relocate:</strong> {selectedStudent.careerPreferences?.willingToRelocate}</p>

                  <hr className="my-4 border-gray-200" />

                  <h6 className="text-gray-600 font-bold mb-3">4. Documents & Links</h6>
                  <p className="mb-2 text-sm text-gray-700">
                    <strong>LinkedIn:</strong>{" "}
                    {selectedStudent.documentsAndLinks?.linkedinProfile ? (
                      <a href={selectedStudent.documentsAndLinks.linkedinProfile} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                        View Profile
                      </a>
                    ) : "N/A"}
                  </p>
                  <p className="mb-2 text-sm text-gray-700">
                    <strong>Portfolio / GitHub:</strong>{" "}
                    {selectedStudent.documentsAndLinks?.portfolioOrGithub ? (
                      <a href={selectedStudent.documentsAndLinks.portfolioOrGithub} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                        View Portfolio
                      </a>
                    ) : "N/A"}
                  </p>
                  <p className="mb-2 text-sm text-gray-700">
                    <strong>Resume:</strong>{" "}
                    {selectedStudent.documentsAndLinks?.resume ? (
                      <a href={`${SERVER_URL}/${selectedStudent.documentsAndLinks.resume}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                        View Resume
                      </a>
                    ) : "N/A"}
                  </p>
                  <p className="mb-0 text-sm text-gray-700">
                    <strong>Registration PDF:</strong>{" "}
                    {selectedStudent.documentsAndLinks?.registrationPDF ? (
                      <a href={`${SERVER_URL}/${selectedStudent.documentsAndLinks.registrationPDF}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                        View PDF
                      </a>
                    ) : "N/A"}
                  </p>

                  <hr className="my-4 border-gray-200" />

                  <h6 className="text-gray-600 font-bold mb-3">5. Declaration & Consent</h6>
                  {(() => {
                    const dec = selectedStudent.declarationAndConsent || {};
                    let heardFromList = dec.heardFrom?.join(", ") || "N/A";
                    if (dec.heardFrom?.includes("Others") && dec.otherSource) {
                      heardFromList = heardFromList.replace("Others", `Others - ${dec.otherSource}`);
                    }
                    return (
                      <>
                        <p className="mb-2 text-sm text-gray-700"><strong>Heard From:</strong> {heardFromList}</p>
                        <p className="mb-2 text-sm text-gray-700"><strong>Attended Previous Fair:</strong> {dec.attendedPreviousFair}</p>
                        <p className="mb-2 text-sm text-gray-700"><strong>Declaration Confirmed:</strong> {dec.declarationConfirmed ? "Yes" : "No"}</p>
                        <p className="mb-2 text-sm text-gray-700"><strong>Consent to Share Profile:</strong> {dec.consentToShareProfile ? "Yes" : "No"}</p>
                        <p className="mb-0 text-sm text-gray-700">
                          <strong>Date of Submission:</strong>{" "}
                          {new Date(dec.dateOfSubmission).toLocaleDateString()}
                        </p>
                      </>
                    );
                  })()}
                </>
              ) : (
                <p className="text-gray-500">No details available.</p>
              )}
            </div>

            {/* Bottom inside the modal */}
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold shadow-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default StudentDetailList;





