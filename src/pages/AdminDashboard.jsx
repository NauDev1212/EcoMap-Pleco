import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Users, 
  FileCheck, 
  Clock, 
  Check, 
  X, 
  Eye, 
  LogOut, 
  LayoutDashboard, 
  ShieldAlert,
  MapPin,
  Loader2,
  ExternalLink
} from "lucide-react";

// Fix icon Leaflet agar marker muncul dengan benar
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalApproved: 0, totalPending: 0 });
  const [pendingReports, setPendingReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); 
  const [selectedImage, setSelectedImage] = useState(null); // Modal Bukti Foto
  const [selectedLocation, setSelectedLocation] = useState(null); // Modal Visualisasi Peta

  // Load Data dari Supabase saat komponen dimuat
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Ambil Laporan 'pending' dari tabel 'reports'
      const { data: pendingData, error: pendingErr } = await supabase
        .from("reports")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (pendingErr) throw pendingErr;
      setPendingReports(pendingData || []);

      // 2. Hitung Total Laporan Valid/Disetujui ('approved')
      const { count: approvedCount, error: approvedErr } = await supabase
        .from("reports")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      if (approvedErr) throw approvedErr;

      // 3. Hitung Total Pengguna dari tabel 'profiles'
      let usersCount = 0;
      try {
        const { count, error: userErr } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });
        
        if (!userErr && count !== null) {
          usersCount = count;
        }
      } catch (e) {
        console.warn("Tabel profiles tidak ditemukan, menyetel total users ke 0");
      }

      setStats({
        totalUsers: usersCount,
        totalApproved: approvedCount || 0,
        totalPending: pendingData?.length || 0,
      });

    } catch (err) {
      console.error("Gagal mengambil data admin dari Supabase:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ACTION: Setujui Laporan (Ubah status 'pending' -> 'approved' di Supabase)
  const handleApprove = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menyetujui laporan ini ke Peta Utama?")) return;

    setProcessingId(id);
    try {
      const { error } = await supabase
        .from("reports")
        .update({ status: "approved" })
        .eq("id", id);

      if (error) throw error;

      alert("Laporan berhasil disetujui & diteruskan ke Peta!");
      await fetchDashboardData(); 
    } catch (err) {
      alert("Gagal menyetujui laporan: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  // ACTION: Tolak & Hapus Laporan dari Database Supabase
  const handleReject = async (id) => {
    if (!window.confirm("Peringatan: Laporan palsu ini akan dihapus permanen dari database! Lanjutkan?")) return;

    setProcessingId(id);
    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("Laporan berhasil ditolak dan dihapus dari database.");
      await fetchDashboardData(); 
    } catch (err) {
      alert("Gagal menghapus laporan: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/profil";
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6F9] font-sans">
      
      {/* 🟢 SIDEBAR NAVIGASI KHUSUS ADMIN */}
      <aside className="w-20 lg:w-64 bg-[#1E293B] text-white flex flex-col justify-between p-4 shadow-xl">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-700">
            <div className="p-2 bg-indigo-600 rounded-xl">
              <ShieldAlert size={24} className="text-white" />
            </div>
            <span className="hidden lg:inline text-lg font-bold tracking-wide">
              EcoMap Admin
            </span>
          </div>

          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-indigo-600 rounded-xl text-white font-medium shadow-md">
              <LayoutDashboard size={20} />
              <span className="hidden lg:inline">Dashboard</span>
            </a>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="hidden lg:inline font-medium">Keluar</span>
        </button>
      </aside>

      {/* 🟢 AREA UTAMA DASHBOARD */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        
        {/* Header Topbar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800">
              Statistics & Reports
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Panel Verifikasi & Control Laporan Komunitas
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              A
            </div>
            <span className="text-sm font-semibold text-slate-700">Administrator</span>
          </div>
        </div>

        {/* 🟢 STATISTIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1: Total Pengguna */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm font-semibold text-slate-400 mb-1">Total Users</p>
            <h3 className="text-3xl font-black text-slate-800">{stats.totalUsers}</h3>
            <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">
              <Users size={14} /> Terdaftar di Sistem
            </div>
          </div>

          {/* Card 2: Total Laporan Disetujui */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm font-semibold text-slate-400 mb-1">Valid Reports (Peta)</p>
            <h3 className="text-3xl font-black text-emerald-600">{stats.totalApproved}</h3>
            <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">
              <FileCheck size={14} /> Tampil di Halaman Peta
            </div>
          </div>

          {/* Card 3: Menunggu Persetujuan */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm font-semibold text-slate-400 mb-1">Pending Moderation</p>
            <h3 className="text-3xl font-black text-amber-500">{stats.totalPending}</h3>
            <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg w-fit">
              <Clock size={14} /> Butuh Peninjauan Admin
            </div>
          </div>

        </div>

        {/* 🟢 TABEL MODERASI LAPORAN */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Persetujuan Laporan Masuk
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pilih <b className="text-emerald-600">Yes</b> untuk menyetujui atau <b className="text-red-500">No</b> untuk menolak & menghapus.
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
              {pendingReports.length} Laporan Pending
            </span>
          </div>

          {/* Tabel Data */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1E293B] text-white text-xs uppercase tracking-wider">
                  <th className="p-4 pl-6">SN</th>
                  <th className="p-4">Pengirim & Email</th>
                  <th className="p-4">Detail Laporan</th>
                  <th className="p-4 text-center">Lokasi Peta</th>
                  <th className="p-4 text-center">Bukti Foto</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400">
                      Memuat laporan dari Supabase...
                    </td>
                  </tr>
                ) : pendingReports.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400">
                      🎉 Tidak ada laporan sementara yang perlu diverifikasi.
                    </td>
                  </tr>
                ) : (
                  pendingReports.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-slate-400">{index + 1}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{item.user_name || "Anonim"}</div>
                        <div className="text-xs text-slate-400">{item.user_email || "-"}</div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="font-bold text-indigo-900">{item.title}</div>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{item.description}</p>
                      </td>

                      {/* 🟢 MODIFIKASI LOKASI PETA */}
                      <td className="p-4 text-center">
                        {item.latitude && item.longitude ? (
                          <div className="flex flex-col items-center gap-1">
                            <button
                              onClick={() => setSelectedLocation({
                                lat: item.latitude,
                                lng: item.longitude,
                                title: item.title,
                                user: item.user_name
                              })}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold border border-red-200 shadow-sm transition-colors"
                            >
                              <MapPin size={15} className="text-red-500 fill-red-500" />
                              <span>Lihat Peta</span>
                            </button>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {item.latitude.toFixed(3)}, {item.longitude.toFixed(3)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300">Tidak ada koordinat</span>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        {item.image_url ? (
                          <button
                            onClick={() => setSelectedImage(item.image_url)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Eye size={14} /> Lihat Foto
                          </button>
                        ) : (
                          <span className="text-xs text-slate-300">Tanpa Foto</span>
                        )}
                      </td>
                      
                      {/* TOMBOL ACTION: YES / NO */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApprove(item.id)}
                            disabled={processingId === item.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg font-bold text-xs shadow-sm transition-colors"
                            title="Setujui dan masukkan ke Peta"
                          >
                            {processingId === item.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Check size={14} />
                            )}
                            YES
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            disabled={processingId === item.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white rounded-lg font-bold text-xs shadow-sm transition-colors"
                            title="Tolak dan hapus laporan"
                          >
                            {processingId === item.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <X size={14} />
                            )}
                            NO
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* 🟢 MODAL POPUP BUKTI FOTO */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600"
            >
              <X size={18} />
            </button>
            <h3 className="font-bold text-slate-800 mb-3">Bukti Foto Laporan</h3>
            <img
              src={selectedImage}
              alt="Bukti Laporan"
              className="w-full h-80 object-cover rounded-xl border"
            />
          </div>
        </div>
      )}

      {/* 🟢 MODAL POPUP VISUALISASI PETA LOKASI */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <MapPin className="text-red-500" size={20} />
                  Lokasi Titik Laporan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Laporan: <b className="text-indigo-600">{selectedLocation.title}</b> ({selectedLocation.user || "Anonim"})
                </p>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Container Peta Leaflet */}
            <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
              <MapContainer 
                center={[selectedLocation.lat, selectedLocation.lng]} 
                zoom={16} 
                scrollWheelZoom={true}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                  <Popup>
                    <div className="text-xs">
                      <b>{selectedLocation.title}</b><br/>
                      Pelapor: {selectedLocation.user || "Anonim"}
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Footer Modal: Buka via Google Maps Direct Link */}
            <div className="mt-4 flex justify-between items-center bg-slate-50 p-3 rounded-xl">
              <span className="text-xs text-slate-500 font-mono">
                Lat: {selectedLocation.lat}, Lng: {selectedLocation.lng}
              </span>
              <a
                href={`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}