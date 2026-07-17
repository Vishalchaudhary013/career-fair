import React from "react";

const TITLE_MAP = {
  "Companies":      "Participating",
  "Job Roles":      "Different",
  "Graduates":      "Active Participation",
  "States / U.Ts":  "North India",
  "Cities & Towns": "Diversity",
  "Hall Tickets":   "Generated",
};

const FairStatistics = ({ statistics }) => {
  // Accept the raw statistics array from the backend: [{ label, value }]
  const stats = Array.isArray(statistics)
    ? statistics.filter(s => s?.value > 0)
    : [];

  if (stats.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto mt-14 mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-2xl shadow transition-all duration-300"
          >
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-2">
              {TITLE_MAP[stat.label] || stat.label}
            </p>
            <h2 className="text-[2rem] font-extrabold text-primary leading-tight">
              {stat.value}+{" "}
              <span className="text-[1rem] font-semibold text-gray-700">
                {stat.label}
              </span>
            </h2>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FairStatistics;

