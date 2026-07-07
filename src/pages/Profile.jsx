import React, { useState, useEffect } from "react";
import { LogOut, CheckCircle, ShieldAlert } from "lucide-react";
// Import supabase jika nanti sudah siap dihubungkan:
// import { supabase } from '../utils/supabaseClient';

export default function Profile({ onAuthChange }) {
  const [user, setUser] = useState(null);

  // State manajemen form
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // Hanya email yang tersisa untuk Register

  useEffect(() => {
    const savedUser = localStorage.getItem("ecoMapUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 1. PROTEKSI LOGIN: Cek apakah user sudah pernah register
  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password)
      return alert("Mohon isi Username dan Password!");

    // Mengambil data pendaftar dari localStorage
    const savedUser = localStorage.getItem("ecoMapUser_Registered");

    if (!savedUser) {
      alert(
        'Akun tidak ditemukan! Anda harus menekan "Register now" untuk mendaftar terlebih dahulu.',
      );
      return;
    }

    const registeredData = JSON.parse(savedUser);

    // Validasi kecocokan username dan password
    if (
      registeredData.username === username &&
      registeredData.password === password
    ) {
      localStorage.setItem("ecoMapUser", savedUser);
      setUser(registeredData);
      if (onAuthChange) onAuthChange(true);
    } else {
      alert("Username atau Password salah! Silakan coba lagi.");
    }
  };

  // 2. REGISTER & VERIFIKASI EMAIL
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password || !email) {
      return alert("Mohon lengkapi seluruh kolom pendaftaran!");
    }

    /* 💡 JALUR SUPABASE (Masa Depan):
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { display_name: username } }
      });
      if (error) return alert(error.message);
      alert('Email verifikasi telah dikirim! Silakan cek kotak masuk Anda.');
    */

    // Simulasi Frontend saat ini:
    const newUserData = { username, email, password };

    // Simpan ke database pendaftaran lokal
    localStorage.setItem("ecoMapUser_Registered", JSON.stringify(newUserData));

    alert(
      `Registrasi Berhasil! Link verifikasi telah dikirimkan ke email: ${email}. Silakan verifikasi email Anda sebelum melakukan login.`,
    );

    // Pindahkan user ke halaman login setelah mendaftar agar mereka melakukan verifikasi
    setIsRegisterMode(false);
    setPassword("");
  };

  // 3. INTEGRASI OAUTH GOOGLE & APPLE (Instan Tanpa Ketik)
  const handleOAuthLogin = async (provider) => {
    alert(
      `Menghubungkan ke layanan ${provider}... Anda akan diarahkan ke pop-up konfirmasi akun.`,
    );

    /* 💡 JALUR SUPABASE (Sangat Mudah untuk Google & Apple):
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider, // 'google' atau 'apple'
      });
    */

    // Simulasi Sukses OAuth:
    const oauthUser = {
      username: `${provider}_User`,
      email: `user.${provider}@example.com`,
    };

    localStorage.setItem("ecoMapUser_Registered", JSON.stringify(oauthUser));
    localStorage.setItem("ecoMapUser", JSON.stringify(oauthUser));
    setUser(oauthUser);
    if (onAuthChange) onAuthChange(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("ecoMapUser");
    setUser(null);
    setUsername("");
    setPassword("");
    setEmail("");
    if (onAuthChange) onAuthChange(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF1CE] p-4 flex flex-col justify-center items-center font-sans">
      {user ? (
        /* KONDISI 1: DASHBOARD USER */
        <div className="w-full max-w-md bg-white border rounded-2xl shadow-md p-6 space-y-6">
          <div className="flex items-center space-x-4 border-b pb-4">
            <div className="h-16 w-16 bg-[#2B6141] text-white rounded-full flex items-center justify-center text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-1.5">
                {user.username}
                <CheckCircle size={18} className="text-[#2B6141]" />
              </h2>
              <p className="text-sm text-neutral-500">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl font-medium text-sm transition-colors"
          >
            Keluar dari Akun
          </button>
        </div>
      ) : (
        /* KONDISI 2: FORM LOGIN / REGISTER */
        <div className="w-full max-w-lg flex flex-col items-center">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#008000] tracking-wide">
              {isRegisterMode ? "Hello!" : "Welcome Back!"}
            </h1>
            <p className="text-sm md:text-base font-semibold text-[#2B6141]/80 mt-1">
              {isRegisterMode
                ? "Let's Register Your Account"
                : "Let's Login to Your Account"}
            </p>
          </div>

          <div className="w-full bg-[#008000] rounded-[32px] p-8 md:p-10 shadow-xl border-4 border-[#2B6141]">
            <form
              onSubmit={isRegisterMode ? handleRegister : handleLogin}
              className="space-y-5"
            >
              <div>
                <label className="block text-white font-medium text-sm mb-1.5 pl-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white px-4 py-3 rounded-2xl text-neutral-800 font-medium focus:outline-none"
                  required
                />
              </div>

              {/* TAMPIL HANYA SAAT REGISTER */}
              {isRegisterMode && (
                <div>
                  <label className="block text-white font-medium text-sm mb-1.5 pl-1">
                    Alamat E-Mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh@email.com"
                    className="w-full bg-white px-4 py-3 rounded-2xl text-neutral-800 font-medium focus:outline-none text-sm"
                    required={isRegisterMode}
                  />
                </div>
              )}

              <div>
                <label className="block text-white font-medium text-sm mb-1.5 pl-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white px-4 py-3 rounded-2xl text-neutral-800 font-medium focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 flex flex-col items-center">
                <button
                  type="submit"
                  className="px-10 py-2 bg-white text-[#2B6141] font-bold rounded-full text-base hover:bg-neutral-100 transition-colors uppercase tracking-wider"
                >
                  {isRegisterMode ? "Register" : "Login"}
                </button>

                <p className="text-white/90 text-xs font-medium mt-4">
                  {isRegisterMode
                    ? "Already have an account? "
                    : "Don't have an account? "}
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                    className="underline text-white font-bold hover:text-yellow-200 transition-colors ml-1"
                  >
                    {isRegisterMode ? "Login now" : "Register now"}
                  </button>
                </p>
              </div>

              {/* ─── INTEGRASI STRUKTUR TOMBOL GOOGLE & APPLE ─── */}
              <div className="pt-2 space-y-2 border-t border-white/20 mt-2">
                <div
                  onClick={() => handleOAuthLogin("google")}
                  className="w-full bg-white py-2 px-4 rounded-full flex items-center justify-between shadow-sm cursor-pointer hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600 text-sm">G</span>
                    <span className="text-emerald-900 font-bold text-xs">
                      Login With Google
                    </span>
                  </div>
                  <span className="text-[10px] underline text-emerald-800 font-semibold">
                    Click to link
                  </span>
                </div>

                <div
                  onClick={() => handleOAuthLogin("apple")}
                  className="w-full bg-white py-2 px-4 rounded-full flex items-center justify-between shadow-sm cursor-pointer hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black text-sm"></span>
                    <span className="text-emerald-900 font-bold text-xs">
                      Login With Apple
                    </span>
                  </div>
                  <span className="text-[10px] underline text-emerald-800 font-semibold">
                    Click to link
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
