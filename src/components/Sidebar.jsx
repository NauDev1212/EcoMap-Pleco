// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { X, Menu, Home, Map, BookOpen, User, Siren, Leaf } from "lucide-react";

// // Menerima LoggedIn dari App.jsx

// const Sidebar = ({ isLoggedIn }) => {
//   const [expanded, setExpanded] = useState(false);

//   const getNavLinkClass = (isActive, isLocked) => {
//     return `flex items-center py-2 px-3 my-1 font-medium rounded-md transition-all group ${
//       !expanded && "justify-center"
//     } ${
//       !isLocked && isActive
//         ? "bg-gray-100 text-[#008000] shadow-sm font-semibold"
//         : "text-black/80 hover:bg-gray-100/80"
//     } ${
//       isLocked
//         ? "opacity-35 blur-[1px] cursor-not-allowed pointer-events-none selector-none"
//         : "cursor-pointer"
//     }`;
//   };

//   return (
//     <aside
//       className={`h-screen sticky top-0 left-0 transition-all duration-300 z-50 !block ${
//         expanded ? "w-56" : "w-16"
//       }`}
//     >
//       {/* Navigasi Utama */}

//       <nav className="h-full flex flex-col bg-white shadow-sm justify-between pb-4 overflow-y-auto">
//         {/*Logo & Menu Utama*/}

//         <div className="flex-1 px-3 space-y-1">
//           {/* Logo Sidebar */}

//           <div className="pb-2 flex justify-between items-center mb-2 min-h-[64px] pt-5">
//             <div className="flex items-center gap-2 overflow-hidden pl-1">
//               {/* Ikon Leaf - Selalu Muncul di Kiri */}

//               {/* <div className="text-[#008000] flex-shrink-0"> */}

//               <img src="ecoMap.jpg" alt="Logo" className="w-10 h-10" />

//               {/* </div> */}

//               {/* Teks Judul */}

//               <h1
//                 className={`font-bold leading-tight text-[#008000] transition-all duration-300 ease-in-out ${
//                   expanded
//                     ? "opacity-100 w-auto ml-1"
//                     : "w-0 opacity-0 overflow-hidden"
//                 }`}
//               >
//                 <span className="text-base font-extrabold block">EcoMap</span>

//                 <span className="text-base font-extrabold block">Pleco</span>
//               </h1>
//             </div>

//             {/* Tombol Menu */}

//             <button
//               onClick={() => setExpanded((curr) => !curr)}
//               className={`p-2 pt-5 rounded-lg text-black hover:bg-gray-500/10 transition-colors ${
//                 !expanded && "mx-auto"
//               }`}
//             >
//               {expanded ? <X size={22} /> : <Menu size={22} />}
//             </button>
//           </div>

//           {/* Beranda */}

//           <NavLink
//             to={!isLoggedIn ? "#" : "/"}
//             onClick={(e) => !isLoggedIn && e.preventDefault()}
//             className={({ isActive }) => getNavLinkClass(isActive, !isLoggedIn)}
//           >
//             <Home size={22} />

//             <span
//               className={`transition-all duration-300 ease-in-out overflow-hidden ${
//                 expanded ? "w-52 ml-3 opacity-100" : "w-0 opacity-0"
//               }`}
//             >
//               Beranda
//             </span>
//           </NavLink>

//           {/* Peta */}

//           <NavLink
//             to={!isLoggedIn ? "#" : "/peta"}
//             onClick={(e) => !isLoggedIn && e.preventDefault()}
//             className={({ isActive }) => getNavLinkClass(isActive, !isLoggedIn)}
//           >
//             <Map size={22} />

//             <span
//               className={`transition-all duration-300 ease-in-out overflow-hidden ${
//                 expanded ? "w-52 ml-3 opacity-100" : "w-0 opacity-0"
//               }`}
//             >
//               Peta
//             </span>
//           </NavLink>

//           {/* Edukasi */}

//           <NavLink
//             to={!isLoggedIn ? "#" : "/edukasi"}
//             onClick={(e) => !isLoggedIn && e.preventDefault()}
//             className={({ isActive }) => getNavLinkClass(isActive, !isLoggedIn)}
//           >
//             <BookOpen size={22} />

//             <span
//               className={`transition-all duration-300 ease-in-out overflow-hidden ${
//                 expanded ? "w-52 ml-3 opacity-100" : "w-0 opacity-0"
//               }`}
//             >
//               Edukasi
//             </span>
//           </NavLink>
//         </div>

//         {/* Bawah */}

//         <div>
//           {/* Garis Pembatas */}

//           <hr className="border-t border-gray-200 my-2 mx-3" />

//           <div className="px-3 space-y-1">
//             {/* Profil */}

//             <NavLink
//               to="/profil"
//               className={({ isActive }) => getNavLinkClass(isActive, false)}
//             >
//               <User size={22} />

//               <span
//                 className={`transition-all duration-300 ease-in-out overflow-hidden ${
//                   expanded ? "w-52 ml-3 opacity-100" : "w-0 opacity-0"
//                 }`}
//               >
//                 Profil
//               </span>
//             </NavLink>

//             {/* Laporkan */}

//             <NavLink
//               to={!isLoggedIn ? "#" : "/laporan"}
//               onClick={(e) => !isLoggedIn && e.preventDefault()}
//               className={({ isActive }) =>
//                 getNavLinkClass(isActive, !isLoggedIn)
//               }
//             >
//               <Siren size={22} />

//               <span
//                 className={`transition-all duration-300 ease-in-out overflow-hidden ${
//                   expanded ? "w-52 ml-3 opacity-100" : "w-0 opacity-0"
//                 }`}
//               >
//                 Laporkan
//               </span>
//             </NavLink>
//           </div>
//         </div>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;


import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { X, Menu, Home, Map, BookOpen, User, Siren } from "lucide-react";

// Menerima LoggedIn dari App.jsx
const Sidebar = ({ isLoggedIn }) => {
  const [expanded, setExpanded] = useState(false);

  const getNavLinkClass = (isActive, isLocked) => {
    return `flex items-center h-11 transition-all duration-200 group relative rounded-xl ${
      !expanded ? "justify-center w-11 mx-auto" : "justify-start px-3.5 w-full"
    } ${
      !isLocked && isActive
        ? "bg-gray-100 text-[#008000] font-semibold shadow-sm"
        : "text-black/80 hover:bg-gray-100/80"
    } ${
      isLocked
        ? "opacity-35 blur-[1px] cursor-not-allowed pointer-events-none select-none"
        : "cursor-pointer"
    }`;
  };

  return (
    /* Wrapper luar bertindak sebagai pembatas ruang (spacer) di Flexbox */
    <div
      className={`h-screen shrink-0 transition-all duration-300 ease-in-out ${
        expanded ? "w-56" : "w-16"
      }`}
    >
      {/* Sidebar dibuat FIXED agar terkunci penuh di layar tanpa terpengaruh scroll halaman */}
      <aside
        className={`fixed top-0 left-0 h-screen transition-all duration-300 z-50 select-none ${
          expanded ? "w-56" : "w-16"
        }`}
      >
        <nav className="h-full flex flex-col justify-between bg-white border-r border-gray-100 py-4 px-2 overflow-hidden shadow-sm">
          
          {/* BAGIAN ATAS: Logo & Navigasi Utama */}
          <div className="space-y-4">
            
            {/* Header Logo & Tombol Toggle */}
            <div className={`flex items-center min-h-[44px] ${expanded ? "justify-between px-1" : "justify-center"}`}>
              <div className="flex items-center gap-2 overflow-hidden">
                {/* Logo Image (Ukuran Asli) */}
                <img src="ecoMap.jpg" alt="Logo" className="w-10 h-10 shrink-0" />

                {/* Teks Judul Logo */}
                <h1
                  className={`font-bold leading-tight text-[#008000] transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
                    expanded ? "opacity-100 max-w-[150px] ml-1" : "max-w-0 opacity-0"
                  }`}
                >
                  <span className="text-base font-extrabold block leading-none">EcoMap</span>
                  <span className="text-sm font-bold block leading-tight">Pleco</span>
                </h1>
              </div>

              {/* Tombol Toggle saat Sidebar Terbuka */}
              {expanded && (
                <button
                  onClick={() => setExpanded(false)}
                  aria-label="Close Sidebar"
                  className="p-1.5 rounded-lg text-black hover:bg-gray-100 transition-colors shrink-0"
                >
                  <X size={22} />
                </button>
              )}
            </div>

            {/* Tombol Toggle saat Sidebar Tertutup */}
            {!expanded && (
              <div className="flex justify-center my-2">
                <button
                  onClick={() => setExpanded(true)}
                  aria-label="Open Sidebar"
                  className="p-2 rounded-xl text-black hover:bg-gray-100 transition-colors"
                >
                  <Menu size={22} />
                </button>
              </div>
            )}

            {/* Menu Navigasi Utama */}
            <div className="space-y-1 pt-2">
              {/* Beranda */}
              <NavLink
                to={!isLoggedIn ? "#" : "/"}
                onClick={(e) => !isLoggedIn && e.preventDefault()}
                className={({ isActive }) => getNavLinkClass(isActive, !isLoggedIn)}
                title={!expanded ? "Beranda" : ""}
              >
                <Home size={22} className="shrink-0" />
                <span
                  className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
                    expanded ? "opacity-100 max-w-[150px] ml-3.5" : "max-w-0 opacity-0"
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
                title={!expanded ? "Peta" : ""}
              >
                <Map size={22} className="shrink-0" />
                <span
                  className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
                    expanded ? "opacity-100 max-w-[150px] ml-3.5" : "max-w-0 opacity-0"
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
                title={!expanded ? "Edukasi" : ""}
              >
                <BookOpen size={22} className="shrink-0" />
                <span
                  className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
                    expanded ? "opacity-100 max-w-[150px] ml-3.5" : "max-w-0 opacity-0"
                  }`}
                >
                  Edukasi
                </span>
              </NavLink>
            </div>
          </div>

          {/* BAGIAN BAWAH: Profil & Laporkan */}
          <div className="shrink-0 pt-2 border-t border-gray-100 space-y-1">
            {/* Profil */}
            <NavLink
              to="/profil"
              className={({ isActive }) => getNavLinkClass(isActive, false)}
              title={!expanded ? "Profil" : ""}
            >
              <User size={22} className="shrink-0" />
              <span
                className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
                  expanded ? "opacity-100 max-w-[150px] ml-3.5" : "max-w-0 opacity-0"
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
              title={!expanded ? "Laporkan" : ""}
            >
              <Siren size={22} className="shrink-0" />
              <span
                className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
                  expanded ? "opacity-100 max-w-[150px] ml-3.5" : "max-w-0 opacity-0"
                }`}
              >
                Laporkan
              </span>
            </NavLink>
          </div>

        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;