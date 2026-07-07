import React, { useState, useRef } from "react";
import { Download, Waves } from "lucide-react"; // Ditambahkan icon Waves untuk sungai

export default function Report() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [judul, setJudul] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // 🌟 STATE BARU
  const [namaSungai, setNamaSungai] = useState(""); // Menyimpan sungai yang dipilih
  const [keteranganEkologis, setKeteranganEkologis] = useState(""); // Menyimpan deskripsi dampak

  // 🌟 CONTOH DATA SUNGAI INDONESIA (Sesuaikan dengan data array yang ada di petamu)
  const daftarSungai = [
    { id: 1, nama: "Sungai Ciliwung" },
    { id: 2, nama: "Sungai Jatiluhur (Citarum)" },
    { id: 3, nama: "Sungai Brantas" },
    { id: 4, nama: "Sungai Kapuas" },
    { id: 5, nama: "Sungai Musi" },
    { id: 6, nama: "Sungai Bengawan Solo" },
  ];

  const fileInputRef = useRef(null);

  const handleAreaClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaSungai) {
      alert("Silakan pilih lokasi nama sungai terlebih dahulu!");
      return;
    }
    if (!selectedFile) {
      alert("Silakan unggah bukti foto atau video terlebih dahulu!");
      return;
    }
    if (!keteranganEkologis.trim()) {
      alert("Silakan isi kolom keterangan dampak ekologis!");
      return;
    }
    if (!agreed) {
      alert("Anda harus menyetujui syarat dan ketentuan sebelum mengirim.");
      return;
    }

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("email", email);
    formData.append("judul", judul);
    formData.append("bukti", selectedFile);
    formData.append("lokasi_koordinat", "Jl. Srengseng Sawah No **");

    // 🌟 DATA BARU YANG DIKIRIM KE DATABASE/BACKEND
    formData.append("nama_sungai", namaSungai);
    formData.append("keterangan_ekologis", keteranganEkologis);

    try {
      const response = await fetch("https://api.websitemu.com/v1/laporan", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Laporan ekologis sungai berhasil disimpan ke database!");
        // Reset form area jika diperlukan
        setNamaSungai("");
        setKeteranganEkologis("");
        setSelectedFile(null);
      } else {
        alert("Gagal mengirim laporan ke server.");
      }
    } catch (error) {
      console.error("Error saat menghubungkan ke database:", error);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  return (
    <div className="min-h-screen bg-[#008000] p-4 md:p-8 flex justify-center items-center font-sans">
      <div className="w-full max-w-4xl bg-[#FDF1CE] rounded-lg shadow-xl p-6 md:p-10">
        <h1 className="text-2xl md:text-4xl font-bold text-[#A52A2A] text-center tracking-wide uppercase mb-8">
          Laporan Pemetaan Sungai
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama Lengkap */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-full md:w-1/4 font-bold text-black text-sm md:text-base mb-1 md:mb-0">
              Nama Lengkap:
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Simeone Estrada"
              className="w-full md:w-3/4 bg-white px-4 py-2 text-[#7F7F7F] placeholder-[#7F7F7F] focus:outline-none shadow-sm"
            />
          </div>

          {/* Alamat E-Mail */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-full md:w-1/4 font-bold text-black text-sm md:text-base mb-1 md:mb-0">
              Alamat E-Mail:
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="someone@example.com"
              className="w-full md:w-3/4 bg-white px-4 py-2 text-[#7F7F7F] placeholder-[#7F7F7F] focus:outline-none shadow-sm"
            />
          </div>

          {/* Judul Laporan */}
          <div className="flex flex-col md:flex-row md:items-start">
            <label className="w-full md:w-1/4 font-bold text-black text-sm md:text-base pt-2 mb-1 md:mb-0">
              Judul Laporan:
            </label>
            <textarea
              rows="2"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="ex: SAPU-MENYAPU : maraknya masyarakat di sekitar sungai jatiluhur terhadap invasif plecotacmus"
              className="w-full md:w-3/4 bg-white px-4 py-2 text-[#7F7F7F] placeholder-[#7F7F7F] text-sm italic focus:outline-none resize-none shadow-sm"
            />
          </div>

          {/* 🌟 TAMBAHAN: OPSI PILIHAN NAMA SUNGAI INDONESIA (Diletakkan di atas Lokasi Koordinat) */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-full md:w-1/4 font-bold text-black text-sm md:text-base mb-1 md:mb-0 flex items-center gap-1">
              Nama Aliran Sungai:
            </label>
            <div className="w-full md:w-3/4 relative">
              <select
                required
                value={namaSungai}
                onChange={(e) => setNamaSungai(e.target.value)}
                className="w-full bg-white px-4 py-2.5 text-neutral-700 font-medium focus:outline-none shadow-sm appearance-none border-r-8 border-transparent cursor-pointer"
              >
                <option value="" disabled>
                  -- Klik untuk Pilih Sungai Berdasarkan Data Peta --
                </option>
                {daftarSungai.map((sungai) => (
                  <option key={sungai.id} value={sungai.nama}>
                    {sungai.nama}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Lokasi Yang Dilaporkan */}
          <div className="flex flex-col md:flex-row md:items-start">
            <label className="w-full md:w-1/4 font-bold text-black text-sm md:text-base pt-1 mb-2 md:mb-0">
              Lokasi Detail Koordinat:
            </label>

            <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1 border-2 border-dashed border-gray-400 h-32 bg-sky-100 flex items-center justify-center relative overflow-hidden shadow-sm">
                <span className="text-xs text-gray-500 font-semibold px-2 text-center">
                  [ Map ]
                </span>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600 font-bold text-lg">
                  📍
                </div>
              </div>

              <div className="sm:col-span-2 bg-white p-4 text-[#7F7F7F] text-xs sm:text-sm italic flex items-center shadow-sm">
                <p>
                  ex: Jl. Srengseng Sawah No ** ***************** <br />
                  <span className="not-italic text-gray-500">
                    (nama alamat tertulis otomatis berasal dari titik poin yang
                    diacuh)
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Bukti Foto/Video */}
          <div className="pt-2 flex flex-col items-center">
            <label className="font-bold text-black text-sm md:text-base mb-3 text-center">
              Bukti Foto/Video:
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,video/*"
            />

            <div
              onClick={handleAreaClick}
              className="w-full max-w-lg bg-[#2E4A47] p-5 rounded-sm shadow-inner cursor-pointer"
            >
              <div className="border-2 border-dashed border-sky-200 bg-[#E8F1F5] py-8 px-4 flex flex-col items-center justify-center hover:bg-sky-50 transition-colors">
                <Download className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-xs md:text-sm text-black font-semibold text-center">
                  {selectedFile ? (
                    <span className="text-green-700 font-bold">
                      Terpilih: {selectedFile.name}
                    </span>
                  ) : (
                    <>
                      Choose a file{" "}
                      <span className="font-normal text-gray-600">
                        or drag it here.
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* 🌟 TAMBAHAN: KOLOM KETERANGAN / DAMPAK EKOLOGIS (Diletakkan di bawah Bukti Foto) */}
          <div className="flex flex-col items-center pt-2">
            <label className="font-bold text-black text-sm md:text-base mb-2 text-center">
              Keterangan & Dampak Ekologis Sungai:
            </label>
            <textarea
              rows="4"
              required
              value={keteranganEkologis}
              onChange={(e) => setKeteranganEkologis(e.target.value)}
              placeholder="Deskripsikan dampak populasi ikan sapu-sapu di sini. Contoh: Populasi ikan sapu-sapu (Plecostomus) merusak struktur tanggul tanah lumpur, mendominasi rantai makanan lokal, dan mengurangi hasil tangkapan ikan asli nelayan tradisional..."
              className="w-full max-w-lg bg-white px-4 py-3 text-neutral-800 placeholder-gray-400 text-sm focus:outline-none shadow-md rounded-sm border border-neutral-300 min-h-[100px]"
            />
          </div>

          {/* Footer: Checkbox & Submit */}
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <label className="flex items-start gap-3 cursor-pointer max-w-xl">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-green-700 cursor-pointer flex-shrink-0"
              />
              <span className="text-xs md:text-sm font-bold text-black leading-tight">
                Saya menyetujui bahwa data ekologis yang saya kirimkan bersifat
                valid dan dapat dipertanggungjawabkan untuk pemetaan berkala.
              </span>
            </label>

            <button
              type="submit"
              className="bg-[#008000] hover:bg-green-800 text-white font-bold px-8 py-2 rounded-full shadow-md tracking-wider transition-colors uppercase text-sm md:text-base self-end sm:self-auto"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
