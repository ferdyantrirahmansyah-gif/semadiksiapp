"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Activity {
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
}

export default function KegiatanPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");
  const [activities, setActivities] = useState<Activity[]>([]);

  const defaultActs: Activity[] = [
    {
      title: "SEMADIKSI Peduli: Bakti Sosial Akhir Tahun",
      category: "Sosial",
      type: "Sosial",
      date: "24 Desember 2024",
      desc: "Mari bergabung dalam aksi nyata untuk berbagi kebahagiaan bersama saudara-saudara kita di Panti Asuhan Kasih Bunda. Kegiatan meliputi penyaluran donasi dan edukasi kreatif.",
      status: "Gratis",
      price: "Gratis",
      tags: ["KIP-K", "Sosial"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJjFnnOT1uRw3AzSrpjK7O1l8C-DZgjx42__Bc-mF4QPRiwt9843RkY_tua0A7SDtfLcdbIgVjejrOdAmCMkn_sUtEP-oo2wLD8s0bPLKgCIy2bFZ1KzZgAwez0RouTEKeHKyIGeNuXmhN6aFWiFOJzhTBV8ULDJTt0dHQhZxifP1QordSIU5OPVvpdU0Z1OKyH1NmzVjiUffcWKjAjpJUwIPBFi23W-AeNCJcm78USgZLcjqAMRLO1g",
      latest: true,
    },
    {
      title: "Latihan Kepemimpinan Mahasiswa Berprestasi",
      category: "Seminar",
      type: "Seminar",
      date: "15 November 2024",
      desc: "Program intensif 2 hari untuk mengasah skill kepemimpinan, manajemen waktu, dan public speaking bagi penerima beasiswa.",
      status: "Pendaftaran Ditutup",
      price: "IDR 25.000",
      tags: ["Kepemimpinan", "Internal"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfSBLMGaaiBSsHUfV97CbiGvDC8aHHToUnyAp1Nl4nvkYZQWDJYIDFKMSvXkh47UKsg5W1b8bbuGnS1PNoYSJM6NndroxzoSw7cJsSIY7pf4Qovl29f0HsV-ciQTizbcOTWsU7J_4N0_K5MbYPv3SFUwL4kfwedHMavywdCZ8tgwuY6sLW2L1JIvjB0ainTR1IciDA7MOd2emTvb6QBp5S4aicc876brvEDHT7FzSYQSy8bCF_gjPgmw",
      closed: true,
    },
    {
      title: "SEMADIKSI Cultural Night & Reunion",
      category: "Workshop",
      type: "Workshop",
      date: "10 Januari 2025",
      desc: "Malam keakraban antar angkatan dengan pertunjukan seni budaya dan sharing session dari alumni inspiratif.",
      status: "Beli Tiket",
      price: "IDR 50.000",
      tags: ["Budaya", "Hiburan"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyeApvLwCftrL0Sa85oc5pJl9jwpigdy5My_uMQAWfN9NkBuIuvnfajbksNCj_QWnxlbPEjMBArQcn50DdKR9_ca15qPsaadM3v16xHcuPXHCYowTfNrqwfVe2r6Lfi5pJ5B-Q5bmKGjoC3zhEGvTd6qgKL3mO8efrN_qgA20ygM2LJDIIDn7dXL_c_7pDS3SoibZvkBQZimHdNAPP0KsiY3FMYtiRyOTf1DmefcINHASJpf0X1WjQbA",
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
                    <div className="flex gap-2 mt-4">
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
                    </div>
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
                    ) : (
                      <Link
                        href={`/dashboard/pembayaran?title=${encodeURIComponent(act.title)}&price=${encodeURIComponent(act.price)}&date=${encodeURIComponent(act.date)}&img=${encodeURIComponent(act.img)}&desc=${encodeURIComponent(act.desc)}&type=${encodeURIComponent(act.type)}`}
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
