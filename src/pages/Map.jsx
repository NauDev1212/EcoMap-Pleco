import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  Tooltip,
  GeoJSON,
} from "react-leaflet";
import {
  AlertTriangle,
  TestTube,
  Droplets,
  Calendar,
  User,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { supabase } from "../supabaseClient";
import geojsonData from '../data/jakartaRiver.json';

export default function Map({ isLoggedIn = true }) {
  const jakartaCenter = [-6.204043, 106.812515];
  const defaultZoom = 11;

  const [approvedReports, setApprovedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMetrics, setActiveMetrics] = useState(null);

  // State untuk menampilkan Modal Komentar / Ulasan Lengkap

  const [selectedReportModal, setSelectedReportModal] = useState(null);

  const carouselRef = useRef(null);

  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // ─── HELPER MENDAPATKAN TOTAL SKOR TERTIMBANG WQI (20 - 100) ───
  const getScoreValue = (report) => {
  if (!report) return 0;

  const eco = report.ecological_score;
  
  // Jika tersimpan sebagai objek hasil kalkulasi WQI
  if (typeof eco === "object" && eco !== null) {
    if (typeof eco.wqi_total === "number") return eco.wqi_total; // <--- DITAMBAHKAN
    if (typeof eco.totalWQI === "number") return eco.totalWQI;
    if (typeof eco.score_total === "number") return eco.score_total;
    if (typeof eco.total === "number") return eco.total;
  }

  if (typeof eco === "number") return eco;
  if (typeof report.total_wqi === "number") return report.total_wqi;
  if (typeof report.density === "number") return report.density;

  return 0;
};

  // ─── HELPER PENENTU WARNA MARKER BERDASARKAN RATA-RATA WQI ───
  const getMarkerColor = (report) => {
    if (!report) return "#ea4235";

    const score = getScoreValue(report);

    // Patokan Kategori WQI (Skor 20 - 100)
    if (score >= 91) return "#82d9f8"; // Biru (Sangat Baik / Normal: 91 - 100)
    if (score >= 71) return "#14cd14"; // Hijau (Sangat Baik / Normal: 71 - 90)
    if (score >= 51) return "#ffd83d"; // Kuning (Tercemar Ringan: 51 - 70)
    if (score >= 26) return "#FF8C00"; // Orange (Tercemar Sedang: 26 - 50)
    return "#ea4235";                  // Merah (Tercemar Berat / Buruk: < 25)
  };

  // ─── HELPER TEKS INDIKATOR KETERANGAN ───
  const getDisplayIndicator = (report) => {
    if (!report) return "Tanpa Data";

    const score = getScoreValue(report);
    if (score >= 91) return `Sangat Baik (${score})`;
    if (score >= 71) return `Normal (${score})`;
    if (score >= 51) return `Tercemar Ringan (${score})`;
    if (score >= 26) return `Tercemar Sedang (${score})`;
    return `Tercemar Berat (${score})`;
  };

  // ─── HELPER PH AIR STATIS (REFERENSI JURNAL 5 SUNGAI) ───
const getPHValue = () => {
  // Langsung kembalikan nilai statis yang Anda inginkan
  return "4.48 – 8.20 pH"; // Atau rentang seperti: return "3 - 8 pH";

};

// ─── HELPER MENDAPATKAN SUB-INDEKS / NILAI DISSOLVED OXYGEN (DO) ───
const getDOValue = (report) => {
  if (!report) return "N/A";

  const eco = report?.ecological_score;
  if (eco && typeof eco === "object") {
    // 1. Cek kunci utama dari Supabase (snake_case)
    if (eco.sub_index_do !== undefined && eco.sub_index_do !== null) {
      return `${eco.sub_index_do} / 100 point`;
    }
    // 2. Fallback format alternatif
    if (eco.subIndexDO !== undefined && eco.subIndexDO !== null) {
      return `${eco.subIndexDO} / 100 point`;
    }
    if (eco.do_score !== undefined && eco.do_score !== null) {
      return `${eco.do_score} / 100 point`;
    }
  }

  // Fallback jurnal jika data WQI tidak ada
  const params = report?.journal_reference?.parameter;
  if (params && (params.do_value || params.do)) {
    return params.do_value || params.do;
  }
  return report?.do_value || report?.do || "N/A";
};

// ─── HELPER MENDAPATKAN SUB-INDEKS / NILAI LOGAM BERAT ───
const getHeavyMetalValue = (report) => {
  if (!report) return "N/A";

  const eco = report?.ecological_score;
  if (eco && typeof eco === "object") {
    // 1. Cek kunci utama dari Supabase (snake_case)
    if (eco.sub_index_metal !== undefined && eco.sub_index_metal !== null) {
      // Pembalikan nilai: 120 - nilai_asli
      // Jika WQI Logam = 100 (Sangat Bagus), Tingkat Cemaran = 20 (Rendah)
      // Jika WQI Logam = 20 (Sangat Buruk), Tingkat Cemaran = 100 (Tinggi)
      const contaminationLevel = 120 - Number(eco.sub_index_metal);
      return `${contaminationLevel} / 100 point`;
    }

    // 2. Fallback format alternatif
    if (eco.subIndexMetal !== undefined && eco.subIndexMetal !== null) {
      const contaminationLevel = 120 - Number(eco.subIndexMetal);
      return `${contaminationLevel} / 100 point`;
    }
    if (eco.metal_score !== undefined && eco.metal_score !== null) {
      const contaminationLevel = 120 - Number(eco.metal_score);
      return `${contaminationLevel} / 100 point`;
    }
  }

  // Fallback jurnal jika data WQI tidak ada (tetap menampilkan kadar konsentrasi asli dari jurnal)
  const params = report?.journal_reference?.parameter;
  if (params) {
    const list = [];
    if (params.cd && params.cd !== "Tidak diteliti") list.push(`Cd: ${params.cd}`);
    if (params.hg && params.hg !== "Tidak diteliti") list.push(`Hg: ${params.hg}`);
    if (params.pb && params.pb !== "Tidak diteliti") list.push(`Pb: ${params.pb}`);
    if (list.length > 0) return list.join(", ");
  }
  return report?.heavy_metal || "N/A";
};

  // ─── HELPER MENDAPATKAN NAMA LOKASI ───
  const getReportLocation = (report) => {
    return (
      report?.river_name ||
      report?.wilayah ||
      report?.title ||
      "Lokasi Pelaporan"
    );
  };

  useEffect(() => {
    const loadSupabaseData = async () => {
      try {
        const { data: reports, error: reportsError } = await supabase
          .from("reports")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false });

        if (reportsError) throw reportsError;

        if (reports && reports.length > 0) {
          console.log("Data Supabase Berhasil Diterima:", reports);
          setApprovedReports(reports);
          setActiveMetrics(reports[0]);
        }
      } catch (error) {
        console.error("Gagal memuat data dari Supabase:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSupabaseData();
  }, []);

  const filteredReports = approvedReports.filter(
    (report) =>
      getReportLocation(report)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (report.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (report.user_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FDF1CE]/20">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-[#008000] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-[#008000]">
            Memuat Data Laporan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0 overflow-x-hidden min-h-screen bg-[#FDF1CE]/40 p-4 md:p-6 font-sans space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full min-w-0">
        
        {/* PANEL PETA INTERAKTIF */}
        <div className="lg:col-span-8 bg-[#D3C7A3] p-3 rounded-3xl border-4 border-[#008000]/20 shadow-md flex flex-col min-h-[480px] lg:h-[550px] min-w-0 w-full">
          
          <div className="flex-1 w-full h-full rounded-2xl overflow-hidden z-10 relative min-w-0">
            <MapContainer
              center={jakartaCenter}
              zoom={defaultZoom}
              style={{ width: "100%", height: "100%" }}
              zoomControl={false}        // Menghilangkan tombol kontrol zoom (+ / -) di sudut peta
              scrollWheelZoom={false}    // Mematikan fitur zoom menggunakan scroll mouse
              doubleClickZoom={false}    // Mematikan fitur zoom saat melakukan double click
              boxZoom={false}            // Mematikan fitur zoom menggunakan kotak (Shift + drag)
              touchZoom={false}          // Mematikan pinch-zoom di layar sentuh
              dragging={true}            // Memastikan peta tetap bisa digeser-geser (pan)
             >
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              />

              {geojsonData && (
                <GeoJSON
                  data={geojsonData}
                  style={() => ({
                    color: "#0284c7",
                    weight: 4,
                    opacity: 0.85,
                  })}
                  onEachFeature={(feature, layer) => {
                    // Ambil properti nama sungai dari GeoJSON (sesuaikan nama propertinya, misal: 'NAMOBJ', 'name', atau 'river_name')
                    const riverName =
                      feature.properties?.NAMOBJ ||
                      feature.properties?.name ||
                      feature.properties?.river_name ||
                      "Aliran Sungai";
              
                    layer.bindTooltip(riverName, {
                      permanent: false, // Disarankan false agar tooltip tidak menumpuk memenuhi layar
                      direction: "center",
                      className:
                        "bg-white/90 text-sky-900 font-bold text-[10px] px-1.5 py-0.5 rounded border border-sky-300 shadow-sm",
                    });
                  }}
                />
              )}

              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" />

              {/* RENDER TITIK LAPORAN */}
              {approvedReports.map((report) => {
                const lat = Number(report.latitude);
                const lng = Number(report.longitude);

                if (isNaN(lat) || isNaN(lng) || !lat || !lng) return null;

                const markerColor = getMarkerColor(report);

                return (
                  <CircleMarker
                    key={report.id}
                    center={[lat, lng]}
                    radius={10}
                    fillColor={markerColor}
                    color="#fff"
                    weight={2}
                    fillOpacity={0.9}
                    eventHandlers={{
                      click: () => setActiveMetrics(report),
                    }}
                  >
                    <Popup>
                      <div className="text-xs font-sans space-y-1">
                        <p className="font-bold text-neutral-800">
                          {getReportLocation(report)}
                        </p>
                        <p className="text-neutral-600">
                          Pelapor:{" "}
                          <span className="font-semibold">
                            {report.user_name || "Anonim"}
                          </span>
                        </p>
                        <p className="text-neutral-600">
                          Kesehatan Air:{" "}
                          <span
                            className="font-semibold"
                            style={{ color: markerColor }}
                          >
                            {getDisplayIndicator(report)}
                          </span>
                        </p>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>

          {/* DISPLAY PARAMETER AIR HASIL PERHITUNGAN WQI */}
          <div className="mt-3 bg-white/95 p-3.5 rounded-2xl border border-neutral-200 shadow-sm space-y-2 min-w-0">
            <div className="text-center border-b border-neutral-100 pb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                📊 Titik Terpilih:{" "}
                <span className="text-[#008000] normal-case font-extrabold">
                  {getReportLocation(activeMetrics)}
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* PH AIR */}
              <div className="w-full sm:w-1/3 max-w-[200px] bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/60 text-center shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 mb-0.5">
                  <TestTube size={15} /> pH Air
                </div>
                <p className="text-sm font-black text-emerald-800">
                  {getPHValue(activeMetrics)}
                </p>
              </div>

              {/* OKSIGEN TERLARUT (DO SUB-INDEX) */}
              <div className="w-full sm:w-1/3 max-w-[200px] bg-blue-50/70 p-2.5 rounded-xl border border-blue-200/60 text-center shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-700 mb-0.5">
                  <Droplets size={15} /> Indeks DO
                </div>
                <p className="text-sm font-black text-blue-800">
                  {getDOValue(activeMetrics)}
                </p>
              </div>

              {/* LOGAM BERAT SUB-INDEX */}
              <div className="w-full sm:w-1/3 max-w-[200px] bg-red-50/70 p-2.5 rounded-xl border border-red-200/60 text-center shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-700 mb-0.5">
                  <AlertTriangle size={15} /> Indeks Logam
                </div>
                <p
                  className="text-xs font-extrabold text-red-800 truncate"
                  title={getHeavyMetalValue(activeMetrics)}
                >
                  {getHeavyMetalValue(activeMetrics)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL KANAN - LEGEND WQI */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4 min-w-0 w-full">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-200 space-y-4">
              <h3 className="text-base font-extrabold text-neutral-800 border-b pb-2 tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#008000]"></span>{" "}
                Indikator Kualitas Air
              </h3>
              
              <div className="flex flex-col space-y-3 text-xs">
                {/* MERAH */}
                <div className="flex items-start gap-3 p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="w-4 h-4 rounded-full bg-[#ea4235] shrink-0 mt-0.5"></span>
                  <div className="space-y-0.5 w-full">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-neutral-800">Merah</span>
                      <span className="text-[11px] font-semibold text-neutral-500">Skor 0 - 25</span>
                    </div>
                    <p className="font-bold text-red-700">Tercemar Berat (Very Bad)</p>
                    <p className="text-[11px] text-neutral-600 leading-snug">
                      Kualitas air sangat buruk dan kritis. Ecosistem sungai sangat terganggu.
                    </p>
                  </div>
                </div>

                {/* ORANGE */}
                <div className="flex items-start gap-3 p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="w-4 h-4 rounded-full bg-[#FF8C00] shrink-0 mt-0.5"></span>
                  <div className="space-y-0.5 w-full">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-neutral-800">Orange</span>
                      <span className="text-[11px] font-semibold text-neutral-500">Skor 26 - 50</span>
                    </div>
                    <p className="font-bold text-orange-600">Tercemar Sedang (Bad)</p>
                    <p className="text-[11px] text-neutral-600 leading-snug">
                      Kualitas air buruk. Mengalami pencemaran yang signifikan.
                    </p>
                  </div>
                </div>

                {/* KUNING */}
                <div className="flex items-start gap-3 p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="w-4 h-4 rounded-full bg-[#ffd83d] shrink-0 mt-0.5"></span>
                  <div className="space-y-0.5 w-full">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-neutral-800">Kuning</span>
                      <span className="text-[11px] font-semibold text-neutral-500">Skor 51 - 70</span>
                    </div>
                    <p className="font-bold text-amber-600">Tercemar Ringan (Moderate)</p>
                    <p className="text-[11px] text-neutral-600 leading-snug">
                      Kualitas air sedang/cukupan. Kondisi perairan mulai terpengaruh pencemaran ringan.
                    </p>
                  </div>
                </div>

                {/* HIJAU */}
                <div className="flex items-start gap-3 p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="w-4 h-4 rounded-full bg-[#14cd14] shrink-0 mt-0.5"></span>
                  <div className="space-y-0.5 w-full">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-neutral-800">Hijau</span>
                      <span className="text-[11px] font-semibold text-neutral-500">Skor 71 - 90</span>
                    </div>
                    <p className="font-bold text-emerald-700">Baik (Good)</p>
                    <p className="text-[11px] text-neutral-600 leading-snug">
                      Kualitas air baik dan relatif bersih. Ekosistem perairan berfungsi normal.
                    </p>
                  </div>
                </div>

                {/* BIRU */}
                <div className="flex items-start gap-3 p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="w-4 h-4 rounded-full bg-[#82d9f8] shrink-0 mt-0.5"></span>
                  <div className="space-y-0.5 w-full">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-neutral-800">Biru</span>
                      <span className="text-[11px] font-semibold text-neutral-500">Skor 91 - 100</span>
                    </div>
                    <p className="font-bold text-sky-600">Sangat Baik (Excellent)</p>
                    <p className="text-[11px] text-neutral-600 leading-snug">
                      Kualitas air sangat baik/alami. Sangat bersih dan belum terpolusi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-200 space-y-3">
            <h4 className="font-black text-sm uppercase text-[#008000]">
              Bantu Riset Kami!
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Laporkan segera koordinat ledakan ikan sapu-sapu untuk memperkaya
              data.
            </p>
            <NavLink
              to={!isLoggedIn ? "#" : "/laporan"}
              onClick={(e) => !isLoggedIn && e.preventDefault()}
              className={`block ${!isLoggedIn ? "opacity-40" : ""}`}
            >
              <button
                disabled={!isLoggedIn}
                className="w-full bg-[#008000] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                + Tambahkan Laporan Baru <ArrowRight size={14} />
              </button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* HISTORI LAPORAN (CAROUSEL) */}
      <div className="space-y-3 pt-4 w-full max-w-full overflow-hidden min-w-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-300 pb-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="w-7 h-7 rounded-lg bg-[#008000] flex items-center justify-center text-white font-bold text-sm">
              📋
            </div>
            <h3 className="text-base font-extrabold text-neutral-800">
              Histori Laporan Kolektif
            </h3>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-neutral-300 text-xs text-neutral-400 w-full sm:w-64 shadow-sm">
              <Search size={14} />
              <input
                type="text"
                placeholder="Cari sungai / wilayah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent focus:outline-none w-full text-neutral-700 text-[11px]"
              />
            </div>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <p className="text-xs text-neutral-500 italic text-center py-8 bg-white/50 rounded-2xl">
            Tidak ada laporan yang ditemukan.
          </p>
        ) : (
          <div className="relative group w-full max-w-full min-w-0 px-2 sm:px-10">
            <button
              onClick={() => handleScroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-[#008000] text-neutral-700 hover:text-white p-2.5 rounded-full shadow-lg border border-neutral-200 transition-all focus:outline-none hidden sm:flex items-center justify-center"
              aria-label="Scroll Kiri"
            >
              <ChevronLeft size={20} />
            </button>

            <div
              ref={carouselRef}
              className="flex overflow-x-auto gap-4 py-3 px-1 scroll-smooth w-full max-w-full min-w-0"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="shrink-0 w-[260px] sm:w-[300px] md:w-[320px] bg-white text-neutral-800 p-5 rounded-3xl shadow-sm border border-neutral-200 border-l-8 transition-all hover:shadow-md hover:scale-[1.01] cursor-pointer flex flex-col justify-between"
                  style={{ borderLeftColor: getMarkerColor(report) }}
                  onClick={() => {
                    setActiveMetrics(report);         // Fokus ke titik peta & parameter
                    setSelectedReportModal(report);   // Membuka Modal Pop-up Komentar Full
                  }}
                >

                  
               {/* ─── MODAL POP-UP ULASAN & KOMENTAR LENGKAP ─── */}
      {selectedReportModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-md p-4 overflow-y-auto"
          onClick={() => setSelectedReportModal(null)}
        >
          <div 
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 my-auto relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat area dalam diklik
          >
            
            {/* Header Modal */}
            <div className="bg-[#008000] px-6 py-4 text-white flex justify-between items-center">
              <span className="text-sm font-black uppercase tracking-wider">
                Detail Laporan Ekologis
              </span>
              <button
                type="button"
                onClick={() => setSelectedReportModal(null)}
                className="bg-white/20 hover:bg-white/30 w-8 h-8 rounded-full flex items-center justify-center transition-colors text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Isi Konten Modal */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              {/* Lokasi & Status */}
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg">
                  📍 {getReportLocation(selectedReportModal)}
                </span>
                <span 
                  className="text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm"
                  style={{ backgroundColor: getMarkerColor(selectedReportModal) }}
                >
                  {getDisplayIndicator(selectedReportModal)}
                </span>
              </div>

              {/* Komentar / Deskripsi Full */}
              <div className="space-y-1.5 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  💬 Ulasan / Komentar Lengkap Pelapor:
                </p>
                <p className="text-sm text-neutral-800 leading-relaxed font-medium whitespace-pre-wrap">
                  "{selectedReportModal.description || "Tidak ada deskripsi catatan."}"
                </p>
              </div>

              {/* Informasi Pelapor & Waktu */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs text-neutral-600">
                <div className="flex items-center gap-1.5 font-semibold text-neutral-700">
                  <User size={14} className="text-[#008000]" /> 
                  <span>{selectedReportModal.user_name || "Anonim"}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-end text-neutral-400">
                  <Calendar size={14} /> 
                  <span>{new Date(selectedReportModal.created_at || Date.now()).toLocaleDateString("id-ID")}</span>
                </div>
              </div>

            </div>

            {/* Footer Modal dengan Tombol Tutup Aktif */}
            <div className="bg-neutral-50 px-6 py-4 border-t flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setActiveMetrics(selectedReportModal); // Memusatkan parameter & titik peta ke laporan ini
                  setSelectedReportModal(null);          // Menutup pop-up modal
                }}
                className="w-full sm:w-auto bg-[#008000] hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer"
              >
                Tutup & Lihat Peta
              </button>
            </div>

          </div>
        </div>
      )}

                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md truncate max-w-[150px]">
                        {getReportLocation(report)}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold shrink-0">
                        ✓ Disetujui
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mt-2 font-medium">
                      "{report.description || "Tidak ada deskripsi"}"
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 text-[10px] text-neutral-500 border-t border-neutral-100 pt-3 mt-4">
                    <span className="flex items-center gap-1.5 font-semibold text-neutral-700">
                      <User size={12} className="text-[#008000]" /> Oleh:{" "}
                      {report.user_name || "Anonim"}
                    </span>
                    <span className="flex items-center gap-1.5 text-neutral-400">
                      <Calendar size={12} /> Dibuat:{" "}
                      {new Date(
                        report.created_at || Date.now()
                      ).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleScroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-[#008000] text-neutral-700 hover:text-white p-2.5 rounded-full shadow-lg border border-neutral-200 transition-all focus:outline-none hidden sm:flex items-center justify-center"
              aria-label="Scroll Kanan"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}