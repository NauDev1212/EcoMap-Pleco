// src/data/journalData.js
// DAFTAR 10 PERTANYAAN EKOLOGIS TERTIMBANG (BERDASARKAN PP NO. 22 TAHUN 2021 & STANDARD WQI)

export const ECOLOGICAL_QUESTIONS = [
  // ==========================================
  // KELOMPOK 1: INDIKATOR DO (DISSOLVED OXYGEN)
  // ==========================================
  {
    id: "do_1",
    category: "DO",
    weight: 5, // P_i = 5 (Indikator vital kelangsungan hidup biota akuatik)
    standar_baku_mutu: "Baku Mutu DO Kelas II: Minimum 4.0 mg/L",
    label: "1. Bagaimana perkiraan kondisi kandungan oksigen terlarut (DO) atau kesegaran air berdasarkan aktivitas organisme air dan kejernihan aliran di lokasi ini?",
    options: [
      { value: 20, label: "Air sangat keruh/hitam, berbusa, tidak ada tanda kehidupan ikan (Anoksik < 2.0 mg/L)" },
      { value: 40, label: "Air nampak tenang mati, ikan terlihat sering megap-megap di permukaan (Hipoksia 2.0 - 3.9 mg/L)" },
      { value: 60, label: "Kondisi air mengalir biasa, ikan hidup terbatas (Memenuhi Batas Minimum 4.0 - 5.0 mg/L)" },
      { value: 80, label: "Air mengalir cukup lancar, jernih sedang, organisme aktif (Baik 5.1 - 6.5 mg/L)" },
      { value: 100, label: "Air mengalir deras, jernih, aerasi sangat baik (Sangat Ideal > 6.5 mg/L)" }
    ]
  },
  {
    id: "do_2",
    category: "DO",
    weight: 3, // P_i = 3 (Kekeruhan/Turbiditas & Eutrofikasi)
    standar_baku_mutu: "Baku Mutu Kekeruhan & Alga (Bebas dari Eutrofikasi Berat)",
    label: "2. Apa warna air sungai secara kasat mata saat ini?",
    options: [
      { value: 20, label: "Hitam pekat, coklat tua keruh pekat, atau mengeluarkan warna kimiawi mencolok" },
      { value: 40, label: "Coklat keruh atau kehijauan pekat akibat alga berlebih (eutrofikasi)" },
      { value: 60, label: "Keruh kecoklatan biasa (khas aliran tanah atau lumpur terbawa erosi)" },
      { value: 80, label: "Agak jernih dengan sedikit kekeruhan ringan" },
      { value: 100, label: "Sangat jernih alami, dasar sungai dapat terlihat dengan jelas" }
    ]
  },
  {
    id: "do_3",
    category: "DO",
    weight: 3, // P_i = 3 (Indikator Pembusukan Organik / H2S / Senyawa Volatil)
    standar_baku_mutu: "Baku Mutu Aroma: Tidak Berbau (PP 22/2021)",
    label: "3. Bagaimana aroma atau bau air sungai di sekitar lokasi pengamatan?",
    options: [
      { value: 20, label: "Bau busuk yang sangat menyengat (seperti comberan pekat, belerang, atau limbah kimia)" },
      { value: 40, label: "Berbau apek atau bau lumpur busuk yang cukup mengganggu" },
      { value: 60, label: "Tercium sedikit bau lumpur alami atau tidak berbau menyengat" },
      { value: 80, label: "Berbau netral, tidak ada aroma polutan yang tercium" },
      { value: 100, label: "Berbau segar khas air alami/pegunungan" }
    ]
  },
  {
    id: "do_4",
    category: "DO",
    weight: 4, // P_i = 4 (Bioindikator Keanekaragaman Biota Sensitip Oksigen)
    standar_baku_mutu: "Baku Mutu Integritas Biotik & Keanekaragaman Spesies",
    label: "4. Apakah Anda masih melihat ikan lokal yang peka terhadap polusi (seperti mujair, nilem, wader, atau gabus) hidup bebas?",
    options: [
      { value: 20, label: "Sama sekali tidak ada ikan lokal sensitif, perairan terlihat 'mati'" },
      { value: 40, label: "Sangat jarang, hanya terlihat satu-dua ekor ikan kecil dalam kondisi lemah" },
      { value: 60, label: "Ikan lokal mulai terlihat sesekali di bagian aliran yang agak deras" },
      { value: 80, label: "Ikan lokal cukup banyak ditemukan dan hidup aktif bergerombol" },
      { value: 100, label: "Keanekaragaman ikan lokal sangat tinggi dan berkembang biak dengan sehat" }
    ]
  },
  {
    id: "do_5",
    category: "DO",
    weight: 4, // P_i = 4 (Beban Penurunan Oksigen akibat Beban Organik BOD/COD)
    standar_baku_mutu: "Baku Mutu BOD: Maks 3 mg/L | COD: Maks 25 mg/L",
    label: "5. Bagaimana tingkat pencemaran limbah organik rumah tangga atau sampah domestik yang menumpuk di badan air?",
    options: [
      { value: 20, label: "Sampah organik menumpuk sangat padat dan air limbah cucian pekat langsung masuk" },
      { value: 40, label: "Banyak tumpukan sampah domestik di pinggiran dan air keruh akibat limbah cair rumah tangga" },
      { value: 60, label: "Terdapat sedikit sampah rumah tangga di beberapa titik" },
      { value: 80, label: "Minim sampah rumah tangga, aliran air cukup bersih dari hambatan organik" },
      { value: 100, label: "Bersih total dari sampah domestik maupun limbah organik buangan warga" }
    ]
  },

  // ==========================================
  // KELOMPOK 2: INDIKATOR LOGAM BERAT & TOKSIKITAS
  // ==========================================
  {
    id: "metal_1",
    category: "LOGAM",
    weight: 5, // P_i = 5 (Toksisitas Timbal / Pb sangat berbahaya bagi saraf & organ)
    standar_baku_mutu: "Baku Mutu Timbal (Pb) Kelas II: Maksimum 0.03 mg/L",
    label: "6. Apakah terdapat aktivitas di sekitar perairan yang berpotensi tinggi menyumbangkan limbah Logam Timbal (Pb) seperti bengkel cat/kendaraan, percetakan, atau buangan aki bekas?",
    options: [
      { value: 20, label: "Sangat banyak industri/bengkel/pembuangan limbah cat dan aki langsung ke sungai (> 0.03 mg/L)" },
      { value: 40, label: "Ada beberapa aktivitas bengkel atau lalu lintas padat yang air cecerannya mengalir ke sungai" },
      { value: 60, label: "Aktivitas pencemar Pb tergolong sedang atau berjarak agak jauh dari sempadan sungai" },
      { value: 80, label: "Hanya sedikit atau hampir tidak ada aktivitas yang menghasilkan limbah Pb" },
      { value: 100, label: "Sama sekali tidak ada aktivitas manusia yang berpotensi mencemari Pb (Steril/Konservasi)" }
    ]
  },
  {
    id: "metal_2",
    category: "LOGAM",
    weight: 5, // P_i = 5 (Kadmium / Cd beracun bagi ginjal & sistem akut)
    standar_baku_mutu: "Baku Mutu Kadmium (Cd) Kelas II: Maksimum 0.01 mg/L",
    label: "7. Bagaimana intensitas penggunaan pupuk kimia/pestisida di lahan pertanian atau aktivitas industri pelapisan logam/tekstil di sekitar aliran sungai ini yang memicu cemaran Kadmium (Cd)?",
    options: [
      { value: 20, label: "Sungai dikelilingi pertanian intensif pestisida tinggi atau pabrik tekstil/galvanis tanpa olah limbah" },
      { value: 40, label: "Terdapat aktivitas pertanian atau industri menengah yang cukup sering mengalirkan drainase ke sungai" },
      { value: 60, label: "Aktivitas pertanian ada namun dalam skala kecil/terbatas" },
      { value: 80, label: "Aktivitas pertanian organik atau minim penggunaan bahan kimia sintetis" },
      { value: 100, label: "Bebas dari aktivitas pertanian intensif maupun industri yang menghasilkan Kadmium" }
    ]
  },
  {
    id: "metal_3",
    category: "LOGAM",
    weight: 5, // P_i = 5 (Merkuri / Hg toksisitas tertinggi, bioakumulasi tinggi)
    standar_baku_mutu: "Baku Mutu Merkuri (Hg) Kelas II: Maksimum 0.002 mg/L",
    label: "8. Apakah terdapat indikasi aktivitas penambangan (seperti penambangan emas tanpa izin/PSTI), pembuangan limbah medis/laboratorium, atau sampah elektronik di sekitar lokasi?",
    options: [
      { value: 20, label: "Sangat kuat indikasi aktivitas penambangan liar/limbah elektronik/medis langsung di badan air" },
      { value: 40, label: "Terdapat aktivitas yang berpotensi menyumbang merkuri di wilayah hulu atau sekitar lokasi" },
      { value: 60, label: "Potensi pencemaran Hg kecil, namun ada pembuangan sampah rumah tangga campuran" },
      { value: 80, label: "Lingkungan sekitar bersih dari aktivitas tambang atau limbah berbahaya spesifik" },
      { value: 100, label: "Sangat steril dari segala bentuk aktivitas yang berisiko mencemari merkuri" }
    ]
  },
  {
    id: "metal_4",
    category: "LOGAM",
    weight: 4, // P_i = 4 (Akumulasi Logam Berat pada Sedimen Lumpur Dasar)
    standar_baku_mutu: "Baku Mutu Sedimen & Kualitas Lumpur Perairan Dasar",
    label: "9. Bagaimana kondisi fisik dasar sungai (sedimen/lumpur) tempat ikan sapu-sapu mencari makan dan tempat mengendapnya logam berat?",
    options: [
      { value: 20, label: "Lumpur dasar sangat tebal, hitam pekat, dan berbau busuk menyengat (Endapan polutan tinggi)" },
      { value: 40, label: "Dasar sungai dipenuhi lumpur kecoklatan dengan endapan sampah organik yang cukup banyak" },
      { value: 60, label: "Dasar perairan bercampur antara lumpur, pasir, dan sedikit batuan" },
      { value: 80, label: "Dasar sungai didominasi oleh pasir dan bebatuan kecil dengan sedikit lumpur" },
      { value: 100, label: "Dasar sungai bersih, berbatu, berpasir, dan aliran air lancar tanpa endapan lumpur tercemar" }
    ]
  },
  {
    id: "metal_5",
    category: "LOGAM",
    weight: 4, // P_i = 4 (Bioindikator Dominansi Spesies Invasi Tahan Logam Berat)
    standar_baku_mutu: "Baku Mutu Keseimbangan Ekosistem & Bio-akumulator",
    label: "10. Bagaimana tingkat populasi atau keberadaan ikan sapu-sapu di lokasi pengamatan ini?",
    options: [
      { value: 20, label: "Ikan sapu-sapu melimpah ruah dan mendominasi total biomassa (Tanda perairan tercemar/kritis)" },
      { value: 40, label: "Populasi ikan sapu-sapu cukup banyak dan mudah ditemukan di setiap sudut sungai" },
      { value: 60, label: "Populasi ikan sapu-sapu ada dalam jumlah sedang, bercampur dengan spesies lain" },
      { value: 80, label: "Populasi ikan sapu-sapu jarang ditemukan dan hanya di titik tertentu" },
      { value: 100, label: "Ikan sapu-sapu hampir tidak ditemukan (Kondisi perairan sangat bersih / alami)" }
    ]
  }
];