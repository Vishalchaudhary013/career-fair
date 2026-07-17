const allItems = [
  "basic-information",
  "location",
  "event-information",
  "banner-photos",
  "tickets",
  "question"
];

const CreateEventSidebar = ({ activeTab, setActiveTab, maxReachedStep = 0, eventType }) => {
  const currentIdx = allItems.indexOf(activeTab);

  const items = [
    {
      id: "basic-information",
      label: "Basic information",
      description: "Title, date & time"
    },
    {
      id: "location",
      label: eventType === "virtual" ? "Joining details" : "Location",
      description: eventType === "virtual" ? "Virtual meeting links" : "Physical Fair location"
    },
    {
      id: "event-information",
      label: "Fair information",
      description: "Description, FAQs & terms"
    },
    {
      id: "banner-photos",
      label: "Banner and photos",
      description: "Fair banner & logo"
    },
    {
      id: "tickets",
      label: "Tickets",
      description: "Pricing & capacity details"
    },
    {
      id: "question",
      label: "Question",
      description: "Registration form fields"
    }
  ];

  return (
    <>
      
      <div className="lg:hidden w-full bg-white border-b border-gray-100 py-3.5 px-4 sm:px-6 shrink-0 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Step {currentIdx + 1} of {items.length}</span>
          <span className="text-primary font-semibold">{items[currentIdx]?.label}</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300" 
            style={{ width: `${((currentIdx + 1) / items.length) * 100}%` }}
          />
        </div>
      </div>

     
      <aside className="hidden lg:flex w-[350px] shrink-0 border-r border-gray-100 flex-col overflow-y-auto bg-white">
        <div className="py-10 px-8 relative">
          <ul className="relative space-y-8">
            
            <div 
              className="absolute left-[18px] top-4 bottom-4 w-[2px] bg-slate-100" 
              style={{ zIndex: 0 }}
            />

            {items.map((item, idx) => {
              const itemGlobalIdx = allItems.indexOf(item.id);
              const isCompleted = itemGlobalIdx < currentIdx;
              const isActive = itemGlobalIdx === currentIdx;
              const isClickable = itemGlobalIdx <= maxReachedStep;

              return (
                <li key={item.id} className="relative z-10">
                  <button
                    disabled={!isClickable}
                    onClick={() => {
                      if (isClickable) setActiveTab(item.id);
                    }}
                    className={`w-full flex items-start gap-4 text-left transition-all ${
                      isClickable ? "cursor-pointer hover:opacity-90" : "cursor-not-allowed opacity-60"
                    }`}
                  >
                    
                    <div 
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isCompleted 
                          ? "bg-green-50 border border-green-200 text-green-700" 
                          : isActive 
                            ? "bg-primary border border-primary text-white font-bold shadow-md shadow-primary/10" 
                            : "bg-white border-2 border-slate-300 text-slate-500 font-semibold"
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <span className="text-[14px]">{idx + 1}</span>
                      )}
                    </div>

                    
                    <div className="flex-1 flex flex-col pt-1.5">
                      <span 
                        className={`text-[15px] leading-tight transition-colors ${
                          isActive 
                            ? "text-primary font-bold" 
                            : isCompleted 
                              ? "text-slate-800 font-semibold" 
                              : "text-slate-500 font-medium"
                        }`}
                      >
                        {item.label}
                      </span>

                      
                      {(isCompleted || isActive) && (
                        <span className="text-[12px] text-slate-400 font-normal mt-0.5">
                          {item.description}
                        </span>
                      )}

                      {isCompleted && (
                        <span className="text-[12px] text-green-700 font-semibold mt-0.5 flex items-center gap-1">
                          Complete
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
};

export { allItems };
export default CreateEventSidebar;
