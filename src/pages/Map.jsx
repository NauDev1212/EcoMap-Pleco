import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { AlertTriangle, Thermometer, Droplets, FlaskConical, Calendar, User, Search, ArrowRight } from "lucide-react";

// === DATA BACKUP (Otomatis dipakai jika Backend API Anda belum dinyalakan) ===
const backupRiverPoints = [
  { id: 1, name: "Sungai Ciliwung - Segmen Jakarta", lat: -6.2297, lng: 106.8295, density: "Sangat Ekstrem", color: "#8B0000", ph: 6.2, temp: 27.3, doLevel: 3.5, heavyMetal: 0.37 },
  { id: 2, name: "Sungai Citarum - Segmen Hulu", lat: -6.9147, lng: 107.6098, density: "Padat Tinggi", color: "#FF8C00", ph: 5.8, temp: 28.1, doLevel: 2.1, heavyMetal: 0.52 },
  { id: 3, name: "Sungai Brantas - Segmen Surabaya", lat: -7.2575, lng: 112.7521, density: "Ekstrem", color: "#FF0000", ph: 6.0, temp: 26.9, doLevel: 4.0, heavyMetal: 0.41 }
];

const backupReports = [
  { id: 1, location: "CITARUM, PENANGKAPAN MASSAL", author: "Rian H.", date: "16 Oktober 2026", desc: "Ditemukan luapan koloni ikan sapu-sapu di dekat bantaran tanggul yang jebol.", bgColor: "bg-slate-700" },
  { id: 2, location: "CILIWUNG, SURGA SAPU-SAPU", author: "Andini K.", date: "27 Mei 2027", desc: "Kondisi air keruh memicu ledakan populasi Loricariidae di dasar sungai perkotaan.", bgColor: "bg-emerald-800" }
];

// Menambahkan props isLoggedIn agar pengecekan hak akses tombol berfungsi
export default function Map({ isLoggedIn = true }) {
  // Koordinat Utama Fokus Indonesia
  const indonesiaCenter = [-2.5489, 118.0149];
  const defaultZoom = 5;

  // ─── STATE UNTUK MENAMPUNG DATA DATABASE ───
  const [riverDataPoints, setRiverDataPoints] = useState([]);
  const [reportsHistory, setReportsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // ─── STATE UNTUK MONITOR PARAMETER YANG AKTIF ───
  const [activeMetrics, setActiveMetrics] = useState({
    name: "Silakan pilih/klik salah satu titik pada peta",
    ph: "-", temp: "-", doLevel: "-", heavyMetal: "-", density: "Normal"
  });

  // ─── AMBIL DATA DARI DATABASE (FETCH API) ───
  useEffect(() => {
    const loadDatabaseData = async () => {
      try {
        const responsePoints = await fetch("http://localhost:5000/api/river-points");
        if (!responsePoints.ok) throw new Error("API Offline");
        const dataPoints = await responsePoints.json();
        setRiverDataPoints(dataPoints);
        
        const responseReports = await fetch("http://localhost:5000/api/reports");
        const dataReports = await responseReports.json();
        setReportsHistory(dataReports);

        if (dataPoints.length > 0) setActiveMetrics(dataPoints[0]);

      } catch (error) {
        console.warn("Menggunakan data lokal/backup karena server backend belum terhubung.");
        setRiverDataPoints(backupRiverPoints);
        setReportsHistory(backupReports);
        setActiveMetrics(backupRiverPoints[0]);
      } finally {
        setLoading(false);
      }
    };

    loadDatabaseData();
  }, []);

  // Fitur Pencarian Sederhana pada Histori Laporan
  const filteredReports = reportsHistory.filter(report =>
    report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FDF1CE]/20">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-[#008000] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-[#008000]">Menghubungkan ke Database Ekosistem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FDF1CE]/40 p-4 md:p-6 font-sans space-y-6">
      
      {/* ─── BARIS 1: AREA DASHBOARD UTAMA & HEATMAP METRICS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* KIRI: PANEL PETA INTERAKTIF LEAFLET */}
        <div className="lg:col-span-8 bg-[#D3C7A3] p-3 rounded-3xl border-4 border-[#008000]/20 shadow-md flex flex-col min-h-[480px] lg:h-[550px]">
          <div className="flex-1 w-full h-full rounded-2xl overflow-hidden z-10 relative">
            <MapContainer 
              center={indonesiaCenter} 
              zoom={defaultZoom} 
              style={{ width: "100%", height: "100%" }}
              maxBounds={[[15, 90], [-15, 145]]}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {riverDataPoints.map((point) => (
                <CircleMarker
                  key={point.id}
                  center={[point.lat, point.lng]}
                  radius={12}
                  fillColor={point.color || "#008000"}
                  color="#fff"
                  weight={2}
                  fillOpacity={0.85}
                  eventHandlers={{
                    click: () => setActiveMetrics(point),
                  }}
                >
                  <Popup>
                    <div className="text-xs font-sans space-y-1">
                      <p className="font-bold text-neutral-800">{point.name}</p>
                      <p className="text-neutral-600">Status: <span className="font-semibold" style={{ color: point.color }}>{point.density}</span></p>
                      <p className="text-[10px] text-emerald-700 font-medium">Data parameter berhasil dimuat</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          {/* MONITOR PARAMETER AIR KUALITATIF */}
          <div className="mt-3 bg-white/95 p-3 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-2 text-center border border-neutral-200">
            <div className="col-span-2 md:col-span-4 text-left border-b pb-1 mb-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">📊 Terpilih: <span className="text-[#008000] normal-case">{activeMetrics.name}</span></p>
            </div>
            <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-200/50">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-700 mb-0.5"><FlaskConical size={14} /> pH Air</div>
              <p className="text-lg font-black text-amber-800">{activeMetrics.ph}</p>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-red-100 text-red-700">Kurang Sehat</span>
            </div>
            <div className="bg-orange-50/60 p-2 rounded-lg border border-orange-200/50">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-orange-700 mb-0.5"><Thermometer size={14} /> Suhu Air</div>
              <p className="text-lg font-black text-orange-800">{activeMetrics.temp}°C</p>
              <span className="text-[9px] text-orange-600 font-medium">Tercatat Hangat</span>
            </div>
            <div className="bg-blue-50/60 p-2 rounded-lg border border-blue-200/50">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-blue-700 mb-0.5"><Droplets size={14} /> Oksigen (DO)</div>
              <p className="text-lg font-black text-blue-800">{activeMetrics.doLevel} <span className="text-xs font-normal">mg/L</span></p>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-green-100 text-green-700">Kadar Bagus</span>
            </div>
            <div className="bg-red-50/60 p-2 rounded-lg border border-red-200/50">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-red-700 mb-0.5"><AlertTriangle size={14} /> Logam Berat</div>
              <p className="text-lg font-black text-red-800">{activeMetrics.heavyMetal} <span className="text-xs font-normal">ppm</span></p>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-red-600 text-white">Tercemar/Kritis</span>
            </div>
          </div>
        </div>

        {/* KANAN: LEGEND INDIKATOR KEPADATAN & AKUMULASI STATISTIK */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-200 space-y-4">
            <h3 className="text-base font-extrabold text-neutral-800 border-b pb-2 tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008000]"></span> Indikator Kepadatan Heatmap
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-medium">
              <div className="flex items-center gap-2.5 p-1.5 bg-neutral-50 rounded-lg">
                <span className="w-3.5 h-3.5 rounded-full bg-[#8B0000] flex-shrink-0"></span>
                <div><p className="font-bold text-neutral-700 leading-none">Merah Pekat</p><span className="text-[10px] text-neutral-400">Sangat Ekstrem</span></div>
              </div>
              <div className="flex items-center gap-2.5 p-1.5 bg-neutral-50 rounded-lg">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FF0000] flex-shrink-0"></span>
                <div><p className="font-bold text-neutral-700 leading-none">Merah</p><span className="text-[10px] text-neutral-400">Ekstrem</span></div>
              </div>
              <div className="flex items-center gap-2.5 p-1.5 bg-neutral-50 rounded-lg">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FF8C00] flex-shrink-0"></span>
                <div><p className="font-bold text-neutral-700 leading-none">Kuning Pekat</p><span className="text-[10px] text-neutral-400">Padat Tinggi</span></div>
              </div>
              <div className="flex items-center gap-2.5 p-1.5 bg-neutral-50 rounded-lg">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FFFF00] flex-shrink-0 border border-neutral-300"></span>
                <div><p className="font-bold text-neutral-700 leading-none">Kuning</p><span className="text-[10px] text-neutral-400">Padat Sedang</span></div>
              </div>
              <div className="flex items-center gap-2.5 p-1.5 bg-neutral-50 rounded-lg col-span-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#008000] flex-shrink-0"></span>
                <div><p className="font-bold text-neutral-700 leading-none">Hijau Pekat / Hijau</p><span className="text-[10px] text-neutral-400">Padat Rendah / Alami Sangat Rendah</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-200 space-y-3 relative overflow-hidden group">
            <h4 className="font-black text-sm tracking-wide uppercase text-[#008000]">Bantu Kami Riset!</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Melihat ledakan populasi ikan sapu-sapu di ekosistem perairan sekitarmu? Laporkan segera koordinatnya untuk memperkaya akurasi basis data nasional.
            </p>
            {/* PERBAIKAN: Menghapus class dinamis dari komponen lain dan menyederhanakan logika NavLink */}
            <NavLink
              to={!isLoggedIn ? "#" : "/laporan"}
              onClick={(e) => !isLoggedIn && e.preventDefault()}
              className={`block ${!isLoggedIn ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <button 
                disabled={!isLoggedIn}
                className="w-full bg-[#008000] hover:bg-[#006400] text-white transition-colors py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm disabled:pointer-events-none"
              >
                + Tambahkan Laporan Baru <ArrowRight size={14} />
              </button>
            </NavLink>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-neutral-200 grid grid-cols-3 gap-2 text-center divide-x divide-neutral-100">
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">Total Laporan</p>
              <p className="text-xl font-black text-neutral-800">{riverDataPoints.length + 60}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">Sungai Terpantau</p>
              <p className="text-xl font-black text-[#008000]">{riverDataPoints.length} Titik</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">Kandungan Kritis</p>
              <p className="text-xl font-black text-red-600">5 Titik</p>
            </div>
          </div>

        </div>
      </div>

      {/* ─── BARIS 2: HISTORI LAPORAN ─── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-neutral-300 pb-2">
          <div className="w-7 h-7 rounded-lg bg-[#008000] flex items-center justify-center text-white font-bold text-sm">📋</div>
          <h3 className="text-base font-extrabold text-neutral-800 tracking-tight">Histori Laporan Kolektif</h3>
          
          <div className="ml-auto flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border text-xs text-neutral-400 max-w-xs w-64">
            <Search size={14} /> 
            <input 
              type="text" 
              placeholder="Cari lokasi laporan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent focus:outline-none w-full text-neutral-700 text-[11px]" 
            />
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <p className="text-xs text-neutral-500 italic text-center py-4">Tidak ada histori laporan yang cocok dengan kata kunci.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <div 
                key={report.id} 
                className={`${report.bgColor || "bg-zinc-700"} text-white p-5 rounded-t-[36px] rounded-b-[36px] shadow-md flex flex-col justify-between space-y-3 relative overflow-hidden border border-white/10`}
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold tracking-wide uppercase bg-white/20 px-2 py-0.5 rounded-full">
                    {report.location}
                  </span>
                  <p className="text-xs text-neutral-200 leading-relaxed line-clamp-4">
                    "{report.desc}"
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-neutral-300 border-t border-white/10 pt-2">
                  <span className="flex items-center gap-1"><User size={11} /> Pelapor: {report.author}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} /> {report.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}