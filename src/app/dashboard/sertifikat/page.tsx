"use client";

import { useState } from "react";

interface AttendedActivity {
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
}

export default function SertifikatPage() {
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"Semua" | "Selesai" | "Terdaftar">("Semua");
  const [selectedCert, setSelectedCert] = useState<AttendedActivity | null>(null);
  const [showInfoModal, setShowInfoModal] = useState<AttendedActivity | null>(null);

  const myActivities: AttendedActivity[] = [
    {
      id: "act-1",
      title: "Latihan Kepemimpinan Mahasiswa Berprestasi (LKMB)",
      category: "Kepemimpinan",
      organizer: "SEMADIKSI Divisi Keorganisasian",
      date: "15 November 2024",
      duration: "16 JP (Jam Pelajaran)",
      status: "Selesai",
      code: "CERT-LKMB-2024-0891",
      img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
      description: "Program intensif dua hari yang dirancang untuk mengasah keterampilan kepemimpinan, manajemen organisasi, komunikasi publik, serta etika bagi penerima beasiswa KIP-K.",
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
      img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
      description: "Kegiatan pengabdian masyarakat mengajar anak-anak nelayan di pesisir Semarang Utara guna meningkatkan literasi baca-tulis, matematika dasar, dan motivasi belajar.",
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
      img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80",
      description: "Workshop praktis pembuatan web aplikasi modern menggunakan Next.js App Router, Tailwind CSS, TypeScript, dan proses deployment ke Vercel.",
    },
    {
      id: "act-4",
      title: "SEMADIKSI Peduli: Bakti Sosial Akhir Tahun",
      category: "Sosial",
      organizer: "SEMADIKSI Divisi Pengabdian Masyarakat",
      date: "24 Desember 2024",
      duration: "10 Jam Sosial",
      status: "Terdaftar",
      code: "PENDING",
      img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80",
      description: "Penyaluran donasi sembako, pakaian layak pakai, dan kelas edukasi kreatif bagi anak-anak asuh di Panti Asuhan Kasih Bunda menjelang akhir tahun.",
    },
  ];

  // Filtering Logic
  const filtered = myActivities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(search.toLowerCase()) ||
      act.organizer.toLowerCase().includes(search.toLowerCase());

    const matchesTab =
      filterTab === "Semua" ||
      (filterTab === "Selesai" && act.status === "Selesai") ||
      (filterTab === "Terdaftar" && act.status === "Terdaftar");

    return matchesSearch && matchesTab;
  });

  const completedCount = myActivities.filter((a) => a.status === "Selesai").length;
  const registeredCount = myActivities.filter((a) => a.status === "Terdaftar").length;

  const handleDownload = (act: AttendedActivity) => {
    alert(`Mengunduh sertifikat resmi untuk: \n${act.title}\nNomor Seri: ${act.code}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-lg relative">
      {/* Page Header */}
      <section className="space-y-md">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface leading-tight">
            Sertifikat &amp; Riwayat Kegiatan
          </h2>
          <p className="text-on-surface-variant mt-2 font-body-md text-base">
            Pantau partisipasi kegiatan Anda, lihat detail program yang diikuti, dan unduh sertifikat resmi sebagai bukti portofolio Anda.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
          {/* Card 1 */}
          <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-5 shadow-[0px_4px_20px_0px_rgba(27,109,36,0.03)] flex items-center gap-4 hover:shadow-[0px_8px_30px_0px_rgba(27,109,36,0.06)] hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[28px] font-bold">task_alt</span>
            </div>
            <div>
              <p className="text-on-surface-variant text-label-sm font-semibold uppercase tracking-wider">Total Partisipasi</p>
              <h3 className="text-2xl font-extrabold text-on-surface mt-1">{myActivities.length} Kegiatan</h3>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-5 shadow-[0px_4px_20px_0px_rgba(27,109,36,0.03)] flex items-center gap-4 hover:shadow-[0px_8px_30px_0px_rgba(27,109,36,0.06)] hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[28px] font-bold">workspace_premium</span>
            </div>
            <div>
              <p className="text-on-surface-variant text-label-sm font-semibold uppercase tracking-wider">Sertifikat Terbit</p>
              <h3 className="text-2xl font-extrabold text-on-surface mt-1">{completedCount} Sertifikat</h3>
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-5 shadow-[0px_4px_20px_0px_rgba(27,109,36,0.03)] flex items-center gap-4 hover:shadow-[0px_8px_30px_0px_rgba(27,109,36,0.06)] hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-secondary-container/30 flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-[28px] font-bold">schedule</span>
            </div>
            <div>
              <p className="text-on-surface-variant text-label-sm font-semibold uppercase tracking-wider">Kegiatan Mendatang</p>
              <h3 className="text-2xl font-extrabold text-on-surface mt-1">{registeredCount} Terdaftar</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className="flex flex-col md:flex-row gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-surface-variant/30 z-10 relative">
        <div className="relative flex-grow">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 font-body-md transition-all outline-none text-on-surface"
            placeholder="Cari kegiatan atau nomor seri sertifikat..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { label: "Semua Kegiatan", value: "Semua" },
            { label: "Selesai", value: "Selesai" },
            { label: "Mendatang / Terdaftar", value: "Terdaftar" },
          ].map((tab) => (
            <button
              key={tab.value}
              className={`whitespace-nowrap px-6 py-3 font-bold rounded-lg cursor-pointer transition-all ${
                filterTab === tab.value
                  ? "bg-primary text-white"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-variant/20"
              }`}
              onClick={() => setFilterTab(tab.value as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Activities Grid list */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length > 0 ? (
          filtered.map((act) => (
            <div
              key={act.id}
              className="bg-surface-container-lowest rounded-2xl border border-surface-variant/30 shadow-[0px_4px_25px_0px_rgba(27,109,36,0.04)] overflow-hidden flex flex-col justify-between hover:shadow-[0px_10px_35px_0px_rgba(27,109,36,0.08)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Card Image and Badge */}
              <div className="h-48 relative overflow-hidden shrink-0">
                <img className="w-full h-full object-cover" alt={act.title} src={act.img} />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    {act.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-md border ${
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
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-outline">
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                    <span>{act.date}</span>
                    <span className="w-1 h-1 bg-outline/30 rounded-full"></span>
                    <span>{act.duration}</span>
                  </div>
                  <h3 className="font-bold text-lg text-on-surface leading-tight hover:text-primary transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm line-clamp-2">{act.description}</p>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-surface-variant/30 flex items-center justify-between gap-2">
                  {act.status === "Selesai" ? (
                    <>
                      <button
                        onClick={() => setSelectedCert(act)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-primary text-primary hover:bg-primary/5 rounded-xl font-bold text-sm cursor-pointer transition-all active:scale-98"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        Lihat Sertifikat
                      </button>
                      <button
                        onClick={() => handleDownload(act)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-on-primary hover:brightness-110 rounded-xl font-bold text-sm cursor-pointer transition-all active:scale-98 shadow-md"
                      >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Unduh
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowInfoModal(act)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-surface-variant text-on-surface-variant hover:bg-surface-variant/10 rounded-xl font-bold text-sm cursor-pointer transition-all active:scale-98"
                      >
                        <span className="material-symbols-outlined text-[18px]">info</span>
                        Informasi Kegiatan
                      </button>
                      <div className="flex-1 text-center py-2 bg-surface-container rounded-xl text-outline font-semibold text-xs border border-dashed border-outline-variant/50">
                        Belum Terlaksana
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-xl bg-surface-container-lowest rounded-2xl border border-dashed border-surface-variant/50">
            <span className="material-symbols-outlined text-5xl text-outline mb-2">search_off</span>
            <p className="font-bold text-on-surface-variant text-lg">Tidak ada riwayat kegiatan ditemukan</p>
            <p className="text-outline">Coba cari dengan kata kunci lain atau pilih tab filter lainnya.</p>
          </div>
        )}
      </section>

      {/* MODAL 1: Interactive High-Fidelity Certificate Viewer */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-surface-variant/30 mb-6">
              <div>
                <h3 className="font-bold text-xl text-on-surface">Pratinjau Sertifikat Resmi</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">No Seri: {selectedCert.code}</p>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-variant/30 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            {/* Certificate Paper Rendering */}
            <div className="flex-grow flex items-center justify-center p-2 md:p-6 bg-surface-container-low rounded-2xl overflow-x-auto shadow-inner">
              <div
                className="w-[800px] h-[560px] bg-[#FDFBF7] border-[12px] border-double border-[#C5A059] p-10 flex flex-col justify-between relative shrink-0 shadow-lg text-stone-800 select-none"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {/* Background decorative watermark patterns */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#C5A059_2px,transparent_2px)] [background-size:16px_16px]"></div>
                <div className="absolute top-8 left-8 right-8 bottom-8 border border-[#C5A059]/20 pointer-events-none"></div>

                {/* Certificate Header */}
                <div className="text-center space-y-2 z-10">
                  <div className="flex justify-center items-center gap-2 mb-1">
                    <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[16px] font-bold">
                      S
                    </span>
                    <span className="font-display font-extrabold text-primary tracking-widest text-lg">SEMADIKSI</span>
                  </div>
                  <h4 className="font-serif tracking-[0.2em] text-[#C5A059] text-sm uppercase font-semibold">Sertifikat Penghargaan</h4>
                  <p className="text-[10px] text-stone-500 tracking-wider">NOMOR SERI ELEKTRONIK: {selectedCert.code}</p>
                </div>

                {/* Certificate Body */}
                <div className="text-center space-y-4 z-10">
                  <p className="font-serif italic text-stone-500 text-sm">Dengan bangga mempersembahkan penghargaan kepada:</p>
                  <div>
                    <h1 className="font-display text-3xl font-extrabold text-[#1B6D24] tracking-wide border-b-2 border-stone-300 w-fit mx-auto pb-1 px-8 uppercase">
                      Ahmad Fauzan
                    </h1>
                    <p className="text-[11px] text-stone-500 mt-2 font-semibold uppercase tracking-widest">
                      Mahasiswa KIP-K • Universitas Diponegoro
                    </p>
                  </div>
                  <p className="max-w-xl mx-auto text-xs leading-relaxed text-stone-600">
                    Atas partisipasi aktif dan kontribusinya sebagai <span className="font-bold text-stone-800">Peserta</span> dalam kegiatan:
                    <br />
                    <span className="font-bold text-stone-800 text-sm mt-1 inline-block">
                      &ldquo;{selectedCert.title}&rdquo;
                    </span>
                    <br />
                    Yang diselenggarakan oleh <span className="font-semibold text-stone-700">{selectedCert.organizer}</span> pada tanggal <span className="font-semibold">{selectedCert.date}</span> dengan bobot ekuivalensi <span className="font-semibold text-primary">{selectedCert.duration}</span>.
                  </p>
                </div>

                {/* Certificate Footer (Signatures & Seal) */}
                <div className="flex justify-between items-end px-6 z-10">
                  {/* Left Sign */}
                  <div className="text-center space-y-1 w-44">
                    <div className="h-12 flex items-center justify-center border-b border-stone-300 relative">
                      {/* Fake Cursive Signature */}
                      <span className="font-serif italic text-[#1B6D24] text-lg select-none opacity-80 rotate-[-4deg]">
                        m.fatih
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-stone-700">Muhammad Fatih</p>
                    <p className="text-[8px] text-stone-500">Ketua Umum SEMADIKSI</p>
                  </div>

                  {/* Middle Golden Seal Badge */}
                  <div className="flex flex-col items-center justify-center relative -bottom-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E6C98A] via-[#C5A059] to-[#9E7E38] shadow-md flex items-center justify-center border-4 border-[#FDFBF7] relative z-20">
                      <span className="material-symbols-outlined text-white text-[28px] font-bold">workspace_premium</span>
                    </div>
                    <div className="absolute w-20 h-20 rounded-full border border-dashed border-[#C5A059]/40 z-10 animate-spin-slow"></div>
                    <span className="text-[8px] font-bold text-[#C5A059] mt-1.5 uppercase tracking-widest">VERIFIED KIP-K</span>
                  </div>

                  {/* Right Sign / QR Validation */}
                  <div className="text-center space-y-1 w-44 flex flex-col items-center">
                    <a
                      href={`/verifikasi?code=${selectedCert.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white p-1 border border-stone-200 shadow-sm flex items-center justify-center cursor-pointer hover:border-primary transition-all group relative"
                      title="Klik untuk mensimulasikan pemindaian QR Code"
                    >
                      {/* Realistic Mock Validation QR Code */}
                      <div className="w-full h-full bg-[radial-gradient(#1A1C1C_3px,transparent_3px)] [background-size:7px_7px] relative">
                        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-2 border-stone-800 bg-white"></div>
                        <div className="absolute top-0 right-0 w-3.5 h-3.5 border-2 border-stone-800 bg-white"></div>
                        <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-2 border-stone-800 bg-white"></div>
                      </div>
                      
                      {/* Hover overlay link icon */}
                      <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="material-symbols-outlined text-white text-[16px]">open_in_new</span>
                      </div>
                    </a>
                    <p className="text-[8px] font-semibold text-stone-500 uppercase tracking-wider mt-1">Pindai untuk Validasi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-4 mt-6 pt-4 border-t border-surface-variant/30 justify-end">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-6 py-3 border border-surface-variant text-on-surface-variant hover:bg-surface-variant/15 rounded-full font-bold text-sm cursor-pointer transition-all"
              >
                Kembali
              </button>
              <button
                onClick={() => handleDownload(selectedCert)}
                className="px-8 py-3 bg-primary text-on-primary hover:brightness-110 rounded-full font-bold text-sm cursor-pointer shadow-md active:scale-98 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Unduh PDF Resmi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Activity Information Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-xl shadow-2xl relative flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Image Banner */}
            <div className="h-56 relative">
              <img className="w-full h-full object-cover" alt={showInfoModal.title} src={showInfoModal.img} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <button
                onClick={() => setShowInfoModal(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">
                  {showInfoModal.category}
                </span>
                <h3 className="text-xl font-bold text-white leading-tight">{showInfoModal.title}</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-outline-variant uppercase tracking-wider">Deskripsi Kegiatan</h4>
                <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">
                  {showInfoModal.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-surface-variant/30">
                <div className="space-y-1">
                  <p className="text-xs text-outline font-semibold uppercase tracking-wider">Penyelenggara</p>
                  <p className="font-bold text-sm text-on-surface">{showInfoModal.organizer}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-outline font-semibold uppercase tracking-wider">Waktu Pelaksanaan</p>
                  <p className="font-bold text-sm text-on-surface">{showInfoModal.date}</p>
                </div>
                <div className="space-y-1 mt-2">
                  <p className="text-xs text-outline font-semibold uppercase tracking-wider">Bobot Kredit / Durasi</p>
                  <p className="font-bold text-sm text-primary">{showInfoModal.duration}</p>
                </div>
                <div className="space-y-1 mt-2">
                  <p className="text-xs text-outline font-semibold uppercase tracking-wider">Status Partisipasi</p>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container/20 text-on-secondary-container border border-secondary-container">
                    <span className="w-1.5 h-1.5 bg-secondary-container rounded-full animate-pulse"></span>
                    Terdaftar
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-surface-container-low border-t border-surface-variant/30 flex gap-3 justify-end">
              <button
                onClick={() => setShowInfoModal(null)}
                className="px-6 py-2.5 border border-surface-variant text-on-surface-variant hover:bg-surface-variant/15 rounded-full font-bold text-sm cursor-pointer transition-all"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setShowInfoModal(null);
                  alert("Membuka tiket kegiatan untuk check-in QR Code...");
                }}
                className="px-8 py-2.5 bg-primary text-on-primary hover:brightness-110 rounded-full font-bold text-sm cursor-pointer shadow-md active:scale-98 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                Lihat Tiket Masuk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
