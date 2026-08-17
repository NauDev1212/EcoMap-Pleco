// Duplicate code 2

import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { ECOLOGICAL_QUESTIONS } from "../data/journalData";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
  Polyline,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import {
  Download,
  Waves,
  MapPin,
  BookOpen,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Activity,
  FileText,
  X,
  Image as ImageIcon,
  Crosshair,
  ShieldAlert,
} from "lucide-react";

// Data Koordinat Vektor Sungai Jakarta
const rivers = [
  {
    name: "Kali Angke",
    path: [
      [-6.32, 106.71],
      [-6.26, 106.72],
      [-6.2, 106.735],
      [-6.15, 106.745],
      [-6.11, 106.73],
    ],
  },
  {
    name: "Kali Pesanggrahan",
    path: [
      [-6.34, 106.76],
      [-6.28, 106.765],
      [-6.22, 106.77],
      [-6.17, 106.762],
      [-6.12, 106.755],
    ],
  },
  {
    name: "Sungai Ciliwung",
    path: [
      [-6.35, 106.835],
      [-6.29, 106.845],
      [-6.23, 106.852],
      [-6.18, 106.838],
      [-6.12, 106.83],
    ],
  },
  {
    name: "Kali Sunter",
    path: [
      [-6.32, 106.9],
      [-6.25, 106.895],
      [-6.19, 106.89],
      [-6.14, 106.885],
      [-6.1, 106.895],
    ],
  },
  {
    name: "Sungai Cisadane",
    path: [
      [-6.33, 106.64],
      [-6.25, 106.63],
      [-6.17, 106.62],
      [-6.1, 106.64],
    ],
  },
];

// Fix Icon Marker Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const RIVERS_LIST = [
  "Sungai Ciliwung",
  "Sungai Cisadane",
  "Kali Pesanggrahan",
  "Kali Sunter",
  "Kali Angke",
  "Lainnya"
];

const TYPE_USER = [
  "Masyarakat Umum",
  "Instansi Pemerintah",
  "Akademisi / Peneliti",
  "Komunitas Lingkungan",
];

function MapRecenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 11);
    }
  }, [lat, lng, map]);
  return null;
}

function LocationPickerMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const coord = marker.getLatLng();
          setPosition([coord.lat, coord.lng]);
        },
      }}
    />
  ) : null;
}

export default function Report() {
  const [nama, setNama] = useState("");
  const [selectedUserKategori, setSelectedUserKategori] = useState([]);
  const [judul, setJudul] = useState("");
  const [wilayah, setWilayah] = useState("");
  const [waktuPengamatan, setWaktuPengamatan] = useState("");

  const [selectedRiverName, setSelectedRiverName] = useState("");
  const [customRiverName, setCustomRiverName] = useState("");
  const [markerPosition, setMarkerPosition] = useState([-6.204043, 106.812515]);
  const [gettingLocation, setGettingLocation] = useState(false);

  const [selectedLokasiId, setSelectedLokasiId] = useState("");
  const [selectedJournal, setSelectedJournal] = useState(null);

  const [journalParams, setJournalParams] = useState({
    ph: "-",
    do_value: "-",
    pb: "-",
    hg: "-",
    cd: "-",
  });

  // State untuk menyimpan jawaban 10 soal
  const [scores, setScores] = useState({
    do_1: "", do_2: "", do_3: "", do_4: "", do_5: "",
    metal_1: "", metal_2: "", metal_3: "", metal_4: "", metal_5: ""
  });

  const [keteranganEkologis, setKeteranganEkologis] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    if (selectedFile.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

// --- KALKULASI PRESI WQI TERTIMBANG (BERDASARKAN WEIGHT Pi & SKOR Ci) ---
const calculateWeightedSubIndex = (category) => {
  const filteredQuestions = ECOLOGICAL_QUESTIONS.filter((q) => q.category === category);
  
  let totalCiPi = 0;
  let totalPi = 0;

  filteredQuestions.forEach((q) => {
    const val = Number(scores[q.id] || 0);
    if (val > 0) {
      const Ci = val;        // Skor opsi jawaban (20 - 100)
      const Pi = q.weight;   // Bobot indikator (3 - 5)
      
      totalCiPi += Ci * Pi;
      totalPi += Pi;
    }
  });

  if (totalPi === 0) return 0;
  return Math.round(totalCiPi / totalPi);
};

// Hitung Sub-Indeks Persisi masing-masing kategori
const subIndexDO = calculateWeightedSubIndex("DO");
const subIndexMetal = calculateWeightedSubIndex("LOGAM");

// Hitung WQI Total gabungan tertimbang dari seluruh 10 indikator
const calculateTotalWQI = () => {
  let totalCiPi = 0;
  let totalPi = 0;

  ECOLOGICAL_QUESTIONS.forEach((q) => {
    const val = Number(scores[q.id] || 0);
    if (val > 0) {
      totalCiPi += val * q.weight;
      totalPi += q.weight;
    }
  });

  if (totalPi === 0) return 0;
  return Math.round(totalCiPi / totalPi);
};

const totalWQI = calculateTotalWQI();

  const getWQIStatus = (wqi) => {
    const isFilled = Object.values(scores).every((val) => val !== "");
    if (!isFilled) {
      return {
        label: "Belum Lengkap",
        color: "#9CA3AF",
        badge: "bg-gray-100 text-gray-700 border-gray-300",
      };
    }
    if (wqi >= 81) {
      return {
        label: "Sangat Baik (Kondisi Alami)",
        color: "#22C55E",
        badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      };
    }
    if (wqi >= 51) {
      return {
        label: "Baik / Tercemar Ringan",
        color: "#EAB308",
        badge: "bg-amber-100 text-amber-800 border-amber-300",
      };
    }
    if (wqi >= 26) {
      return {
        label: "Cukup / Tercemar Sedang",
        color: "#F97316",
        badge: "bg-orange-100 text-orange-800 border-orange-300",
      };
    }
    return {
      label: "Buruk / Tercemar Berat",
      color: "#EF4444",
      badge: "bg-red-100 text-red-800 border-red-300",
    };
  };

  const statusObj = getWQIStatus(totalWQI);

  const checkIfOnWater = async (lat, lng) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const delta = 0.15;

    const query = `
    [out:json][timeout:10];
    (
      node["natural"="water"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
      way["natural"="water"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
      way["waterway"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
      relation["waterway"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
    );
    out ids;
  `;

    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: "data=" + encodeURIComponent(query),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (!res.ok) throw new Error("Overpass API error");
      const data = await res.json();
      return data.elements && data.elements.length > 0;
    } catch (err) {
      return true; // Fallback jika timeout/offline
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser Anda.");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMarkerPosition([pos.coords.latitude, pos.coords.longitude]);
        setGettingLocation(false);
      },
      (err) => {
        alert("Gagal mengambil lokasi. Pastikan GPS aktif.");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleJournalSelect = (e) => {
    const id = e.target.value;
    setSelectedLokasiId(id);

    const journal = ECOLOGICAL_QUESTIONS.find((item) => item.id_lokasi === id);
    if (journal) {
      setSelectedJournal(journal);
      const params = journal.parameter_kimia;
      const pbVal = params.logam_berat?.Pb?.nilai ?? params.logam_berat?.Pb?.nilai_min ?? null;
      const hgVal = params.logam_berat?.Hg?.nilai ?? null;
      const cdVal = params.logam_berat?.Cd?.nilai ?? null;

      setJournalParams({
        ph: params.pH?.nilai ? `${params.pH.nilai} pH` : "Tidak diteliti",
        do_value: params.DO?.nilai ? `${params.DO.nilai} ${params.DO.satuan || ""}` : "Tidak diteliti",
        pb: pbVal !== null ? `${pbVal} mg/L` : "Tidak diteliti",
        hg: hgVal !== null ? `${hgVal} mg/L` : "Tidak diteliti",
        cd: cdVal !== null ? `${cdVal} mg/L` : "Tidak diteliti",
      });
    } else {
      setSelectedJournal(null);
      setJournalParams({ ph: "-", do_value: "-", pb: "-", hg: "-", cd: "-" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file terlalu besar! Maksimal 10MB.");
      return;
    }
    setSelectedFile(file);
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setNama("");
    setSelectedUserKategori([]);
    setJudul("");
    setWilayah("");
    setWaktuPengamatan("");
    setSelectedRiverName("");
    setCustomRiverName("");
    setSelectedLokasiId("");
    setSelectedJournal(null);
    setKeteranganEkologis("");
    setSelectedFile(null);
    setAgreed(false);
    setScores({
      do_1: "", do_2: "", do_3: "", do_4: "", do_5: "",
      metal_1: "", metal_2: "", metal_3: "", metal_4: "", metal_5: ""
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUserKategoriToggle = (category) => {
    if (selectedUserKategori.includes(category)) {
      setSelectedUserKategori(selectedUserKategori.filter((item) => item !== category));
    } else {
      setSelectedUserKategori([...selectedUserKategori, category]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!nama.trim()) return alert("Nama Lengkap Pelapor wajib diisi!");
    if (!judul.trim()) return alert("Judul Laporan wajib diisi!");
    if (!wilayah.trim()) return alert("Wilayah wajib diisi!");
    if (!waktuPengamatan) return alert("Waktu Pengamatan wajib ditentukan!");
    if (selectedUserKategori.length === 0) return alert("Pilih minimal satu Kategori Pengguna!");

    const finalTypeUser = selectedUserKategori.join(", ");
    const finalRiverName = selectedRiverName === "Lainnya" ? customRiverName : selectedRiverName;
    if (!finalRiverName.trim()) return alert("Pilih atau isi Nama Aliran Sungai!");

    const isAllScoresFilled = Object.values(scores).every((score) => score !== "");
    if (!isAllScoresFilled) {
      return alert("Harap isi seluruh pertanyaan Indikator Evaluasi Ekologis!");
    }

    if (!selectedFile) return alert("Silakan unggah foto/video bukti lapangan!");
    if (!keteranganEkologis.trim()) return alert("Keterangan Tambahan wajib diisi!");
    if (!agreed) return alert("Anda harus menyetujui pernyataan validitas data.");

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        setLoading(false);
        setMessage({
          type: "error",
          text: "Sesi login Anda tidak ditemukan. Silakan login terlebih dahulu.",
        });
        return;
      }

      const userEmail = session.user.email;
      const [lat, lng] = markerPosition;

      const isWater = await checkIfOnWater(lat, lng);
      if (!isWater) {
        setLoading(false);
        setMessage({
          type: "error",
          text: "Lokasi tidak valid! Titik koordinat terdeteksi di daratan. Silakan geser marker ke area sungai.",
        });
        return;
      }

      let imageUrl = null;
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("report-images")
          .upload(fileName, selectedFile);

        if (uploadError) throw new Error("Gagal mengunggah bukti: " + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("report-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("reports").insert([
        {
          user_email: userEmail,
          title: judul,
          user_name: nama,
          user_type: finalTypeUser,
          description: keteranganEkologis,
          latitude: lat,
          longitude: lng,
          image_url: imageUrl,
          status: "pending",
          river_name: finalRiverName,
          wilayah: wilayah,
          waktu_pengamatan: waktuPengamatan,
          ecological_score: {
            sub_index_do: subIndexDO,
            sub_index_metal: subIndexMetal,
            wqi_total: totalWQI,
            kategori: statusObj.label,
            color_indicator: statusObj.color,
            raw_details: scores,
          },
          journal_reference: selectedJournal
            ? {
                id_lokasi: selectedJournal.id_lokasi,
                nama_sungai: selectedJournal.nama_sungai,
                segmen: selectedJournal.segmen,
                sumber: selectedJournal.sumber_jurnal,
                parameter: journalParams,
              }
            : null,
        },
      ]);

      if (insertError) throw insertError;

      setMessage({
        type: "success",
        text: "Laporan ekologis sungai berhasil dikirim! Titik lokasi perairan Anda telah tervalidasi.",
      });

      resetForm();
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "Terjadi kesalahan saat menyimpan data.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#008000] p-4 md:p-8 flex justify-center items-center font-sans">
      <div className="w-full max-w-4xl bg-[#FDF1CE] rounded-2xl shadow-2xl p-6 md:p-10 my-6">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-[#A52A2A]/20 pb-6">
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-wide text-[#A52A2A]">
            Laporan Pemetaan Ekologis Sungai
          </h1>
          <p className="text-xs md:text-sm text-gray-700 font-semibold mt-1">
            Formulir survei bioindikator populasi ikan sapu-sapu & Evaluasi Kualitas Air Sungai
          </p>
        </div>

        {message.text && (
          <div
            className={`p-4 mb-6 rounded-lg flex items-center gap-3 text-sm font-semibold shadow-sm ${
              message.type === "success"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. DATA IDENTITAS */}
          <div className="bg-white/70 p-5 rounded-xl border border-amber-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#A52A2A] flex items-center gap-2 border-b pb-2">
              <FileText className="w-5 h-5" /> 1. DATA IDENTITAS & INFORMASI PENGAMATAN
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1">Nama Lengkap Pelapor</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Naufal Yudha"
                  className="w-full bg-white px-3 py-2 text-sm text-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Kategori Pengguna <span className="text-gray-500 font-normal">(Bisa pilih lebih dari satu)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white p-3 border rounded-lg shadow-sm">
                  {TYPE_USER.map((category, idx) => {
                    const isChecked = selectedUserKategori.includes(category);
                    return (
                      <label
                        key={idx}
                        className={`flex items-center gap-2 p-2.5 rounded-md border cursor-pointer transition-all ${
                          isChecked
                            ? "bg-green-100 border-green-600 font-semibold text-green-900"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleUserKategoriToggle(category)}
                          className="w-4 h-4 accent-green-700 rounded cursor-pointer"
                        />
                        <span className="text-xs">{category}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Judul Laporan Pengamatan</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="ex: Evaluasi Kualitas Air & Biomassa Sapu-Sapu"
                  className="w-full bg-white px-3 py-2 text-sm text-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Wilayah (Kecamatan / Kab / Kota)</label>
                  <input
                    type="text"
                    required
                    value={wilayah}
                    onChange={(e) => setWilayah(e.target.value)}
                    placeholder="Contoh: Ciracas, Depok"
                    className="w-full bg-white px-3 py-2 text-sm text-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Waktu Pengamatan</label>
                  <input
                    type="datetime-local"
                    required
                    value={waktuPengamatan}
                    onChange={(e) => setWaktuPengamatan(e.target.value)}
                    className="w-full bg-white px-3 py-2 text-sm text-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1 flex items-center gap-1">
                  <Waves className="w-4 h-4 text-blue-600" /> Pilih Nama Aliran Sungai
                </label>
                <select
                  required
                  value={selectedRiverName}
                  onChange={(e) => setSelectedRiverName(e.target.value)}
                  className="w-full bg-white px-3 py-2 text-sm font-semibold text-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer"
                >
                  <option value="">-- Pilih Nama Sungai --</option>
                  {RIVERS_LIST.map((r, idx) => (
                    <option key={idx} value={r}>{r}</option>
                  ))}
                </select>

                {selectedRiverName === "Lainnya" && (
                  <input
                    type="text"
                    required
                    value={customRiverName}
                    onChange={(e) => setCustomRiverName(e.target.value)}
                    placeholder="Masukkan nama sungai lainnya..."
                    className="w-full mt-2 bg-white px-3 py-2 text-sm text-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                )}
              </div>
            </div>
          </div>

          {/* 2. PETA INTERAKTIF */}
          <div className="bg-white/70 p-5 rounded-xl border border-amber-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-2">
              <h2 className="text-base font-bold text-[#A52A2A] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" /> 2. TITIK LOKASI PENGAMATAN PERSIS
              </h2>

              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={gettingLocation}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {gettingLocation ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
                Gunakan GPS Saya Saat Ini
              </button>
            </div>

            <div className="bg-[#D9D7C7] p-3 rounded-3xl border-4 border-[#C1BD9C] shadow-inner">
              <div className="w-full h-80 rounded-2xl overflow-hidden border border-gray-300 shadow-sm relative z-0">
                <MapContainer center={markerPosition} zoom={11} scrollWheelZoom={true} className="w-full h-full">
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />
                  <MapRecenter lat={markerPosition[0]} lng={markerPosition[1]} />
                  <LocationPickerMarker position={markerPosition} setPosition={setMarkerPosition} />
                  {rivers.map((river, idx) => (
                    <Polyline key={idx} positions={river.path} pathOptions={{ color: "#0284c7", weight: 5, opacity: 0.85 }}>
                      <Tooltip permanent direction="center" className="bg-white/90 text-sky-900 font-bold text-[10px] px-1.5 py-0.5 rounded border border-sky-300 shadow-sm">
                        {river.name}
                      </Tooltip>
                    </Polyline>
                  ))}
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" />
                </MapContainer>
              </div>

              <div className="mt-3 bg-white/80 backdrop-blur px-4 py-2 rounded-xl flex justify-between items-center text-xs font-mono font-bold text-gray-700 border border-amber-200">
                <span>Lat: {markerPosition[0].toFixed(6)}</span>
                <span>Lng: {markerPosition[1].toFixed(6)}</span>
              </div>
            </div>
          </div>

          {/* 3. INDIKATOR EVALUASI EKOLOGIS (10 SOAL) */}
          <div className="bg-white/70 p-5 rounded-xl border border-amber-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-[#A52A2A] flex items-center gap-2 border-b pb-2">
              <Activity className="w-5 h-5" /> 3. INDIKATOR EVALUASI EKOLOGI SUNGAI
            </h2>

            {/* SUB-BAGIAN 1: DO */}
            <div className="space-y-4 bg-sky-50/50 p-4 rounded-lg border border-sky-200">
              <h3 className="text-sm font-black text-sky-900 uppercase flex items-center gap-2">
                <Waves className="w-4 h-4 text-sky-600" /> A. Indikator Oksigen Terlarut (DO) & Fisik Air
              </h3>
              {ECOLOGICAL_QUESTIONS.filter(q => q.category === "DO").map((ind) => (
                <div key={ind.id} className="space-y-1 text-xs md:text-sm bg-white p-3 rounded border border-sky-100">
                  <label className="font-bold text-gray-900 block">{ind.label}</label>
                  <select
                    required
                    value={scores[ind.id]}
                    onChange={(e) => setScores({ ...scores, [ind.id]: e.target.value })}
                    className="w-full mt-1 bg-gray-50 p-2 border rounded font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-600 cursor-pointer"
                  >
                    <option value="">-- Pilih Jawaban Indikator --</option>
                    {ind.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* SUB-BAGIAN 2: LOGAM BERAT */}
            <div className="space-y-4 bg-amber-50/50 p-4 rounded-lg border border-amber-200">
              <h3 className="text-sm font-black text-amber-900 uppercase flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" /> B. Indikator Potensi Cemaran Logam Berat & Sedimen
              </h3>
              {ECOLOGICAL_QUESTIONS.filter(q => q.category === "LOGAM").map((ind) => (
                <div key={ind.id} className="space-y-1 text-xs md:text-sm bg-white p-3 rounded border border-amber-100">
                  <label className="font-bold text-gray-900 block">{ind.label}</label>
                  <select
                    required
                    value={scores[ind.id]}
                    onChange={(e) => setScores({ ...scores, [ind.id]: e.target.value })}
                    className="w-full mt-1 bg-gray-50 p-2 border rounded font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-600 cursor-pointer"
                  >
                    <option value="">-- Pilih Jawaban Indikator --</option>
                    {ind.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* RINGKASAN SKOR WQI & SUB-INDEKS */}
            <div className="p-4 bg-white rounded-lg border shadow-inner space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center border-b pb-3">
                <div className="bg-sky-50 p-2 rounded border border-sky-200">
                  <span className="text-[11px] font-bold text-sky-800 block uppercase">OKSIGEN TERLARUT (DO):</span>
                  <span className="text-xl font-black text-sky-900">{subIndexDO} / 100</span>
                </div>
                <div className="bg-amber-50 p-2 rounded border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-800 block">LOGAM BERAT (Pb, Hg, Cd):</span>
                  <span className="text-xl font-black text-amber-900">{subIndexMetal} / 100</span>
                </div>
                <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 block uppercase">Total Rata-Rata:</span>
                  <span className="text-xl font-black text-emerald-900">{totalWQI} / 100</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                <span className="text-xs font-bold text-gray-600 uppercase">Kategori Kualitas Air:</span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-black border ${statusObj.badge}`}>
                  {statusObj.label}
                </span>
              </div>
            </div>
          </div>

          {/* 4. MEDIA & CATATAN */}
          <div className="bg-white/70 p-5 rounded-xl border border-amber-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#A52A2A] flex items-center gap-2 border-b pb-2">
              <Download className="w-5 h-5" /> 4. BUKTI UNGGAH FOTO/VIDEO & CATATAN
            </h2>

            <div>
              <label className="block text-xs font-bold text-black mb-2">Unggah Foto/Video Bukti Lapangan</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />

              <div onClick={() => fileInputRef.current?.click()} className="w-full bg-[#2E4A47] p-4 rounded cursor-pointer hover:bg-[#233a38] transition-colors">
                <div className="border-2 border-dashed border-sky-200 bg-[#E8F1F5] py-6 px-4 flex flex-col items-center justify-center rounded">
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      {previewUrl ? (
                        <div className="relative mb-2">
                          <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg border-2 border-green-600 shadow-md" />
                          <button type="button" onClick={handleRemoveFile} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <ImageIcon className="w-10 h-10 text-green-600 mb-1" />
                      )}
                      <span className="text-green-700 font-bold flex items-center gap-1 text-xs md:text-sm">
                        <CheckCircle2 className="w-4 h-4" /> Terpilih: {selectedFile.name}
                      </span>
                    </div>
                  ) : (
                    <>
                      <Download className="w-8 h-8 text-gray-500 mb-2" />
                      <p className="text-xs md:text-sm text-black font-semibold text-center">
                        Klik untuk memilih file <span className="text-gray-500 font-normal">(Maks 10MB)</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Keterangan Tambahan Dampak Ekologis Sungai</label>
              <textarea
                rows="3"
                required
                value={keteranganEkologis}
                onChange={(e) => setKeteranganEkologis(e.target.value)}
                placeholder="Deskripsikan temuan kondisi fisik atau dampak spesifik di lokasi..."
                className="w-full bg-white px-3 py-2 text-sm text-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              ></textarea>
            </div>
          </div>

          {/* FOOTER & SUBMIT */}
          <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <label className="flex items-start gap-3 cursor-pointer max-w-xl">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-green-700 cursor-pointer flex-shrink-0"
              />
              <span className="text-xs md:text-sm font-bold text-black leading-tight">
                Saya berusia (diatas 15 tahun) dan menyatakan dengan sebenar-benarnya bahwa data ekologis yang saya kirimkan bersifat valid serta sesuai lokasi pengamatan di lapangan.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-[#008000] hover:bg-green-800 disabled:bg-gray-400 text-white font-extrabold px-8 py-3 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm cursor-pointer"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Mengirim...</> : "Submit Laporan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}