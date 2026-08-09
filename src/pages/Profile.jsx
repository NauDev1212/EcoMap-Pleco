import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, LogOut, ShieldCheck } from "lucide-react";
import { supabase } from "../supabaseClient";

// 1. Daftarkan daftar email yang memiliki hak akses Admin
const ADMIN_EMAILS = [
  "adminecomap@gmail.com",
  "naufalyudha1212@gmail.com" // Sesuaikan dengan email akun admin Anda
];

export default function Profile({ onAuthChange }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // State Form
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // Check Session saat komponen dimuat & dengarkan perubahan status Auth
  useEffect(() => {
    // 1. Ambil session aktif dari Supabase
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        if (onAuthChange) onAuthChange(true);
      }
      setLoading(false);
    };

    checkSession();

    // 2. Listener realtime perubahan status autentikasi (Login/Logout/OAuth Redirect)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        if (onAuthChange) onAuthChange(true);
      } else {
        setUser(null);
        if (onAuthChange) onAuthChange(false);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [onAuthChange]);

  // Evaluasi apakah user yang sedang login adalah Admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // 1. REGISTER dengan Verifikasi E-Mail
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !username) {
      return alert("Mohon lengkapi seluruh kolom pendaftaran!");
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: username,
        },
        emailRedirectTo: window.location.origin,
      },
    });

    setLoading(false);

    if (error) {
      alert(`Gagal Mendaftar: ${error.message}`);
    } else {
      alert(
        `Registrasi Berhasil! Link verifikasi telah dikirimkan ke email: ${email}. Silakan cek kotak masuk/spam email Anda dan klik link verifikasi sebelum melakukan login.`
      );
      setIsRegisterMode(false);
      setPassword("");
    }
  };

  // 2. LOGIN Email & Password
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return alert("Mohon isi Email dan Password!");
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        alert("Email Anda belum diverifikasi! Silakan cek kotak masuk email Anda.");
      } else {
        alert(`Login Gagal: ${error.message}`);
      }
    }
  };

  // 3. LOGIN VIA GOOGLE / APPLE (OAuth)
  const handleOAuthLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      alert(`Gagal terhubung ke ${provider}: ${error.message}`);
    }
  };

  // 4. LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setEmail("");
    setPassword("");
    setUsername("");
    if (onAuthChange) onAuthChange(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF1CE] flex items-center justify-center">
        <p className="text-[#2B6141] font-bold text-lg">Memuat data autentikasi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF1CE] p-4 flex flex-col justify-center items-center font-sans">
      {user ? (
        /* DASHBOARD USER SETELAH LOGIN */
        <div className="w-full max-w-md bg-white border rounded-2xl shadow-md p-6 space-y-6">
          <div className="flex items-center space-x-4 border-b pb-4">
            <div className="h-16 w-16 bg-[#2B6141] text-white rounded-full flex items-center justify-center text-2xl font-bold">
              {(user.user_metadata?.display_name || user.email || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-1.5 flex-wrap">
                {user.user_metadata?.display_name || "Pengunjung"}
                <CheckCircle size={18} className="text-[#2B6141]" />
                
                {/* Badge khusus jika role akun adalah Admin */}
                {isAdmin && (
                  <span className="text-[10px] bg-emerald-700 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </h2>
              <p className="text-sm text-neutral-500">{user.email}</p>
            </div>
          </div>

          {/* Tombol Akses Admin Panel (Hanya Tampil Jika User Adalah Admin) */}
          {isAdmin && (
            <Link
              to="/admin"
              className="w-full py-3 bg-[#2B6141] hover:bg-[#204931] text-white rounded-xl font-bold text-center flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <ShieldCheck size={20} /> Masuk Panel Admin
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full py-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Keluar dari Akun
          </button>
        </div>
      ) : (
        /* FORM LOGIN / REGISTER */
        <div className="w-full max-w-lg flex flex-col items-center">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#008000] tracking-wide">
              {isRegisterMode ? "Hello!" : "Welcome Back!"}
            </h1>
            <p className="text-sm md:text-base font-semibold text-[#2B6141]/80 mt-1">
              {isRegisterMode ? "Let's Register Your Account" : "Let's Login to Your Account"}
            </p>
          </div>

          <div className="w-full bg-[#008000] rounded-[32px] p-8 md:p-10 shadow-xl border-4 border-[#2B6141]">
            <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
              {/* Field Username (Hanya muncul saat Register) */}
              {isRegisterMode && (
                <div>
                  <label className="block text-white font-medium text-sm mb-1.5 pl-1">
                    Username / Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full bg-white px-4 py-3 rounded-2xl text-neutral-800 font-medium focus:outline-none"
                    required={isRegisterMode}
                  />
                </div>
              )}

              {/* Field Email */}
              <div>
                <label className="block text-white font-medium text-sm mb-1.5 pl-1">
                  Alamat E-Mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  className="w-full bg-white px-4 py-3 rounded-2xl text-neutral-800 font-medium focus:outline-none"
                  required
                />
              </div>

              {/* Field Password */}
              <div>
                <label className="block text-white font-medium text-sm mb-1.5 pl-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white px-4 py-3 rounded-2xl text-neutral-800 font-medium focus:outline-none"
                  required
                />
              </div>

              {/* Tombol Submit */}
              <div className="pt-3 flex flex-col items-center">
                <button
                  type="submit"
                  className="px-10 py-2.5 bg-white text-[#2B6141] font-bold rounded-full text-base hover:bg-neutral-100 transition-colors uppercase tracking-wider shadow"
                >
                  {isRegisterMode ? "Register" : "Login"}
                </button>

                <p className="text-white/90 text-xs font-medium mt-4">
                  {isRegisterMode ? "Already have an account? " : "Don't have an account? "}
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                    className="underline text-white font-bold hover:text-yellow-200 transition-colors ml-1"
                  >
                    {isRegisterMode ? "Login now" : "Register now"}
                  </button>
                </p>
              </div>

              {/* Tombol OAuth Google & Apple */}
              <div className="pt-3 space-y-2 border-t border-white/20 mt-2">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin("google")}
                  className="w-full bg-white py-2 px-4 rounded-full flex items-center justify-between shadow-sm hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600 text-sm">G</span>
                    <span className="text-emerald-900 font-bold text-xs">Login With Google</span>
                  </div>
                  <span className="text-[10px] underline text-emerald-800 font-semibold">
                    Instant Login
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin("apple")}
                  className="w-full bg-white py-2 px-4 rounded-full flex items-center justify-between shadow-sm hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black text-sm"></span>
                    <span className="text-emerald-900 font-bold text-xs">Login With Apple</span>
                  </div>
                  <span className="text-[10px] underline text-emerald-800 font-semibold">
                    Instant Login
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}