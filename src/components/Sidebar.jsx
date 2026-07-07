import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { X, Menu, Home, Map, BookOpen, User, Siren, Leaf } from "lucide-react";

// Menerima LoggedIn dari App.jsx
const Sidebar = ({ isLoggedIn }) => {
  const [expanded, setExpanded] = useState(false);

  const getNavLinkClass = (isActive, isLocked) => {
    return `flex items-center py-2 px-3 my-1 font-medium rounded-md transition-all group ${
      !expanded && "justify-center"
    } ${
      !isLocked && isActive
        ? "bg-gray-100 text-[#008000] shadow-sm font-semibold"
        : "text-black/80 hover:bg-gray-100/80"
    } ${
      isLocked
        ? "opacity-35 blur-[1px] cursor-not-allowed pointer-events-none selector-none"
        : "cursor-pointer"
    }`;
  };

  return (
    <aside
      className={`h-screen sticky top-0 left-0 transition-all duration-300 z-50 !block ${
        expanded ? "w-56" : "w-16"
      }`}
    >
      {/* Navigasi Utama */}
      <nav className="h-full flex flex-col bg-white shadow-sm justify-between pb-4 overflow-y-auto">
        
        {/*Logo & Menu Utama*/}
        <div className="flex-1 px-3 space-y-1">
          
          {/* Logo Sidebar */}
          <div className="pb-2 flex justify-between items-center mb-2 min-h-[64px] pt-5">
            <div className="flex items-center gap-2 overflow-hidden pl-1">
              {/* Ikon Leaf - Selalu Muncul di Kiri */} 
              <div className="text-[#008000] flex-shrink-0">
                <Leaf size={28} />
              </div>
              
              {/* Teks Judul */}
              <h1 
                className={`font-bold leading-tight text-[#008000] transition-all duration-300 ease-in-out ${
                  expanded ? "opacity-100 w-auto ml-1" : "w-0 opacity-0 overflow-hidden"
                }`}
              >
                <span className="text-base font-extrabold block">EcoMap</span>
                <span className="text-base font-extrabold block">Pleco</span>
              </h1>
            </div>

            {/* Tombol Menu */}
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className={`p-2 pt-5 rounded-lg text-black hover:bg-gray-500/10 transition-colors ${
                !expanded && "mx-auto"
              }`}
            >
              {expanded ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Beranda */}
          <NavLink
            to={!isLoggedIn ? "#" : "/"}
            onClick={(e) => !isLoggedIn && e.preventDefault()}
            className={({ isActive }) => getNavLinkClass(isActive, !isLoggedIn)}
          >
            <Home size={22} />
            <span
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                expanded ? "w-52 ml-3 opacity-100" : "w-0 opacity-0"
              }`}
            >
              Beranda
            </span>
          </NavLink>

          {/* Peta */}
          <NavLink
            to={!isLoggedIn ? "#" : "/peta"}
            onClick={(e) => !isLoggedIn && e.preventDefault()}
            className={({ isActive }) => getNavLinkClass(isActive, !isLoggedIn)}
          >
            <Map size={22} />
            <span
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                expanded ? "w-52 ml-3 opacity-100" : "w-0 opacity-0"
              }`}
            >
              Peta
            </span>
          </NavLink>

          {/* Edukasi */}
          <NavLink
            to={!isLoggedIn ? "#" : "/edukasi"}
            onClick={(e) => !isLoggedIn && e.preventDefault()}
            className={({ isActive }) => getNavLinkClass(isActive, !isLoggedIn)}
          >
            <BookOpen size={22} />
            <span
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                expanded ? "w-52 ml-3 opacity-100" : "w-0 opacity-0"
              }`}
            >
              Edukasi
            </span>
          </NavLink>
        </div>

        {/* Bawah */}
        <div>
          {/* Garis Pembatas */}
          <hr className="border-t border-gray-200 my-2 mx-3" />

          <div className="px-3 space-y-1">
            {/* Profil */}
            <NavLink
              to="/profil"
              className={({ isActive }) => getNavLinkClass(isActive, false)}
            >
              <User size={22} />
              <span
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  expanded ? "w-52 ml-3 opacity-100" : "w-0 opacity-0"
                }`}
              >
                Profil
              </span>
            </NavLink>

            {/* Laporkan */}
            <NavLink
              to={!isLoggedIn ? "#" : "/laporan"}
              onClick={(e) => !isLoggedIn && e.preventDefault()}
              className={({ isActive }) => getNavLinkClass(isActive, !isLoggedIn)}
            >
              <Siren size={22} />
              <span
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  expanded ? "w-52 ml-3 opacity-100" : "w-0 opacity-0"
                }`}
              >
                Laporkan
              </span>
            </NavLink>
          </div>
        </div>
        
      </nav>
    </aside>
  );
};

export default Sidebar;