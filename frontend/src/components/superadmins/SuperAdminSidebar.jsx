/**
 * Function is used to create the LHS of the Super admin dashboard.
 * -- It contains three sections ::
 * --- Dashboard: This section contains the dashboard of the super admin.
 * --- Manage Admins: This section contains the all the data of admins.
 * --- Manage Job Fairs: This section contains the all the job fairs data and super admin can edit and delete the job events.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SuperAdminSidebar({ activeTab, setActiveTab, activeBar }) {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
      navigate('/');
  };

  /**
   * Function is used to handle the small screen by converting into offcanvas
   */
  function returnSmallScreenSidebar(){
    return(
      <div className="md:hidden">
        {/* Offcanvas Overlay */}
        {show && (
          <div 
            className="fixed inset-0 z-[1040] bg-black/50 transition-opacity" 
            onClick={handleClose}
          ></div>
        )}
        
        {/* Offcanvas Panel */}
        <div 
          className={`fixed inset-y-0 left-0 z-[1050] w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            show ? 'translate-x-0' : '-translate-x-full'
          } flex flex-col`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h5 className="text-xl font-semibold mb-0">
              {activeBar === "admin" ? "Admin Panel" : "Super Admin"}
            </h5>
            <button 
              type="button" 
              className="text-gray-500 hover:text-gray-700 bg-transparent"
              onClick={handleClose}
            >
              <span className="text-2xl leading-none">&times;</span>
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto flex-1">
            <nav className="flex flex-col gap-2">
              <button
                className={`text-left font-medium px-4 py-2 rounded transition-colors ${activeTab === "dashboard" ? "bg-blue-600 text-white" : "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"}`}
                onClick={() => {
                  setActiveTab("dashboard");
                  handleClose();
                }}
              >
                Dashboard
              </button>
              
              {activeBar !== 'admin' && (
                <button
                  className={`text-left font-medium px-4 py-2 rounded transition-colors ${activeTab === "manageAdmins" ? "bg-blue-600 text-white" : "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"}`}
                  onClick={() => {
                    setActiveTab("manageAdmins");
                    handleClose();
                  }}
                >
                  Manage Admins
                </button>
              )}
              
              <button
                className={`text-left font-medium px-4 py-2 rounded transition-colors ${activeTab === "manageJobFairs" ? "bg-blue-600 text-white" : "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"}`}
                onClick={() => {
                  setActiveTab("manageJobFairs");
                  handleClose();
                }}
              >
                Manage Job Fairs
              </button>
              
              <button
                className="text-left font-medium px-4 py-2 mt-4 rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
                onClick={() => {
                  handleLogout();
                  handleClose();
              }}
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Function is used to handle the larger screen size
   */
  function returnLargeScreenSidebar(){
    return(
      <div className="hidden md:flex flex-col   h-screen p-4 w-[250px] shrink-0 sticky top-0">
        <h2 className="text-xl font-bold text-blue-600 mb-4">
          {activeBar === "admin" ? "Admin Panel" : "Super Admin"}
        </h2>
        <nav className="flex flex-col gap-2 h-full">
          <button
            className={`text-left font-medium px-4 py-2 rounded transition-colors ${activeTab === "dashboard" ? "bg-blue-600 text-white" : "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 "}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          
          {activeBar !== 'admin' && (
            <button
              className={`text-left font-medium px-4 py-2 rounded transition-colors ${activeTab === "manageAdmins" ? "bg-blue-600 text-white" : "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 "}`}
              onClick={() => setActiveTab("manageAdmins")}
            >
              Manage Admins
            </button>
          )}
          
          <button
            className={`text-left font-medium px-4 py-2 rounded transition-colors ${activeTab === "manageJobFairs" ? "bg-blue-600 text-white" : "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 "}`}
            onClick={() => setActiveTab("manageJobFairs")}
          >
            Manage Job Fairs
          </button>
          
          <button
            className="text-left font-medium px-4 py-2 mt-auto rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
            onClick={handleLogout}
          >
          Logout
        </button>
        </nav>
      </div>
    )
  }

  return (
    <>
      <div className="md:hidden p-2 bg-gray-50 border-b flex items-center">
        <button 
          className="bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1 rounded transition-colors" 
          onClick={handleShow}
        >
          <i className="bi bi-list"></i>
        </button>
      </div>
      {returnSmallScreenSidebar()}
      {returnLargeScreenSidebar()}
    </>
  );
}

export default SuperAdminSidebar;
