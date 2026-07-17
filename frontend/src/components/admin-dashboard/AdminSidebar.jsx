import React from "react";
import { FiLogOut, FiPieChart, FiCalendar } from "react-icons/fi";

const AdminSidebar = ({ activeSection, setActiveSection, onLogout }) => {
  const menuItems = [
    { key: "Overview", label: "Overview", icon: <FiPieChart size={16} /> },
    { key: "Events", label: "Events", icon: <FiCalendar size={16} /> },
    // { key: "Expired-Events", label: "Expired Events", icon: <FiCalendar size={16} /> },
  ];

  return (
    <aside className="bg-[#E4EBFB] border border-[#D8E2F7]  p-4 xl:sticky xl:top-6 h-auto xl:h-full flex flex-col overflow-hidden">
      <div className="mb-7">
        <p className="text-slate-900 text-xl font-semibold">Dashboard</p>
        <p className="text-[11px] tracking-[0.16em] text-slate-500 mt-1 font-semibold uppercase">Event Organizer</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-7 sm:grid-cols-2 xl:grid-cols-1 xl:space-y-2 xl:gap-0 overflow-y-auto pr-1">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveSection(item.key)}
            className={`w-full flex items-center justify-center xl:justify-start gap-2.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
              activeSection === item.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:bg-white/70"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-[#D0DCF5] space-y-2">
        <button
          onClick={onLogout}
          className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg border border-slate-300 hover:bg-white/80 flex items-center justify-center xl:justify-start gap-2 transition"
        >
          <FiLogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
