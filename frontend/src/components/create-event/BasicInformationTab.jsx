import { AlertCircle, Globe, Lock } from "lucide-react";
import DateTimePicker from "./DateTimePicker";
import { t } from "../../utils/translations";

const BasicInformationTab = ({
  title, setTitle,
  visibility, setVisibility,
  startDate, setStartDate,
  startTime, setStartTime,
  endDate, setEndDate,
  endTime, setEndTime,
  language, setLanguage,
  availableLanguages,
}) => (
  <div className="w-full space-y-7 animate-in fade-in duration-200">
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <label className="block text-sm font-semibold text-gray-800 ">{t(language, "fairName")}</label>
        <span className=" text-gray-400"><AlertCircle size={14} /></span>
      </div>
      <input
        type="text"
        placeholder={t(language, "enterFairName")}
        value={title}
        required
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
      />
    </div>

    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <label className="block text-sm font-semibold text-gray-800 ">{t(language, "fairVisibility")}</label>
        <span className=" text-gray-400"><AlertCircle size={14} /></span>
      </div>
      <div className="inline-flex border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setVisibility("public")}
          className={`flex items-center gap-2 px-7 py-2.5 text-sm font-medium transition-colors cursor-pointer ${visibility === "public" ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
        >
          <Globe size={14} /> {t(language, "publicBtn")}
        </button>
        <button
          onClick={() => setVisibility("private")}
          className={`flex items-center gap-2 px-7 py-2.5 text-sm font-medium border-l border-gray-200 transition-colors cursor-pointer ${visibility === "private" ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
        >
          <Lock size={14} /> {t(language, "privateBtn")}
        </button>
      </div>
    </div>

    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <label className="block text-sm font-semibold text-gray-800 ">{t(language, "fairLanguage")}</label>
        <span className=" text-gray-400"><AlertCircle size={14} /></span>
      </div>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full sm:max-w-md border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition cursor-pointer"
      >
        {availableLanguages.map(lang => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
    </div>

    <div className="flex flex-col sm:flex-row gap-6">
      <DateTimePicker label={t(language, "fairStartsFrom")} dateVal={startDate} timeVal={startTime} onDateChange={setStartDate} onTimeChange={setStartTime} />
      <DateTimePicker label={t(language, "fairEndsAt")} dateVal={endDate} timeVal={endTime} onDateChange={setEndDate} onTimeChange={setEndTime} />
    </div>
  </div>
);

export default BasicInformationTab;
