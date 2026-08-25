import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faSignOutAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/");
    } else {
      setUser(JSON.parse(userStr));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    navigate("/");
    window.location.reload();
  };

  if (!user) return null;

  return (
    <div className="bg-[#FFFDF9] min-h-screen font-sans py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-black text-gray-900 mb-8 text-center">My Profile</h1>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col md:flex-row items-center gap-8 border-b border-gray-100 pb-8">
            <div className="w-32 h-32 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center text-5xl shrink-0">
              <FontAwesomeIcon icon={faUserCircle} />
            </div>
            
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">{user.name || "User"}</h2>
              <p className="text-gray-500 mt-1">{user.email}</p>
            </div>
          </div>
          
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/my-orders" 
              className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-rose-300 hover:shadow-md transition bg-gray-50/50"
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-xl">
                <FontAwesomeIcon icon={faBox} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">My Orders</h3>
                <p className="text-xs text-gray-500 mt-1">Track & process your orders</p>
              </div>
            </Link>
            
            {user.role === "ROLE_ADMIN" && (
              <Link 
                to="/admin/dashboard" 
                className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-rose-300 hover:shadow-md transition bg-gray-50/50"
              >
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center text-xl">
                  <FontAwesomeIcon icon={faUserCircle} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Admin Panel</h3>
                  <p className="text-xs text-gray-500 mt-1">Manage store & orders</p>
                </div>
              </Link>
            )}

            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-rose-300 hover:shadow-md transition bg-gray-50/50 text-left w-full"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-xl">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Logout</h3>
                <p className="text-xs text-gray-500 mt-1">Sign out of your account</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
