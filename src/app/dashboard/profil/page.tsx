"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ProfilPage() {
  useEffect(() => {
    // 3D card tilt effect
    const card = document.querySelector(".profile-header-card") as HTMLElement;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = card.getBoundingClientRect();

      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;

      card.style.transform = `perspective(1000px) rotateY(${x * 2}deg) rotateX(${-y * 2}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const historyItems = [
    {
      title: "Malam Keakraban & Upgrading SEMADIKSI 2023",
      category: "Akademik",
      date: "12 Des 2023",
      desc: "Membangun solidaritas dan meningkatkan kapasitas diri sebagai mahasiswa KIP-K.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlUaW-ZS6LpTsZ64agwr8nm5KWchmhzxBNj90aAxaA3HOdxHVhyO9B4MKjILy1O_XdhuY8fZnK-aJ3EUTcLM7obEmEbw9-0MKnQUVuNXkEZLbQPq5P_DH-R5o5tilfc5HNFb6Zlsu9SjaORp6sy2EGmO0n_GRnmqNwerEgyn-MXuxgpwbDuM7d780dbRRjV62TGfDQf41ztasbWhx7gyMP0dqSc0RVZkyjbdcAPpJKhLcz9bUVvMsjqA",
    },
    {
      title: "Strategi Manajemen Keuangan Mahasiswa",
      category: "Webinar",
      date: "05 Okt 2023",
      desc: "Tips jitu mengelola uang saku KIP-K agar tetap produktif dan hemat.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAL2OfXTZKzZtu2JVrmy9SMkMOwiOgCfMxy8zHIHlKSVRmtSdN2Uvy_Zk9Sg-sQaHptSM7atdP0qAm4aN6mum3E6xnN1jSeR15t5cBuN8k_6lB-T4ROwufkCxRWg-qZOz36SdH5uMx_9eFk90CtBMqr3K4q3WjF6uxLjI3lQgbphE3MVTkaVGU4vYYSsVNHj_uxctlneg5Q-wT5aXmBYqYRi2TFi3gkzBIGJ9gSuEY_vnOoAFD_GPXG6w",
    },
    {
      title: "SEMADIKSI Berbagi: Desa Binaan 2023",
      category: "Sosial",
      date: "15 Sep 2023",
      desc: "Program pengabdian masyarakat di Desa Sejahtera, Tembalang.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAEAZ_aAheRNVnJq1QBdkXB1An12KhbmqJ_qvTTyzk4wAzqwSdzJNi5x_DWJQB9ZnIleaf7nggVVM-2-fRGTh-ehVIlRBRqXzyOZ21L9s0Wo-ByPE-9Po_2sJtuDYLHmWxjJsqfnMshvoqJlgQ3BK9_HaDeBtXvUC3kTLVnjCGkmDdie3ym8qwEwNFENj1jzgFsqeREyJKc0kT3QIvjr9Jh7eiK7oyUxmzvPK3KUbdbYfP2U8Jzm2-hA",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-md md:py-xl relative">
      {/* Profile Header Section */}
      <section className="mb-xl">
        <div className="profile-header-card bg-surface-container-lowest rounded-[32px] p-md md:p-lg shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] relative overflow-hidden transition-transform duration-300 ease-out">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-md md:gap-lg relative z-10">
            {/* Avatar with Status Ring */}
            <div className="relative">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-white shadow-lg overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Ahmad Fauzan profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSqkIMDVmraJfuluYuOafSp5jlN1kt75ZtORGLAF-_GI8GrvQinmIMEYIzpsXit5jEHCmhSyTcKwd7a0zE9gy556BdO_r9fc_mFxTcObwkZbsTWnF_yAxi4_urSiBPr36oYZZHM96wWx2b4rHqjLy5ujL6V7xF-WgCYWTqsV5OkFYueCtA4WibIuPMe54mtCOXSNCTAmtiSSTyOLxCduLvq9Foa5tcAKVbQz-5kYy1yCAkIkmlYoSvuQ"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full shadow-md">
                <span className="material-symbols-outlined text-[20px] font-bold">
                  verified
                </span>
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                <h2 className="font-display text-3xl font-extrabold text-on-surface">
                  Ahmad Fauzan
                </h2>
                <span className="inline-flex items-center px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold w-fit mx-auto md:mx-0">
                  <span
                    className="material-symbols-outlined text-[16px] mr-1"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    stars
                  </span>
                  Mahasiswa KIP-K
                </span>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Teknik Informatika • Universitas Diponegoro
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <button
                  onClick={() => alert("Pengaturan edit profil sedang disiapkan.")}
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-label-md flex items-center gap-2 active:scale-95 transition-all shadow-md hover:brightness-110 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    edit
                  </span>
                  Edit Profil
                </button>
                <button
                  onClick={() => alert("Link profil disalin ke clipboard.")}
                  className="border-2 border-primary text-primary px-6 py-2.5 rounded-full font-bold text-label-md flex items-center gap-2 active:scale-95 transition-all hover:bg-primary/5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    share
                  </span>
                  Bagikan
                </button>
              </div>
            </div>
          </div>
          {/* Background Accent */}
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[200px] text-primary rotate-12 translate-x-20 -translate-y-10">
              school
            </span>
          </div>
        </div>
      </section>

      {/* Bento Grid for Data & Activities */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-md md:gap-lg">
        {/* Left Column: Personal Data */}
        <div className="lg:col-span-4 flex flex-col gap-md">
          <div className="bg-surface rounded-xl p-md border border-surface-container-high shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-md text-xl font-extrabold text-primary">
                Data Diri
              </h3>
              <span className="material-symbols-outlined text-on-surface-variant">
                info
              </span>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-surface-container-low rounded-lg">
                <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  NIM
                </span>
                <span className="font-body-md text-body-md text-on-surface font-semibold">
                  24060121140000
                </span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg">
                <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Angkatan
                </span>
                <span className="font-body-md text-body-md text-on-surface font-semibold">
                  2021
                </span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg">
                <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Email Akademik
                </span>
                <span className="font-body-md text-body-md text-on-surface font-semibold">
                  fauzan@student.undip.ac.id
                </span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg">
                <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Status KIP-K
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-body-md text-body-md text-on-surface font-semibold">
                    Penerima Beasiswa Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Settings Card */}
          <div className="bg-surface rounded-xl p-md border border-surface-container-high shadow-sm overflow-hidden relative">
            <h3 className="font-headline-md text-xl font-extrabold text-on-surface mb-md">
              Pengaturan
            </h3>
            <div className="space-y-1">
              <a
                onClick={() => alert("Menuju pengaturan keamanan...")}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-high transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">
                    lock
                  </span>
                  <span className="font-body-md text-body-md">
                    Keamanan Akun
                  </span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </a>
              <a
                onClick={() => alert("Menuju pengaturan notifikasi...")}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-high transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">
                    notifications
                  </span>
                  <span className="font-body-md text-body-md">Notifikasi</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </a>
              <a
                onClick={() => alert("Mengunduh transkrip keaktifan beasiswa...")}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-high transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">
                    description
                  </span>
                  <span className="font-body-md text-body-md">
                    Unduh Transkrip KIP
                  </span>
                </div>
                <span className="material-symbols-outlined text-primary group-hover:translate-y-0.5 transition-transform">
                  download
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Activity History */}
        <div className="lg:col-span-8 flex flex-col gap-md">
          <div className="bg-surface rounded-xl p-md md:p-lg border border-surface-container-high shadow-sm flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-lg">
              <div>
                <h3 className="font-headline-md text-xl font-extrabold text-on-surface">
                  Riwayat Kegiatan
                </h3>
                <p className="text-on-surface-variant font-body-md text-body-md">
                  Daftar kegiatan SEMADIKSI yang telah diikuti.
                </p>
              </div>
              <div className="flex items-center bg-surface-container-low p-1 rounded-full border border-surface-container-high w-fit">
                <button className="px-6 py-2 rounded-full bg-white shadow-sm font-bold text-label-md text-primary cursor-pointer">
                  Selesai
                </button>
                <button
                  onClick={() => alert("Belum ada kegiatan yang terdaftar aktif.")}
                  className="px-6 py-2 rounded-full font-bold text-label-md text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  Terdaftar
                </button>
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
              {historyItems.map((item, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col md:flex-row gap-md p-md rounded-2xl hover:bg-surface-container-low transition-all border border-transparent hover:border-surface-container-high cursor-pointer"
                >
                  <div className="w-full md:w-40 h-28 rounded-xl overflow-hidden shadow-sm shrink-0">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={item.title}
                      src={item.img}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">
                        {item.category}
                      </span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        • {item.date}
                      </span>
                    </div>
                    <h4 className="font-bold text-lg text-on-surface mb-1 leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-on-surface-variant font-body-md text-body-md line-clamp-1">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-end md:justify-center">
                    <span className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-all">
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-surface-container-high text-center">
              <button
                onClick={() => alert("Menampilkan semua riwayat kegiatan...")}
                className="text-primary font-bold text-label-md flex items-center gap-2 mx-auto hover:underline cursor-pointer"
              >
                Lihat Semua Riwayat
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
