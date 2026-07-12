import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { AlertTriangle, Thermometer, Droplets, FlaskConical, Calendar, User, Search, ArrowRight } from "lucide-react";

// Import client supabase yang sudah kita konfigurasi di Langkah 3
import { supabase } from "../supabaseClient";

export default function Map({ isLoggedIn = true }) {
  // ─── PERBAIKAN: SETTING FOKUS KAWASAN JAKARTA ───
  const jakartaCenter = [-6.2088, 106.8456]; // Koordinat pusat Jakarta
  const defaultZoom = 11; // Level zoom diperdekat untuk area perkotaan

  const [riverDataPoints, setRiverDataPoints] = useState([]);
  const [reportsHistory, setReportsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeMetrics, setActiveMetrics] = useState({
    name: "Silakan pilih/klik salah satu titik pada peta",
    ph: "-", temp: "-", doLevel: "-", heavyMetal: "-", density: "Normal"
  });

  // ─── UTAMA: AMBIL DATA LANGSUNG DARI SUPABASE DATABASE ───
  useEffect(() => {
    const loadSupabaseData = async () => {
      try {
        const { data: points, error: pointsError } = await supabase
          .from("river_points")
          .select("*");

        if (pointsError) throw pointsError;

        const { data: reports, error: reportsError } = await supabase
          .from("reports")
          .select("*")
          .order("created_at", { ascending: false });

        if (reportsError) throw reportsError;

        if (points && points.length > 0) {
          setRiverDataPoints(points);
          setActiveMetrics(points[0]);
        }
        
        if (reports) {
          setReportsHistory(reports);
        }

      } catch (error) {
        console.error("Gagal memuat data dari Supabase:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSupabaseData();
  }, []);

  const filteredReports = reportsHistory.filter(report =>
    report.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.desc?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FDF1CE]/20">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-[#008000] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-[#008000]">Menghubungkan ke Database Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FDF1CE]/40 p-4 md:p-6 font-sans space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* PANEL PETA INTERAKTIF */}
        <div className="lg:col-span-8 bg-[#D3C7A3] p-3 rounded-3xl border-4 border-[#008000]/20 shadow-md flex flex-col min-h-[480px] lg:h-[550px]">
          <div className="flex-1 w-full h-full rounded-2xl overflow-hidden z-10 relative">
            {/* PERBAIKAN: Menggunakan jakartaCenter, defaultZoom, dan membatasi Geser Peta (maxBounds) hanya di sekitar Jabodetabek */}
            <MapContainer 
              center={[-6.2088, 106.8456]} 
              zoom={11} 
              maxBounds={[[-5.9, 106.3], [-6.5, 107.3]]}
              style={{ width: "100%", height: "100%" }}
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
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          {/* DISPLAY PARAMETER AIR */}
          <div className="mt-3 bg-white/95 p-3 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-2 text-center border border-neutral-200">
            <div className="col-span-2 md:col-span-4 text-left border-b pb-1 mb-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">📊 Terpilih: <span className="text-[#008000] normal-case">{activeMetrics.name}</span></p>
            </div>
            <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-200/50">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-700 mb-0.5"><FlaskConical size={14} /> pH Air</div>
              <p className="text-lg font-black text-amber-800">{activeMetrics.ph}</p>
            </div>
            <div className="bg-orange-50/60 p-2 rounded-lg border border-orange-200/50">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-orange-700 mb-0.5"><Thermometer size={14} /> Suhu Air</div>
              <p className="text-lg font-black text-orange-800">{activeMetrics.temp}°C</p>
            </div>
            <div className="bg-blue-50/60 p-2 rounded-lg border border-blue-200/50">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-blue-700 mb-0.5"><Droplets size={14} /> Oksigen (DO)</div>
              <p className="text-lg font-black text-blue-800">{activeMetrics.doLevel} <span className="text-xs font-normal">mg/L</span></p>
            </div>
            <div className="bg-red-50/60 p-2 rounded-lg border border-red-200/50">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-red-700 mb-0.5"><AlertTriangle size={14} /> Logam Berat</div>
              <p className="text-lg font-black text-red-800">{activeMetrics.heavyMetal} <span className="text-xs font-normal">ppm</span></p>
            </div>
          </div>
        </div>

        {/* PANEL KANAN (LEGENDA) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-200 space-y-4">
            <h3 className="text-base font-extrabold text-neutral-800 border-b pb-2 tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008000]"></span> Indikator Kepadatan Heatmap
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-medium">
              <div className="flex items-center gap-2.5 p-1.5 bg-neutral-50 rounded-lg"><span className="w-3.5 h-3.5 rounded-full bg-[#8B0000]"></span><div><p className="font-bold text-neutral-700 leading-none">Merah Pekat</p></div></div>
              <div className="flex items-center gap-2.5 p-1.5 bg-neutral-50 rounded-lg"><span className="w-3.5 h-3.5 rounded-full bg-[#FF0000]"></span><div><p className="font-bold text-neutral-700 leading-none">Merah</p></div></div>
              <div className="flex items-center gap-2.5 p-1.5 bg-neutral-50 rounded-lg"><span className="w-3.5 h-3.5 rounded-full bg-[#FF8C00]"></span><div><p className="font-bold text-neutral-700 leading-none">Kuning Pekat</p></div></div>
              <div className="flex items-center gap-2.5 p-1.5 bg-neutral-50 rounded-lg"><span className="w-3.5 h-3.5 rounded-full bg-[#FFFF00]"></span><div><p className="font-bold text-neutral-700 leading-none">Kuning</p></div></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-200 space-y-3">
            <h4 className="font-black text-sm uppercase text-[#008000]">Bantu Kami Riset!</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">Laporkan segera koordinat ledakan ikan sapu-sapu untuk memperkaya data.</p>
            <NavLink to={!isLoggedIn ? "#" : "/laporan"} onClick={(e) => !isLoggedIn && e.preventDefault()} className={`block ${!isLoggedIn ? "opacity-40" : ""}`}>
              <button disabled={!isLoggedIn} className="w-full bg-[#008000] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">+ Tambahkan Laporan Baru <ArrowRight size={14} /></button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* HISTORI LAPORAN BUBBLE SECTION */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-neutral-300 pb-2">
          <div className="w-7 h-7 rounded-lg bg-[#008000] flex items-center justify-center text-white font-bold text-sm">📋</div>
          <h3 className="text-base font-extrabold text-neutral-800">Histori Laporan Kolektif</h3>
          <div className="ml-auto flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border text-xs text-neutral-400 max-w-xs w-64">
            <Search size={14} /> 
            <input type="text" placeholder="Cari lokasi laporan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent focus:outline-none w-full text-neutral-700 text-[11px]" />
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <p className="text-xs text-neutral-500 italic text-center py-4">Tidak ada laporan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <div key={report.id} className={`${report.bgColor || "bg-zinc-700"} text-white p-5 rounded-t-[36px] rounded-b-[36px] shadow-md flex flex-col justify-between space-y-3`}>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold tracking-wide uppercase bg-white/20 px-2 py-0.5 rounded-full">{report.location}</span>
                  <p className="text-xs text-neutral-200 line-clamp-4">"{report.desc}"</p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-neutral-300 border-t border-white/10 pt-2">
                  <span><User size={11} className="inline mr-1"/> Pelapor: {report.author}</span>
                  <span><Calendar size={11} className="inline mr-1"/> {report.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}