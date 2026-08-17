import React from "react";
import { ShieldAlert, Leaf, Droplet, Info } from "lucide-react";

// Import gambar dari folder assets di src

import pardalisImg from "../asset/pardalis.jpg";
import disjunctivusImg from "../asset/disjunctivus.jpg";
import plecostomusImg from "../asset/plecostomus.jpg";
import nilemImg from "../asset/nilem.jpg";

export default function Education() {
  return (
    <div className="min-h-screen bg-[#FDF1CE] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* HEADER UTAMA */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold text-[#008000] tracking-wide uppercase pb-5">
            Edukasi Terhadap Ikan Sapu-Sapu
          </h1>
          <p className="text-sm md:text-base text-emerald-900/80 max-w-2xl mx-auto font-medium">
            Mengenal perbandingan spesies invasif ikan sapu-sapu, potensi pemanfaatan
            ekologis non-konsumsi, serta panduan penanganan yang tepat dan
            logis.
          </p>
        </div>

        {/* ─── SUB JUDUL 1: PERBANDINGAN SPESIES ─── */}
        <section className="space-y-6">
          <div className="border-b-2 border-[#008000]/20 pb-2">
            <h2 className="text-2xl font-bold text-[#008000] flex items-center gap-2">
              <Info size={24} /> 1. Perbandingan Spesies Ikan Sapu-Sapu
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Kenali perbedaan morfologi spesies ikan sapu-sapu invasif yang
              sering ditemui di perairan umum Indonesia.
            </p>
          </div>

          {/* KARTU SPESIES 1 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-neutral-200">
            <div className="h-56 md:h-64 relative overflow-hidden bg-neutral-900">
              <img
                src={pardalisImg}
                alt="Pterygoplichthys pardalis"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 right-4 bg-red-600 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                High Risk
              </span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-bold text-[#008000] italic">
                Pterygoplichthys pardalis
              </h3>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                Paling Sering Ditemui
              </p>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Dicirikan oleh pola bintik-bintik gelap yang menyerupai macan
                tutul dengan latar belakang tubuh yang lebih terang. Sangat
                adaptif dan mendominasi sebagian besar ekosistem air tawar di
                Indonesia.
              </p>
            </div>
          </div>

          {/* KARTU SPESIES 2 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-neutral-200">
            <div className="h-56 md:h-64 relative overflow-hidden bg-neutral-900">
              <img
                src={disjunctivusImg}
                alt="Pterygoplichthys disjunctivus"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 right-4 bg-orange-500 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Mod-High Risk
              </span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-bold text-[#008000] italic">
                Pterygoplichthys disjunctivus
              </h3>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                Sering Dilaporkan
              </p>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Seringkali keliru diidentifikasi sebagai <i>P. pardalis</i>.
                Spesies ini memiliki karakteristik unik berupa pola labirin
                (garis cacing berliku-liku) yang menyatu di area perut, bukan
                bintik-bintik terpisah.
              </p>
            </div>
          </div>

          {/* KARTU SPESIES 3 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-neutral-200">
            <div className="h-56 md:h-64 relative overflow-hidden bg-neutral-900">
              <img
                src={plecostomusImg}
                alt="Hypostomus plecostomus"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 right-4 bg-amber-500 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Lower Risk
              </span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-bold text-[#008000] italic">
                Hypostomus plecostomus
              </h3>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                Sering Terkecoh
              </p>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Merupakan jenis "Original Pleco" asli dari perdagangan ikan
                hias. Umumnya berukuran lebih kecil dengan jumlah jari-jari
                sirip punggung yang lebih sedikit (7-8 jari) dibandingkan dengan
                genus Pterygoplichthys yang berukuran masif.
              </p>
            </div>
          </div>

          {/* TABEL MORFOLOGI UTAMA (SESUAI GAMBAR REFERENSI) */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-neutral-200 overflow-x-auto">
            <h3 className="font-bold text-neutral-800 mb-4 text-base">
              Tabel Perbedaan Morfologi Utama
            </h3>
            <table className="w-full text-left text-xs md:text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b-2 border-neutral-200 text-gray-400 font-semibold uppercase text-[10px]">
                  <th className="py-2">Karakteristik</th>
                  <th className="py-2 text-[#008000]">P. pardalis</th>
                  <th className="py-2 text-[#008000]">P. disjunctivus</th>
                  <th className="py-2 text-[#008000]">H. plecostomus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700 font-medium">
                <tr>
                  <td className="py-3 font-bold">Pola Tubuh</td>
                  <td className="py-3">Bintik gelap jelas</td>
                  <td className="py-3">Labirin/Garis berliku</td>
                  <td className="py-3">Bintik kecil seragam</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold">Sirip Punggung</td>
                  <td className="py-3">11-13 Jari sirip</td>
                  <td className="py-3">11-13 Jari sirip</td>
                  <td className="py-3">7-8 Jari sirip</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold">Ukuran Maksimal</td>
                  <td className="py-3">Hingga 50 cm</td>
                  <td className="py-3">Hingga 60 cm</td>
                  <td className="py-3">Hingga 30 cm</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold">Risiko Invasif</td>
                  <td className="py-3">
                    <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                      Kritis
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                      Tinggi
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                      Sedang
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── SUB JUDUL 2: IKAN LOKAL TERANCAM PUNAH ─── */}
      


        {/* ─── SUB JUDUL 3: IKAN LOKAL YANG MASIH BERTAHAN HIDUP ─── */}
        


        {/* ─── SUB JUDUL 4: PEMANFAATAN NON-PANGAN ─── */}
        <section className="space-y-4">
          <div className="border-b-2 border-[#008000]/20 pb-2">
            <h2 className="text-2xl font-bold text-[#008000] flex items-center gap-2">
              <Leaf size={24} /> 4. Pemanfaatan Non-Pangan
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Karena isu kandungan logam berat di beberapa sungai Indonesia,
              pemanfaatan organ ikan sapu-sapu dialihkan ke sektor non-pangan:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-200">
              <div className="w-10 h-10 bg-emerald-50 text-[#008000] rounded-xl flex items-center justify-center mb-3 font-bold">
                🧪
              </div>
              <h4 className="font-bold text-neutral-800 mb-1">
                Pupuk Organik Cair (POC) Tinggi Nitrogen
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Daging dan jeroan ikan sapu-sapu kaya akan unsur hara makro.
                Melalui fermentasi anaerob menggunakan EM4, komponen tubuhnya
                dapat diubah menjadi pupuk cair organik bermutu tinggi guna
                memicu pertumbuhan vegetatif tanaman.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-200">
              <div className="w-10 h-10 bg-emerald-50 text-[#008000] rounded-xl flex items-center justify-center mb-3 font-bold">
                👜
              </div>
              <h4 className="font-bold text-neutral-800 mb-1">
                Bahan Baku Kerajinan Kulit Eksotis
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Kulit ikan sapu-sapu berstruktur keras dan memiliki osteodermata
                (sisik keras berlapis tulang). Melalui proses penyamakan kimiawi
                yang tepat, tekstur kulit ini berpotensi diolah menjadi
                komoditas dompet, hiasan, atau aksesoris estetik bernilai
                ekonomi.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-200 col-span-1 md:col-span-2">
            <div className="w-10 h-10 bg-emerald-50 text-[#008000] rounded-xl flex items-center justify-center mb-3 font-bold">
              🔬
            </div>
            <h4 className="font-bold text-neutral-800 mb-1">
              Ekstraksi Kitosan dari Limbah Sisik Keras
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Kitosan dari ikan sapu-sapu adalah senyawa biopolimer polisakarida
              turunan kitin yang diekstraksi dari limbah sisik ikan sapu-sapu.
              Melalui proses tahapan kimiawi yang terukur, eksoskeleton keras
              ini dapat diolah menjadi material serbaguna dengan potensi
              implementasi yang luas:
            </p>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FDF1CE]/40 p-3 rounded-xl border border-[#008000]/10">
              <div>
                <h5 className="text-xs font-bold text-[#008000] mb-0.5">
                  🔹 Adsorben Logam Berat (Koagulan Air)
                </h5>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Gugus amina (-NH<sub>2</sub>) dan hidroksil (-OH) pada
                  rantai kitosan bertindak sebagai agen pengkelat (chelating
                  agent) alami yang sangat kuat untuk mengikat dan mengendapkan
                  polutan logam berat berbahaya (seperti timbal atau merkuri) di
                  aliran sungai yang tercemar.
                </p>
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#008000] mb-0.5">
                  🔹 Edible Coating & Hand Sanitizer Alami
                </h5>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Memiliki sifat antimikroba dan polielektrolit alami yang mampu
                  menghambat pertumbuhan bakteri patogen serta jamur, sehingga
                  sangat berguna untuk lapisan pelindung non-toksik ataupun
                  bahan dasar antiseptik ramah lingkungan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SUB JUDUL 5: SOLUSI ERADIKASI MENURUT MUI ─── */}
        <section className="space-y-4">
          <div className="border-b-2 border-[#008000]/20 pb-2">
            <h2 className="text-2xl font-bold text-[#008000] flex items-center gap-2">
              <ShieldAlert size={24} /> 5. Solusi Pembasmian Yang Logis & Manusiawi              
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Sebagai spesies asing invasif yang merusak habitat lokal, populasi
              ikan sapu-sapu perlu dikendalikan. Namun, Islam melarang
              penyiksaan satwa (ihsan fi qatli al-hayawan).
            </p>
          </div>

          <div className="bg-emerald-900 text-white p-6 rounded-2xl space-y-4 shadow-lg border-l-8 border-[#008000]">
            <p className="text-xs md:text-sm leading-relaxed italic opacity-90">
              "Berdasarkan prinsip fikih lingkungan, pemusnahan spesies merusak
              (mudharat) diperbolehkan demi menjaga kemaslahatan ekosistem air
              lokal. Namun, metode pembunuhan tidak boleh menyiksa satwa secara
              perlahan (seperti membiarkannya mengering di terik matahari atau
              menguburkannya hidup-hidup)."
            </p>

            <div className="bg-black/20 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-300 flex items-center gap-1.5">
                <Droplet size={14} /> Solusi Penanganan Paling Logis & Cepat:
              </h4>
              <ul className="list-disc list-inside text-xs space-y-2 text-neutral-100 leading-relaxed">
                <li>
                  <strong className="text-white">
                    Metode Hipotermia Termal (Cepat & Mati Rasa):
                  </strong>{" "}
                  Merendam ikan ke dalam wadah air es yang sangat dingin (es
                  serut pekat). Penurunan suhu drastis menghentikan sistem saraf
                  sensorik ikan secara instan sehingga ikan kehilangan kesadaran
                  tanpa rasa sakit (metode paling direkomendasikan medis satwa).
                </li>
                <li>
                  <strong className="text-white">
                    Pukulan Telak Instan pada Kraniat (Serebral):
                  </strong>{" "}
                  Memberikan satu pukulan kuat dan terarah menggunakan alat
                  tumpul tepat pada bagian pusat saraf di kepala (antara dua
                  mata). Metode ini menghancurkan otak seketika, mencegah rasa
                  sakit yang berkepanjangan dibanding membelah tubuhnya secara
                  perlahan (metode paling praktis).
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
