import React, { useState, useRef, useEffect } from "react";

{/* import { rivers } from '../data/riverData'; */}

import { supabase } from "../supabaseClient";
import { JOURNAL_DATA } from "../data/journalData";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Polyline, Tooltip } from "react-leaflet";
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
  Crosshair
} from "lucide-react";


// iseng nambahin
// Data Koordinat Vektor Sungai Jakarta
const rivers = [
  {
    name: "Kali Angke",
    path: [
      [-6.3200, 106.7100],
      [-6.2600, 106.7200],
      [-6.2000, 106.7350],
      [-6.1500, 106.7450],
      [-6.1100, 106.7300]
    ]
  },
  {
    name: "Kali Pesanggrahan",
    path: [
      [-6.3400, 106.7600],
      [-6.2800, 106.7650],
      [-6.2200, 106.7700],
      [-6.1700, 106.7620],
      [-6.1200, 106.7550]
    ]
  },
  {
    name: "Sungai Ciliwung",
    path: [
      [-6.3500, 106.8350],
      [-6.2900, 106.8450],
      [-6.2300, 106.8520],
      [-6.1800, 106.8380],
      [-6.1200, 106.8300]
    ]
  },
  {
    name: "Kali Sunter",
    path: [
      [-6.3200, 106.9000],
      [-6.2500, 106.8950],
      [-6.1900, 106.8900],
      [-6.1400, 106.8850],
      [-6.1000, 106.8950]
    ]
  },
  {
    name: "Sungai Cisadane",
    path: [
      [-6.3300, 106.6400],
      [-6.2500, 106.6300],
      [-6.1700, 106.6200],
      [-6.1000, 106.6400]
    ]
  }
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

// Daftar Nama Sungai Umum
const RIVERS_LIST = [
  "Sungai Ciliwung",
  "Sungai Cisadane",
  "Kali Pesanggrahan",
  "Kali Sunter",
  "Kali Angke"
];   

// Helper Component untuk Menggeser Tampilan Peta
function MapRecenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 11);
    }
  }, [lat, lng, map]);
  return null;
}

// Helper Component untuk Menangani Klik/Drag Marker
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

// Indikator Evaluasi Ekologis
const ECOLOGICAL_INDICATORS = [
  {
    id: "ind1",
    label: "1. Kepadatan Ikan Sapu-Sapu (Bioindikator Utama):",
    description: "Bagaimana tingkat populasi/keberadaan ikan sapu-sapu di lokasi ini?",
    options: [
      { value: 1, label: "Tidak ada sama sekali / Sangat jarang" },
      { value: 3, label: "Ada beberapa, tetapi bercampur seimbang dengan jenis ikan lain" },
      { value: 5, label: "Sangat mendominasi, hampir tidak terlihat jenis ikan lain" }
    ]
  },
  {
    id: "ind2",
    label: "2. Keberadaan Ikan Lokal (Bioindikator Sensitif):",
    description: "Apakah Anda masih melihat ikan lokal (seperti mujair, nilem, wader, atau gabus) hidup bebas?",
    options: [
      { value: 1, label: "Ya, masih banyak dan bervariasi" },
      { value: 3, label: "Jarang sekali terlihat" },
      { value: 5, label: "Tidak ada sama sekali / Sudah tidak ditemukan di titik ini" }
    ]
  },
  {
    id: "ind3",
    label: "3. Warna Air (Indikator Fisik):",
    description: "Apa warna air sungai secara kasat mata saat ini?",
    options: [
      { value: 1, label: "Jernih atau kecokelatan alami (lumpur sungai normal)" },
      { value: 3, label: "Keruh keputihan (tampak seperti sisa air sabun/detergen)" },
      { value: 5, label: "Hitam pekat atau hijau gelap berlendir" }
    ]
  },
  {
    id: "ind4",
    label: "4. Bau Air (Indikator Fisik):",
    description: "Bagaimana aroma atau bau air sungai di sekitar lokasi pengamatan?",
    options: [
      { value: 1, label: "Tidak berbau / Alami" },
      { value: 3, label: "Berbau kurang sedap / Apek saat angin berembus" },
      { value: 5, label: "Berbau sangat menyengat (seperti busuk, got, atau bahan kimia)" }
    ]
  },
  {
    id: "ind5",
    label: "5. Sumber Polutan Sekitar (Indikator Aktivitas):",
    description: "Apa aktivitas pembuangan limbah terdekat yang paling menonjol?",
    options: [
      { value: 1, label: "Tidak ada buangan limbah langsung" },
      { value: 3, label: "Banyak tumpukan sampah domestik / rumah tangga" },
      { value: 5, label: "Ada pipa pembuangan langsung dari pabrik, bengkel, atau industri" }
    ]
  }
];

export default function Report() {
  // Identitas & Info Umum
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [judul, setJudul] = useState("");
  const [wilayah, setWilayah] = useState("");
  const [waktuPengamatan, setWaktuPengamatan] = useState("");

  // Pilihan Sungai & Koordinat
  const [selectedRiverName, setSelectedRiverName] = useState("");
  const [customRiverName, setCustomRiverName] = useState("");
  const [markerPosition, setMarkerPosition] = useState([-6.204043, 106.812515]);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Jurnal Rujukan
  const [selectedLokasiId, setSelectedLokasiId] = useState("");
  const [selectedJournal, setSelectedJournal] = useState(null);

  // Parameter Kimia Terisi Otomatis
  const [journalParams, setJournalParams] = useState({
    ph: "-",
    do_value: "-",
    pb: "-",
    hg: "-",
    cd: "-"
  });

  // Indikator Evaluasi Ekologis (Default Kosong/Unselected untuk Memaksa User Memilih)
  const [scores, setScores] = useState({
    ind1: "",
    ind2: "",
    ind3: "",
    ind4: "",
    ind5: ""
  });

  // Media & Catatan
  const [keteranganEkologis, setKeteranganEkologis] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [agreed, setAgreed] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);

  // Preview Image Handler
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

  // Total Skor Ekologis
  const totalSkor = Object.values(scores).reduce((a, b) => Number(a || 0) + Number(b || 0), 0);

  const getStatusKualitas = (score) => {
    if (score === 0) return { label: "Belum Lengkap", color: "#9CA3AF", badge: "bg-gray-100 text-gray-700 border-gray-300" };
    if (score <= 9) return { label: "Sangat Baik (Kondisi Alami)", color: "#10B981", badge: "bg-emerald-100 text-emerald-800 border-emerald-300" };
    if (score <= 15) return { label: "Tercemar Ringan (Perlu Pengawasan)", color: "#FBBF24", badge: "bg-amber-100 text-amber-800 border-amber-300" };
    if (score <= 20) return { label: "Tercemar Sedang (Perlu Konservasi)", color: "#F97316", badge: "bg-orange-100 text-orange-800 border-orange-300" };
    return { label: "Tercemar Berat (Kondisi Kritis / Bahaya)", color: "#EF4444", badge: "bg-red-100 text-red-800 border-red-300" };
  };

  const statusObj = getStatusKualitas(totalSkor);

  // Helper Verifikasi Lokasi Perairan via Overpass API (Teroptimasi)
 const checkIfOnWater = async (lat, lng) => {
   // 1. Abort Controller untuk cegah hang (timeout 5 detik)
   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), 4000);
 
   // 2. Gunakan Delta lebih kecil (~0.0004 atau radius ~40-50 meter agar tidak meloloskan daratan di sekitar sungai)
   const delta = 1.5000; 
   
   const query = `
     [out:json][timeout:10];
     (
       node["natural"="water"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
       way["natural"="water"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
       way["waterway"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
       relation["waterway"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
     );
     out count;
   `;
 
   try {
     const res = await fetch("https://overpass-api.de/api/interpreter", {
       method: "POST",
       body: "data=" + encodeURIComponent(query),
       headers: {
         "Content-Type": "application/x-www-form-urlencoded",
       },
       signal: controller.signal,
     });
 
     clearTimeout(timeoutId);
 
     if (!res.ok) {
       throw new Error(`Server Overpass bermasalah (Status: ${res.status})`);
     }
 
     const data = await res.json();
 
     // Jika ada elemen perairan/sungai terdeteksi di koordinat tersebut
     const isWater = data.elements && data.elements.length > 0;
     return isWater;
 
   } catch (err) {
     console.warn("Validasi Overpass API gagal/timeout:", err.message);
 
     // 3. FALLBACK AMAN: Jika Overpass API timeout/down, 
     // Gunakan fungsi hitung jarak lokal (isPointNearRiver) dari array 'rivers' bawaan aplikasi
     if (typeof isPointNearRiver === "function" && typeof rivers !== "undefined") {
       return isPointNearRiver(lat, lng, rivers, 0.5); // Toleransi 500 meter dari vektor lokal
     }
 
     // Jika tidak ada data lokal, kembalikan false agar daratan TIDAK lolos otomatis
     return false; 
   }
 };

  // Ambil Lokasi GPS Perangkat
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
        console.error(err);
        alert("Gagal mengambil lokasi. Pastikan GPS aktif dan izin akses diberikan.");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Handler Pilihan Jurnal
  const handleJournalSelect = (e) => {
    const id = e.target.value;
    setSelectedLokasiId(id);

    const journal = JOURNAL_DATA.find((item) => item.id_lokasi === id);
    if (journal) {
      setSelectedJournal(journal);
      const params = journal.parameter_kimia;
      const pbVal = params.logam_berat?.Pb?.nilai ?? params.logam_berat?.Pb?.nilai_min ?? null;
      const hgVal = params.logam_berat?.Hg?.nilai ?? null;
      const cdVal = params.logam_berat?.Cd?.nilai ?? null;

      setJournalParams({
        ph: params.pH?.nilai !== undefined && params.pH?.nilai !== null ? `${params.pH.nilai} ${params.pH.satuan || ""}` : "Tidak diteliti",
        do_value: params.DO?.nilai !== undefined && params.DO?.nilai !== null ? `${params.DO.nilai} ${params.DO.satuan || ""}` : "Tidak diteliti",
        pb: pbVal !== null ? `${pbVal} mg/L` : "Tidak diteliti",
        hg: hgVal !== null ? `${hgVal} mg/L` : "Tidak diteliti",
        cd: cdVal !== null ? `${cdVal} mg/L` : "Tidak diteliti"
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
    setEmail("");
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
    setScores({ ind1: "", ind2: "", ind3: "", ind4: "", ind5: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validasi Kelengkapan Pertanyaan
    if (!nama.trim()) return alert("Nama Lengkap Pelapor wajib diisi!");
    if (!email.trim()) return alert("Alamat Email wajib diisi!");
    if (!judul.trim()) return alert("Judul Laporan wajib diisi!");
    if (!wilayah.trim()) return alert("Wilayah (Kecamatan/Kab/Kota) wajib diisi!");
    if (!waktuPengamatan) return alert("Waktu Pengamatan wajib ditentukan!");
    
    const finalRiverName = selectedRiverName === "Lainnya" ? customRiverName : selectedRiverName;
    if (!finalRiverName.trim()) return alert("Pilih atau isi Nama Aliran Sungai!");

    // Validasi Indikator Evaluasi Ekologis Terisi Semua
    const isAllScoresFilled = Object.values(scores).every((score) => score !== "");
    if (!isAllScoresFilled) {
      return alert("Harap isi seluruh 5 pertanyaan Indikator Evaluasi Ekologis!");
    }

    if (!selectedFile) return alert("Silakan unggah foto/video bukti lapangan!");
    if (!keteranganEkologis.trim()) return alert("Keterangan Tambahan Dampak Ekologis wajib diisi!");
    if (!agreed) return alert("Anda harus menyetujui pernyataan validitas data.");

    setLoading(true);

    try {
      const [lat, lng] = markerPosition;

      // Check Validasi Apakah Titik Peta Berada di Sungai/Perairan
      const isWater = await checkIfOnWater(lat, lng);
      if (!isWater) {
        setLoading(false);
        setMessage({
          type: "error",
          text: "Lokasi tidak valid! Titik koordinat yang Anda pilih terdeteksi di daratan. Silakan geser marker ke area sungai atau perairan."
        });
        return;
      }

      let imageUrl = null;

      // 1. Upload Gambar ke Supabase Storage
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

      // 2. Simpan ke Supabase Database
      const { error: insertError } = await supabase.from("reports").insert([
        {
          title: judul,
          user_name: nama,
          user_email: email,
          description: keteranganEkologis,
          latitude: lat,
          longitude: lng,
          image_url: imageUrl,
          status: "pending",
          river_name: finalRiverName,
          wilayah: wilayah,
          waktu_pengamatan: waktuPengamatan,
          ecological_score: {
            score_total: totalSkor,
            kategori: statusObj.label,
            color_indicator: statusObj.color,
            details: scores
          },
          journal_reference: selectedJournal ? {
            id_lokasi: selectedJournal.id_lokasi,
            nama_sungai: selectedJournal.nama_sungai,
            segmen: selectedJournal.segmen,
            sumber: selectedJournal.sumber_jurnal,
            parameter: journalParams
          } : null
        }
      ]);

      if (insertError) throw insertError;

      setMessage({
        type: "success",
        text: "Laporan ekologis sungai berhasil dikirim! Titik lokasi perairan Anda telah tervalidasi."
      });

      resetForm();

    } catch (err) {
      console.error(err);
      setMessage({ 
        type: "error", 
        text: err.message || "Terjadi kesalahan saat menyimpan data." 
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
          <div className="flex justify-center items-center gap-2 text-[#A52A2A] mb-1">
            <Waves className="w-8 h-8" />
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-wide">
              Laporan Pemetaan Ekologis Sungai
            </h1>
          </div>
          <p className="text-xs md:text-sm text-gray-700 font-semibold">
            Formulir survei bioindikator populasi ikan sapu-sapu & pemetaan lokasi real-time
          </p>
        </div>

        {/* Notifikasi Message */}
        {message.text && (
          <div className={`p-4 mb-6 rounded-lg flex items-center gap-3 text-sm font-semibold shadow-sm ${
            message.type === "success" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-red-100 text-red-800 border border-red-300"
          }`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ─── 1. DATA IDENTITAS & INFORMASI PENGAMATAN ─── */}
          <div className="bg-white/70 p-5 rounded-xl border border-amber-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#A52A2A] flex items-center gap-2 border-b pb-2">
              <FileText className="w-5 h-5" /> 1. DATA IDENTITAS & INFORMASI PENGAMATAN
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1">Nama Lengkap Pelapor *</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Ahmad Subagja"
                  className="w-full bg-white px-3 py-2 text-sm text-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Alamat Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ahmad@example.com"
                  className="w-full bg-white px-3 py-2 text-sm text-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-black mb-1">Judul Laporan Pengamatan *</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="ex: Temuan Kelimpahan Ikan Sapu-Sapu di Bantaran Sungai"
                  className="w-full bg-white px-3 py-2 text-sm text-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Wilayah (Kecamatan / Kab / Kota) *</label>
                <input
                  type="text"
                  required
                  value={wilayah}
                  onChange={(e) => setWilayah(e.target.value)}
                  placeholder="Contoh: Pancoran Mas, Depok"
                  className="w-full bg-white px-3 py-2 text-sm text-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Waktu Pengamatan *</label>
                <input
                  type="datetime-local"
                  required
                  value={waktuPengamatan}
                  onChange={(e) => setWaktuPengamatan(e.target.value)}
                  className="w-full bg-white px-3 py-2 text-sm text-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-black mb-1 flex items-center gap-1">
                  <Waves className="w-4 h-4 text-blue-600" /> Pilih Nama Aliran Sungai *
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


          {/* ─── 2. DESAIN PETA INTERAKTIF KONSISTEN DENGAN LAYOUT MAP DISAMPING ─── */}
          <div className="bg-white/70 p-5 rounded-xl border border-amber-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-2">
              <h2 className="text-base font-bold text-[#A52A2A] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" /> 2. TITIK LOKASI PENGAMATAN PERSIS (PETA INTERAKTIF)
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
          
            <p className="text-xs text-gray-600 italic">
              *Geser marker atau klik pada peta. Laporan <strong>wajib berada di titik sungai/perairan</strong> (bukan daratan).
            </p>
          
            {/* Frame Peta Disesuaikan dengan Halaman Peta Utama */}
            <div className="bg-[#D9D7C7] p-3 rounded-3xl border-4 border-[#C1BD9C] shadow-inner">
              <div className="w-full h-80 rounded-2xl overflow-hidden border border-gray-300 shadow-sm relative z-0">
                <MapContainer
                  center={markerPosition || [-6.204043, 106.812515]} // Default Center Jakarta
                  zoom={11} // Level zoom 11 pas menampilkan se-Jakarta (tidak terlalu dekat/jauh)
                  tap={false}
                  scrollWheelZoom={true}
                  className="w-full h-full"
                >
                  {/* TileLayer Base Map (Light No Labels) */}
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                  />
          
                  {/* Dynamic Recenter & Marker Terpilih */}
                  <MapRecenter lat={markerPosition[0]} lng={markerPosition[1]} />
                  <LocationPickerMarker position={markerPosition} setPosition={setMarkerPosition} />
          
                  {/* Rendering Aliran Sungai Biru Tebal (Sama seperti Map.jsx) */}
                  {rivers && rivers.map((river, idx) => (
                    <Polyline
                      key={idx}
                      positions={river.path}
                      pathOptions={{
                        color: "#0284c7", // Warna biru terang/tebal
                        weight: 5,         // Ketebalan garis agar terlihat jelas
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
          
                  {/* TileLayer Label Jalan & Nama Tempat di Atas Garis Sungai */}
                  <TileLayer 
                    url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" 
                  />
                </MapContainer>
              </div>
          
              {/* Readout Koordinat Terpilih */}
              <div className="mt-3 bg-white/80 backdrop-blur px-4 py-2 rounded-xl flex justify-between items-center text-xs font-mono font-bold text-gray-700 border border-amber-200">
                <span>Latitude: {markerPosition[0].toFixed(6)}</span>
                <span>Longitude: {markerPosition[1].toFixed(6)}</span>
              </div>
            </div>
          </div>


          {/* ─── 3. REFERENSI JURNAL ILMIAH ─── */}
          <div className="bg-white/70 p-5 rounded-xl border border-amber-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-[#A52A2A] flex items-center gap-2 border-b pb-2">
              <BookOpen className="w-5 h-5" /> 3. REFERENSI JURNAL ILMIAH (OPSIONAL)
            </h2>

            <select
              value={selectedLokasiId}
              onChange={handleJournalSelect}
              className="w-full bg-white px-3 py-2 text-sm font-medium text-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer"
            >
              <option value="">-- Pilih Jurnal --</option>
              {JOURNAL_DATA.map((item) => (
                <option key={item.id_lokasi} value={item.id_lokasi}>
                  {item.nama_sungai} - {item.segmen} ({item.sumber_jurnal.penulis}, {item.sumber_jurnal.tahun})
                </option>
              ))}
            </select>

            {selectedJournal && (
              <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mt-2">
                <p className="text-xs font-bold text-amber-900 mb-2">
                  ⚡ Parameter Kimia Terisi Otomatis Berdasarkan Jurnal Ilmiah:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="bg-white p-2 rounded border">
                    <span className="text-gray-500 block">pH Air:</span>
                    <span className="font-bold text-gray-800">{journalParams.ph}</span>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="text-gray-500 block">DO (Oksigen):</span>
                    <span className="font-bold text-gray-800">{journalParams.do_value}</span>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="text-gray-500 block">Logam Pb:</span>
                    <span className="font-bold text-gray-800">{journalParams.pb}</span>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="text-gray-500 block">Logam Hg:</span>
                    <span className="font-bold text-gray-800">{journalParams.hg}</span>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="text-gray-500 block">Logam Cd:</span>
                    <span className="font-bold text-gray-800">{journalParams.cd}</span>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* ─── 4. INDIKATOR EVALUASI EKOLOGIS ─── */}
          <div className="bg-white/70 p-5 rounded-xl border border-amber-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#A52A2A] flex items-center gap-2 border-b pb-2">
              <Activity className="w-5 h-5" /> 4. INDIKATOR EVALUASI KEPADATAN & EKOLOGI SUNGAI (WAJIB ALL)
            </h2>

            {ECOLOGICAL_INDICATORS.map((ind) => (
              <div key={ind.id} className="space-y-1 text-xs md:text-sm">
                <label className="font-bold text-gray-900 block">{ind.label} *</label>
                <p className="text-gray-600 italic">{ind.description}</p>
                <select
                  required
                  value={scores[ind.id]}
                  onChange={(e) => setScores({ ...scores, [ind.id]: e.target.value })}
                  className="w-full bg-white p-2 border rounded font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer"
                >
                  <option value="">-- Pilih Jawaban Indikator --</option>
                  {ind.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className="mt-4 p-4 bg-white rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Total Skor Ekologis:</p>
                <p className="text-2xl font-black text-gray-800">{totalSkor} / 25</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status Kualitas Air:</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusObj.badge}`}>
                  {statusObj.label}
                </span>
              </div>
            </div>
          </div>


          {/* ─── 5. BUKTI MEDIA & CATATAN ─── */}
          <div className="bg-white/70 p-5 rounded-xl border border-amber-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#A52A2A] flex items-center gap-2 border-b pb-2">
              <Download className="w-5 h-5" /> 5. BUKTI UNGGAH FOTO/VIDEO & CATATAN
            </h2>

            <div>
              <label className="block text-xs font-bold text-black mb-2">Unggah Foto/Video Bukti Lapangan *</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*"
              />
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-[#2E4A47] p-4 rounded cursor-pointer hover:bg-[#233a38] transition-colors"
              >
                <div className="border-2 border-dashed border-sky-200 bg-[#E8F1F5] py-6 px-4 flex flex-col items-center justify-center rounded">
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      {previewUrl ? (
                        <div className="relative mb-2">
                          <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg border-2 border-green-600 shadow-md" />
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <ImageIcon className="w-10 h-10 text-green-600 mb-1" />
                      )}
                      <span className="text-green-700 font-bold flex items-center gap-1 text-xs md:text-sm">
                        <CheckCircle2 className="w-4 h-4" /> Terpilih: {selectedFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-xs text-red-600 font-bold hover:underline mt-1"
                      >
                        Ganti File
                      </button>
                    </div>
                  ) : (
                    <>
                      <Download className="w-8 h-8 text-gray-500 mb-2" />
                      <p className="text-xs md:text-sm text-black font-semibold text-center">
                        Klik untuk memilih file <span className="text-gray-500 font-normal">(Foto atau Video, maks 10MB)</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                Keterangan Tambahan Dampak Ekologis Sungai *
              </label>
              <textarea
                rows="3"
                required
                value={keteranganEkologis}
                onChange={(e) => setKeteranganEkologis(e.target.value)}
                placeholder="Deskripsikan dampak spesifik populasi ikan sapu-sapu di titik pengamatan ini..."
                className="w-full bg-white px-3 py-2 text-sm text-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              ></textarea>
            </div>
          </div>


          {/* ─── FOOTER & SUBMIT ─── */}
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
                Saya menyetujui bahwa data ekologis yang saya kirimkan bersifat valid dan sesuai lokasi pengamatan sebenarnya.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-[#008000] hover:bg-green-800 disabled:bg-gray-400 text-white font-extrabold px-8 py-3 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Memverifikasi & Mengirim...
                </>
              ) : (
                "Submit Laporan"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}