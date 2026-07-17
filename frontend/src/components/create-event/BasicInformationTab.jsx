import { AlertCircle, Globe, Lock } from "lucide-react";
import DateTimePicker from "./DateTimePicker";

const BasicInformationTab = ({
  title, setTitle,
  visibility, setVisibility,
  startDate, setStartDate,
  startTime, setStartTime,
  endDate, setEndDate,
  endTime, setEndTime,
}) => (
  <div className="w-full space-y-7 animate-in fade-in duration-200">
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <label className="block text-sm font-semibold text-gray-800 ">Fair Name</label>
       <span className=" text-gray-400"><AlertCircle size={14} /></span>
      </div>
      <input
        type="text"
        placeholder="Enter Fair Name"
        value={title}
        required
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
      />
    </div>

    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <label className="block text-sm font-semibold text-gray-800 ">Fair Visiblity</label>
       <span className=" text-gray-400"><AlertCircle size={14} /></span>
      </div>
      <div className="inline-flex border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setVisibility("public")}
          className={`flex items-center gap-2 px-7 py-2.5 text-sm font-medium transition-colors cursor-pointer ${visibility === "public" ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
        >
          <Globe size={14} /> Public
        </button>
        <button
          onClick={() => setVisibility("private")}
          className={`flex items-center gap-2 px-7 py-2.5 text-sm font-medium border-l border-gray-200 transition-colors cursor-pointer ${visibility === "private" ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
        >
          <Lock size={14} /> Private
        </button>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-6">
      <DateTimePicker label="Fair Starts from" dateVal={startDate} timeVal={startTime} onDateChange={setStartDate} onTimeChange={setStartTime} />
      <DateTimePicker label="Fair Ends at" dateVal={endDate} timeVal={endTime} onDateChange={setEndDate} onTimeChange={setEndTime} />
    </div>
  </div>
);

export default BasicInformationTab;
