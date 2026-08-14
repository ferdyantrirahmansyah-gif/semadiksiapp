"use client";

import { useState, useEffect } from "react";
import { BeasiswaItem, INITIAL_INFO_BEASISWA } from "@/data/portalData";

export default function InfoBeasiswaPage() {
  const [beasiswaList, setBeasiswaList] = useState<BeasiswaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Dibuka" | "Segera Dibuka" | "Ditutup">("Semua");
  const [categoryFilter, setCategoryFilter] = useState<string>("Semua");
  const [selectedBeasiswa, setSelectedBeasiswa] = useState<BeasiswaItem | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("semadiksi_info_beasiswa");
      if (stored) {
        setBeasiswaList(JSON.parse(stored));
      } else {
        setBeasiswaList(INITIAL_INFO_BEASISWA);
        localStorage.setItem("semadiksi_info_beasiswa", JSON.stringify(INITIAL_INFO_BEASISWA));
      }
    } catch (e) {
      setBeasiswaList(INITIAL_INFO_BEASISWA);
    }
  }, []);

  const filteredList = beasiswaList.filter((item) => {
    if (statusFilter !== "Semua" && item.status !== statusFilter) {
      return false;
    }
    if (categoryFilter !== "Semua" && item.category !== categoryFilter) {
      return false;
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.provider.toLowerCase().includes(q) ||
        item.coverage.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openCount = beasiswaList.filter(b => b.status === "Dibuka").length;
  const soonCount = beasiswaList.filter(b => b.status === "Segera Dibuka").length;
  const closedCount = beasiswaList.filter(b => b.status === "Ditutup").length;

  const categoryColorMap: { [key: string]: string } = {
    "KIP Kuliah": "bg-primary/10 text-primary border-primary/20",
    "Prestasi Akademik": "bg-indigo-500/10 text-indigo-700 border-indigo-200",
    "Prestasi Non-Akademik": "bg-purple-500/10 text-purple-700 border-purple-200",
    "Bantuan UKT / Biaya Hidup": "bg-amber-500/10 text-amber-700 border-amber-200",
    "Beasiswa Swasta / BUMN": "bg-blue-500/10 text-blue-700 border-blue-200",
    "Lainnya": "bg-stone-500/10 text-stone-700 border-stone-200",
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-900/10 via-surface to-surface-container-low border border-primary/20 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/15 text-primary rounded-full text-xs font-bold border border-primary/25">
            <span className="material-symbols-outlined text-[15px]">school</span>
            <span>Pusat Layanan Beasiswa UNUSA</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface">
            Informasi Program Beasiswa
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
            Informasi resmi pendaftaran beasiswa KIP Kuliah, beasiswa prestasi UNUSA, beasiswa kemitraan industri & perbankan, serta bantuan pendanaan studi bagi mahasiswa aktif.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-surface-variant/30 relative z-10">
          <div className="bg-surface/80 backdrop-blur rounded-2xl p-3.5 border border-surface-variant/20">
            <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Total Program</p>
            <p className="text-lg md:text-xl font-black text-on-surface mt-0.5">{beasiswaList.length} Beasiswa</p>
          </div>
          <div className="bg-surface/80 backdrop-blur rounded-2xl p-3.5 border border-surface-variant/20">
            <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Sedang Dibuka</p>
            <p className="text-lg md:text-xl font-black text-primary mt-0.5">{openCount} Program</p>
          </div>
          <div className="bg-surface/80 backdrop-blur rounded-2xl p-3.5 border border-surface-variant/20">
            <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Segera Dibuka</p>
            <p className="text-lg md:text-xl font-black text-amber-600 mt-0.5">{soonCount} Program</p>
          </div>
          <div className="bg-surface/80 backdrop-blur rounded-2xl p-3.5 border border-surface-variant/20">
            <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Telah Ditutup</p>
            <p className="text-lg md:text-xl font-black text-outline mt-0.5">{closedCount} Program</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-surface border border-surface-variant/30 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        {/* Search Box */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Cari nama beasiswa, instansi penyedia, atau cakupan biaya..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-surface-variant/20 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-xs font-semibold text-on-surface"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Status Tabs & Category */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Pills */}
          <div className="flex gap-1 bg-surface-container p-1 rounded-xl text-xs font-bold">
            {(["Semua", "Dibuka", "Segera Dibuka", "Ditutup"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-[11px] ${
                  statusFilter === st
                    ? "bg-primary text-white shadow-sm font-bold"
                    : "text-on-surface-variant hover:bg-surface-variant/20"
                }`}
              >
                {st === "Dibuka" ? `🟢 Dibuka (${openCount})` : st === "Segera Dibuka" ? `🟡 Segera (${soonCount})` : st === "Ditutup" ? `🔴 Tutup (${closedCount})` : "Semua"}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-surface-container border border-surface-variant/20 rounded-xl text-xs font-bold text-on-surface outline-none cursor-pointer"
          >
            <option value="Semua">📁 Semua Kategori</option>
            <option value="KIP Kuliah">KIP Kuliah</option>
            <option value="Prestasi Akademik">Prestasi Akademik</option>
            <option value="Prestasi Non-Akademik">Prestasi Non-Akademik</option>
            <option value="Bantuan UKT / Biaya Hidup">Bantuan UKT / Biaya Hidup</option>
            <option value="Beasiswa Swasta / BUMN">Beasiswa Swasta / BUMN</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
      </div>

      {/* Grid of Scholarships */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((item) => {
            const isDibuka = item.status === "Dibuka";
            const isSegera = item.status === "Segera Dibuka";

            return (
              <div
                key={item.id}
                className="bg-surface-container-lowest border border-surface-variant/30 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Banner Thumbnail */}
                <div className="h-44 relative overflow-hidden bg-surface-container">
                  <img
                    src={item.bannerImg}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black border backdrop-blur shadow-sm ${
                        categoryColorMap[item.category] || "bg-surface-container text-on-surface"
                      }`}
                    >
                      {item.category}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide shadow-sm flex items-center gap-1 ${
                        isDibuka
                          ? "bg-emerald-600 text-white"
                          : isSegera
                            ? "bg-amber-500 text-white"
                            : "bg-red-600 text-white"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      <span>{item.status}</span>
                    </span>
                  </div>

                  {/* Deadline on banner bottom */}
                  <div className="absolute bottom-3 left-3 right-3 text-white flex justify-between items-center text-xs font-semibold drop-shadow">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px]">event_busy</span>
                      <span>Batas: {item.closeDate}</span>
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div>
                      <p className="text-[11px] font-bold text-primary truncate">{item.provider}</p>
                      <h3 className="font-bold text-base text-on-surface leading-snug line-clamp-2 group-hover:text-primary transition-colors mt-0.5">
                        {item.title}
                      </h3>
                    </div>

                    {/* Coverage Highlight Box */}
                    <div className="bg-primary/5 border border-primary/15 rounded-xl p-2.5 space-y-0.5">
                      <p className="text-[10px] font-extrabold text-primary uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">verified</span>
                        <span>Cakupan & Benefit:</span>
                      </p>
                      <p className="text-xs font-semibold text-on-surface line-clamp-2">
                        {item.coverage}
                      </p>
                    </div>

                    {/* Requirements Preview */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-outline uppercase">Syarat Utama:</p>
                      <ul className="text-xs text-on-surface-variant space-y-1 list-disc list-inside line-clamp-2">
                        {item.requirements.slice(0, 2).map((req, rIdx) => (
                          <li key={rIdx} className="truncate">{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-surface-variant/20 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedBeasiswa(item)}
                      className="flex-1 py-2.5 px-3 bg-surface-container hover:bg-surface-variant/30 text-on-surface rounded-xl font-bold text-xs transition-all border border-surface-variant/30 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">info</span>
                      <span>Detail & Syarat</span>
                    </button>

                    {item.applyUrl && isDibuka && (
                      <a
                        href={item.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 bg-primary text-on-primary hover:brightness-110 active:scale-95 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Daftar</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-3xl p-12 text-center text-outline">
          <span className="material-symbols-outlined text-5xl block mb-2 text-outline/40">school</span>
          <p className="font-bold text-base text-on-surface">Tidak ada program beasiswa yang cocok dengan filter Anda.</p>
          <p className="text-xs text-outline mt-1">Silakan sesuaikan kata kunci pencarian atau ganti status filter pendaftaran.</p>
        </div>
      )}

      {/* MODAL: DETAIL LENGKAP BEASISWA & SYARAT PENDAFTARAN */}
      {selectedBeasiswa && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-surface-variant/30 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">school</span>
                </span>
                <div>
                  <h3 className="font-bold text-lg text-on-surface">Detail Informasi Beasiswa</h3>
                  <p className="text-xs text-on-surface-variant">Penyelenggara: <strong className="text-primary">{selectedBeasiswa.provider}</strong></p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBeasiswa(null)}
                className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-variant/30 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            {/* Banner & Title Section */}
            <div className="space-y-6">
              <div className="h-56 rounded-2xl overflow-hidden relative shadow-inner bg-surface-container">
                <img
                  src={selectedBeasiswa.bannerImg}
                  alt={selectedBeasiswa.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-primary text-white rounded-full text-xs font-bold">
                      {selectedBeasiswa.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedBeasiswa.status === "Dibuka" ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                    }`}>
                      Status: {selectedBeasiswa.status}
                    </span>
                  </div>
                  <h2 className="font-extrabold text-xl md:text-2xl drop-shadow">{selectedBeasiswa.title}</h2>
                </div>
              </div>

              {/* Coverage & Timeline Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 md:col-span-2 space-y-1">
                  <p className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">card_giftcard</span>
                    <span>Cakupan Pembiayaan & Keuntungan:</span>
                  </p>
                  <p className="text-sm font-bold text-on-surface leading-snug">
                    {selectedBeasiswa.coverage}
                  </p>
                </div>

                <div className="bg-surface-container border border-surface-variant/20 rounded-2xl p-4 space-y-1">
                  <p className="text-[11px] font-bold text-outline uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">calendar_month</span>
                    <span>Periode Pendaftaran:</span>
                  </p>
                  <p className="text-xs font-bold text-on-surface">
                    {selectedBeasiswa.openDate} s.d. {selectedBeasiswa.closeDate}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">info</span>
                  <span>Deskripsi Program Beasiswa</span>
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container-low p-4 rounded-2xl border border-surface-variant/20">
                  {selectedBeasiswa.description}
                </p>
              </div>

              {/* Requirements List */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">fact_check</span>
                  <span>Persyaratan & Kriteria Pendaftar:</span>
                </h4>
                <div className="bg-surface-container-low p-4 rounded-2xl border border-surface-variant/20 space-y-2">
                  <ul className="space-y-2">
                    {selectedBeasiswa.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-on-surface">
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">check_circle</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Selection Procedure */}
              {selectedBeasiswa.selectionStages && (
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">account_tree</span>
                    <span>Alur & Tahapan Seleksi:</span>
                  </h4>
                  <div className="bg-surface-container-low p-4 rounded-2xl border border-surface-variant/20 text-xs font-medium text-on-surface leading-relaxed">
                    {selectedBeasiswa.selectionStages}
                  </div>
                </div>
              )}

              {/* Guide File Download */}
              {selectedBeasiswa.guideFileName && (
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-3xl">picture_as_pdf</span>
                    <div>
                      <p className="font-bold text-xs text-on-surface">{selectedBeasiswa.guideFileName}</p>
                      <p className="text-[10px] text-outline">Buku Panduan & Petunjuk Teknis Resmi • {selectedBeasiswa.guideFileSize || "2.5 MB"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Mengunduh dokumen panduan: ${selectedBeasiswa.guideFileName}`)}
                    className="px-4 py-2 bg-primary text-on-primary hover:brightness-110 text-xs font-bold rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">download</span>
                    <span>Unduh Panduan (PDF)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-surface-variant/30 mt-6">
              <button
                onClick={() => setSelectedBeasiswa(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-surface-container hover:bg-surface-variant/30 text-on-surface-variant rounded-xl font-bold text-xs cursor-pointer transition-all"
              >
                Tutup
              </button>

              {selectedBeasiswa.applyUrl && selectedBeasiswa.status === "Dibuka" && (
                <a
                  href={selectedBeasiswa.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary text-on-primary hover:brightness-110 active:scale-95 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>Kunjungi Portal Pendaftaran Resmi</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
