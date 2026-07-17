import { Calendar, Clock } from "lucide-react";
import { DATE_OPTS, TIME_OPTS } from "./dateTimeHelpers";

const Caret = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="pointer-events-none">
    <path d="M2 4l3.5 3.5L9 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DateTimePicker = ({ label, dateVal, timeVal, onDateChange, onTimeChange }) => (
  <div className="flex-1 min-w-0">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="flex gap-2">
      <div className="relative flex-1 min-w-0">
        <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
        <select
          value={dateVal}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full pl-9 pr-7 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white appearance-none outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
        >
          {DATE_OPTS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"><Caret /></span>
      </div>
      <div className="relative" style={{ minWidth: 130 }}>
        <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
        <select
          value={timeVal}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full pl-9 pr-7 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white appearance-none outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
        >
          {TIME_OPTS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"><Caret /></span>
      </div>
    </div>
  </div>
);

export default DateTimePicker;
