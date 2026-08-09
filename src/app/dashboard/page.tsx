"use client";

import Link from "next/link";

export default function DashboardHome() {
  const highlights = [
    {
      title: "SEMADIKSI Mengajar",
      category: "Pengabdian",
      date: "15 Oct",
      status: "Free",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIWf6rG7XQ4j6dIjWO4gQFxP2L10IaeD_y9_gLEJe5RrifvHzoDIjXvkFDRPrbumVaB8J933IxVJkDFW4wfCC0lHIvnhZufHpdKU6Bh1ebH2KQS-LvAqxrkHxzKxRDGnI2uQDHL62jxYapC56k7VqsQtkoCCWTnaAKIVh3mW3iyOjuIRQ0DZCfLWaO1aQKPW-YAGb_BpcEgHxRHkiKbrzcxENOYOXPlDMvcryAEFlx5-tUNEQeJjqbhg",
    },
    {
      title: "Pelatihan Karya Tulis",
      category: "Akademik",
      date: "20 Oct",
      status: "Terbatas",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNxIRut5MMPLO3BDhtDG7ivQWI1MTwK61kAqY3VodvwtaPKIfG4VyP6Fe7st6_WNOcpWYSMBxEtK0VQ-BDf_QvKbDXo98gTqOemU9ZIDJEKIfDpYu5qrClJks1YNovLkm1rHfvw3G_Rsj6_ORBnc3zV3dHV55xy0Tkg2zQs95Ngz-VYXvp3sumBJ6CefjfFpsulKof2587B5TOfWLMURH1WHLy5B8FyS0vosuwzoHbmNTMK2mcGP9Z4A",
    },
    {
      title: "Gathering KIP-K 2024",
      category: "Sosial",
      date: "05 Nov",
      status: "Terbuka",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRMQ-d6nNFpGEE5UMuXb5ZAepbNCOdxvWhRJbToiNki5oFEgN67XLhfWuQy4bS0LJyd7_vvkMYoq1MfnltjKQj5T81z0Rojz-p9oDpAxXugm7SrEVHecWl7JQJ5HG2i9ZpD3n6qMFh70lQH3YpmMc2SRAoqlxTBXoEvNikA1Ysn7t_5TJjvv_7jb-N1XZE7B_s8Js0W4VJ-ZJenWKuL5WR6_GCIAyORUC4-spkvDmk4u2vf3y-DGOh5w",
    },
    {
      title: "Malam Inagurasi Juara",
      category: "Event",
      date: "12 Dec",
      status: "Berbayar",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFwR_Y_KEGxvg0Qjnq_xv8nEmY9gThhmJBp9y4fcSeGij7OwXKlTNrKk1E2PoYbJQNeQTfyoAJfxLxazD17FG7657UCUqiUtIHWr_blKppxnp6NtoJtl0498xyA3BB05wLsirIFd2QhKi8a2LqV4V4KQ3wV9LIqEI_GAZA1vH7jX8TBqPUQxsfc5JNyWJNlE7qvnDJyGUr2mRCJU8u3x64h04KolTml_TPAzMQZYAzUS_6cxmO5CdI2Q",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 relative z-10">
      {/* Welcome Section */}
      <section className="mb-12">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface mb-2">
          Selamat Pagi, Sobat Dikti!
        </h2>
        <p className="font-body-lg text-on-surface-variant max-w-2xl text-lg">
          Mari berkontribusi dan berkembang bersama komunitas penerima beasiswa
          pendidikan terbesar di kampus.
        </p>
      </section>

      {/* Bento Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Feature Card */}
        <div className="md:col-span-2 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_0px_rgba(27,109,36,0.05)] border border-surface-container-high p-8 flex flex-col justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <span className="bg-primary text-white font-semibold text-xs px-3 py-1 rounded-full">
              Coming Soon
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-on-surface mt-4 mb-4">
              Seminar Nasional Kebangsaan 2024
            </h3>
            <p className="font-body-md text-on-surface-variant mb-6">
              Jangan lewatkan kesempatan untuk berdiskusi dengan tokoh-tokoh
              inspiratif nasional dalam rangkaian Dies Natalis SEMADIKSI.
            </p>
            <Link
              href="/dashboard/pembayaran"
              className="bg-primary text-white px-6 py-3 rounded-full font-bold text-label-md inline-flex items-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-md w-fit cursor-pointer"
            >
              Daftar Sekarang
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[180px] -mr-12 -mt-8 rotate-12">
              school
            </span>
          </div>
        </div>

        {/* Side Stats / Small Cards */}
        <div className="flex flex-col gap-6">
          <Link
            href="/dashboard/kegiatan"
            className="bg-secondary-container text-on-secondary-container p-6 rounded-xl shadow-sm hover:brightness-105 transition-all block cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-3xl">
                confirmation_number
              </span>
              <span className="bg-white/30 px-2 py-1 rounded font-bold text-xs">
                2 Aktif
              </span>
            </div>
            <p className="font-label-md text-label-md opacity-80">Tiket Saya</p>
            <p className="font-headline-md text-xl font-bold">Workshop UI/UX</p>
          </Link>
          <div className="bg-tertiary-container text-on-tertiary-container p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-3xl">
                volunteer_activism
              </span>
            </div>
            <p className="font-label-md text-label-md opacity-80">
              Poin Keaktifan
            </p>
            <p className="font-headline-md text-3xl font-extrabold">
              1.250 <span className="text-lg font-normal">XP</span>
            </p>
          </div>
        </div>

        {/* Activities Highlight Section */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {highlights.map((item, index) => (
            <Link
              key={index}
              href="/dashboard/kegiatan"
              className="bg-surface-container-lowest border border-surface-container-high rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer block group"
            >
              <div
                className="h-40 bg-cover bg-center transition-transform duration-300 group-hover:scale-102"
                style={{ backgroundImage: `url('${item.img}')` }}
              ></div>
              <div className="p-5">
                <span className="text-xs font-bold text-primary uppercase">
                  {item.category}
                </span>
                <h4 className="font-bold text-on-surface mt-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <div className="mt-3 flex items-center justify-between text-on-surface-variant">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      calendar_today
                    </span>
                    <span className="text-xs">{item.date}</span>
                  </div>
                  <span className="text-xs font-bold text-secondary">
                    {item.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
