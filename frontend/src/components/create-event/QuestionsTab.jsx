import { Plus, X, Check, ChevronDown, Trash2, Upload, GripVertical, Edit2 } from "lucide-react";
import { useState } from "react";
import { t } from "../../utils/translations";

const PREDEFINED_QUESTIONS = [
  { id: "pb_1",  title: "Title (Mr.,Mrs.,Etc)",        type: "Dropdown type question" },
  { id: "pb_2",  title: "Gender",                      type: "Radio button type question" },
  { id: "pb_3",  title: "Designation",                 type: "Text input type question" },
  { id: "pb_4",  title: "Organization",                type: "Text input type question" },
  { id: "pb_5",  title: "Address",                     type: "Paragraph type question" },
  { id: "pb_6",  title: "City (Text)",                 type: "Text input type question" },
  { id: "pb_7",  title: "State (India)",               type: "Dropdown type" },
  { id: "pb_8",  title: "Country",                     type: "Dropdown type question" },
  { id: "pb_9",  title: "Pincode/Zipcode/Postcode",    type: "Text input type question" },
  { id: "pb_10", title: "Contact Number",              type: "Mobile number type question" },
  { id: "pb_11", title: "Emergency Contact Number",    type: "Mobile number type question" },
  { id: "pb_12", title: "Emergency Contact Name",      type: "Text input type question" },
  { id: "pb_13", title: "Emergency Contact Relation",  type: "Text input type question" },
  { id: "pb_14", title: "Blood Group",                 type: "Dropdown type" },
  { id: "pb_15", title: "State",                       type: "Dropdown Auto Populates Based on Country" },
  { id: "pb_16", title: "City",                        type: "Dropdown Auto Populates Based on State" },
  { id: "pb_17", title: "Upload Resume / CV",          type: "File upload type question" },
];

const renderInputForQuestion = (q, language) => {
  const typeStr = (q.type || "").toLowerCase();

  if (typeStr.includes("paragraph")) {
    return <textarea rows="3" placeholder={`Enter your ${q.title.toLowerCase()}`} className="w-full border border-gray-200 rounded-md px-4 py-3 text-gray-700 placeholder-black/30 outline-none font-medium resize-none" />;
  }

  if (typeStr.includes("dropdown") || typeStr.includes("country") || typeStr.includes("state")) {
    return (
      <div className="relative">
        <select className="w-full border border-gray-200 rounded-md px-4 py-3 text-gray-700 outline-none font-medium appearance-none cursor-pointer">
          <option value="">{t(language, "selectOptionText")} {t(language, qTitleMap[q.title] || q.title) || q.title}</option>
          {q.title === "Title (Mr.,Mrs.,Etc)" && (<><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Dr.</option><option>Miss</option></>)}
          {q.title === "Blood Group" && (<><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></>)}
          {q.options && q.options.map((opt) => (
            <option key={opt.id} value={opt.value}>{opt.value}</option>
          ))}
          {q.allowOther && <option value="Other">{t(language, "otherOptionText")}</option>}
        </select>
        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    );
  }

  if (typeStr.includes("radio") || typeStr.includes("multiple choice")) {
    return (
      <div className="flex flex-col gap-3 mt-2">
        {q.title === "Gender" ? (
          <div className="flex flex-col gap-2 mt-4 ml-2">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium"><input type="radio" name={q.id} className="w-4 h-4 text-primary cursor-pointer" /> {t(language, "male")}</label>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium"><input type="radio" name={q.id} className="w-4 h-4 text-primary cursor-pointer" /> {t(language, "female")}</label>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium"><input type="radio" name={q.id} className="w-4 h-4 text-primary cursor-pointer" /> {t(language, "other")}</label>
          </div>
        ) : q.options ? (
          <div className="flex flex-col gap-3">
            {q.options.map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
                <input type="radio" name={q.id} className="w-4 h-4 text-primary cursor-pointer" /> {opt.value}
              </label>
            ))}
            {q.allowOther && (
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
                <input type="radio" name={q.id} className="w-4 h-4 text-primary cursor-pointer" /> {t(language, "otherOptionText")}
              </label>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-4 ml-2">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium"><input type="radio" name={q.id} className="w-4 h-4 text-primary cursor-pointer" /> {t(language, "option1")}</label>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium"><input type="radio" name={q.id} className="w-4 h-4 text-primary cursor-pointer" /> {t(language, "option2")}</label>
          </div>
        )}
      </div>
    );
  }

  if (typeStr.includes("checkbox")) {
    return (
      <div className="flex flex-col gap-3 mt-2">
        {q.options ? (
          <div className="flex flex-col gap-3">
            {q.options.map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
                <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" /> {opt.value}
              </label>
            ))}
            {q.allowOther && (
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
                <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" /> {t(language, "otherOptionText")}
              </label>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-4 ml-2">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium"><input type="checkbox" className="w-4 h-4 rounded cursor-pointer" /> {t(language, "option1")}</label>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium"><input type="checkbox" className="w-4 h-4 rounded cursor-pointer" /> {t(language, "option2")}</label>
          </div>
        )}
      </div>
    );
  }

  if (typeStr.includes("file")) {
    return (
      <div className="mt-4 border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50">
        <Upload size={24} className="text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">{t(language, "clickToUploadFile")}</p>
      </div>
    );
  }

  let inputType = "text";
  if (typeStr.includes("email") || q.title.toLowerCase().includes("email")) inputType = "email";
  else if (typeStr.includes("number") || typeStr.includes("mobile")) inputType = "tel";
  else if (typeStr.includes("date") || typeStr.includes("calendar")) inputType = "date";
  else if (typeStr.includes("time")) inputType = "time";

  return <input type={inputType} placeholder={`Enter your ${q.title.toLowerCase()}`} className="w-full border border-gray-200 rounded-md px-4 py-3 text-gray-700 placeholder-black/30 outline-none font-medium" />;
};


const qTitleMap = {
  "Name": "enterYourName",
  "Email ID": "enterYourEmailId",
  "Title (Mr.,Mrs.,Etc)": "qTitle",
  "Gender": "qGender",
  "Designation": "qDesignation",
  "Organization": "qOrganization",
  "Address": "qAddress",
  "City (Text)": "qCityText",
  "State (India)": "qStateIndia",
  "Country": "qCountry",
  "Pincode/Zipcode/Postcode": "qPincode",
  "Contact Number": "qContactNumber",
  "Emergency Contact Number": "qEmergencyContactNumber",
  "Emergency Contact Name": "qEmergencyContactName",
  "Emergency Contact Relation": "qEmergencyContactRelation",
  "Blood Group": "qBloodGroup",
  "State": "qState",
  "City": "qCity",
  "Upload Resume / CV": "qUploadResume"
};

const QuestionsTab = ({
  addedQuestions, setAddedQuestions,
  showQuestionBank, setShowQuestionBank,
  showCustomQuestionForm, setShowCustomQuestionForm,
  selectedPredefinedQuestion, setSelectedPredefinedQuestion,
  customQuestionTitle, setCustomQuestionTitle,
  customQuestionType, setCustomQuestionType,
  questionStatus, setQuestionStatus,
  questionTickets, setQuestionTickets,
  fileUploadFields = [], setFileUploadFields,
  language
}) => {
  const [customOptions, setCustomOptions] = useState([{ id: 1, value: "Option 1" }, { id: 2, value: "Option 2" }]);
  const [allowOther, setAllowOther] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const handleAddQuestionClick = (q) => {
    if (!addedQuestions.find((aq) => aq.id === q.id)) {
      setEditingQuestionId(null);
      setSelectedPredefinedQuestion(q);
      setQuestionStatus("Mandatory");
      setQuestionTickets("All Tickets");
    }
  };

  const handleEditQuestion = (q) => {
    setEditingQuestionId(q.id);
    setQuestionStatus(q.status || "Mandatory");
    setQuestionTickets(q.tickets || "All Tickets");
    setCustomQuestionTitle(q.title);
    setCustomQuestionType(q.type || "Text");
    if (q.options) {
      setCustomOptions(q.options);
    } else {
      setCustomOptions([{ id: 1, value: "Option 1" }, { id: 2, value: "Option 2" }]);
    }
    setAllowOther(!!q.allowOther);
    
    setShowCustomQuestionForm(true);
    setShowQuestionBank(false);
    setSelectedPredefinedQuestion(null);
  };

  const handleSavePredefinedQuestion = () => {
    if (!selectedPredefinedQuestion) return;
    setAddedQuestions((prev) => {
      if (editingQuestionId) {
        return prev.map((q) => q.id === editingQuestionId ? { ...selectedPredefinedQuestion, status: questionStatus, tickets: questionTickets } : q);
      }
      return [...prev, { ...selectedPredefinedQuestion, status: questionStatus, tickets: questionTickets }];
    });
    setSelectedPredefinedQuestion(null);
    setEditingQuestionId(null);
  };

  const handleRemoveQuestion = (id) => {
    setAddedQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSaveCustomQuestion = () => {
    if (!customQuestionTitle.trim() || !customQuestionType) return;
    
    const needsOptions = ["Multiple Choice", "Checkboxes", "Dropdown", "Radio Button"].includes(customQuestionType);
    const newQuestion = {
      id: editingQuestionId || `custom_${Date.now()}`,
      title: customQuestionTitle,
      type: customQuestionType,
      status: questionStatus,
      tickets: questionTickets,
      ...(needsOptions && { options: customOptions, allowOther }),
    };
    
    setAddedQuestions((prev) => {
      if (editingQuestionId) {
        return prev.map((q) => q.id === editingQuestionId ? newQuestion : q);
      }
      return [...prev, newQuestion];
    });
    
    setEditingQuestionId(null);
    setCustomQuestionTitle("");
    setCustomQuestionType("");
    setQuestionStatus("Mandatory");
    setQuestionTickets("All Tickets");
    setCustomOptions([{ id: 1, value: "Option 1" }, { id: 2, value: "Option 2" }]);
    setAllowOther(false);
    setShowCustomQuestionForm(false);
    setShowQuestionBank(false);
  };

  const handleAddCustomOption = () => {
    setCustomOptions((prev) => [...prev, { id: Date.now(), value: `Option ${prev.length + 1}` }]);
  };

  const handleRemoveCustomOption = (id) => {
    setCustomOptions((prev) => prev.filter((opt) => opt.id !== id));
  };

  const handleUpdateCustomOption = (id, newValue) => {
    setCustomOptions((prev) => prev.map((opt) => opt.id === id ? { ...opt, value: newValue } : opt));
  };

  const StatusToggle = () => (
    <div className="flex border border-gray-200 rounded-lg overflow-hidden w-fit mt-1.5 shadow-sm">
      <button onClick={() => setQuestionStatus("Mandatory")} className={`px-8 py-2 text-sm font-semibold transition-colors cursor-pointer ${questionStatus === "Mandatory" ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>{t(language, "mandatory")}</button>
      <button onClick={() => setQuestionStatus("Optional")} className={`px-8 py-2 text-sm font-semibold transition-colors cursor-pointer border-l border-gray-200 ${questionStatus === "Optional" ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>{t(language, "optional")}</button>
    </div>
  );

  const TicketsToggle = () => (
    <div className="flex border border-gray-200 rounded-lg overflow-hidden w-fit mt-1.5 shadow-sm">
      <button onClick={() => setQuestionTickets("All Tickets")} className={`px-8 py-2 text-sm font-semibold transition-colors cursor-pointer ${questionTickets === "All Tickets" ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>{t(language, "allTickets")}</button>
      <button onClick={() => setQuestionTickets("Selected Tickets")} className={`px-8 py-2 text-sm font-semibold transition-colors cursor-pointer border-l border-gray-200 ${questionTickets === "Selected Tickets" ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>{t(language, "selectedTickets")}</button>
    </div>
  );

  // ── Predefined config view ──
  if (selectedPredefinedQuestion) return (
    <div className="flex-1 overflow-auto p-0 max-w-4xl">
      <div className="border-b border-gray-200 p-8 pt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedPredefinedQuestion.title}</h2>
        <p className="text-[15px] font-semibold text-gray-500">{t(language, "questionsDesc")}</p>
        <button onClick={() => setSelectedPredefinedQuestion(null)} className="text-primary hover:bg-gray-100 p-2 rounded-full cursor-pointer"><X size={24} /></button>
      </div>
      <div className="p-8 space-y-8">
        <div><label className="block text-[15px] font-bold text-gray-700 mb-2">{t(language, "questionStatus")}</label><StatusToggle /></div>

        <button onClick={handleSavePredefinedQuestion} className="bg-secondary hover:bg-secondary/90 text-white px-8 py-2.5 rounded-full text-sm font-semibold transition cursor-pointer">
          {editingQuestionId ? "Update Question" : "Add Question"}
        </button>
      </div>
    </div>
  );

  // ── Question Bank ──
  if (showQuestionBank) return (
    <div className="flex-1 overflow-auto p-0 max-w-4xl">
      <div className="border-b border-gray-200 p-8 pt-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{t(language, "questionBankLabel")}</h2>
            <p className="text-[15px] font-semibold text-gray-500">{t(language, "questionsDesc")}</p>
            <p className="text-primary font-semibold mt-4">{t(language, "selectQuestionToAsk")}</p>
          </div>
          <button onClick={() => setShowQuestionBank(false)} className="text-primary hover:bg-gray-100 p-2 rounded-full cursor-pointer"><X size={24} /></button>
        </div>
      </div>
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PREDEFINED_QUESTIONS.map((q) => {
          const isAdded = addedQuestions.find((aq) => aq.id === q.id);
          return (
            <div key={q.id} className={`group flex items-center justify-between px-4 h-[64px] border rounded-md cursor-pointer transition ${isAdded ? "border-primary shadow-sm" : "border-gray-200"}`} onClick={() => handleAddQuestionClick(q)}>
              <div className="relative flex flex-col justify-center w-full h-full">
                <h3 className="font-semibold text-primary transition-transform duration-300 group-hover:-translate-y-2">{t(language, qTitleMap[q.title] || q.title) || q.title}</h3>
                <p className="text-[13px] text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute left-0 bottom-1.5 pointer-events-none">{q.type}</p>
              </div>
              <div className="text-primary shrink-0 ml-4">{isAdded ? <Check size={20} /> : <Plus size={20} />}</div>
            </div>
          );
        })}
      </div>
      <div className="p-8 border-t border-gray-200 flex justify-center bg-gray-50/50">
        <button onClick={() => { setShowQuestionBank(false); setShowCustomQuestionForm(true); }} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition cursor-pointer">{t(language, "createCustomQuestion")}</button>
      </div>
    </div>
  );

  // ── Custom Question Form ──
  if (showCustomQuestionForm) return (
    <div className="flex-1 overflow-auto p-0 max-w-4xl">
      <div className="border-b border-gray-200 p-8 pt-10 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{t(language, "createCustomQuestion")}</h2>
          <p className="text-[15px] font-semibold text-gray-500">{t(language, "questionsDesc")}</p>
        </div>
        <button onClick={() => setShowCustomQuestionForm(false)} className="text-primary hover:bg-gray-100 p-2 rounded-full cursor-pointer"><X size={24} /></button>
      </div>
      <div className="p-8 space-y-8">
        <div>
          <label className="block text-[15px] font-bold text-gray-700 mb-2">{t(language, "questionTitle")}</label>
          <input type="text" value={customQuestionTitle} onChange={(e) => setCustomQuestionTitle(e.target.value)} placeholder="E.g. What is your t-shirt size?" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
        </div>
        <div>
          <label className="block text-[15px] font-bold text-gray-700 mb-2">{t(language, "questionType")}</label>
          <div className="relative">
            <select value={customQuestionType} onChange={(e) => setCustomQuestionType(e.target.value)} className="w-full border border-gray-200 rounded-md px-4 py-3 outline-none focus:border-primary appearance-none cursor-pointer">
              <option value="">{t(language, "pleaseSelectType")}</option>
              <option value="Text">{t(language, "typeText")}</option>
              <option value="Paragraph">{t(language, "typeParagraph")}</option>
              <option value="Multiple Choice">{t(language, "typeMultipleChoice")}</option>
              <option value="Radio Button">{t(language, "typeRadioButton")}</option>
              <option value="Checkboxes">{t(language, "typeCheckboxes")}</option>
              <option value="Dropdown">{t(language, "typeDropdown")}</option>
              <option value="Contact Number">{t(language, "typeContactNumber")}</option>
              <option value="Date of birth">{t(language, "typeDateOfBirth")}</option>
              <option value="File">{t(language, "typeFile")}</option>
              <option value="Calendar Date">{t(language, "typeCalendarDate")}</option>
              <option value="Time">{t(language, "typeTime")}</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
          </div>
        </div>

        {(customQuestionType === "Dropdown" || customQuestionType === "Radio Button" || customQuestionType === "Checkboxes" || customQuestionType === "Multiple Choice") && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 mt-4">
            <label className="block text-[15px] font-bold text-gray-700 mb-4">{t(language, "optionsText")}</label>
            <div className="space-y-3">
              {customOptions.map((opt, index) => (
                <div key={opt.id} className="flex items-center gap-3">
                  <GripVertical size={18} className="text-gray-400 cursor-grab shrink-0" />
                  {["Multiple Choice", "Radio Button"].includes(customQuestionType) && <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />}
                  {customQuestionType === "Checkboxes" && <div className="w-4 h-4 rounded border border-gray-300 shrink-0" />}
                  {customQuestionType === "Dropdown" && <span className="text-gray-400 text-sm w-4 shrink-0">{index + 1}.</span>}
                  
                  <input
                    type="text"
                    value={opt.value}
                    onChange={(e) => handleUpdateCustomOption(opt.id, e.target.value)}
                    className="flex-1 border-b border-gray-300 bg-transparent px-2 py-1.5 outline-none focus:border-primary transition"
                  />
                  
                  {customOptions.length > 1 && (
                    <button onClick={() => handleRemoveCustomOption(opt.id)} className="text-gray-400 hover:text-secondary transition p-1 cursor-pointer">
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
              
              {allowOther && (
                <div className="flex items-center gap-3 mt-3">
                  <GripVertical size={18} className="text-gray-400 invisible shrink-0" />
                  {["Multiple Choice", "Radio Button"].includes(customQuestionType) && <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />}
                  {customQuestionType === "Checkboxes" && <div className="w-4 h-4 rounded border border-gray-300 shrink-0" />}
                  {customQuestionType === "Dropdown" && <span className="text-gray-400 text-sm w-4 shrink-0">{customOptions.length + 1}.</span>}
                  
                  <input
                    type="text"
                    value="Other"
                    disabled
                    className="flex-1 border-b border-gray-300 bg-transparent px-2 py-1.5 outline-none text-gray-500"
                  />
                  <button onClick={() => setAllowOther(false)} className="text-gray-400 hover:text-secondary transition p-1 cursor-pointer">
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 mt-6 ml-7">
              <button onClick={handleAddCustomOption} className="text-sm font-semibold text-primary hover:text-primary/90 flex items-center gap-1 cursor-pointer">
                <Plus size={16} /> Add option
              </button>
              {!allowOther && ["Multiple Choice", "Checkboxes", "Radio Button"].includes(customQuestionType) && (
                <>
                  <span className="text-gray-300">|</span>
                  <button onClick={() => setAllowOther(true)} className="text-sm font-semibold text-primary hover:text-primary/90 cursor-pointer">
                    Add "Other"
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        <div><label className="block text-[15px] font-bold text-gray-700 mb-2">{t(language, "questionStatus")}</label><StatusToggle /></div>

        <button onClick={handleSaveCustomQuestion} disabled={!customQuestionTitle.trim() || !customQuestionType} className="bg-secondary hover:bg-secondary/90 text-white px-8 py-2.5 rounded-full text-sm font-semibold transition cursor-pointer disabled:opacity-50">
          {editingQuestionId ? "Update Question" : "Add Question"}
        </button>
      </div>
    </div>
  );

  // ── Main Questions View ──
  return (
    <div className="flex-1 overflow-auto p-10 max-w-4xl">
      <p className="text-[15px] font-semibold text-gray-500 mb-8">{t(language, "questionsDesc")}</p>
      <div className="space-y-8 mb-8">
        {addedQuestions.map((q) => (
          <div key={q.id} className="relative group">
            <div className="flex justify-between items-start mb-2">
              <label className="block text-[15px] font-bold text-gray-600">
                {t(language, qTitleMap[q.title] || q.title) || q.title} <span className="text-gray-400 font-semibold">({q.status})</span>
              </label>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => handleEditQuestion(q)} title="Edit Question" className="text-primary hover:bg-primary/10 p-1.5 rounded cursor-pointer transition">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleRemoveQuestion(q.id)} title="Delete Question" className="text-secondary hover:bg-secondary/10 p-1.5 rounded cursor-pointer transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="mt-2">{renderInputForQuestion(q, language)}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-gray-200 p-6 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-[17px] font-bold text-primary">{t(language, "fileUploadFields")}</h3>
          </div>
          <button onClick={() => setFileUploadFields([...fileUploadFields, { title: "", id: Date.now() }])} className="border border-primary text-primary hover:bg-primary hover:text-white px-5 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-sm"><Plus size={16} /> Add Field</button>
        </div>
        {fileUploadFields.map((field) => (
          <div key={field.id} className="p-6 border-b border-gray-200 flex items-start gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t(language, "fieldTitleLabel")}</label>
              <input
                type="text"
                value={field.title}
                onChange={(e) => {
                  setFileUploadFields(prev => prev.map(f => f.id === field.id ? { ...f, title: e.target.value } : f));
                }}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-primary font-medium text-gray-800 transition"
                placeholder={t(language, "fieldTitlePlaceholder")}
              />
            </div>
            <div className="w-[300px] border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center bg-gray-50/50 shrink-0">
              <Upload size={24} className="text-gray-400 mb-3" />
              <p className="text-sm text-gray-400 font-medium">{t(language, "attendeesWillUploadHere")}</p>
            </div>
            <button onClick={() => setFileUploadFields(fileUploadFields.filter(f => f.id !== field.id))} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer" title="Remove Field">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-8">
        <button onClick={() => setShowQuestionBank(true)} className="flex items-center gap-2 border border-[#c4b5fd] text-[#374151] font-bold text-sm px-4 py-2.5 rounded-md hover:bg-[#c4b5fd]/10 transition cursor-pointer">
          <Plus size={16} className="text-gray-600" /> {t(language, "addNewQuestionBtn")}
        </button>
      </div>
    </div>
  );
};

export default QuestionsTab;
