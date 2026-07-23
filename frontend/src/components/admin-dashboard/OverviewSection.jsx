import React from "react";

const OverviewSection = ({ events }) => {
  return (
    <div className="space-y-6 px-1.5">
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 ">
        <div className="rounded-lg border border-[#E2EAFC] p-5 bg-white shadow-sm">
          <p className="text-xs text-slate-500 tracking-widest font-semibold uppercase">
            Total Fairs
          </p>
          <p className="text-4xl mt-2 font-bold text-primary">
            {events.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
