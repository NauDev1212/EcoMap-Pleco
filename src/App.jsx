import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Map from "./pages/Map";
import Education from "./pages/Education";
import Profile from "./pages/Profile";
import Report from "./pages/Report";

import 'leaflet/dist/leaflet.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cek status login setiap kali aplikasi pertama kali dimuat
  useEffect(() => {
    const savedUser = localStorage.getItem("ecoMapUser");
    setIsLoggedIn(!!savedUser); 
  }, []);

  // Fungsi pemicu agar Sidebar dan Profile kompak berubah saat login/logout
  const handleAuthChange = (status) => {
    setIsLoggedIn(status);
  };

return (
    // JANGAN berikan bg-[#FDF1CE] di sini agar tidak bocor ke latar belakang Sidebar / halaman full
    <div className="flex min-h-screen bg-neutral-50">
      
      {/* 1. KIRI: Sidebar tetap berdiri sendiri di kiri */}
      <Sidebar isLoggedIn={isLoggedIn} />

      {/* 2. KANAN: Kontainer utama sisi kanan */}
      <div className="flex-1 flex flex-col justify-between min-h-screen">
        
        {/* Area Halaman: Biarkan warna diatur oleh masing-masing halaman (Home, Map, Report, dll.) */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/peta" element={<Map />} />
            <Route path="/edukasi" element={<Education />} />
            <Route path="/profil" element={<Profile onAuthChange={handleAuthChange} />} />
            <Route path="/laporan" element={<Report />} />
          </Routes>
        </main>

        {/* Area Bawah: Warna krem dikunci khusus di dalam komponen Footer saja */}
        <Footer />
        
      </div>
    </div>
  );
}

export default App;