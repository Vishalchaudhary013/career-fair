import { useEffect, useRef, useState } from "react";
import { Info, Plus, Minus, ChevronDown, ChevronUp, AlertCircle, Briefcase, Music, Trophy, Mic, Palette, Code, Users, Medal, HelpCircle, Video, Wrench, Ticket } from "lucide-react";
import { SERVER_URL } from "../../config";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { City, State } from "country-state-city";
import { FiUpload, FiX, FiTrash2 } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import { t } from "../../utils/translations";

const INDIA_ISO_CODE = 'IN';
const INDIA_STATES = State.getStatesOfCountry(INDIA_ISO_CODE).map(s => ({ value: s.name, label: s.name, isoCode: s.isoCode }));

const DEFAULT_CATEGORIES = [
  { value: "Career Drive", label: "Career Drive", icon: Briefcase },
  { value: "College Festivals", label: "College Festivals", icon: Music },
  { value: "Competitions", label: "Competitions", icon: Trophy },
  { value: "Conferences", label: "Conferences", icon: Mic },
  { value: "Cultural Events", label: "Cultural Events", icon: Palette },
  { value: "Hackathon", label: "Hackathon", icon: Code },
  { value: "Mentorships", label: "Mentorships", icon: Users },
  { value: "Olympiad", label: "Olympiad", icon: Medal },
  { value: "Quizzes", label: "Quizzes", icon: HelpCircle },
  { value: "Webinars", label: "Webinars", icon: Video },
  { value: "Workshop", label: "Workshop", icon: Wrench },
];

const DEFAULT_TYPES = [
  { value: "Internship", label: "Internship", icon: Briefcase },
  { value: "Job", label: "Job", icon: Briefcase },
  { value: "Apprenticeship", label: "Apprenticeship", icon: Briefcase },
];

const EventInformationTab = ({

  description, setDescription,
  fairStats, setFairStats,
  companies, addCompany, removeCompany, updateCompany,
  thingsToKnow, addThing, removeThing, updateThing,
  instructions, setInstructions,
  termsText, setTermsText,
  faqs, addFaq, removeFaq, updateFaq, toggleFaq,
  category, setCategory,
  fairType, setFairType,
  extraDetails, setExtraDetails,
  companyListDocumentUrl, setCompanyListDocumentUrl,
  language
}) => {
  const getTranslatedPostingType = (pt) => t(language, (pt || "Job").toLowerCase()) || (pt || "Job");
  const [categoriesList, setCategoriesList] = useState(DEFAULT_CATEGORIES);
  const [showNewCatModal, setShowNewCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatFile, setNewCatFile] = useState(null);
  const [isCreatingCat, setIsCreatingCat] = useState(false);

  const [typesList, setTypesList] = useState(DEFAULT_TYPES);
  const [showNewTypeModal, setShowNewTypeModal] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [isCreatingType, setIsCreatingType] = useState(false);

  const [benefitOptions, setBenefitOptions] = useState([
    { label: "Health Insurance", value: "Health Insurance" },
    { label: "Transport", value: "Transport" },
    { label: "Meals", value: "Meals" }
  ]);
  const [selectInputs, setSelectInputs] = useState({});

  const [showImgModal, setShowImgModal] = useState(false);
  const [imgUrlInput, setImgUrlInput] = useState("");
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [tableHover, setTableHover] = useState({ rows: 0, cols: 0 });
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrlInput, setLinkUrlInput] = useState("");
  const fileInputRef = useRef(null);
  const catFileInputRef = useRef(null);
  const savedRange = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    setCategoriesList([...DEFAULT_CATEGORIES]);
    setTypesList([...DEFAULT_TYPES]);
  }, []);

  const handleCreateCategory = () => {
    if (!newCatName.trim() || !newCatFile) return;
    setIsCreatingCat(true);

    const newCat = { value: newCatName.trim(), label: newCatName.trim(), iconUrl: URL.createObjectURL(newCatFile) };
    setCategoriesList(prev => [newCat, ...prev]);
    setCategory(newCat.value);
    setShowNewCatModal(false);
    setNewCatName("");
    setNewCatFile(null);

    setIsCreatingCat(false);
  };

  const handleCreateType = () => {
    if (!newTypeName.trim()) return;
    setIsCreatingType(true);

    const newType = { value: newTypeName.trim(), label: newTypeName.trim(), icon: Briefcase };
    setTypesList(prev => [newType, ...prev]);
    setFairType(newType.value);
    setShowNewTypeModal(false);
    setNewTypeName("");

    setIsCreatingType(false);
  };

  useEffect(() => {
    if (!editorRef.current) return;

    const nextHtml = description || "";
    if (editorRef.current.innerHTML !== nextHtml) {
      editorRef.current.innerHTML = nextHtml;
    }
  }, [description]);

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-200">

      <div>
        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-3">
          {t(language, "fairCategory")}
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
          <div className="relative flex-1">
            <select
              value={category || ""}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition bg-white text-gray-700 cursor-pointer"
            >
              <option value="">{t(language, "selectCategory")}</option>
              {categoriesList.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
          <button
            onClick={() => setShowNewCatModal(true)}
            className="flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:text-primary/90 border border-primary px-4 py-2.5 rounded-lg hover:bg-primary/5 transition cursor-pointer shrink-0"
          >
            <Plus size={16} /> {t(language, "newCategory")}
          </button>
        </div>

        {category && (
          <p className="mt-2 text-xs text-primary font-medium flex items-center gap-1.5">
            {(() => {
              const cat = categoriesList.find(c => c.value === category);
              if (cat?.iconUrl) return <img src={cat.iconUrl} alt={cat.label} className="w-4 h-4 object-contain" />;
              const Icon = cat?.icon;
              return Icon ? <Icon size={14} /> : null;
            })()}
            {category}
          </p>
        )}
      </div>


      <div>
        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-3">
          {t(language, "fairType")}
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
          <div className="relative flex-1">
            <select
              value={fairType || ""}
              onChange={(e) => setFairType(e.target.value)}
              className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition bg-white text-gray-700 cursor-pointer"
            >
              <option value="">{t(language, "selectFairType")}</option>
              {typesList.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
          <button
            onClick={() => setShowNewTypeModal(true)}
            className="flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:text-primary/90 border border-primary px-4 py-2.5 rounded-lg hover:bg-primary/5 transition cursor-pointer shrink-0"
          >
            <Plus size={16} /> {t(language, "newType")}
          </button>
        </div>

        {fairType && (
          <p className="mt-2 text-xs text-primary font-medium flex items-center gap-1.5">
            {(() => {
              const tp = typesList.find(t => t.value === fairType);
              const Icon = tp?.icon;
              return Icon ? <Icon size={14} /> : null;
            })()}
            {fairType}
          </p>
        )}
      </div>

      {showNewCatModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onMouseDown={() => setShowNewCatModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] mx-4 p-6 animate-in zoom-in-95 duration-200" onMouseDown={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-primary mb-5 border-b pb-3">{t(language, "newCategory")}</h3>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t(language, "categoryName")}</label>
              <input
                type="text"
                placeholder="e.g. Virtual Reality"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                autoFocus
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t(language, "categoryIcon")}</label>
              <div
                onClick={() => catFileInputRef.current?.click()}
                className={`w-full border-2 border-dashed ${newCatFile ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'} rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition`}
              >
                {newCatFile ? (
                  <>
                    <img src={URL.createObjectURL(newCatFile)} alt="preview" className="w-10 h-10 object-contain" />
                    <span className="text-xs font-medium text-primary">{newCatFile.name}</span>
                  </>
                ) : (
                  <>
                    <Palette size={24} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Click to upload icon image</span>
                  </>
                )}
                <input
                  ref={catFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) setNewCatFile(e.target.files[0]);
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowNewCatModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition"
              >
                {t(language, "cancel")}
              </button>
              <button
                onClick={handleCreateCategory}
                disabled={!newCatName.trim() || !newCatFile || isCreatingCat}
                className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
              >
                {isCreatingCat && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewTypeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onMouseDown={() => setShowNewTypeModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] mx-4 p-6 animate-in zoom-in-95 duration-200" onMouseDown={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-primary mb-5 border-b pb-3">{t(language, "newType")}</h3>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t(language, "typeName")}</label>
              <input
                type="text"
                placeholder="e.g. Fellowships"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewTypeModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition"
              >
                {t(language, "cancel")}
              </button>
              <button
                onClick={handleCreateType}
                disabled={!newTypeName.trim() || isCreatingType}
                className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingType ? "Creating..." : "Create Type"}
              </button>
            </div>
          </div>
        </div>
      )}


      <div>
        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-3">
          {t(language, "fairDescriptionLabel")}
        </label>


        <div className="border border-gray-200 rounded-t-lg bg-gray-50 px-3 py-2 flex items-center gap-0.5 flex-wrap select-none">
          {[
            { title: "Bold", cmd: "bold", label: <span className="font-bold text-sm">B</span> },
            { title: "Italic", cmd: "italic", label: <span className="italic text-sm">I</span> },
            { title: "Underline", cmd: "underline", label: <span className="underline text-sm">U</span> },
          ].map(({ title, cmd, label }) => (
            <button key={cmd} title={title} onMouseDown={e => { e.preventDefault(); document.execCommand(cmd, false); }} className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-700 cursor-pointer transition">{label}</button>
          ))}

          <div className="relative flex items-center justify-center w-7 h-7 rounded hover:bg-gray-200 cursor-pointer transition" title="Text Color">
            <div className="flex flex-col items-center justify-center">
              <span className="font-bold text-xs text-gray-800 leading-none">A</span>
              <span className="w-3.5 h-1 bg-red-500 rounded-full mt-0.5" id="color-indicator"></span>
            </div>
            <input
              type="color"
              defaultValue="#ff0000"
              onChange={e => {
                document.execCommand("foreColor", false, e.target.value);
                const ind = document.getElementById("color-indicator");
                if (ind) ind.style.backgroundColor = e.target.value;
              }}
              onMouseDown={e => e.stopPropagation()}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Pick Text Color"
            />
          </div>

          <div className="w-px h-5 bg-gray-300 mx-1.5" />
          <select defaultValue="14" onMouseDown={e => e.stopPropagation()} onChange={e => { document.execCommand("fontSize", false, "7"); const els = document.querySelectorAll("[size='7']"); els.forEach(el => { el.removeAttribute("size"); el.style.fontSize = e.target.value + "px"; }); }} className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white outline-none cursor-pointer h-6">
            {["10", "12", "14", "16", "18", "20", "24", "28", "32", "Normal"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="w-px h-5 bg-gray-300 mx-1.5" />
          {[
            { title: "Align Left", cmd: "justifyLeft", icon: (<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="1" y1="3" x2="13" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="1" y1="7" x2="9" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="1" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>) },
            { title: "Align Center", cmd: "justifyCenter", icon: (<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="1" y1="3" x2="13" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="3" y1="7" x2="11" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="1" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>) },
            { title: "Align Right", cmd: "justifyRight", icon: (<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="1" y1="3" x2="13" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="5" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="1" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>) },
          ].map(({ title, cmd, icon }) => (
            <button key={cmd} title={title} onMouseDown={e => { e.preventDefault(); document.execCommand(cmd, false); }} className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600 cursor-pointer transition">{icon}</button>
          ))}
          <button title="Bullet List" onMouseDown={e => { e.preventDefault(); document.execCommand("insertUnorderedList", false); }} className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600 cursor-pointer transition">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="2" cy="3.5" r="1.2" fill="currentColor" /><line x1="5" y1="3.5" x2="13" y2="3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="2" cy="7" r="1.2" fill="currentColor" /><line x1="5" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="2" cy="10.5" r="1.2" fill="currentColor" /><line x1="5" y1="10.5" x2="13" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          <button title="Numbered List" onMouseDown={e => { e.preventDefault(); document.execCommand("insertOrderedList", false); }} className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600 cursor-pointer transition">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 1.5v4m-1-1h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><line x1="5.5" y1="3.5" x2="13" y2="3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M1.5 8.5h2a1 1 0 0 1 0 2h-2a1 1 0 0 0 0 2h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><line x1="5.5" y1="10.5" x2="13" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1.5" />


          <button title="Insert Image" onMouseDown={e => { e.preventDefault(); const sel = window.getSelection(); if (sel && sel.rangeCount) savedRange.current = sel.getRangeAt(0).cloneRange(); setImgUrlInput(""); setShowImgModal(true); }} className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600 cursor-pointer transition">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="2" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><circle cx="4.5" cy="5.5" r="1.3" stroke="currentColor" strokeWidth="1.2" /><polyline points="1,11 4.5,7.5 7,10 9.5,7.5 14,11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>


          <button title="Insert Link" onMouseDown={e => { e.preventDefault(); const sel = window.getSelection(); if (sel && sel.rangeCount) savedRange.current = sel.getRangeAt(0).cloneRange(); setLinkUrlInput(""); setShowLinkModal(true); }} className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600 cursor-pointer transition">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M5.5 9.5a3.5 3.5 0 0 0 4.95 0l2-2a3.5 3.5 0 0 0-4.95-4.95L6.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M9.5 5.5a3.5 3.5 0 0 0-4.95 0l-2 2a3.5 3.5 0 0 0 4.95 4.95l1-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          </button>


          <div className="relative">
            <button title="Insert Table" onMouseDown={e => { e.preventDefault(); const sel = window.getSelection(); if (sel && sel.rangeCount) savedRange.current = sel.getRangeAt(0).cloneRange(); setTableHover({ rows: 0, cols: 0 }); setShowTablePicker(p => !p); }} className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600 cursor-pointer transition">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="1" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><line x1="1" y1="5.5" x2="14" y2="5.5" stroke="currentColor" strokeWidth="1.1" /><line x1="1" y1="9.5" x2="14" y2="9.5" stroke="currentColor" strokeWidth="1.1" /><line x1="5.5" y1="1" x2="5.5" y2="14" stroke="currentColor" strokeWidth="1.1" /><line x1="9.5" y1="1" x2="9.5" y2="14" stroke="currentColor" strokeWidth="1.1" /></svg>
            </button>
            {showTablePicker && (
              <div className="absolute left-0 top-full mt-1.5 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 select-none" onMouseLeave={() => setTableHover({ rows: 0, cols: 0 })}>
                <p className="text-[11px] font-semibold text-gray-500 mb-2 text-center tracking-wide">Table</p>
                <div className="flex flex-col gap-0.5">
                  {Array.from({ length: 8 }, (_, r) => (
                    <div key={r} className="flex gap-0.5">
                      {Array.from({ length: 8 }, (_, c) => (
                        <div key={c} onMouseEnter={() => setTableHover({ rows: r + 1, cols: c + 1 })} onMouseDown={e => {
                          e.preventDefault();
                          const rows = r + 1, cols = c + 1;
                          const html = `<table style="border-collapse:collapse;width:100%;margin:8px 0"><tbody>` + Array(rows).fill(0).map(() => `<tr>` + Array(cols).fill(0).map(() => `<td style="border:1px solid #d1d5db;padding:6px 10px;min-width:60px">&nbsp;</td>`).join("") + `</tr>`).join("") + `</tbody></table><p><br></p>`;
                          const editor = document.querySelector(".rich-editor");
                          if (editor) editor.focus();
                          const sel = window.getSelection();
                          if (savedRange.current) { sel.removeAllRanges(); sel.addRange(savedRange.current); }
                          let success = false;
                          try { success = document.execCommand("insertHTML", false, html); } catch (err) { }
                          if (!success && savedRange.current) {
                            const temp = document.createElement("div"); temp.innerHTML = html;
                            const frag = document.createDocumentFragment(); let node, lastNode;
                            while ((node = temp.firstChild)) { lastNode = frag.appendChild(node); }
                            savedRange.current.insertNode(frag);
                            if (lastNode) { savedRange.current.setStartAfter(lastNode); savedRange.current.collapse(true); }
                            sel.removeAllRanges(); sel.addRange(savedRange.current);
                          }
                          if (editor) { const evt = new Event("input", { bubbles: true }); editor.dispatchEvent(evt); }
                          setShowTablePicker(false);
                        }} className={`w-5 h-5 rounded-sm border cursor-pointer transition-colors ${r < tableHover.rows && c < tableHover.cols ? "bg-primary/20 border-primary/40" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`} />
                      ))}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-center text-gray-500 mt-2 font-medium">{tableHover.rows > 0 ? `${tableHover.cols} × ${tableHover.rows}` : "Hover to select"}</p>
              </div>
            )}
          </div>
        </div>

        <div ref={editorRef} contentEditable suppressContentEditableWarning onPaste={e => { e.preventDefault(); const text = e.clipboardData.getData("text/plain"); document.execCommand("insertText", false, text); }} onInput={e => setDescription(e.currentTarget.innerHTML)} data-placeholder={t(language, "fairDescriptionPlaceholder")} className="w-full min-h-[220px] border border-t-0 border-gray-200 rounded-b-lg px-4 py-3 text-sm text-gray-800 outline-none transition overflow-auto rich-editor" style={{ lineHeight: "1.7" }} />
        <style>{`.rich-editor:empty:before{content:attr(data-placeholder);color:#9ca3af;pointer-events:none}.rich-editor table{border-collapse:collapse;width:100%;margin:8px 0}.rich-editor td,.rich-editor th{border:1px solid #d1d5db;padding:6px 10px;min-width:60px}.rich-editor a{color:#110060;text-decoration:underline}.rich-editor img{max-width:100%;border-radius:4px;margin:4px 0}.rich-editor ul{list-style:disc;padding-left:1.5rem;margin:4px 0}.rich-editor ol{list-style:decimal;padding-left:1.5rem;margin:4px 0}`}</style>


        {showImgModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onMouseDown={() => setShowImgModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] mx-4 p-6 animate-in fade-in zoom-in-95 duration-150" onMouseDown={e => e.stopPropagation()}>
              <h3 className="text-base font-semibold text-primary mb-5">Insert Image</h3>
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t(language, "uploadFromDevice")}</p>
                <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-5 text-sm text-gray-500 hover:border-primary hover:text-primary transition cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 13V4m0 0L7 7m3-3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 14v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  {t(language, "clickToUploadImage")}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={async e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const fd = new FormData();
                    fd.append('file', file);
                    const res = await fetch(`${SERVER_URL}/api/upload/public`, { method: 'POST', body: fd });
                    const data = await res.json();
                    if (data.success) {
                      const fileUrl = data.url;
                      const realUrl = fileUrl.startsWith('http') ? fileUrl : `${SERVER_URL}${fileUrl}`;
                      const sel = window.getSelection();
                      if (savedRange.current) { sel.removeAllRanges(); sel.addRange(savedRange.current); }
                      document.execCommand("insertImage", false, realUrl);
                      setShowImgModal(false);
                    } else {
                      alert("Failed to upload image: " + data.message);
                    }
                  } catch (err) {
                    console.error("Failed to upload image", err);
                    alert("Failed to upload image.");
                  }
                  e.target.value = "";
                }} />
              </div>
              <div className="flex items-center gap-3 my-4"><div className="flex-1 h-px bg-gray-100" /><span className="text-xs text-gray-400 font-medium">or</span><div className="flex-1 h-px bg-gray-100" /></div>
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t(language, "insertFromUrl")}</p>
                <input type="url" placeholder="https://example.com/image.jpg" value={imgUrlInput} onChange={e => setImgUrlInput(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => setShowImgModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer">{t(language, "cancel")}</button>
                <button onClick={() => { if (!imgUrlInput.trim()) return; const sel = window.getSelection(); if (savedRange.current) { sel.removeAllRanges(); sel.addRange(savedRange.current); } document.execCommand("insertImage", false, imgUrlInput.trim()); setShowImgModal(false); }} className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition cursor-pointer disabled:opacity-40" disabled={!imgUrlInput.trim()}>{t(language, "insertBtn")}</button>
              </div>
            </div>
          </div>
        )}


        {showLinkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onMouseDown={() => setShowLinkModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] mx-4 p-6 animate-in fade-in zoom-in-95 duration-150" onMouseDown={e => e.stopPropagation()}>
              <h3 className="text-base font-semibold text-primary mb-5">{t(language, "insertLinkTitle")}</h3>
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t(language, "urlWebAddress")}</p>
                <input type="url" placeholder="https://example.com" value={linkUrlInput} onChange={e => setLinkUrlInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && linkUrlInput.trim()) { const sel = window.getSelection(); if (savedRange.current) { sel.removeAllRanges(); sel.addRange(savedRange.current); } document.execCommand("createLink", false, linkUrlInput.trim()); setShowLinkModal(false); } }} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" autoFocus />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => setShowLinkModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer">{t(language, "cancel")}</button>
                <button onClick={() => { if (!linkUrlInput.trim()) return; const sel = window.getSelection(); if (savedRange.current) { sel.removeAllRanges(); sel.addRange(savedRange.current); } document.execCommand("createLink", false, linkUrlInput.trim()); setShowLinkModal(false); }} className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition cursor-pointer disabled:opacity-40" disabled={!linkUrlInput.trim()}>{t(language, "insertLinkTitle")}</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">{t(language, "additionalFairDetails")}</h3>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t(language, "organizedBy")}</label>
            <input type="text" value={extraDetails?.organizedBy || ""} onChange={e => setExtraDetails(prev => ({ ...prev, organizedBy: e.target.value }))} placeholder={t(language, "organizerNamePlaceholder")} className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t(language, "registrationDeadline")}</label>
            <input type="datetime-local" value={extraDetails?.registrationDateTime || ""} onChange={e => setExtraDetails(prev => ({ ...prev, registrationDateTime: e.target.value }))} className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent text-gray-700" />
          </div>
        </div>
      </div>


      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">{t(language, "contactInformation")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t(language, "whatsappNumber")}</label>
            <input type="text" maxLength={10} value={extraDetails?.whatsappNumber || ""} onChange={e => setExtraDetails(prev => ({ ...prev, whatsappNumber: e.target.value }))} placeholder={t(language, "tenDigitNumberPlaceholder")} className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t(language, "primaryPhone")}</label>
            <input type="text" maxLength={10} value={extraDetails?.phone || ""} onChange={e => setExtraDetails(prev => ({ ...prev, phone: e.target.value }))} placeholder={t(language, "tenDigitNumberPlaceholder")} className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t(language, "additionalPhone")}</label>
            <input type="text" maxLength={10} value={extraDetails?.additionalPhone || ""} onChange={e => setExtraDetails(prev => ({ ...prev, additionalPhone: e.target.value }))} placeholder={t(language, "tenDigitNumberPlaceholder")} className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t(language, "additionalPhone2")}</label>
            <input type="text" maxLength={10} value={extraDetails?.additionalPhone2 || ""} onChange={e => setExtraDetails(prev => ({ ...prev, additionalPhone2: e.target.value }))} placeholder={t(language, "tenDigitNumberPlaceholder")} className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t(language, "additionalPhone3")}</label>
            <input type="text" maxLength={10} value={extraDetails?.additionalPhone3 || ""} onChange={e => setExtraDetails(prev => ({ ...prev, additionalPhone3: e.target.value }))} placeholder={t(language, "tenDigitNumberPlaceholder")} className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div className="sm:col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t(language, "email")}</label>
            <input type="email" value={extraDetails?.email || ""} onChange={e => setExtraDetails(prev => ({ ...prev, email: e.target.value }))} placeholder={t(language, "emailAddressPlaceholder")} className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
        </div>
      </div>


      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">{t(language, "socialMediaLinks")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t(language, "facebookUrl")}</label>
            <input type="text" value={extraDetails?.facebook || ""} onChange={e => setExtraDetails(prev => ({ ...prev, facebook: e.target.value }))} placeholder="https://facebook.com/..." className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t(language, "instagramUrl")}</label>
            <input type="text" value={extraDetails?.instagram || ""} onChange={e => setExtraDetails(prev => ({ ...prev, instagram: e.target.value }))} placeholder="https://instagram.com/..." className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t(language, "linkedinUrl")}</label>
            <input type="text" value={extraDetails?.linkedin || ""} onChange={e => setExtraDetails(prev => ({ ...prev, linkedin: e.target.value }))} placeholder="https://linkedin.com/..." className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t(language, "twitterUrl")}</label>
            <input type="text" value={extraDetails?.twitter || ""} onChange={e => setExtraDetails(prev => ({ ...prev, twitter: e.target.value }))} placeholder="https://twitter.com/..." className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
        </div>
      </div>




      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">{t(language, "highlights")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {fairStats.map((stat, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 relative group">
              {fairStats.length > 1 && (
                <button
                  onClick={() => setFairStats(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center hover:bg-secondary/20 transition cursor-pointer"
                >
                  <Minus size={10} />
                </button>
              )}
              <div className="flex items-center gap-1.5 mb-2 pr-6">
                <input
                  type="text"
                  value={
                    stat.label === "Companies" ? (t(language, "companiesHighlight") || stat.label) :
                    stat.label === "Job Roles" ? (t(language, "jobRolesHighlight") || stat.label) :
                    stat.label === "Graduates" ? (t(language, "graduatesHighlight") || stat.label) :
                    stat.label === "States / U.Ts" ? (t(language, "statesHighlight") || stat.label) :
                    stat.label === "Cities & Towns" ? (t(language, "citiesHighlight") || stat.label) :
                    stat.label === "Hall Tickets" ? (t(language, "hallTicketsHighlight") || stat.label) : stat.label
                  }
                  placeholder="e.g. Companies"
                  onChange={e => setFairStats(prev => {
                    const newStats = [...prev];
                    newStats[i].label = e.target.value;
                    return newStats;
                  })}
                  className="w-full text-xs font-semibold text-gray-500 outline-none border-b border-transparent focus:border-primary bg-transparent pb-0.5"
                />
              </div>
              <input
                type="number"
                value={stat.value}
                onChange={e => setFairStats(prev => {
                  const newStats = [...prev];
                  newStats[i].value = e.target.value;
                  return newStats;
                })}
                className="w-full text-sm font-medium outline-none focus:border-primary bg-transparent placeholder-gray-300 px-2 py-1 border-b border-gray-100"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => setFairStats(prev => [...prev, { label: "", value: "" }])}
          className="mt-3 flex items-center gap-1.5 text-sm text-primary font-medium hover:underline cursor-pointer"
        >
          <Plus size={14} /> {t(language, "addHighlights")}
        </button>
      </div>


      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <h3 className="text-sm font-semibold text-primary">{t(language, "hiringPartners")}</h3>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-600 mb-2">{t(language, "companyListDoc")}</label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".pdf,.xls,.xlsx"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setCompanyListDocumentUrl({ file: e.target.files[0], preview: URL.createObjectURL(e.target.files[0]), existingName: "" });
                }
              }}
              className="w-full text-xs font-medium outline-none file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary/90"
            />
            {companyListDocumentUrl?.existingName && !companyListDocumentUrl?.file && (
              <a href={`${companyListDocumentUrl.preview}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-medium truncate flex-1 hover:underline cursor-pointer">
                Current: {companyListDocumentUrl.existingName}
              </a>
            )}
            {companyListDocumentUrl?.file && (
              <span className="text-xs text-green-600 font-medium truncate flex-1">
                Selected: {companyListDocumentUrl.file.name}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {companies.map((c, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 relative shadow-sm mb-6">
              {companies.length > 1 && (
                <button type="button" onClick={() => removeCompany(i)} className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer" title="Remove Company"><FiTrash2 size={14} /></button>
              )}
              <div className="mb-4 text-primary font-bold text-lg border-b border-gray-100 pb-2">{t(language, "companyPrefix")}{i + 1}</div>

              <div className="flex gap-4 mb-6">
                {["Job", "Internship", "Apprenticeship"].map(type => (
                  <label key={t(language, type.toLowerCase()) || type} className={`cursor-pointer flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold border-2 transition ${(c.postingType || "Job") === type ? "border-primary bg-primary/5 text-primary" : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"}`}>
                    <input type="radio" className="hidden" checked={(c.postingType || "Job") === type} onChange={() => updateCompany(i, "postingType", type)} />
                    {t(language, type.toLowerCase()) || type}
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="mb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700 bg-primary/5 p-3 ">
                    <input
                      type="checkbox"
                      name="showDetailsInUI"
                      checked={c.showDetailsInUI !== false}
                      onChange={(e) => updateCompany(i, e.target.name, e.target.checked)}
                      className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm font-semibold text-slate-700 select-none">
                    {t(language, "wantToShowJobAndCompanyDetails")}
                  </span>
                  </label>
                  <p className="text-[11px] text-slate-500 mt-1 ml-8">{t(language, "ifUntickedCandidatesModal")}</p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-600 uppercase mb-2">{t(language, "companyLogo")}</label>
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        updateCompany(i, "logoSourceMode", "upload");

                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition ${c.logoSourceMode === "upload"
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                      {t(language, "uploadFile")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateCompany(i, "logoSourceMode", "link");
                        updateCompany(i, "companyLogoUrl", c.logoLink || "");
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition ${c.logoSourceMode === "link"
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                      {t(language, "imageLink")}
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    {c.companyLogoUrl ? (
                      <div className="relative w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src={c.companyLogoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => {
                            if (c.logoSourceMode === "upload") {
                              setLogoFile(null);
                            } else {
                              updateCompany(i, "logoLink", "");
                            }
                            updateCompany(i, "companyLogoUrl", "");
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow hover:bg-red-600 transition"
                        >
                          <FiX size={10} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                        <FaBuilding size={24} />
                      </div>
                    )}

                    {c.logoSourceMode === "upload" ? (
                      <label className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/50 cursor-pointer hover:bg-slate-50 hover:border-primary/45 transition h-16">
                        <div className="flex flex-col items-center text-center">
                          <FiUpload size={14} className="text-slate-400 mb-1" />
                          <span className="text-[9px] font-bold text-primary">{t(language, "uploadLogo")}</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => { if (e.target.files && e.target.files[0]) { updateCompany(i, "companyLogo", e.target.files[0]); updateCompany(i, "companyLogoUrl", URL.createObjectURL(e.target.files[0])); } }}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="flex-grow">
                        <input
                          type="url"
                          name="logoLink"
                          value={c.logoLink}
                          onChange={(e) => {
                            updateCompany(i, "logoLink", e.target.value);
                            updateCompany(i, "companyLogoUrl", e.target.value);
                          }}
                          placeholder="Image URL..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-sm font-bold text-slate-800 mb-4">{c.postingType || "Job"} {t(language, "jobDetailsTitle")}</h4>

                <div className="mb-4">
                  {c.jobProfile.map((job, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-4 mb-4 items-end">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-600 mb-1">{getTranslatedPostingType(c.postingType)} {t(language, "titleLabel")} </label>
                        <input
                          type="text"
                          placeholder={`${getTranslatedPostingType(c.postingType)} ${t(language, "titleLabel")}`}
                          value={job.title}
                          onChange={(e) => {
                            const newProfiles = [...(c.jobProfile || [])];
                            newProfiles[index].title = e.target.value;
                            updateCompany(i, "jobProfile", newProfiles);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-600 mb-1">{getTranslatedPostingType(c.postingType)} {t(language, "typeLabel")}</label>
                        <select
                          value={job.type}
                          onChange={(e) => {
                            const newProfiles = [...(c.jobProfile || [])];
                            newProfiles[index].type = e.target.value;
                            updateCompany(i, "jobProfile", newProfiles);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        >
                          <option value="">{t(language, "selectType")}</option>
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                          <option value="Internship">Internship</option>
                          <option value="Contract">Contract</option>
                        </select>
                      </div>
                      {index > 0 && (
                        <button type="button" onClick={() => {
                          const newProfiles = (c.jobProfile || []).filter((_, idx) => idx !== index);
                          updateCompany(i, "jobProfile", newProfiles);
                        }} className="text-red-500 hover:text-red-700 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg shrink-0">
                          <FiX size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => updateCompany(i, "jobProfile", [...(c.jobProfile || []), { title: "", type: "" }])} className="text-xs text-primary font-bold hover:underline">+ {t(language, "addPrefix")} {getTranslatedPostingType(c.postingType)} {t(language, "titleLabel")}</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "qualification")}</label>
                    <input
                      type="text"
                      name="qualification"
                      value={c.qualification}
                      onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "noOfPositions")}</label>
                    <input
                      type="number"
                      name="candidatesRequired"
                      value={c.candidatesRequired}
                      onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "salaryRange")}</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="minSalary"
                        value={c.minSalary}
                        onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                        placeholder={t(language, "minSal")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                      />
                      <input
                        type="number"
                        name="maxSalary"
                        value={c.maxSalary}
                        onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                        placeholder={t(language, "maxSal")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                      />
                      <select
                        name="salaryType"
                        value={c.salaryType}
                        onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                        className="w-[100px] bg-slate-50 border border-slate-200 rounded-lg py-2 px-2 outline-none text-xs focus:border-primary focus:bg-white shrink-0"
                      >
                        <option value="Per Month">{t(language, "perMonth")}</option>
                        <option value="Per Year">{t(language, "perYear")}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {c.postingType === 'Internship' || c.postingType === 'Apprenticeship' ? t(language, 'duration') : t(language, 'experienceRequired')}
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="minExperience"
                        value={c.minExperience}
                        onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                      >
                        <option value="">{c.postingType === 'Internship' || c.postingType === 'Apprenticeship' ? t(language, 'minDur') : '-Min Exp-'}</option>
                        {[...Array(15)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                      <select
                        name="maxExperience"
                        value={c.maxExperience}
                        onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                      >
                        <option value="">{c.postingType === 'Internship' || c.postingType === 'Apprenticeship' ? t(language, 'maxDur') : '-Max Exp-'}</option>
                        {[...Array(20)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                      </select>
                      <select
                        name="experienceType"
                        value={c.experienceType}
                        onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                        className="w-[100px] bg-slate-50 border border-slate-200 rounded-lg py-2 px-2 outline-none text-xs focus:border-primary focus:bg-white shrink-0"
                      >
                        <option value="Months">{t(language, "months")}</option>
                        <option value="Years">{t(language, "years")}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-600 mb-1">{c.postingType || "Job"} Description</label>
                  <textarea
                    name="description"
                    value={c.description}
                    onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                    placeholder={`${getTranslatedPostingType(c.postingType)} ${t(language, "jobDescriptionPlaceholder")}`}
                    rows="3"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white resize-none"
                  />
                </div>

                <div className="mb-4">
                  {c.locations.map((loc, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 mb-4 items-end">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{getTranslatedPostingType(c.postingType)} {t(language, "locationStateLabel")}</label>
                        <Select
                          options={INDIA_STATES}
                          value={INDIA_STATES.find(s => s.value === loc.state) || null}
                          onChange={(selected) => {
                            const newLocs = [...(c.locations || [])];
                            newLocs[index].state = selected ? selected.value : "";
                            newLocs[index].city = "";
                            updateCompany(i, "locations", newLocs);
                          }}
                          placeholder={t(language, "searchStatePlaceholder")}
                          isClearable
                          isSearchable
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: '#f8fafc',
                              borderColor: state.isFocused ? '#110060' : '#e2e8f0',
                              boxShadow: 'none',
                              '&:hover': { borderColor: state.isFocused ? '#110060' : '#e2e8f0' },
                              borderRadius: '0.5rem',
                              minHeight: '34px',
                              fontSize: '12px'
                            }),
                            menu: base => ({ ...base, fontSize: '12px', zIndex: 50 })
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{getTranslatedPostingType(c.postingType)} {t(language, "locationCityLabel")}</label>
                        <Select
                          options={(() => {
                            if (!loc.state) return [];
                            const stateObj = INDIA_STATES.find(s => s.value === loc.state);
                            if (!stateObj) return [];
                            const cities = City.getCitiesOfState(INDIA_ISO_CODE, stateObj.isoCode);
                            const uniqueCities = [...new Set(cities.map(c => c.name))];
                            return uniqueCities.map(c => ({ value: c, label: c }));
                          })()}
                          value={loc.city ? { value: loc.city, label: loc.city } : null}
                          onChange={(selected) => {
                            const newLocs = [...(c.locations || [])];
                            newLocs[index].city = selected ? selected.value : "";
                            updateCompany(i, "locations", newLocs);
                          }}
                          placeholder={loc.state ? "Search City..." : "Select State first"}
                          isDisabled={!loc.state}
                          isClearable
                          isSearchable
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: '#f8fafc',
                              borderColor: state.isFocused ? '#110060' : '#e2e8f0',
                              boxShadow: 'none',
                              '&:hover': { borderColor: state.isFocused ? '#110060' : '#e2e8f0' },
                              borderRadius: '0.5rem',
                              minHeight: '34px',
                              fontSize: '12px'
                            }),
                            menu: base => ({ ...base, fontSize: '12px', zIndex: 50 })
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "pincode")}</label>
                        <input
                          type="text"
                          placeholder={t(language, "pincode")}
                          value={loc.pincode}
                          onChange={(e) => {
                            const newLocs = [...(c.locations || [])];
                            newLocs[index].pincode = e.target.value;
                            updateCompany(i, "locations", newLocs);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        />
                      </div>
                      {index > 0 ? (
                        <button type="button" onClick={() => {
                          const newLocs = (c.locations || []).filter((_, idx) => idx !== index);
                          updateCompany(i, "locations", newLocs);
                        }} className="text-red-500 hover:text-red-700 px-3 py-2 border border-red-200 rounded-lg bg-red-50 flex items-center justify-center h-[34px]">
                          <FiTrash2 size={16} />
                        </button>
                      ) : <div className="w-9 h-[34px]"></div>}
                    </div>
                  ))}
                  <button type="button" onClick={() => updateCompany(i, "locations", [...(c.locations || []), { state: "", city: "", pincode: "" }])} className="text-xs text-primary font-bold hover:underline">{t(language, "addLocationBtn")}</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{getTranslatedPostingType(c.postingType)} {t(language, "expiryDateLabel")}</label>
                    <input
                      type="date"
                      name="jobExpiryDate"
                      value={c.jobExpiryDate}
                      onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "hiringProcess")}</label>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-700">
                      {['FaceToFace', 'Writtentest', 'Telephonic', 'GroupDiscussion', 'Walk In'].map(method => (
                        <label key={t(language, method === 'FaceToFace' ? 'faceToFace' : method === 'Writtentest' ? 'writtenTest' : method === 'Telephonic' ? 'telephonic' : method === 'GroupDiscussion' ? 'groupDiscussion' : 'walkIn') || method} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(c.hiringProcess || []).includes(method)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateCompany(i, "hiringProcess", [...(c.hiringProcess || []), method]);
                              } else {
                                updateCompany(i, "hiringProcess", (c.hiringProcess || []).filter(m => m !== method));
                              }
                            }}
                          />
                          {t(language, method === 'FaceToFace' ? 'faceToFace' : method === 'Writtentest' ? 'writtenTest' : method === 'Telephonic' ? 'telephonic' : method === 'GroupDiscussion' ? 'groupDiscussion' : 'walkIn') || method}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "positionOpenFor")}</label>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-700">
                      {['Male', 'Female', 'Transgender', 'Other'].map(gender => (
                        <label key={t(language, gender.toLowerCase()) || gender} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(c.positionOpenFor || []).includes(gender)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateCompany(i, "positionOpenFor", [...(c.positionOpenFor || []), gender]);
                              } else {
                                updateCompany(i, "positionOpenFor", (c.positionOpenFor || []).filter(g => g !== gender));
                              }
                            }}
                          />
                          {t(language, gender.toLowerCase()) || gender}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "otherBenefit")}</label>
                    <div className="flex gap-2 items-start">
                      <div className="flex-1">
                        <CreatableSelect
                          isMulti
                          name="otherBenefit"
                          options={benefitOptions}
                          value={c.otherBenefit ? c.otherBenefit.split(',').map(b => ({ label: b.trim(), value: b.trim() })) : []}
                          inputValue={selectInputs[i] || ""}
                          onInputChange={(val, { action }) => {
                            if (action === 'input-change' || action === 'set-value') {
                              setSelectInputs(prev => ({ ...prev, [i]: val }));
                            } else if (action === 'menu-close' || action === 'input-blur') {
                              // Keep the value if they are clicking the Add button
                            }
                          }}
                          onChange={(selected) => {
                            updateCompany(i, "otherBenefit", selected ? selected.map(s => s.value).join(', ') : "");
                            setSelectInputs(prev => ({ ...prev, [i]: "" }));
                          }}
                          formatCreateLabel={(inputValue) => `+ Create "${inputValue}"`}
                          placeholder={t(language, "selectOrType")}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: '#f8fafc',
                              borderColor: state.isFocused ? '#110060' : '#e2e8f0',
                              boxShadow: 'none',
                              '&:hover': { borderColor: state.isFocused ? '#110060' : '#e2e8f0' },
                              borderRadius: '0.5rem',
                              minHeight: '34px',
                              fontSize: '12px'
                            }),
                            menu: base => ({ ...base, fontSize: '12px', zIndex: 50 })
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          const val = (selectInputs[i] || "").trim();
                          if (val) {
                            if (!benefitOptions.find(b => b.value.toLowerCase() === val.toLowerCase())) {
                              setBenefitOptions(prev => [...prev, { label: val, value: val }]);
                            }
                            const currentBenefits = c.otherBenefit ? c.otherBenefit.split(',').map(b => b.trim()) : [];
                            if (!currentBenefits.find(b => b.toLowerCase() === val.toLowerCase())) {
                              updateCompany(i, "otherBenefit", [...currentBenefits, val].join(', '));
                            }
                            setSelectInputs(prev => ({ ...prev, [i]: "" }));
                          }
                        }}
                        className="px-3 py-1 bg-primary text-white text-[12px] font-bold rounded-lg hover:bg-primary/90 transition h-[34px]"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "openForPhysicallyChallenged")}</label>
                    <select
                      name="openForPhysicallyChallenged"
                      value={c.openForPhysicallyChallenged}
                      onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                    >
                      <option value="">{t(language, "selectPlaceholder")}</option>
                      <option value="Yes">{t(language, "yes")}</option>
                      <option value="No">{t(language, "no")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "organisationName")}</label>
                    <input
                      type="text"
                      name="organisationName"
                      value={c.organisationName}
                      onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mt-6">
                <h4 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider ">{t(language, "yourDetailsLabel")}</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "companyNameLabel")}</label>
                    <input
                      type="text"
                      name="companyName"
                      value={c.companyName}
                      onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "companyTypeLabel")}</label>
                    <select
                      name="companyType"
                      value={c.companyType}
                      onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                    >
                      <option value="">{t(language, "selectPlaceholder")}</option>
                      <option value="Private">Private</option>
                      <option value="Public">Public</option>
                      <option value="Government">Government</option>
                      <option value="NGO">NGO</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "contactPersonNameLabel")}</label>
                    <input
                      type="text"
                      name="contactPersonName"
                      value={c.contactPersonName}
                      onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "designationLabel")}</label>
                    <input
                      type="text"
                      name="designation"
                      value={c.designation}
                      onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "mobileNumberLabel")}</label>
                    <input
                      type="text"
                      name="mobileNumber"
                      value={c.mobileNumber}
                      onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                      placeholder={t(language, "enter10DigitPhoneNo")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "emailLabel")}</label>
                    <input
                      type="email"
                      name="email"
                      value={c.email}
                      onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{getTranslatedPostingType(c.postingType)} {t(language, "roleLabel")}</label>
                    <input
                      type="text"
                      name="yourDetailsJobRole"
                      value={c.yourDetailsJobRole}
                      onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "totalNumberOfOpeningsLabel")}</label>
                    <input
                      type="number"
                      name="yourDetailsTotalOpenings"
                      value={c.yourDetailsTotalOpenings}
                      onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "stateLabel")}</label>
                    <Select
                      options={INDIA_STATES}
                      value={INDIA_STATES.find(s => s.value === c.yourDetailsState) || null}
                      onChange={(selected) => {
                        updateCompany(i, "yourDetailsState", selected ? selected.value : "");
                        updateCompany(i, "yourDetailsCity", "");
                      }}
                      placeholder={t(language, "searchStatePlaceholder")}
                      isClearable
                      isSearchable
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: '#f8fafc',
                          borderColor: state.isFocused ? '#110060' : '#e2e8f0',
                          boxShadow: 'none',
                          '&:hover': { borderColor: state.isFocused ? '#110060' : '#e2e8f0' },
                          borderRadius: '0.5rem',
                          minHeight: '34px',
                          fontSize: '12px'
                        }),
                        menu: base => ({ ...base, fontSize: '12px', zIndex: 50 })
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "cityLabel")}</label>
                    <Select
                      options={(() => {
                        if (!c.yourDetailsState) return [];
                        const stateObj = INDIA_STATES.find(s => s.value === c.yourDetailsState);
                        if (!stateObj) return [];
                        const cities = City.getCitiesOfState(INDIA_ISO_CODE, stateObj.isoCode);
                        const uniqueCities = [...new Set(cities.map(c => c.name))];
                        return uniqueCities.map(c => ({ value: c, label: c }));
                      })()}
                      value={c.yourDetailsCity ? { value: c.yourDetailsCity, label: c.yourDetailsCity } : null}
                      onChange={(selected) => {
                        updateCompany(i, "yourDetailsCity", selected ? selected.value : "");
                      }}
                      placeholder={c.yourDetailsState ? t(language, "searchCityPlaceholder") : t(language, "selectStateFirstPlaceholder")}
                      isDisabled={!c.yourDetailsState}
                      isClearable
                      isSearchable
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: '#f8fafc',
                          borderColor: state.isFocused ? '#110060' : '#e2e8f0',
                          boxShadow: 'none',
                          '&:hover': { borderColor: state.isFocused ? '#110060' : '#e2e8f0' },
                          borderRadius: '0.5rem',
                          minHeight: '34px',
                          fontSize: '12px'
                        }),
                        menu: base => ({ ...base, fontSize: '12px', zIndex: 50 })
                      }}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t(language, "salaryRange")} (INR)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="yourDetailsMinSalary"
                        value={c.yourDetailsMinSalary}
                        onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                        placeholder={t(language, "minSalary")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                      />
                      <input
                        type="number"
                        name="yourDetailsMaxSalary"
                        value={c.yourDetailsMaxSalary}
                        onChange={(e) => updateCompany(i, e.target.name, e.target.value)}
                        placeholder={t(language, "maxSalary")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          ))}
        </div>
        <button onClick={addCompany} className="mt-3 flex items-center gap-1.5 text-sm text-primary font-medium hover:underline cursor-pointer"><Plus size={14} /> Add Company</button>
      </div>


      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <h3 className="text-sm font-semibold text-primary">{t(language, "whoCanApply")}</h3>
        </div>
        <div className="space-y-2 w-full">
          {thingsToKnow.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              <input type="text" placeholder={t(language, "fact1Placeholder")?.replace("1", i + 1)} value={item} onChange={e => updateThing(i, e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
              {thingsToKnow.length > 1 && (
                <button onClick={() => removeThing(i)} className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center hover:bg-secondary/20 transition cursor-pointer"><Minus size={11} /></button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addThing} className="mt-3 flex items-center gap-1.5 text-sm text-primary font-medium hover:underline cursor-pointer"><Plus size={14} /> {t(language, "addItem")}</button>
      </div>


      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">{t(language, "fairInformation")}</label>
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <textarea rows={5} placeholder={t(language, "instructionsPlaceholder")} value={instructions} onChange={e => setInstructions(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">{t(language, "termsAndConditions")}</label>
        <textarea rows={5} placeholder={t(language, "termsPlaceholder")} value={termsText} onChange={e => setTermsText(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-none" />
      </div>


      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">{t(language, "faq")}</h3>
        <div className="space-y-3 w-full">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                <button onClick={() => toggleFaq(i)} className="text-gray-400 hover:text-primary transition cursor-pointer">{faq.open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button>
                <input type="text" placeholder={t(language, "questionPlaceholder")} value={faq.q} onChange={e => updateFaq(i, "q", e.target.value)} className="flex-1 text-sm font-medium bg-transparent outline-none placeholder-gray-300" />
                {faqs.length > 1 && <button onClick={() => removeFaq(i)} className="w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center hover:bg-secondary/20 transition cursor-pointer"><Minus size={10} /></button>}
              </div>
              {faq.open && <textarea rows={3} placeholder={t(language, "answerPlaceholder")} value={faq.a} onChange={e => updateFaq(i, "a", e.target.value)} className="w-full px-4 py-3 text-sm placeholder-gray-300 outline-none resize-none bg-white focus:bg-primary/5 transition" />}
            </div>
          ))}
        </div>
        <button onClick={addFaq} className="mt-3 flex items-center gap-1.5 text-sm text-primary font-medium hover:underline cursor-pointer"><Plus size={14} /> {t(language, "addFaq")}</button>
      </div>
    </div>
  );
};

export default EventInformationTab;
