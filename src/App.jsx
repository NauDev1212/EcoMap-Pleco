// import React, { useState, useEffect } from "react";
// import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import { supabase } from "./supabaseClient";

// import Sidebar from "./components/Sidebar";
// import Footer from "./components/Footer";

// import Home from "./pages/Home";
// import Map from "./pages/Map";
// import Education from "./pages/Education";
// import Profile from "./pages/Profile";
// import Report from "./pages/Report";
// import AdminDashboard from "./pages/AdminDashboard";

// import 'leaflet/dist/leaflet.css';

// // 1. Daftarkan email yang diizinkan menjadi Admin
// const ADMIN_EMAILS = [
//   "adminecomap@gmail.com",
//   "naufalyudha1212@gmail.com"
// ];

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();

//   // 2. Pantau status otentikasi dari Supabase
//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     return () => authListener.subscription.unsubscribe();
//   }, []);

//   const isLoggedIn = !!user;
//   const isAdmin = user && ADMIN_EMAILS.includes(user.email);

//   // Cek apakah halaman yang dibuka adalah halaman Admin
//   const isAdminRoute = location.pathname.startsWith("/admin");

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-neutral-50">
//         <p className="text-gray-500 font-medium">Memuat...</p>
//       </div>
//     );
//   }

//   return (
//     /* DITAMBAHKAN: w-full max-w-full overflow-x-hidden pada kontainer paling luar */
//     <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-neutral-50">
      
//       {/* 1. KIRI: Sidebar (Disembunyikan jika berada di halaman Admin) */}
//       {!isAdminRoute && <Sidebar isLoggedIn={isLoggedIn} />}

//       {/* 2. KANAN: Kontainer utama sisi kanan */}
//       {/* DITAMBAHKAN: min-w-0 w-full max-w-full agar Flexbox tidak melebar melebihi layar */}
//       <div className="flex-1 flex flex-col justify-between min-h-screen min-w-0 w-full max-w-full">
        
//         {/* DITAMBAHKAN: min-w-0 w-full max-w-full pada tag <main> */}
//         <main className="flex-grow min-w-0 w-full max-w-full">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/peta" element={<Map isLoggedIn={isLoggedIn} />} />
//             <Route path="/edukasi" element={<Education />} />
//             <Route path="/profil" element={<Profile />} />
//             <Route path="/laporan" element={<Report />} />

//             {/* RUTE ADMIN DENGAN PROTEKSI */}
//             <Route
//               path="/admin"
//               element={
//                 isAdmin ? (
//                   <AdminDashboard />
//                 ) : (
//                   <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 text-center">
//                     <h1 className="text-3xl font-bold text-red-600 mb-2">Akses Ditolak! 🚫</h1>
//                     <p className="text-gray-600 mb-6 max-w-md">
//                       Akun Anda ({user ? user.email : "Belum Login"}) tidak memiliki hak akses untuk membuka halaman Admin.
//                     </p>
//                     <a
//                       href="/profil"
//                       className="px-5 py-2.5 bg-neutral-800 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-colors"
//                     >
//                       Kembali ke Profil
//                     </a>
//                   </div>
//                 )
//               }
//             />

//             {/* Redirect jika rute tidak ditemukan */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </main>

//         {/* Area Bawah: Footer */}
//         {!isAdminRoute && <Footer />}
        
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";

import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Map from "./pages/Map";
import Education from "./pages/Education";
import Profile from "./pages/Profile";
import Report from "./pages/Report";
import AdminDashboard from "./pages/AdminDashboard";

import 'leaflet/dist/leaflet.css';

const ADMIN_EMAILS = [
  "adminecomap@gmail.com",
  "naufalyudha1212@gmail.com"
];

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const isLoggedIn = !!user;
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-gray-500 font-medium">Memuat...</p>
      </div>
    );
  }

  return (
    /* Menggunakan flex biasa tanpa membatasi max-w-full berlebih */
    <div className="flex min-h-screen bg-neutral-50 relative overflow-x-hidden">
      
      {/* 1. SIDEBAR (Hanya tampil jika bukan halaman admin) */}
      {!isAdminRoute && <Sidebar isLoggedIn={isLoggedIn} />}

      {/* 2. KONTEN UTAMA (min-w-0 flex-1 mencegah carousel/peta merusak lebar flex) */}
      <div className="flex-1 flex flex-col justify-between min-w-0 min-h-screen">
        
        <main className="flex-grow min-w-0 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/peta" element={<Map isLoggedIn={isLoggedIn} />} />
            <Route path="/edukasi" element={<Education />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/laporan" element={<Report />} />

            <Route
              path="/admin"
              element={
                isAdmin ? (
                  <AdminDashboard />
                ) : (
                  <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-2">Akses Ditolak! 🚫</h1>
                    <p className="text-gray-600 mb-6 max-w-md">
                      Akun Anda ({user ? user.email : "Belum Login"}) tidak memiliki hak akses untuk membuka halaman Admin.
                    </p>
                    <a
                      href="/profil"
                      className="px-5 py-2.5 bg-neutral-800 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-colors"
                    >
                      Kembali ke Profil
                    </a>
                  </div>
                )
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {!isAdminRoute && <Footer />}
        
      </div>
    </div>
  );
}

export default App;