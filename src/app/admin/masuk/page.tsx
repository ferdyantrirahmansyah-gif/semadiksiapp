"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminMasuk() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Simulated network delay
    setTimeout(() => {
      if (email === "admin123@gmail.com" && password === "12345678") {
        sessionStorage.setItem("admin_logged_in", "true");
        router.push("/admin/dashboard");
      } else {
        setError("Email atau password admin salah!");
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center relative p-margin-mobile overflow-hidden">
      {/* Background Blobs */}
      <div className="organic-blob bg-primary w-[450px] h-[450px] -top-20 -left-20 animate-pulse"></div>
      <div className="organic-blob bg-secondary-container w-[350px] h-[350px] -bottom-20 -right-20 opacity-20"></div>

      <main className="w-full max-w-md bg-surface-container-lowest border border-surface-variant/30 shadow-[0px_8px_30px_0px_rgba(13,99,27,0.08)] rounded-[2rem] p-8 relative z-10 space-y-lg">
        {/* Header */}
        <div className="text-center space-y-xs">
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[16px] font-bold">
              A
            </span>
            <span className="font-display font-extrabold text-primary tracking-widest text-lg">SEMADIKSI</span>
          </div>
          <h2 className="font-headline-md text-2xl font-bold text-on-surface">Portal Admin</h2>
          <p className="font-body-sm text-on-surface-variant">
            Silakan masuk menggunakan kredensial administrator.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-error-container/20 border border-error text-error text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2 animate-shake">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-md">
          {/* Email */}
          <div className="space-y-sm">
            <label className="font-label-md text-label-md text-on-surface-variant block ml-1 font-semibold" htmlFor="email">
              Email / Username
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                admin_panel_settings
              </span>
              <input
                id="email"
                type="email"
                placeholder="admin123@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-surface-container border border-surface-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-body-md text-on-surface"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-sm">
            <label className="font-label-md text-label-md text-on-surface-variant block ml-1 font-semibold" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                lock
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-surface-container border border-surface-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-body-md text-on-surface"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Membuka Gerbang...</span>
                </>
              ) : (
                <>
                  <span>Masuk Administrator</span>
                  <span className="material-symbols-outlined">login</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
