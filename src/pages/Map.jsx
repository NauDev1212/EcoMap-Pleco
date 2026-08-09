import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  Tooltip,
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

export default function Map({ isLoggedIn = true }) {
  const jakartaCenter = [-6.204043, 106.812515];
  const defaultZoom = 11;

  const [approvedReports, setApprovedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMetrics, setActiveMetrics] = useState(null);

  // Ref untuk mengontrol scroll horizontal carousel
  const carouselRef = useRef(null);

  // Fungsi untuk scroll ke kiri dan ke kanan
  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 340; // Jarak scroll setara lebar 1 card + gap
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // ─── KOORDINAT DAN NAMA ALUR SUNGAI ───
  const rivers = [
    {
      name: "Sungai Ciliwung",
      path: [
        [-6.3533, 106.8326],
        [-6.2917, 106.853],
        [-6.2415, 106.858],
        [-6.2088, 106.8456],
        [-6.1685, 106.8315],
        [-6.1215, 106.8112],
      ],
      weight: 6,
    },
    {
      name: "Sungai Cisadane",
      path: [
        [-6.32, 106.63],
        [-6.25, 106.625],
        [-6.17, 106.635],
        [-6.09, 106.66],
      ],
      weight: 6,
    },
    {
      name: "Kali Pesanggrahan",
      path: [
        [-6.31, 106.765],
        [-6.24, 106.77],
        [-6.18, 106.76],
        [-6.15, 106.74],
      ],
      weight: 5,
    },
    {
      name: "Kali Sunter",
      path: [
        [-6.3, 106.9],
        [-6.23, 106.89],
        [-6.16, 106.88],
        [-6.11, 106.895],
      ],
      weight: 5,
    },
    {
      name: "Kali Angke",
      path: [
        [-6.3, 106.71],
        [-6.21, 106.72],
        [-6.15, 106.73],
        [-6.1, 106.745],
      ],
      weight: 5,
    },
  ];

  // ─── HELPER MENDAPATKAN TOTAL SKOR EKOLOGIS ───
  const getScoreValue = (report) => {
    if (!report) return 0;

    const eco = report.ecological_score;
    if (typeof eco === "object" && eco !== null) {
      if (typeof eco.score_total === "number") return eco.score_total;
      if (typeof eco.total === "number") return eco.total;
    }

    if (typeof eco === "number") return eco;
    if (typeof report.density === "number") return report.density;

    return 0;
  };

  // ─── HELPER PENENTU WARNA MARKER & BORDER ───
  const getMarkerColor = (report) => {
    if (!report) return "#008000";

    if (report.ecological_score?.color_indicator) {
      return report.ecological_score.color_indicator;
    }
    if (report.marker_color) {
      return report.marker_color;
    }

    const score = getScoreValue(report);

    if (score >= 19) return "#8B0000"; // Merah Pekat (Skor 19 - 25)
    if (score >= 13) return "#FF8C00"; // Orange (Skor 13 - 18)
    if (score >= 7) return "#FFFF00"; // Kuning (Skor 7 - 12)
    return "#008000"; // Hijau (Skor 1 - 6)
  };

  // ─── HELPER TEKS INDIKATOR KETERANGAN ───
  const getDisplayIndicator = (report) => {
    if (!report) return "Normal";

    if (report.ecological_score?.kategori) {
      return `${report.ecological_score.kategori} (Skor: ${getScoreValue(report)})`;
    }

    const score = getScoreValue(report);
    if (score >= 19) return `Merah Pekat (Skor: ${score})`;
    if (score >= 13) return `Orange / Tercemar Sedang (Skor: ${score})`;
    if (score >= 7) return `Kuning / Tercemar Ringan (Skor: ${score})`;

    return `Hijau / Normal (Skor: ${score})`;
  };

  // ─── HELPER MENDAPATKAN PH AIR ───
  const getPHValue = (report) => {
    if (!report) return "-";
    const params = report.journal_reference?.parameter;
    if (params && (params.ph || params.ph_level || params.ph_value)) {
      return params.ph || params.ph_level || params.ph_value;
    }
    return report.ph || report.ph_level || report.ph_value || "-";
  };

  // ─── HELPER MENDAPATKAN DISSOLVED OXYGEN (DO) ───
  const getDOValue = (report) => {
    if (!report) return "-";
    const params = report.journal_reference?.parameter;
    if (params && (params.do_value || params.do)) {
      return params.do_value || params.do;
    }
    return report.do_value || report.do || "-";
  };

  // ─── HELPER MENDAPATKAN LOGAM BERAT ───
  const getHeavyMetalValue = (report) => {
    if (!report) return "-";
    const params = report.journal_reference?.parameter;
    if (params) {
      const list = [];
      if (params.cd && params.cd !== "Tidak diteliti")
        list.push(`Cd: ${params.cd}`);
      if (params.hg && params.hg !== "Tidak diteliti")
        list.push(`Hg: ${params.hg}`);
      if (params.pb && params.pb !== "Tidak diteliti")
        list.push(`Pb: ${params.pb}`);

      if (list.length > 0) return list.join(", ");
    }
    return report.heavy_metal || "-";
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
    /* DITAMBAHKAN: min-w-0 w-full max-w-full overflow-x-hidden pada kontainer utama */
    <div className="w-full max-w-full min-w-0 overflow-x-hidden min-h-screen bg-[#FDF1CE]/40 p-4 md:p-6 font-sans space-y-6">
      
      {/* DITAMBAHKAN: min-w-0 pada Grid utama */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full min-w-0">
        
        {/* PANEL PETA INTERAKTIF */}
        {/* DITAMBAHKAN: min-w-0 pada kontainer col-span-8 */}
        <div className="lg:col-span-8 bg-[#D3C7A3] p-3 rounded-3xl border-4 border-[#008000]/20 shadow-md flex flex-col min-h-[480px] lg:h-[550px] min-w-0 w-full">
          
          {/* DITAMBAHKAN: min-w-0 pada pembungkus MapContainer */}
          <div className="flex-1 w-full h-full rounded-2xl overflow-hidden z-10 relative min-w-0">
            <MapContainer
              center={jakartaCenter}
              zoom={defaultZoom}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
              />

              {rivers.map((river, idx) => (
                <Polyline
                  key={idx}
                  positions={river.path}
                  pathOptions={{
                    color: "#0284c7",
                    weight: river.weight,
                    opacity: 0.85,
                  }}
                >
                  <Tooltip
                    permanent
                    direction="center"
                    className="bg-white/90 text-sky-900 font-bold text-[10px] px-1.5 py-0.5 rounded border border-sky-300 shadow-sm"
                  >
                    {river.name}
                  </Tooltip>
                </Polyline>
              ))}

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
                          Status:{" "}
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

          {/* DISPLAY PARAMETER AIR */}
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

              {/* OKSIGEN TERLARUT (DO) */}
              <div className="w-full sm:w-1/3 max-w-[200px] bg-blue-50/70 p-2.5 rounded-xl border border-blue-200/60 text-center shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-700 mb-0.5">
                  <Droplets size={15} /> Oksigen (DO)
                </div>
                <p className="text-sm font-black text-blue-800">
                  {getDOValue(activeMetrics)}
                </p>
              </div>

              {/* LOGAM BERAT */}
              <div className="w-full sm:w-1/3 max-w-[200px] bg-red-50/70 p-2.5 rounded-xl border border-red-200/60 text-center shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-700 mb-0.5">
                  <AlertTriangle size={15} /> Logam Berat
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

        {/* PANEL KANAN */}
        {/* DITAMBAHKAN: min-w-0 pada col-span-4 */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4 min-w-0 w-full">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-200 space-y-4">
            <h3 className="text-base font-extrabold text-neutral-800 border-b pb-2 tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008000]"></span>{" "}
              Indikator Kepadatan
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-medium">
              <div className="flex items-center gap-2.5 p-1.5 bg-neutral-50 rounded-lg">
                <span className="w-3.5 h-3.5 rounded-full bg-[#8B0000]"></span>
                <div>
                  <p className="font-bold text-neutral-700 leading-none">
                    Merah Pekat
                  </p>
                  <p className="text-[10px] text-neutral-400">Skor 19 - 25</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-1.5 bg-neutral-50 rounded-lg">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FF8C00]"></span>
                <div>
                  <p className="font-bold text-neutral-700 leading-none">
                    Orange
                  </p>
                  <p className="text-[10px] text-neutral-400">Skor 13 - 18</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-1.5 bg-neutral-50 rounded-lg">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FFFF00]"></span>
                <div>
                  <p className="font-bold text-neutral-700 leading-none">
                    Kuning
                  </p>
                  <p className="text-[10px] text-neutral-400">Skor 7 - 12</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-1.5 bg-neutral-50 rounded-lg">
                <span className="w-3.5 h-3.5 rounded-full bg-[#008000]"></span>
                <div>
                  <p className="font-bold text-neutral-700 leading-none">
                    Hijau (Normal)
                  </p>
                  <p className="text-[10px] text-neutral-400">Skor 1 - 6</p>
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
      {/* DITAMBAHKAN: min-w-0 pada pembungkus bagian histori */}
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
            {/* Tombol Panah Kiri */}
            <button
              onClick={() => handleScroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-[#008000] text-neutral-700 hover:text-white p-2.5 rounded-full shadow-lg border border-neutral-200 transition-all focus:outline-none hidden sm:flex items-center justify-center"
              aria-label="Scroll Kiri"
            >
              <ChevronLeft size={20} />
            </button>

            {/* List Carousel Items */}
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
                  onClick={() => setActiveMetrics(report)}
                >
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

            {/* Tombol Panah Kanan */}
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