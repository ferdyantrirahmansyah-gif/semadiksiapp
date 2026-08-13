"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export interface SeatLayoutConfig {
  rows: number;
  cols: number;
  aisles: number[];
  vipRows: string[];
  accessibleSeats?: string[];
  disabledSeats?: string[];
  customSeatTypes?: { [seatNo: string]: "regular" | "vip" | "accessible" | "disabled" };
  layoutPreset?: string;
}

interface Activity {
  id?: string;
  title: string;
  category: string;
  type: string; // Seminar, Sosial, Workshop, dll.
  date: string;
  desc: string;
  status: string;
  price: string;
  tags: string[];
  img: string;
  latest?: boolean;
  closed?: boolean;
  requireFileUpload?: boolean;
  fileUploadInstruction?: string;
  enableSeatBooking?: boolean;
  seatLayoutConfig?: SeatLayoutConfig;
  quota?: number;
  xpPoints?: number;
}

const getQuotaStatus = (act: Activity) => {
  const isSeatBooking = !!act.enableSeatBooking;
  
  if (isSeatBooking) {
    let total = act.quota || 100;
    if (act.seatLayoutConfig) {
      total = (act.seatLayoutConfig.rows * act.seatLayoutConfig.cols) - (act.seatLayoutConfig.disabledSeats?.length || 0);
    }
    let booked = 0;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`semadiksi_bookings_${act.id}`);
      if (stored) {
        try {
          booked = JSON.parse(stored).length;
        } catch (e) {}
      } else {
        // Initialize mock bookings to make it look active
        const initialCount = Math.min(Math.floor(total * 0.4), 24);
        const mockBookings = Array.from({ length: initialCount }).map((_, idx) => ({
          seatNumber: `B-${idx + 1}`,
          userName: "Mahasiswa KIP",
          userEmail: "mhs@unusa.ac.id"
        }));
        localStorage.setItem(`semadiksi_bookings_${act.id}`, JSON.stringify(mockBookings));
        booked = mockBookings.length;
      }
    }
    return {
      total,
      booked,
      available: Math.max(0, total - booked)
    };
  } else {
    const total = act.quota || 100;
    let booked = 0;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`semadiksi_reg_count_${act.id}`);
      if (stored) {
        booked = parseInt(stored, 10) || 0;
      } else {
        // Generate a deterministic mock registration count based on activity title
        let charSum = 0;
        for (let i = 0; i < act.title.length; i++) {
          charSum += act.title.charCodeAt(i);
        }
        const minPercent = 35;
        const maxPercent = 75;
        const percent = minPercent + (charSum % (maxPercent - minPercent));
        booked = Math.floor((total * percent) / 100);
        localStorage.setItem(`semadiksi_reg_count_${act.id}`, booked.toString());
      }
    }
    return {
      total,
      booked,
      available: Math.max(0, total - booked)
    };
  }
};

export default function KegiatanPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");
  const [activities, setActivities] = useState<Activity[]>([]);

  const defaultActs: Activity[] = [
    {
      id: "act-a",
      title: "SEMADIKSI Peduli: Bakti Sosial Akhir Tahun",
      category: "Sosial",
      type: "Sosial",
      date: "24 Desember 2024",
      desc: "Mari bergabung dalam aksi nyata untuk berbagi kebahagiaan bersama saudara-saudara kita di Panti Asuhan Kasih Bunda. Kegiatan meliputi penyaluran donasi dan edukasi kreatif.",
      status: "Gratis",
      price: "Gratis",
      tags: ["KIP-K", "Sosial"],
      img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800",
      latest: true,
      xpPoints: 200
    },
    {
      id: "act-b",
      title: "Latihan Kepemimpinan Mahasiswa Berprestasi",
      category: "Seminar",
      type: "Seminar",
      date: "15 November 2024",
      desc: "Program intensif 2 hari untuk mengasah skill kepemimpinan, manajemen waktu, dan public speaking bagi penerima beasiswa.",
      status: "Pendaftaran Ditutup",
      price: "IDR 25.000",
      tags: ["Kepemimpinan", "Internal"],
      img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      closed: true,
      xpPoints: 300
    },
    {
      id: "act-c",
      title: "SEMADIKSI Cultural Night & Reunion",
      category: "Workshop",
      type: "Workshop",
      date: "10 Januari 2025",
      desc: "Malam keakraban antar angkatan dengan pertunjukan seni budaya dan sharing session dari alumni inspiratif.",
      status: "Beli Tiket",
      price: "IDR 50.000",
      tags: ["Budaya", "Hiburan"],
      img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
      xpPoints: 150
    },
    {
      id: "act-d",
      title: "Lomba Poster Digital SEMADIKSI 2025",
      category: "Lomba",
      type: "Lomba",
      date: "15 Februari 2025",
      desc: "Tunjukkan kreativitas Anda dalam mendesain poster digital dengan tema 'Inovasi Mahasiswa KIP-K untuk Indonesia Emas 2045'. Terbuka untuk umum dan mahasiswa KIP-K.",
      status: "Daftar Lomba",
      price: "Gratis",
      tags: ["Lomba", "Kreativitas", "Nasional"],
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
      requireFileUpload: true,
      fileUploadInstruction: "Unggah karya poster digital Anda dalam format PNG/JPG dengan ukuran maksimal 5MB.",
      xpPoints: 500
    },
  ];

  useEffect(() => {
    const storedActivities = localStorage.getItem("semadiksi_activities");
    if (storedActivities) {
      try {
        setActivities(JSON.parse(storedActivities));
      } catch (e) {
        setActivities(defaultActs);
      }
    } else {
      setActivities(defaultActs);
      localStorage.setItem("semadiksi_activities", JSON.stringify(defaultActs));
    }
  }, []);

  // Filtering Logic
  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(search.toLowerCase()) ||
      act.desc.toLowerCase().includes(search.toLowerCase());

    const matchesTab = activeTab === "Semua" || act.category === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-lg relative">
      {/* Header & Filter Section */}
      <section className="space-y-md">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface leading-tight">
              Kegiatan &amp; Agenda Mahasiswa
            </h2>
            <p className="text-on-surface-variant mt-2 font-body-md text-base">
              Temukan berbagai kegiatan akademik, sosial, dan pengembangan diri
              bersama komunitas SEMADIKSI.
            </p>
          </div>
        </div>

        {/* Modern Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-surface-variant/30 z-10 relative">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 font-body-md transition-all outline-none text-on-surface"
              placeholder="Cari kegiatan atau tema..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {["Semua", "Seminar", "Sosial", "Workshop", "Lomba"].map((tab) => (
              <button
                key={tab}
                className={`whitespace-nowrap px-6 py-3 font-bold rounded-lg cursor-pointer transition-all ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-variant/20"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Activities List */}
      <section className="grid grid-cols-1 gap-md">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((act, index) => {
            return (
              <div
                key={index}
                className={`group flex flex-col md:flex-row bg-surface-container-lowest rounded-xl border border-surface-variant/30 shadow-[0px_4px_20px_0px_rgba(27,109,36,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0px_8px_30px_0px_rgba(27,109,36,0.1)] hover:-translate-y-0.5 ${
                  act.closed ? "grayscale opacity-80" : ""
                }`}
              >
                <div className="md:w-72 lg:w-96 shrink-0 relative min-h-[200px]">
                  <img
                    className="w-full h-full object-cover"
                    alt={act.title}
                    src={act.img}
                  />
                  {act.latest && (
                    <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold shadow-md">
                      Terbaru
                    </div>
                  )}
                  {act.closed && (
                    <div className="absolute inset-0 bg-surface-dim/40 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                        Kegiatan Berakhir
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-grow p-md flex flex-col justify-between">
                  <div>
                    <div
                      className={`flex items-center gap-2 font-semibold text-sm mb-2 ${
                        act.closed ? "text-outline" : "text-primary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        calendar_today
                      </span>
                      <span>{act.date}</span>
                    </div>
                    <h3
                      className={`font-bold text-xl leading-tight transition-colors ${
                        act.closed
                          ? "text-outline"
                          : "text-on-surface group-hover:text-primary"
                      }`}
                    >
                      {act.title}
                    </h3>
                    <p
                      className={`mt-2 font-body-md ${
                        act.closed ? "text-outline" : "text-on-surface-variant"
                      }`}
                    >
                      {act.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {act.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            act.closed
                              ? "bg-surface-container text-outline"
                              : "bg-secondary-container text-on-secondary-container"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                      {!act.closed && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-tertiary-container text-on-tertiary-container border border-tertiary/10 rounded-full text-xs font-bold shadow-sm">
                          <span className="material-symbols-outlined text-[14px]">volunteer_activism</span>
                          <span>+{act.xpPoints || 250} XP</span>
                        </span>
                      )}
                    </div>

                    {/* Quota Status Indicator */}
                    {(() => {
                      const status = getQuotaStatus(act);
                      const percentFilled = (status.booked / status.total) * 100;
                      const isLow = status.available <= 10 && status.available > 0;
                      const isFull = status.available === 0;

                      return (
                        <div className="mt-4 space-y-1.5 animate-in fade-in duration-200">
                          <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px] text-primary">group</span>
                              <span>Kuota Terisi: <strong className="text-on-surface">{status.booked}</strong> / {status.total} ({status.available} Tersedia)</span>
                            </div>
                            <div>
                              {isFull ? (
                                <span className="text-error font-bold">Penuh</span>
                              ) : isLow ? (
                                <span className="text-error font-bold animate-pulse">Sisa Sedikit</span>
                              ) : (
                                <span className="text-primary font-bold">Tersedia</span>
                              )}
                            </div>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/50">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isFull ? "bg-error" : isLow ? "bg-error" : "bg-primary"
                              }`}
                              style={{ width: `${percentFilled}%` }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-surface-variant/30">
                    <div
                      className={`font-extrabold text-xl ${
                        act.closed ? "text-outline" : "text-on-surface"
                      }`}
                    >
                      {act.price}
                    </div>
                    {act.closed ? (
                      <button
                        className="px-8 py-3 bg-surface-variant text-on-surface-variant rounded-xl font-bold cursor-not-allowed"
                        disabled
                      >
                        Pendaftaran Ditutup
                      </button>
                    ) : getQuotaStatus(act).available === 0 ? (
                      <button
                        className="px-8 py-3 bg-surface-variant text-on-surface-variant rounded-xl font-bold cursor-not-allowed"
                        disabled
                      >
                        Kuota Penuh
                      </button>
                    ) : (
                      <Link
                        href={`/dashboard/pembayaran?title=${encodeURIComponent(act.title)}&activityId=${encodeURIComponent(act.id || "")}`}
                        className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold hover:brightness-110 shadow-md active:scale-95 transition-all text-center cursor-pointer"
                      >
                        {act.status}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-xl bg-surface-container-lowest rounded-xl border border-dashed border-surface-variant/50">
            <span className="material-symbols-outlined text-5xl text-outline mb-2">
              search_off
            </span>
            <p className="font-bold text-on-surface-variant text-lg">
              Tidak ada kegiatan yang ditemukan
            </p>
            <p className="text-outline">
              Coba gunakan filter kata kunci atau kategori yang lain.
            </p>
          </div>
        )}
      </section>

      {/* Pagination or Load More */}
      <div className="flex justify-center pt-8">
        <button
          onClick={() => alert("Menampilkan lebih banyak kegiatan...")}
          className="flex items-center gap-2 px-8 py-4 bg-surface-container-low text-primary font-bold rounded-full hover:bg-primary/10 transition-all border border-primary/20 cursor-pointer"
        >
          Lihat Kegiatan Lainnya
          <span className="material-symbols-outlined">expand_more</span>
        </button>
      </div>
    </div>
  );
}
