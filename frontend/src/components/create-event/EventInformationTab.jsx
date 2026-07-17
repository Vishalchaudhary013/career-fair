import { useEffect, useRef, useState } from "react";
import { Info, Plus, Minus, ChevronDown, ChevronUp, AlertCircle, Briefcase, Music, Trophy, Mic, Palette, Code, Users, Medal, HelpCircle, Video, Wrench, Ticket } from "lucide-react";

const DEFAULT_CATEGORIES = [
  { value: "Career Drive",    label: "Career Drive",    icon: Briefcase },
  { value: "College Festivals", label: "College Festivals", icon: Music },
  { value: "Competitions",      label: "Competitions",      icon: Trophy },
  { value: "Conferences",       label: "Conferences",       icon: Mic },
  { value: "Cultural Events",   label: "Cultural Events",   icon: Palette },
  { value: "Hackathon",         label: "Hackathon",         icon: Code },
  { value: "Mentorships",       label: "Mentorships",       icon: Users },
  { value: "Olympiad",          label: "Olympiad",          icon: Medal },
  { value: "Quizzes",           label: "Quizzes",           icon: HelpCircle },
  { value: "Webinars",          label: "Webinars",          icon: Video },
  { value: "Workshop",          label: "Workshop",          icon: Wrench },
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
}) => {
  const [categoriesList, setCategoriesList] = useState(DEFAULT_CATEGORIES);
  const [showNewCatModal, setShowNewCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatFile, setNewCatFile] = useState(null);
  const [isCreatingCat, setIsCreatingCat] = useState(false);

  const [typesList, setTypesList] = useState(DEFAULT_TYPES);
  const [showNewTypeModal, setShowNewTypeModal] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [isCreatingType, setIsCreatingType] = useState(false);

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
    
    // Mock category creation
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
    
    // Mock type creation
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

      {/* ── Category Selector ── */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-3">
          Fair Category
          <span title="Choose the category that best describes your fair." className="cursor-help text-gray-400"><Info size={14} /></span>
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
          <div className="relative flex-1">
            <select
              value={category || ""}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition bg-white text-gray-700 cursor-pointer"
            >
              <option value="">-- Select a category --</option>
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
            <Plus size={16} /> New Category
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

      {/* ── Type Selector ── */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-3">
          Fair Type
          <span title="Choose the type of opportunities available at your fair." className="cursor-help text-gray-400"><Info size={14} /></span>
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
          <div className="relative flex-1">
            <select
              value={fairType || ""}
              onChange={(e) => setFairType(e.target.value)}
              className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition bg-white text-gray-700 cursor-pointer"
            >
              <option value="">-- Select a fair type --</option>
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
            <Plus size={16} /> New Type
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

      {/* New Category Modal */}
      {showNewCatModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onMouseDown={() => setShowNewCatModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] mx-4 p-6 animate-in zoom-in-95 duration-200" onMouseDown={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-primary mb-5 border-b pb-3">Create New Category</h3>
            
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category Name</label>
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
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category Icon</label>
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
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateCategory} 
                disabled={!newCatName.trim() || !newCatFile || isCreatingCat}
                className="px-5 py-2 text-sm font-bold bg-secondary text-white rounded-lg hover:bg-secondary/90 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isCreatingCat ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewTypeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onMouseDown={() => setShowNewTypeModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] mx-4 p-6 animate-in zoom-in-95 duration-200" onMouseDown={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-primary mb-5 border-b pb-3">Create New Fair Type</h3>
            
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Type Name</label>
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
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Cancel
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
          Fair Description
          <span title="This appears on the public fair page." className="cursor-help text-gray-400"><Info size={14} /></span>
        </label>

        
        <div className="border border-gray-200 rounded-t-lg bg-gray-50 px-3 py-2 flex items-center gap-0.5 flex-wrap select-none">
          {[
            { title: "Bold", cmd: "bold", label: <span className="font-bold text-sm">B</span> },
            { title: "Italic", cmd: "italic", label: <span className="italic text-sm">I</span> },
            { title: "Underline", cmd: "underline", label: <span className="underline text-sm">U</span> },
          ].map(({ title, cmd, label }) => (
            <button key={cmd} title={title} onMouseDown={e => { e.preventDefault(); document.execCommand(cmd, false); }} className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-700 cursor-pointer transition">{label}</button>
          ))}
          <div className="w-px h-5 bg-gray-300 mx-1.5" />
          <select defaultValue="14" onMouseDown={e => e.stopPropagation()} onChange={e => { document.execCommand("fontSize", false, "7"); const els = document.querySelectorAll("[size='7']"); els.forEach(el => { el.removeAttribute("size"); el.style.fontSize = e.target.value + "px"; }); }} className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white outline-none cursor-pointer h-6">
            {["10","12","14","16","18","20","24","28","32","Normal"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="w-px h-5 bg-gray-300 mx-1.5" />
          {[
            { title: "Align Left", cmd: "justifyLeft", icon: (<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="1" y1="3" x2="13" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="1" y1="7" x2="9" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="1" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>) },
            { title: "Align Center", cmd: "justifyCenter", icon: (<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="1" y1="3" x2="13" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="7" x2="11" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="1" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>) },
            { title: "Align Right", cmd: "justifyRight", icon: (<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="1" y1="3" x2="13" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="5" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="1" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>) },
          ].map(({ title, cmd, icon }) => (
            <button key={cmd} title={title} onMouseDown={e => { e.preventDefault(); document.execCommand(cmd, false); }} className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600 cursor-pointer transition">{icon}</button>
          ))}
          <button title="Bullet List" onMouseDown={e => { e.preventDefault(); document.execCommand("insertUnorderedList", false); }} className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600 cursor-pointer transition">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="2" cy="3.5" r="1.2" fill="currentColor"/><line x1="5" y1="3.5" x2="13" y2="3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="2" cy="7" r="1.2" fill="currentColor"/><line x1="5" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="2" cy="10.5" r="1.2" fill="currentColor"/><line x1="5" y1="10.5" x2="13" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          <button title="Numbered List" onMouseDown={e => { e.preventDefault(); document.execCommand("insertOrderedList", false); }} className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600 cursor-pointer transition">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 1.5v4m-1-1h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="5.5" y1="3.5" x2="13" y2="3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M1.5 8.5h2a1 1 0 0 1 0 2h-2a1 1 0 0 0 0 2h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><line x1="5.5" y1="10.5" x2="13" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1.5" />

          
          <button title="Insert Image" onMouseDown={e => { e.preventDefault(); const sel = window.getSelection(); if (sel && sel.rangeCount) savedRange.current = sel.getRangeAt(0).cloneRange(); setImgUrlInput(""); setShowImgModal(true); }} className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600 cursor-pointer transition">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="2" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="4.5" cy="5.5" r="1.3" stroke="currentColor" strokeWidth="1.2"/><polyline points="1,11 4.5,7.5 7,10 9.5,7.5 14,11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          
          <button title="Insert Link" onMouseDown={e => { e.preventDefault(); const sel = window.getSelection(); if (sel && sel.rangeCount) savedRange.current = sel.getRangeAt(0).cloneRange(); setLinkUrlInput(""); setShowLinkModal(true); }} className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600 cursor-pointer transition">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M5.5 9.5a3.5 3.5 0 0 0 4.95 0l2-2a3.5 3.5 0 0 0-4.95-4.95L6.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M9.5 5.5a3.5 3.5 0 0 0-4.95 0l-2 2a3.5 3.5 0 0 0 4.95 4.95l1-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          </button>

          
          <div className="relative">
            <button title="Insert Table" onMouseDown={e => { e.preventDefault(); const sel = window.getSelection(); if (sel && sel.rangeCount) savedRange.current = sel.getRangeAt(0).cloneRange(); setTableHover({ rows: 0, cols: 0 }); setShowTablePicker(p => !p); }} className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600 cursor-pointer transition">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="1" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><line x1="1" y1="5.5" x2="14" y2="5.5" stroke="currentColor" strokeWidth="1.1"/><line x1="1" y1="9.5" x2="14" y2="9.5" stroke="currentColor" strokeWidth="1.1"/><line x1="5.5" y1="1" x2="5.5" y2="14" stroke="currentColor" strokeWidth="1.1"/><line x1="9.5" y1="1" x2="9.5" y2="14" stroke="currentColor" strokeWidth="1.1"/></svg>
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
                          try { success = document.execCommand("insertHTML", false, html); } catch(err) {}
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

        <div ref={editorRef} contentEditable suppressContentEditableWarning onPaste={e => { e.preventDefault(); const text = e.clipboardData.getData("text/plain"); document.execCommand("insertText", false, text); }} onInput={e => setDescription(e.currentTarget.innerHTML)} data-placeholder="Describe your fair here..." className="w-full min-h-[220px] border border-t-0 border-gray-200 rounded-b-lg px-4 py-3 text-sm text-gray-800 outline-none transition overflow-auto rich-editor" style={{ lineHeight: "1.7" }} />
        <style>{`.rich-editor:empty:before{content:attr(data-placeholder);color:#9ca3af;pointer-events:none}.rich-editor table{border-collapse:collapse;width:100%;margin:8px 0}.rich-editor td,.rich-editor th{border:1px solid #d1d5db;padding:6px 10px;min-width:60px}.rich-editor a{color:#110060;text-decoration:underline}.rich-editor img{max-width:100%;border-radius:4px;margin:4px 0}.rich-editor ul{list-style:disc;padding-left:1.5rem;margin:4px 0}.rich-editor ol{list-style:decimal;padding-left:1.5rem;margin:4px 0}`}</style>

        
        {showImgModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onMouseDown={() => setShowImgModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] mx-4 p-6 animate-in fade-in zoom-in-95 duration-150" onMouseDown={e => e.stopPropagation()}>
              <h3 className="text-base font-semibold text-primary mb-5">Insert Image</h3>
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Upload from device</p>
                <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-5 text-sm text-gray-500 hover:border-primary hover:text-primary transition cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 13V4m0 0L7 7m3-3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 14v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Click to upload image
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { 
                  const file = e.target.files?.[0]; 
                  if (!file) return; 
                  try {
                    const fakeUrl = URL.createObjectURL(file);
                    const sel = window.getSelection(); 
                    if (savedRange.current) { sel.removeAllRanges(); sel.addRange(savedRange.current); } 
                    document.execCommand("insertImage", false, fakeUrl); 
                    setShowImgModal(false); 
                  } catch (err) {
                    console.error("Failed to upload image", err);
                  }
                  e.target.value = ""; 
                }} />
              </div>
              <div className="flex items-center gap-3 my-4"><div className="flex-1 h-px bg-gray-100" /><span className="text-xs text-gray-400 font-medium">or</span><div className="flex-1 h-px bg-gray-100" /></div>
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Insert from URL</p>
                <input type="url" placeholder="https://example.com/image.jpg" value={imgUrlInput} onChange={e => setImgUrlInput(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => setShowImgModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer">Cancel</button>
                <button onClick={() => { if (!imgUrlInput.trim()) return; const sel = window.getSelection(); if (savedRange.current) { sel.removeAllRanges(); sel.addRange(savedRange.current); } document.execCommand("insertImage", false, imgUrlInput.trim()); setShowImgModal(false); }} className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition cursor-pointer disabled:opacity-40" disabled={!imgUrlInput.trim()}>Insert</button>
              </div>
            </div>
          </div>
        )}

        
        {showLinkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onMouseDown={() => setShowLinkModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] mx-4 p-6 animate-in fade-in zoom-in-95 duration-150" onMouseDown={e => e.stopPropagation()}>
              <h3 className="text-base font-semibold text-primary mb-5">Insert Link</h3>
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">URL / Web Address</p>
                <input type="url" placeholder="https://example.com" value={linkUrlInput} onChange={e => setLinkUrlInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && linkUrlInput.trim()) { const sel = window.getSelection(); if (savedRange.current) { sel.removeAllRanges(); sel.addRange(savedRange.current); } document.execCommand("createLink", false, linkUrlInput.trim()); setShowLinkModal(false); } }} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" autoFocus />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => setShowLinkModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer">Cancel</button>
                <button onClick={() => { if (!linkUrlInput.trim()) return; const sel = window.getSelection(); if (savedRange.current) { sel.removeAllRanges(); sel.addRange(savedRange.current); } document.execCommand("createLink", false, linkUrlInput.trim()); setShowLinkModal(false); }} className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition cursor-pointer disabled:opacity-40" disabled={!linkUrlInput.trim()}>Insert Link</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">Additional Fair Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Organized By</label>
            <input type="text" value={extraDetails?.organizedBy || ""} onChange={e => setExtraDetails(prev => ({...prev, organizedBy: e.target.value}))} placeholder="Organizer Name" className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Registration Deadline</label>
            <input type="datetime-local" value={extraDetails?.registrationDateTime || ""} onChange={e => setExtraDetails(prev => ({...prev, registrationDateTime: e.target.value}))} className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent text-gray-700" />
          </div>
        </div>
      </div>

     
      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">WhatsApp Number (+91)</label>
            <input type="text" maxLength={10} value={extraDetails?.whatsappNumber || ""} onChange={e => setExtraDetails(prev => ({...prev, whatsappNumber: e.target.value}))} placeholder="10-digit number" className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Primary Phone (+91)</label>
            <input type="text" maxLength={10} value={extraDetails?.phone || ""} onChange={e => setExtraDetails(prev => ({...prev, phone: e.target.value}))} placeholder="10-digit number" className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Additional Phone (+91)</label>
            <input type="text" maxLength={10} value={extraDetails?.additionalPhone || ""} onChange={e => setExtraDetails(prev => ({...prev, additionalPhone: e.target.value}))} placeholder="10-digit number" className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Additional Phone 2 (+91)</label>
            <input type="text" maxLength={10} value={extraDetails?.additionalPhone2 || ""} onChange={e => setExtraDetails(prev => ({...prev, additionalPhone2: e.target.value}))} placeholder="10-digit number" className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Additional Phone 3 (+91)</label>
            <input type="text" maxLength={10} value={extraDetails?.additionalPhone3 || ""} onChange={e => setExtraDetails(prev => ({...prev, additionalPhone3: e.target.value}))} placeholder="10-digit number" className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
            <input type="email" value={extraDetails?.email || ""} onChange={e => setExtraDetails(prev => ({...prev, email: e.target.value}))} placeholder="Email address" className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
        </div>
      </div>

      
      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">Social Media Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Facebook URL</label>
            <input type="text" value={extraDetails?.facebook || ""} onChange={e => setExtraDetails(prev => ({...prev, facebook: e.target.value}))} placeholder="https://facebook.com/..." className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Instagram URL</label>
            <input type="text" value={extraDetails?.instagram || ""} onChange={e => setExtraDetails(prev => ({...prev, instagram: e.target.value}))} placeholder="https://instagram.com/..." className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">LinkedIn URL</label>
            <input type="text" value={extraDetails?.linkedin || ""} onChange={e => setExtraDetails(prev => ({...prev, linkedin: e.target.value}))} placeholder="https://linkedin.com/..." className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Twitter URL</label>
            <input type="text" value={extraDetails?.twitter || ""} onChange={e => setExtraDetails(prev => ({...prev, twitter: e.target.value}))} placeholder="https://twitter.com/..." className="w-full text-sm border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent" />
          </div>
        </div>
      </div>



      
      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">Fair Statistics</h3>
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
                  value={stat.label} 
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
          <Plus size={14} /> Add Statistic
        </button>
      </div>

      
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <h3 className="text-sm font-semibold text-primary">Hiring Partners</h3>
        </div>
        
        {/* EVENT-LEVEL COMPANY LIST DOCUMENT UPLOAD */}
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <label className="block text-xs font-semibold text-gray-500 mb-2">Company List Document (PDF/Excel - Optional)</label>
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              accept=".pdf,.xls,.xlsx" 
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setCompanyListDocumentUrl({ file: e.target.files[0], preview: URL.createObjectURL(e.target.files[0]), existingName: "" });
                }
              }}
              className="w-full text-sm font-medium border-b border-gray-200 pb-1 outline-none focus:border-primary bg-transparent file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
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
            <div key={i} className="border border-gray-200 rounded-lg p-4 relative group">
              {companies.length > 1 && (
                <button onClick={() => removeCompany(i)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center hover:bg-secondary/20 transition cursor-pointer"><Minus size={12} /></button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Company Name</label>
                  <input type="text" placeholder="e.g. Google" value={c.companyName} onChange={e => updateCompany(i, "companyName", e.target.value)} className="w-full text-sm font-medium border-b border-gray-200 pb-1 mb-2 outline-none focus:border-primary bg-transparent placeholder-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Logo URL</label>
                  <input type="text" placeholder="https://..." value={c.companyLogoUrl || ""} onChange={e => updateCompany(i, "companyLogoUrl", e.target.value)} className="w-full text-sm font-medium border-b border-gray-200 pb-1 mb-2 outline-none focus:border-primary bg-transparent placeholder-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Company Logo (Upload)</label>
                  <input type="file" accept="image/*" onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      updateCompany(i, "companyLogo", e.target.files[0]);
                    }
                  }} className="w-full text-sm font-medium border-b border-gray-200 pb-1 mb-2 outline-none focus:border-primary bg-transparent file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Job Profile</label>
                  <input type="text" placeholder="e.g. Software Engineer" value={c.jobProfile} onChange={e => updateCompany(i, "jobProfile", e.target.value)} className="w-full text-sm font-medium border-b border-gray-200 pb-1 mb-2 outline-none focus:border-primary bg-transparent placeholder-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Location</label>
                  <input type="text" placeholder="e.g. Remote" value={c.jobLocation} onChange={e => updateCompany(i, "jobLocation", e.target.value)} className="w-full text-sm font-medium border-b border-gray-200 pb-1 mb-2 outline-none focus:border-primary bg-transparent placeholder-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Candidates Required</label>
                  <input type="number" placeholder="e.g. 5" value={c.candidatesRequired} onChange={e => updateCompany(i, "candidatesRequired", e.target.value)} className="w-full text-sm font-medium border-b border-gray-200 pb-1 mb-2 outline-none focus:border-primary bg-transparent placeholder-gray-300" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                  <textarea rows={2} placeholder="Briefly describe the role or company..." value={c.description || ""} onChange={e => updateCompany(i, "description", e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-700 outline-none focus:border-primary bg-transparent resize-y" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addCompany} className="mt-3 flex items-center gap-1.5 text-sm text-primary font-medium hover:underline cursor-pointer"><Plus size={14} /> Add Company</button>
      </div>

     
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <h3 className="text-sm font-semibold text-primary">Who Can Apply</h3>
          {/* <span className="cursor-help text-gray-400" title="Key facts shown as bullet list on event page"><AlertCircle size={14} /></span> */}
        </div>
        <div className="space-y-2 w-full">
          {thingsToKnow.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              <input type="text" placeholder={`Fact ${i + 1}  e.g. Fair will be in English`} value={item} onChange={e => updateThing(i, e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
              {thingsToKnow.length > 1 && (
                <button onClick={() => removeThing(i)} className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center hover:bg-secondary/20 transition cursor-pointer"><Minus size={11} /></button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addThing} className="mt-3 flex items-center gap-1.5 text-sm text-primary font-medium hover:underline cursor-pointer"><Plus size={14} /> Add Item</button>
      </div>

     
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">Instructions</label>
        <textarea rows={5} placeholder="Enter any instructions for attendees..." value={instructions} onChange={e => setInstructions(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-none" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">Terms &amp; Conditions</label>
        <textarea rows={5} placeholder="Enter terms and conditions for this fair..." value={termsText} onChange={e => setTermsText(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-none" />
      </div>

      
      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">FAQ</h3>
        <div className="space-y-3 w-full">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                <button onClick={() => toggleFaq(i)} className="text-gray-400 hover:text-primary transition cursor-pointer">{faq.open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button>
                <input type="text" placeholder="Question" value={faq.q} onChange={e => updateFaq(i, "q", e.target.value)} className="flex-1 text-sm font-medium bg-transparent outline-none placeholder-gray-300" />
                {faqs.length > 1 && <button onClick={() => removeFaq(i)} className="w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center hover:bg-secondary/20 transition cursor-pointer"><Minus size={10} /></button>}
              </div>
              {faq.open && <textarea rows={3} placeholder="Answer..." value={faq.a} onChange={e => updateFaq(i, "a", e.target.value)} className="w-full px-4 py-3 text-sm placeholder-gray-300 outline-none resize-none bg-white focus:bg-primary/5 transition" />}
            </div>
          ))}
        </div>
        <button onClick={addFaq} className="mt-3 flex items-center gap-1.5 text-sm text-primary font-medium hover:underline cursor-pointer"><Plus size={14} /> Add FAQ</button>
      </div>
    </div>
  );
};

export default EventInformationTab;
