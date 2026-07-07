import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, MapPin, BookOpen, AlertCircle, Award } from "lucide-react";

// Pastikan file gambar ini ada di folder src/asset/ kamu
import sungaiImg from "../asset/sungai sapu-sapu.jpg";

export default function Home() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("ecoMapUser");
    if (!savedUser) {
      const timer = setTimeout(() => {
        setShowAuthModal(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#FDF1CE]/20 font-sans pb-12">
      {/* ─── HERO SECTION (SESUAI DESAIN GAMBAR) ─── */}
      <div className="relative w-full h-[420px] md:h-[500px] bg-[#008000] overflow-hidden flex items-center">
        {/* Konten Teks Kiri */}
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
            eksoskeleton sisa guna ikan sapu-sapu (<b>Plecostomus</b>) untuk perairan
            urban yang lebih sehat.
          </p>
        </div>

        {/* Bentuk Lengkungan Estetis Hijau Gelap (Wave Overlay) */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[60%] bg-[#1E4D2B] z-10 clip-wave hidden md:block"></div>

        {/* Foto Utama Latar Belakang (Mengakses folder src/asset) */}
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
        {/* Blok Pengantar Isu Viral */}
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
            {/* Kartu 1 */}
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

            {/* Kartu 2 */}
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

            {/* Kartu 3 */}
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

      {/* ─── MODAL OVERLAY (TETAP TERJAGA UTUH) ─── */}
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

      {/* Tambahan CSS Khusus untuk melengkungkan background kiri hero */}
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
