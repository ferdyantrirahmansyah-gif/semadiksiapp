"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PembayaranContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse activity details from URL query params
  const title = searchParams.get("title") || "Gelar Karya Mahasiswa 2024";
  const priceStr = searchParams.get("price") || "IDR 25.000";
  const date = searchParams.get("date") || "Sabtu, 15 Juni 2024";
  const img = searchParams.get("img") || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800";
  const desc = searchParams.get("desc") || "";
  const type = searchParams.get("type") || "Umum";

  const [paymentMethod, setPaymentMethod] = useState("gopay");
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if the activity is free
  const isFree = priceStr.toLowerCase().includes("gratis") || priceStr === "IDR 0" || priceStr === "0";

  // Calculate pricing
  let ticketPriceNumeric = 0;
  if (!isFree) {
    // Extract numbers from price string (e.g., "IDR 50.000" -> 50000)
    const cleanNum = priceStr.replace(/[^0-9]/g, "");
    ticketPriceNumeric = parseInt(cleanNum, 10);
    if (isNaN(ticketPriceNumeric)) {
      ticketPriceNumeric = 25000; // fallback default
    } else if (ticketPriceNumeric < 1000) {
      // Handle formatting if it parsed like 50 instead of 50000
      ticketPriceNumeric = ticketPriceNumeric * 1000;
    }
  }

  const serviceFee = isFree ? 0 : 2500;
  const totalPrice = ticketPriceNumeric + serviceFee;

  const handleCheckout = () => {
    setIsProcessing(true);
    
    // Simulate payment transaction
    setTimeout(() => {
      // 1. Save to registered activities list in localStorage
      try {
        const stored = localStorage.getItem("semadiksi_registered_activities");
        const registeredList = stored ? JSON.parse(stored) : [];
        
        // Add current activity if not exists
        if (!registeredList.some((act: any) => act.title === title)) {
          registeredList.push({
            id: `reg-${Date.now()}`,
            title,
            category: type,
            organizer: "SEMADIKSI Panitia Pelaksana",
            date,
            duration: type === "Sosial" ? "10 Jam Sosial" : "8 JP",
            status: "Terdaftar",
            code: `E-TKT-${Math.floor(100000 + Math.random() * 900000)}`,
            img,
            description: desc || "Kegiatan pengembangan diri dan partisipasi komunitas beasiswa KIP-K SEMADIKSI.",
            price: priceStr,
            location: "Gedung Auditorium Utama, Kampus Pleburan",
            rundown: "08.00 - 08.30 : Registrasi & Check-in\n08.30 - 10.00 : Sesi Pembuka & Pengenalan\n10.00 - 12.00 : Sesi Inti Program\n12.00 - 13.00 : Istirahat & Networking\n13.00 - 15.00 : Workshop Praktis & Penutup",
            speaker: "Budi Hermawan (Ketua Divisi Pengembangan) & Tim Mentor SEMADIKSI"
          });
          localStorage.setItem("semadiksi_registered_activities", JSON.stringify(registeredList));
        }
      } catch (e) {
        console.error("Error saving registered activity to localStorage", e);
      }

      setIsProcessing(false);
      // 2. Redirect to My Activities page and trigger simulated email notification
      router.push(`/dashboard/kegiatan-saya?payment_success=true&title=${encodeURIComponent(title)}`);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-md md:pt-lg relative">
      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* Left Column: Payment Details */}
        <div className="flex-1 space-y-md z-10 relative">
          {/* Section: Info Tiket */}
          <section className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_0px_rgba(27,109,36,0.05)] border border-[#EEEEEE]">
            <div className="flex items-center gap-2 mb-md">
              <span
                className="material-symbols-outlined text-primary text-2xl font-bold"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                confirmation_number
              </span>
              <h2 className="font-headline-md text-xl font-extrabold text-on-surface">
                Info Pendaftaran Kegiatan
              </h2>
            </div>
            <div className="flex flex-col md:flex-row gap-md items-start">
              <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden shrink-0 shadow-sm border border-surface-container">
                <img
                  className="w-full h-full object-cover"
                  alt={title}
                  src={img}
                />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-headline-md text-lg font-bold text-primary">
                  {title}
                </h3>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-body-md text-base">
                    calendar_today
                  </span>
                  <p className="font-body-md text-body-md">
                    {date}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-body-md text-base">
                    location_on
                  </span>
                  <p className="font-body-md text-body-md">
                    Gedung Auditorium Utama, Kampus Pleburan
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="px-3 py-1 bg-primary-container/10 text-primary border border-primary/20 rounded-full font-label-md text-label-md font-semibold">
                    Kategori: {type}
                  </div>
                  <p className="font-label-md text-label-md text-on-surface-variant">
                    Jumlah: <span className="font-bold text-on-surface">1 Tiket (Ahmad Fauzan)</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Metode Pembayaran (Only show if not free) */}
          {!isFree ? (
            <section className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_0px_rgba(27,109,36,0.05)] border border-[#EEEEEE]">
              <div className="flex items-center gap-2 mb-md">
                <span
                  className="material-symbols-outlined text-primary text-2xl font-bold"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_balance_wallet
                </span>
                <h2 className="font-headline-md text-xl font-extrabold text-on-surface">
                  Metode Pembayaran
                </h2>
              </div>
              <div className="space-y-6">
                {/* E-Wallet Group */}
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface-variant font-bold uppercase tracking-wider mb-sm">
                    E-Wallet
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                    {/* GoPay */}
                    <label
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === "gopay"
                          ? "border-primary bg-primary-container/5"
                          : "border-surface-variant hover:border-primary/50"
                      }`}
                      onClick={() => setPaymentMethod("gopay")}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#00AED6]/10 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#00AED6]">
                            payments
                          </span>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          GoPay
                        </span>
                      </div>
                      {paymentMethod === "gopay" && (
                        <span
                          className="material-symbols-outlined text-primary font-bold"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                      )}
                    </label>

                    {/* OVO */}
                    <label
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === "ovo"
                          ? "border-primary bg-primary-container/5"
                          : "border-surface-variant hover:border-primary/50"
                      }`}
                      onClick={() => setPaymentMethod("ovo")}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#4C2A86]/10 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#4C2A86]">
                            account_balance_wallet
                          </span>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          OVO
                        </span>
                      </div>
                      {paymentMethod === "ovo" && (
                        <span
                          className="material-symbols-outlined text-primary font-bold"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                {/* Bank Transfer Group */}
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface-variant font-bold uppercase tracking-wider mb-sm">
                    Virtual Account (Bank Transfer)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                    {/* Bank Mandiri */}
                    <label
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === "mandiri"
                          ? "border-primary bg-primary-container/5"
                          : "border-surface-variant hover:border-primary/50"
                      }`}
                      onClick={() => setPaymentMethod("mandiri")}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#FFC107]/10 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#004A99]">
                            account_balance
                          </span>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          Mandiri VA
                        </span>
                      </div>
                      {paymentMethod === "mandiri" && (
                        <span
                          className="material-symbols-outlined text-primary font-bold"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                      )}
                    </label>

                    {/* Bank BNI */}
                    <label
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === "bni"
                          ? "border-primary bg-primary-container/5"
                          : "border-surface-variant hover:border-primary/50"
                      }`}
                      onClick={() => setPaymentMethod("bni")}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#E55300]/10 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#E55300]">
                            account_balance
                          </span>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          BNI VA
                        </span>
                      </div>
                      {paymentMethod === "bni" && (
                        <span
                          className="material-symbols-outlined text-primary font-bold"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_0px_rgba(27,109,36,0.05)] border border-primary/20 bg-primary/5 flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-3xl font-bold">
                redeem
              </span>
              <div>
                <h3 className="font-bold text-primary text-lg">Pendaftaran Gratis</h3>
                <p className="text-on-surface-variant text-sm mt-0.5">
                  Kegiatan ini bebas biaya pendaftaran khusus untuk penerima beasiswa KIP-K.
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Summary Card */}
        <div className="w-full lg:w-96 space-y-md z-10 relative">
          <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_8px_30px_0px_rgba(27,109,36,0.1)] border border-primary/10 sticky top-24">
            <h2 className="font-headline-md text-xl font-bold text-on-surface mb-md">
              Ringkasan Transaksi
            </h2>
            <div className="space-y-4 mb-xl">
              <div className="flex justify-between items-center text-on-surface-variant">
                <p className="font-body-md text-body-md">Biaya Kegiatan</p>
                <p className="font-body-md text-body-md font-semibold text-on-surface">
                  {isFree ? "Gratis" : `Rp ${ticketPriceNumeric.toLocaleString("id-ID")}`}
                </p>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <p className="font-body-md text-body-md">Biaya Layanan</p>
                <p className="font-body-md text-body-md">
                  {isFree ? "Rp 0" : `Rp ${serviceFee.toLocaleString("id-ID")}`}
                </p>
              </div>
              <div className="pt-4 border-t border-surface-variant/30 flex justify-between items-center">
                <p className="font-headline-md text-lg font-bold text-on-surface">
                  Total
                </p>
                <p className="font-headline-md text-2xl font-extrabold text-primary">
                  {isFree ? "Gratis" : `Rp ${totalPrice.toLocaleString("id-ID")}`}
                </p>
              </div>
            </div>
            <div className="space-y-sm">
              <button
                disabled={isProcessing}
                onClick={handleCheckout}
                className="w-full bg-primary text-on-primary font-bold text-label-md py-4 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base font-bold">
                      {isFree ? "done_all" : "lock"}
                    </span>
                    <span>{isFree ? "Konfirmasi Registrasi" : "Bayar Sekarang"}</span>
                  </>
                )}
              </button>
              <p className="text-center font-label-sm text-xs text-on-surface-variant px-4">
                Dengan menekan tombol, Anda menyetujui{" "}
                <a
                  className="text-primary underline cursor-pointer font-bold"
                  onClick={() => alert("Menampilkan Syarat & Ketentuan")}
                >
                  Syarat &amp; Ketentuan
                </a>{" "}
                SEMADIKSI.
              </p>
            </div>

            {/* Security Badges */}
            <div className="mt-lg pt-lg border-t border-surface-variant/30 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
              <span className="material-symbols-outlined text-4xl">
                verified_user
              </span>
              <span className="material-symbols-outlined text-4xl">
                security
              </span>
              <span className="material-symbols-outlined text-4xl">
                encrypted
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PembayaranPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-primary font-bold">Loading Checkout Details...</div>}>
      <PembayaranContent />
    </Suspense>
  );
}
