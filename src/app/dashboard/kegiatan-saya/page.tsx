"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface JoinedActivity {
  id: string;
  title: string;
  category: string;
  organizer: string;
  date: string;
  duration: string;
  status: "Selesai" | "Terdaftar" | "Berlangsung";
  code: string;
  img: string;
  description: string;
  location: string;
  rundown: string;
  speaker: string;
  materials?: string[];
}

function KegiatanSayaContent() {
  const searchParams = useSearchParams();
  const [activities, setActivities] = useState<JoinedActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<JoinedActivity | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<"info" | "rundown" | "speaker" | "materi">("info");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const defaultActivities: JoinedActivity[] = [
    {
      id: "act-1",
      title: "Latihan Kepemimpinan Mahasiswa Berprestasi (LKMB)",
      category: "Kepemimpinan",
      organizer: "SEMADIKSI Divisi Keorganisasian",
      date: "15 November 2024",
      duration: "16 JP (Jam Pelajaran)",
      status: "Selesai",
      code: "CERT-LKMB-2024-0891",
      img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      description: "Program intensif dua hari yang dirancang untuk mengasah keterampilan kepemimpinan, manajemen organisasi, komunikasi publik, serta etika bagi penerima beasiswa KIP-K.",
      location: "Gedung Auditorium GPH Haryo Mataram, Kampus Utama",
      rundown: "08.00 - 08.30 : Registrasi Peserta & Check-in\n08.30 - 09.00 : Pembukaan oleh Pembina Beasiswa\n09.00 - 12.00 : Sesi I: Kepemimpinan Berkarakter & Integritas\n12.00 - 13.00 : Ishoma (Istirahat, Sholat, Makan)\n13.00 - 15.00 : Sesi II: Public Speaking & Teknik Persidangan\n15.00 - 16.00 : Diskusi Kelompok & Post-Test",
      speaker: "Dr. Hendrawan, M.Si. (Konsultan Kepemimpinan Nasional) & Ahmad Subarjo (Ketua Alumni)",
      materials: ["Slide Presentasi Kepemimpinan.pdf", "Modul Teknik Sidang.pdf"]
    },
    {
      id: "act-2",
      title: "SEMADIKSI Berbagi: Volunteer Mengajar Pesisir",
      category: "Sosial",
      organizer: "SEMADIKSI Divisi Pengabdian Masyarakat",
      date: "12 Oktober 2024",
      duration: "20 Jam Sosial",
      status: "Selesai",
      code: "CERT-VOL-2024-1102",
      img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
      description: "Kegiatan pengabdian masyarakat mengajar anak-anak nelayan di pesisir Semarang Utara guna meningkatkan literasi baca-tulis, matematika dasar, dan motivasi belajar.",
      location: "SD Negeri Tambak Lorok 02, Pesisir Semarang Utara",
      rundown: "07.00 - 07.30 : Kumpul di Meeting Point (Rektorat) & Briefing\n07.30 - 08.15 : Perjalanan Menuju Lokasi Pesisir\n08.30 - 11.30 : Pembagian Kelas Mengajar & Sesi Belajar Ceria\n11.30 - 12.30 : Makan Siang Bersama Anak-Anak & Guru Pamong\n12.30 - 14.00 : Pembagian Alat Tulis & Games Kreatif\n14.00 - 14.30 : Evaluasi & Foto Bersama",
      speaker: "Relawan Pengajar SEMADIKSI & Kak Seto Mulyadi (Guest Star Sesi Motivasi)",
      materials: ["Pedoman Volunteer Mengajar.pdf", "Lembar Kerja Siswa SD.pdf"]
    },
    {
      id: "act-3",
      title: "Workshop Web Development Modern dengan Next.js",
      category: "Workshop",
      organizer: "SEMADIKSI Divisi IPTEK & Humas",
      date: "05 September 2024",
      duration: "8 JP",
      status: "Selesai",
      code: "CERT-WD-2024-0345",
      img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800",
      description: "Workshop praktis pembuatan web aplikasi modern menggunakan Next.js App Router, Tailwind CSS, TypeScript, dan proses deployment ke Vercel.",
      location: "Lab Komputer Terpadu Gedung C, Lantai 3",
      rundown: "08.30 - 09.00 : Registrasi & Set-up Lingkungan Pemrograman (Node.js & VS Code)\n09.00 - 10.30 : Teori: Pengenalan Next.js, React Server Components, & Routing\n10.30 - 12.00 : Praktik I: Membuat UI Layout dengan Tailwind CSS\n12.00 - 13.00 : Ishoma\n13.00 - 15.00 : Praktik II: Integrasi API, State Management, & Vercel Deployment\n15.00 - 15.30 : Sesi Tanya Jawab & Sertifikasi Kompetensi",
      speaker: "Ferdian W. (Senior Frontend Engineer) & Tim Developer SEMADIKSI",
      materials: ["Slide Workshop Next.js.pdf", "Repository Source Code Starter.zip"]
    }
  ];

  useEffect(() => {
    // Load registered activities from localStorage
    const loadActivities = () => {
      const stored = localStorage.getItem("semadiksi_registered_activities");
      if (stored) {
        try {
          const registered = JSON.parse(stored);
          // Combine defaults and custom-paid activities (deduplicated by title)
          const combined = [...defaultActivities];
          registered.forEach((act: JoinedActivity) => {
            if (!combined.some(c => c.title === act.title)) {
              combined.push(act);
            }
          });
          setActivities(combined);
        } catch (e) {
          setActivities(defaultActivities);
        }
      } else {
        setActivities(defaultActivities);
      }
    };

    loadActivities();

    // Check query params for payment success simulation
    const paymentSuccess = searchParams.get("payment_success");
    const activityTitle = searchParams.get("title");
    
    if (paymentSuccess === "true" && activityTitle) {
      setToastMessage(activityTitle);
      setShowToast(true);
      
      // Auto-hide toast after 8 seconds
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-lg relative">
      {/* Toast Notification Simulation */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#1e293b] text-white p-4 rounded-xl shadow-2xl border border-slate-700 w-[350px] max-w-[90vw] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl shrink-0">
              <span className="material-symbols-outlined text-primary font-bold">mail</span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Email Baru: SEMADIKSI</p>
                <button onClick={() => setShowToast(false)} className="text-slate-400 hover:text-white text-xs cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
              <p className="text-sm font-bold text-white">Pembayaran &amp; Tiket Terbit! 🎟️</p>
              <p className="text-xs text-slate-300 leading-normal">
                Notifikasi pembayaran berhasil untuk <strong>&ldquo;{toastMessage}&rdquo;</strong> telah dikirim. E-Tiket Anda aktif dan dapat diakses di menu ini.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <section className="space-y-sm">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface leading-tight">
          Kegiatan Saya
        </h2>
        <p className="text-on-surface-variant font-body-md text-base">
          Daftar seluruh program kegiatan dan agenda SEMADIKSI yang Anda ikuti. Masuk ke halaman kegiatan untuk melihat detail lokasi, agenda, narasumber, materi, dan unduhan tiket.
        </p>
      </section>

      {/* Grid List */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activities.map((act) => (
          <div
            key={act.id}
            className="bg-surface-container-lowest rounded-2xl border border-surface-variant/30 shadow-[0px_4px_25px_0px_rgba(27,109,36,0.04)] overflow-hidden flex flex-col justify-between hover:shadow-[0px_10px_35px_0px_rgba(27,109,36,0.08)] hover:-translate-y-1 transition-all duration-300"
          >
            {/* Image Banner */}
            <div className="h-44 relative overflow-hidden">
              <img className="w-full h-full object-cover" alt={act.title} src={act.img} />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-0.5 rounded-full text-xs font-semibold">
                {act.category}
              </div>
              <div className="absolute top-3 right-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold shadow-md border ${
                    act.status === "Selesai"
                      ? "bg-primary-container/20 text-primary border-primary"
                      : "bg-secondary-container/20 text-on-secondary-container border-secondary-container"
                  }`}
                >
                  {act.status}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-grow flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-outline font-semibold">
                  <span className="material-symbols-outlined text-[15px]">calendar_today</span>
                  <span>{act.date}</span>
                </div>
                <h3 className="font-bold text-base text-on-surface leading-tight line-clamp-2">
                  {act.title}
                </h3>
                <p className="text-on-surface-variant text-xs line-clamp-2">
                  {act.description}
                </p>
              </div>

              {/* Action Button: Masuk Kegiatan */}
              <div className="mt-5 pt-3 border-t border-surface-variant/30">
                <button
                  onClick={() => {
                    setSelectedActivity(act);
                    setActiveDetailTab("info");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-on-primary hover:brightness-110 rounded-xl font-bold text-sm cursor-pointer shadow-md active:scale-98 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  Masuk Kegiatan
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* EVENT DASHBOARD MODAL (Tampilan Selanjutnya / Event Detail Portal) */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl relative flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Banner */}
            <div className="h-48 relative shrink-0">
              <img className="w-full h-full object-cover" alt={selectedActivity.title} src={selectedActivity.img} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              {/* Title Overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">
                  {selectedActivity.category}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">{selectedActivity.title}</h3>
              </div>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="bg-surface-container-low px-6 border-b border-surface-variant/30 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
              {[
                { id: "info", label: "Detail Info", icon: "info" },
                { id: "rundown", label: "Agenda Acara", icon: "list_alt" },
                { id: "speaker", label: "Narasumber", icon: "record_voice_over" },
                { id: "materi", label: "Materi & Lampiran", icon: "folder_open" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDetailTab(tab.id as any)}
                  className={`flex items-center gap-1.5 py-4 px-3 font-bold text-xs border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeDetailTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content Scroll Area */}
            <div className="p-6 overflow-y-auto flex-grow space-y-4">
              {/* TAB 1: Detail Info */}
              {activeDetailTab === "info" && (
                <div className="space-y-4">
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl font-semibold shrink-0">location_on</span>
                    <div>
                      <h4 className="font-bold text-sm text-on-surface">Lokasi / Tempat Pelaksanaan</h4>
                      <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                        {selectedActivity.location}
                      </p>
                      <button 
                        onClick={() => alert("Membuka Google Maps...")} 
                        className="mt-2 text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">map</span> Lihat Rute Peta
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-container rounded-xl p-3">
                      <p className="text-[10px] text-outline uppercase font-semibold tracking-wider">Tanggal &amp; Waktu</p>
                      <p className="font-bold text-sm text-on-surface mt-1">{selectedActivity.date}</p>
                    </div>
                    <div className="bg-surface-container rounded-xl p-3">
                      <p className="text-[10px] text-outline uppercase font-semibold tracking-wider">Bobot JP / Kredit</p>
                      <p className="font-bold text-sm text-primary mt-1">{selectedActivity.duration}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm text-outline-variant uppercase tracking-wider">Tentang Kegiatan</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      {selectedActivity.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-xs text-outline font-semibold uppercase tracking-wider">No E-Tiket:</span>
                    <span className="px-3 py-1 bg-surface-container-high rounded text-xs font-mono font-bold text-on-surface">
                      {selectedActivity.code}
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: Agenda Acara */}
              {activeDetailTab === "rundown" && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-outline-variant uppercase tracking-wider">Jadwal Rundown Acara</h4>
                  <div className="relative border-l-2 border-primary/20 ml-2.5 pl-6 space-y-5">
                    {selectedActivity.rundown.split("\n").map((line, idx) => {
                      const parts = line.split(" : ");
                      const time = parts[0] || "";
                      const agenda = parts[1] || "";
                      return (
                        <div key={idx} className="relative">
                          {/* Timeline dot */}
                          <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-surface-container-lowest"></span>
                          <p className="text-xs font-bold text-primary">{time}</p>
                          <p className="text-sm font-semibold text-on-surface mt-0.5">{agenda}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: Narasumber */}
              {activeDetailTab === "speaker" && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-outline-variant uppercase tracking-wider">Narasumber &amp; Instruktur</h4>
                  <div className="bg-surface-container rounded-xl p-4 flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-xl shrink-0 font-bold">
                      {selectedActivity.speaker.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-base text-on-surface">{selectedActivity.speaker}</p>
                      <p className="text-xs text-on-surface-variant mt-1 leading-normal">
                        Narasumber ahli yang dipilih oleh panitia pelaksana SEMADIKSI untuk mengisi pemaparan materi serta membimbing jalannya kegiatan.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Materi & Lampiran */}
              {activeDetailTab === "materi" && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-outline-variant uppercase tracking-wider">Berkas &amp; Materi Pendukung</h4>
                  <div className="space-y-2">
                    {selectedActivity.materials && selectedActivity.materials.length > 0 ? (
                      selectedActivity.materials.map((m, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-surface-container-low p-3 rounded-xl border border-surface-variant/20 hover:bg-surface-container transition-all">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">description</span>
                            <span className="text-sm font-semibold text-on-surface">{m}</span>
                          </div>
                          <button
                            onClick={() => alert(`Mengunduh file: ${m}`)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">download</span> Unduh
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-outline italic">Berkas materi belum diunggah oleh panitia.</p>
                    )}
                  </div>

                  {selectedActivity.status === "Selesai" && (
                    <div className="pt-4 border-t border-surface-variant/30 space-y-3">
                      <h4 className="font-bold text-sm text-[#C5A059] uppercase tracking-wider">Sertifikat Kelulusan</h4>
                      <div className="bg-[#FDFBF7] border border-[#C5A059]/30 rounded-xl p-4 flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                          <span className="material-symbols-outlined text-[#C5A059] text-3xl font-bold">workspace_premium</span>
                          <div>
                            <p className="font-bold text-sm text-stone-800">Sertifikat Resmi Tersedia</p>
                            <p className="text-xs text-stone-500 mt-0.5">No Seri: {selectedActivity.code}</p>
                          </div>
                        </div>
                        <Link
                          href="/dashboard/sertifikat"
                          className="px-5 py-2.5 bg-primary text-on-primary hover:brightness-110 rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer text-center"
                        >
                          Lihat di Menu Sertifikat
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-6 bg-surface-container-low border-t border-surface-variant/30 flex gap-3 justify-end shrink-0">
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-6 py-2.5 border border-surface-variant text-on-surface-variant hover:bg-surface-variant/15 rounded-full font-bold text-sm cursor-pointer transition-all"
              >
                Tutup Portal
              </button>
              {selectedActivity.status !== "Selesai" && (
                <button
                  onClick={() => alert(`Mengunduh E-Tiket untuk check-in QR Code:\nNomor E-Tiket: ${selectedActivity.code}`)}
                  className="px-8 py-2.5 bg-primary text-on-primary hover:brightness-110 rounded-full font-bold text-sm cursor-pointer shadow-md active:scale-98 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                  Unduh E-Tiket Kegiatan
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function KegiatanSayaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-primary font-bold">Memuat Kegiatan Anda...</div>}>
      <KegiatanSayaContent />
    </Suspense>
  );
}
