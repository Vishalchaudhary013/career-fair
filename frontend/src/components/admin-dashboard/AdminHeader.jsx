import React from "react";
import { ArrowLeft } from "lucide-react";

const AdminHeader = ({ activeSection, user }) => {
  const isImpersonating = !!localStorage.getItem("super_admin_token");

  const handleReturnToSuperAdmin = () => {
    localStorage.setItem("user", localStorage.getItem("super_admin_user"));
    localStorage.setItem("token", localStorage.getItem("super_admin_token"));
    localStorage.removeItem("super_admin_user");
    localStorage.removeItem("super_admin_token");
    window.location.href = "/super-admin-dashboard";
  };

  return (

    <>
      {isImpersonating && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleReturnToSuperAdmin}
            className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/20 transition border border-primary/20"
          >
            <ArrowLeft size={16} />
            Return to Super Admin
          </button>
        </div>
      )}

      <div className="bg-white border border-[#DCE5FA] px-6 py-4 flex items-center justify-between shadow-sm">

      
      <div>
        <h1 className="text-xl font-bold text-primary">
          {activeSection === "Overview" ? "Organizer Overview" : "Manage Events"}
        </h1>
        <p className="text-[10px] tracking-[0.1em] text-slate-400 font-bold uppercase">
          Control Panel
        </p>
      </div>

      

      <div className="flex items-center gap-4">
        
        <div className="flex items-center gap-3 rounded-xl bg-[#F5F8FF] border border-[#DEE8FF] px-3 py-1.5">
          <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow-sm">
            {(user?.userName || user?.email || "A").charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {user?.userName || user?.email || "Organizer"}
            </p>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">
              Host
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
   
  );
};

export default AdminHeader;
