import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, MapPin, BookOpen, AlertCircle, Award, HelpCircle, X, ShieldAlert } from "lucide-react";

// Pastikan import supabase Client kamu sudah benar
import { supabase } from "../supabaseClient"; 

// Pastikan lokasi file gambar ini sesuai di folder projekmu
import sungaiImg from "../asset/sungai sapu-sapu.jpg";

export default function Home() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // ─── POPUP PANDUAN UTAMA ───
  const [showGuide, setShowGuide] = useState(true);

  // State pendukung fallback gambar
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // Memeriksa autentikasi user dari Supabase
    const checkUserAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Jika TIDAK ada session/user, tampilkan modal auth
      if (!session) {
        setShowAuthModal(true);
      } else {
        setShowAuthModal(false);
      }
    };

    checkUserAuth();

    // Listener untuk perubahan auth real-time (opsional, untuk memastikan sync saat login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setShowAuthModal(true);
      } else {
        setShowAuthModal(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Fungsi untuk menutup panduan hanya pada sesi tampilan saat ini
  const handleCloseGuide = () => {
    setShowGuide(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#FDF1CE]/20 font-sans pb-12 relative">
      
      {/* POPUP MODAL PANDUAN PENGGUNAAN WEBSITE */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden transform animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Header Popup */}
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-[#008000]/10 to-transparent">
              <div className="flex items-center gap-2 text-[#008000]">
                <HelpCircle size={22} className="animate-pulse" />
                <h2 className="text-base font-black tracking-tight">Panduan Eksplorasi EcoMap-Pleco</h2>
              </div>
              <button 
                onClick={handleCloseGuide}
                className="p-1.5 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-700 transition-colors"
                aria-label="Tutup Panduan"
              >
                <X size={20} />
              </button>
            </div>

            {/* Konten Utama Popup */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
              
              {/* Area Gambar Poster */}
              <div className="w-full h-52 bg-zinc-800 rounded-2xl overflow-hidden border border-neutral-200 shadow-inner relative group">
                {!imgError && (
                  <img 
                    src={sungaiImg} 
                    alt="Poster Panduan Website" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={() => setImgError(true)}
                  />
                )}

                {/* Overlay Informasi Gambar */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E4D2B]/90 to-[#008000]/70 p-6 flex flex-col justify-end text-white text-left space-y-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded w-fit">
                    Panduan Awal
                  </span>
                  <h3 className="text-lg font-black leading-tight">
                    Sinergi Komunitas Memantau Sungai Jakarta
                  </h3>
                  <p className="text-[11px] text-neutral-200">
                    Pantau kualitas air dan laporkan invasi ikan sapu-sapu demi kelestarian ekosistem lokal.
                  </p>
                </div>
              </div>

              {/* Fitur Utama Pemetaan Berdasarkan Pilar */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Cara Menggunakan Platform Ini:
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-xl space-y-1">
                    <MapPin size={18} className="text-[#008000]" />
                    <p className="text-xs font-bold text-neutral-800">1. Pantau Peta Zonasi</p>
                    <p className="text-[11px] text-neutral-600">Klik titik pantau di area Jakarta untuk melihat pH, DO, suhu, dan parameter logam berat.</p>
                  </div>

                  <div className="p-3 bg-blue-50/60 border border-blue-200/60 rounded-xl space-y-1">
                    <BookOpen size={18} className="text-blue-600" />
                    <p className="text-xs font-bold text-neutral-800">2. Akses Edukasi</p>
                    <p className="text-[11px] text-neutral-600">Pelajari pemanfaatan limbah eksoskeleton ikan sapu-sapu menjadi kitosan biopolimer.</p>
                  </div>

                  <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl space-y-1">
                    <ShieldAlert size={18} className="text-amber-600" />
                    <p className="text-xs font-bold text-neutral-800">3. Kirim Laporan</p>
                    <p className="text-[11px] text-neutral-600">Daftarkan akunmu dan laporkan titik sebaran luapan populasi di lapangan secara kolektif.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Popup */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end">
              <button 
                onClick={handleCloseGuide}
                className="bg-[#008000] hover:bg-[#006400] text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                Mulai Eksplorasi Website
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── HERO SECTION ─── */}
      <div className="relative w-full h-[420px] md:h-[500px] bg-[#008000] overflow-hidden flex items-center">
        <div className="absolute left-6 md:left-16 z-20 max-w-xl text-white space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#AFD14D] animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#AFD14D]">
              EcoMap-Pleco Project
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-sm">
            Menjaga Sungai,
            <br />
            Mengelola Invasif.
          </h1>
          <p className="text-sm md:text-base text-neutral-100/90 leading-relaxed font-medium">
            Sistem informasi pemetaan berkala dan edukasi ekologis limbah
            eksoskeleton sisa guna ikan sapu-sapu (<b>Pterygoplichthys</b>) untuk perairan
            urban yang lebih sehat.
          </p>
        </div>

        <div className="absolute inset-y-0 left-0 w-full md:w-[60%] bg-[#1E4D2B] z-10 clip-wave hidden md:block"></div>

        <div className="absolute inset-y-0 right-0 w-full md:w-[65%] h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#008000] via-[#008000]/60 to-transparent md:bg-gradient-to-r md:from-[#1E4D2B] md:via-transparent md:to-transparent z-10" />
          <img
            src={sungaiImg}
            alt="Kondisi Sungai dan Penangkapan Ikan Sapu-sapu"
            className="w-full h-full object-cover object-center scale-105 transform contrast-105"
          />
        </div>
      </div>

      {/* ─── KONTEN INTI RISET & NARASI ISU VIRAL ─── */}
      <div className="max-w-5xl mx-auto px-5 mt-12 space-y-12">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-neutral-200/60 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
              <AlertCircle size={14} /> Isu Lingkungan Terkini
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-neutral-800">
              Ledakan Populasi Plecostomus di Sungai Perkotaan
            </h2>
            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
              Beberapa bulan kebelakang, jagat maya dihebohkan oleh video viral
              koloni jutaan ikan sapu-sapu yang mendominasi aliran sungai hilir
              kota. Tanpa predator alami, ikan invasif ini merusak struktur
              tanggul tanah lumpur, menyingkirkan fauna endemik lokal, serta
              merugikan jaring-jaring nelayan tradisional.
            </p>
          </div>
          <div className="bg-[#FDF1CE] p-5 rounded-2xl border border-[#008000]/10 space-y-2 text-center md:text-left">
            <div className="text-xs font-bold text-[#008000] flex items-center justify-center md:justify-start gap-1">
              <Award size={15} /> Validasi Riset Ilmiah
            </div>
            <p className="text-[11px] text-neutral-700 leading-normal">
              Website ini dikembangkan untuk keperluan <b>Riset Akademis
              terpadu</b>, mengonversi data luapan populasi lapangan menjadi titik
              mitigasi, serta mengkaji potensi pemanfaatan organ tubuh ikan sapu-sapu.
            </p>
          </div>
        </div>

        {/* Tiga Pilar Kontribusi Fitur Utama */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-neutral-800">
              Bagaimana Kamu Bisa Berkontribusi?
            </h3>
            <p className="text-xs text-neutral-500">
              Mari ambil peran aktif dalam menjaga kestabilan ekosistem perairan
              kita melalui platform digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm hover:border-[#008000]/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#008000] flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                📍
              </div>
              <h4 className="font-bold text-sm text-neutral-800 mb-1">
                Eksplorasi Peta Zonasi
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Pantau pesebaran spesies invasif dan tingkat kerawanan ekologis
                sungai di sekitar wilayahmu secara aktual.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm hover:border-[#008000]/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#008000] flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                📖
              </div>
              <h4 className="font-bold text-sm text-neutral-800 mb-1">
                Pusat Edukasi & Biopolimer
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Pelajari morfologi pembeda antar spesies serta prosedur
                pemanfaatan kitosan biopolimer dari limbah sisik keras.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm hover:border-[#008000]/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#008000] flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                📢
              </div>
              <h4 className="font-bold text-sm text-neutral-800 mb-1">
                Pelaporan Lapangan Kolektif
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Kirimkan bukti temuan populasi sapu-sapu di sekitarmu untuk
                membantu akurasi basis data riset nasional.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODAL OVERLAY AUTH ─── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md transition-all duration-300">
          <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-2xl text-center transform scale-100 transition-transform border border-neutral-100">
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-[#008000]/10 text-[#008000] mb-4">
              <LogIn size={26} />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 mb-1">
              Yuk, Bergabung Bersama Kami!
            </h3>
            <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
              Untuk mengakses fitur pemetaan penuh, modul edukasi kitosan, dan
              sistem pelaporan, silakan daftarkan akunmu terlebih dahulu.
            </p>
            <button
              onClick={() => navigate("/profil")}
              className="w-full py-2.5 px-4 font-bold text-white bg-[#008000] hover:bg-[#006400] rounded-xl shadow-md transition-colors text-xs"
            >
              Masuk atau Daftar Sekarang
            </button>
          </div>
        </div>
      )}

      {/* Style Tambahan */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .clip-wave {
          clip-path: polygon(0 0, 100% 0, 78% 100%, 0% 100%);
        }
      `,
        }}
      />
    </div>
  );
}