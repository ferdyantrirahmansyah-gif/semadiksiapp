"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Activity {
  id: string;
  title: string;
  category: string;
  type: string;
  date: string;
  desc: string;
  status: string;
  price: string;
  tags: string[];
  img: string;
  latest?: boolean;
  closed?: boolean;
  location?: string;
  rundown?: string;
  speaker?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  kipStatus: "KIP" | "Non-KIP";
  verificationStatus: "Verified" | "Pending" | "Rejected";
}

interface Certificate {
  id: string;
  userName: string;
  activityTitle: string;
  code: string;
  dateUploaded: string;
}

interface Submission {
  id: string;
  groupName: string;
  leaderName: string;
  category: string;
  documentName: string;
  documentUrl: string;
  score: number | "Belum Dinilai";
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"beranda" | "kegiatan" | "antrean_kip" | "pengguna" | "sertifikat" | "validasi_sertifikat" | "lomba">("beranda");

  // State arrays
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Activity Form Modal states
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [actTitle, setActTitle] = useState("");
  const [actCategory, setActCategory] = useState("Workshop");
  const [actDate, setActDate] = useState("");
  const [actPrice, setActPrice] = useState("Gratis");
  const [actImg, setActImg] = useState("");
  const [actDesc, setActDesc] = useState("");
  const [actLocation, setActLocation] = useState("");
  const [actRundown, setActRundown] = useState("");
  const [actSpeaker, setActSpeaker] = useState("");

  // Certificate Upload Form states
  const [certUser, setCertUser] = useState("");
  const [certActivity, setCertActivity] = useState("");
  const [certCode, setCertCode] = useState("");
  const [uploadingCert, setUploadingCert] = useState(false);

  // Verification Portal States (Admin Tab)
  const [adminCertInput, setAdminCertInput] = useState("");
  const [adminSearchedCode, setAdminSearchedCode] = useState<string | null>(null);
  const [adminMatchedCert, setAdminMatchedCert] = useState<any | null>(null);
  const [adminCertValid, setAdminCertValid] = useState(false);
  const [adminScanning, setAdminScanning] = useState(false);

  // KIP-K Dedicated Queue Tab States
  const [kipSearchQuery, setKipSearchQuery] = useState("");
  const [kipStatusFilter, setKipStatusFilter] = useState<"Pending" | "Verified" | "Rejected" | "Semua">("Pending");

  // Judging States
  const [tempScores, setTempScores] = useState<{ [key: string]: string }>({});

  // Check login session & Initialize data
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("admin_logged_in");
    if (isLoggedIn !== "true") {
      router.push("/admin/masuk");
      return;
    }
    setIsAdminLoggedIn(true);

    // Load activities from localStorage or default ones
    const storedActivities = localStorage.getItem("semadiksi_activities");
    if (storedActivities) {
      try {
        setActivities(JSON.parse(storedActivities));
      } catch (e) {
        initDefaultActivities();
      }
    } else {
      initDefaultActivities();
    }

    // Load users list (initial mock)
    const storedUsers = localStorage.getItem("semadiksi_users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      const defaultUsers: User[] = [
        { id: "usr-1", name: "Ahmad Fauzan", email: "ahmad.fauzan@gmail.com", university: "Universitas Diponegoro", kipStatus: "KIP", verificationStatus: "Verified" },
        { id: "usr-2", name: "Budi Santoso", email: "budi.santoso@gmail.com", university: "Universitas Negeri Semarang", kipStatus: "KIP", verificationStatus: "Pending" },
        { id: "usr-3", name: "Clara Citra", email: "clara.citra@gmail.com", university: "Universitas Diponegoro", kipStatus: "Non-KIP", verificationStatus: "Verified" },
        { id: "usr-4", name: "Dedi Kurnia", email: "dedi.kurnia@gmail.com", university: "UIN Walisongo", kipStatus: "KIP", verificationStatus: "Pending" },
        { id: "usr-5", name: "Evi Latifah", email: "evi.latifah@gmail.com", university: "Universitas PGRI Semarang", kipStatus: "KIP", verificationStatus: "Rejected" },
      ];
      setUsers(defaultUsers);
      localStorage.setItem("semadiksi_users", JSON.stringify(defaultUsers));
    }

    // Load certificates list
    const storedCerts = localStorage.getItem("semadiksi_certificates_admin");
    if (storedCerts) {
      setCertificates(JSON.parse(storedCerts));
    } else {
      const defaultCerts: Certificate[] = [
        { id: "cert-1", userName: "Ahmad Fauzan", activityTitle: "Latihan Kepemimpinan Mahasiswa Berprestasi (LKMB)", code: "CERT-LKMB-2024-0891", dateUploaded: "16 Nov 2024" },
        { id: "cert-2", userName: "Ahmad Fauzan", activityTitle: "SEMADIKSI Berbagi: Volunteer Mengajar Pesisir", code: "CERT-VOL-2024-1102", dateUploaded: "13 Okt 2024" },
      ];
      setCertificates(defaultCerts);
      localStorage.setItem("semadiksi_certificates_admin", JSON.stringify(defaultCerts));
    }

    // Load contest submissions list
    const storedSubmissions = localStorage.getItem("semadiksi_submissions");
    if (storedSubmissions) {
      setSubmissions(JSON.parse(storedSubmissions));
    } else {
      const defaultSubmissions: Submission[] = [
        { id: "sub-1", groupName: "Tim Barokah", leaderName: "Ahmad Fauzan", category: "Karya Tulis Ilmiah", documentName: "KTI_TimBarokah_OptimalisasiPendidikan.pdf", documentUrl: "#", score: 87 },
        { id: "sub-2", groupName: "Tim Srikandi", leaderName: "Evi Latifah", category: "Poster Digital", documentName: "Poster_TimSrikandi_MerdekaBelajar.png", documentUrl: "#", score: "Belum Dinilai" },
        { id: "sub-3", groupName: "Tim Garuda", leaderName: "Budi Santoso", category: "Karya Tulis Ilmiah", documentName: "KTI_TimGaruda_SistemBeasiswaTepatSasaran.pdf", documentUrl: "#", score: 92 },
      ];
      setSubmissions(defaultSubmissions);
      localStorage.setItem("semadiksi_submissions", JSON.stringify(defaultSubmissions));
    }
  }, [router]);

  const initDefaultActivities = () => {
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
        location: "Panti Asuhan Kasih Bunda, Ngaliyan",
        rundown: "08.00 - 08.30: Registrasi Panitia & Keberangkatan\n09.00 - 11.00: Penyerahan Sembako & Edukasi Mewarnai\n11.00 - 12.00: Game Bersama Anak Panti\n12.00 - 13.00: Penutupan & Doa Bersama",
        speaker: "Relawan Divisi Pengabdian"
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
        location: "Gedung Auditorium Utama, Kampus Pleburan",
        rundown: "08.00 - 09.00: Pembukaan & Sambutan\n09.00 - 12.00: Sesi Kepemimpinan\n12.00 - 13.00: Ishoma\n13.00 - 16.00: Sesi Public Speaking & Evaluasi",
        speaker: "Dr. Hendrawan (Konsultan Kepemimpinan)"
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
        location: "Gedung Auditorium Utama, Kampus Pleburan",
        rundown: "18.30 - 19.00: Registrasi & Pintu Dibuka\n19.00 - 20.30: Pertunjukan Budaya Nusantara\n20.30 - 21.30: Sharing Session Alumni Inspiratif\n21.30 - 22.00: Foto Bersama & Penutupan",
        speaker: "Alumni Berprestasi SEMADIKSI"
      },
    ];
    setActivities(defaultActs);
    localStorage.setItem("semadiksi_activities", JSON.stringify(defaultActs));
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_logged_in");
    router.push("/admin/masuk");
  };

  // --- CRUD KEGIATAN LOGIC ---
  const saveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: Activity[] = [];

    if (currentActivity) {
      // Edit
      updated = activities.map((act) =>
        act.id === currentActivity.id
          ? {
              ...act,
              title: actTitle,
              category: actCategory,
              type: actCategory,
              date: actDate,
              price: actPrice,
              status: actPrice === "Gratis" ? "Gratis" : "Beli Tiket",
              img: actImg || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
              desc: actDesc,
              location: actLocation,
              rundown: actRundown,
              speaker: actSpeaker,
            }
          : act
      );
      alert("Kegiatan berhasil diperbarui!");
    } else {
      // Create
      const newAct: Activity = {
        id: `act-${Date.now()}`,
        title: actTitle,
        category: actCategory,
        type: actCategory,
        date: actDate,
        desc: actDesc,
        price: actPrice,
        status: actPrice === "Gratis" ? "Gratis" : "Beli Tiket",
        tags: [actCategory, actPrice === "Gratis" ? "Gratis" : "Berbayar"],
        img: actImg || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        location: actLocation,
        rundown: actRundown,
        speaker: actSpeaker,
      };
      updated = [...activities, newAct];
      alert("Kegiatan baru berhasil diunggah!");
    }

    setActivities(updated);
    localStorage.setItem("semadiksi_activities", JSON.stringify(updated));
    closeActivityModal();
  };

  const deleteActivity = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) {
      const updated = activities.filter((act) => act.id !== id);
      setActivities(updated);
      localStorage.setItem("semadiksi_activities", JSON.stringify(updated));
      alert("Kegiatan telah dihapus!");
    }
  };

  const openActivityModal = (act: Activity | null = null) => {
    setCurrentActivity(act);
    if (act) {
      setActTitle(act.title);
      setActCategory(act.category);
      setActDate(act.date);
      setActPrice(act.price);
      setActImg(act.img);
      setActDesc(act.desc);
      setActLocation(act.location || "");
      setActRundown(act.rundown || "");
      setActSpeaker(act.speaker || "");
    } else {
      setActTitle("");
      setActCategory("Workshop");
      setActDate("");
      setActPrice("Gratis");
      setActImg("");
      setActDesc("");
      setActLocation("");
      setActRundown("");
      setActSpeaker("");
    }
    setShowActivityModal(true);
  };

  const closeActivityModal = () => {
    setShowActivityModal(false);
    setCurrentActivity(null);
  };

  // --- USER VALIDATION & ACC MANAGEMENT ---
  const validateKipUser = (id: string, status: "Verified" | "Rejected") => {
    const updated = users.map((usr) =>
      usr.id === id ? { ...usr, verificationStatus: status } : usr
    );
    setUsers(updated);
    localStorage.setItem("semadiksi_users", JSON.stringify(updated));
    alert(`Status KIP-K pengguna telah diset ke: ${status}`);
  };

  const deleteUser = (id: string, email: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus email "${email}"? Pengguna tidak akan bisa login lagi ke portal.`)) {
      const updated = users.filter((usr) => usr.id !== id);
      setUsers(updated);
      localStorage.setItem("semadiksi_users", JSON.stringify(updated));
      
      // Simulate account revocation by recording in a local blocklist
      const blocklist = JSON.parse(localStorage.getItem("semadiksi_blocked_emails") || "[]");
      blocklist.push(email);
      localStorage.setItem("semadiksi_blocked_emails", JSON.stringify(blocklist));

      alert(`Email ${email} telah diblokir dan dihapus dari portal.`);
    }
  };

  // --- UPLOAD CERTIFICATE LOGIC ---
  const handleUploadCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certUser || !certActivity || !certCode) {
      alert("Harap lengkapi semua isian formulir sertifikat!");
      return;
    }

    setUploadingCert(true);

    setTimeout(() => {
      const newCert: Certificate = {
        id: `cert-${Date.now()}`,
        userName: certUser,
        activityTitle: certActivity,
        code: certCode,
        dateUploaded: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      };

      const updated = [newCert, ...certificates];
      setCertificates(updated);
      localStorage.setItem("semadiksi_certificates_admin", JSON.stringify(updated));

      // Append to the student certificate registry in localStorage so the student sees it!
      try {
        const studentCerts = JSON.parse(localStorage.getItem("semadiksi_registered_activities") || "[]");
        // Generate a completed activity entry mapping this certificate
        studentCerts.push({
          id: `act-cert-${Date.now()}`,
          title: certActivity,
          category: "Pencapaian",
          organizer: "SEMADIKSI Panitia Pelaksana",
          date: newCert.dateUploaded,
          duration: "8 JP",
          status: "Selesai",
          code: certCode,
          img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
          description: `Sertifikat resmi yang diberikan kepada ${certUser} atas partisipasinya dalam kegiatan ${certActivity}.`
        });
        localStorage.setItem("semadiksi_registered_activities", JSON.stringify(studentCerts));
      } catch(err) {}

      setUploadingCert(false);
      setCertCode("");
      alert(`Sertifikat berhasil diterbitkan untuk ${certUser}!`);
    }, 1500);
  };

  // --- VERIFICATION PORTAL LOGIC (Admin Tab) ---
  const handleAdminCertSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminCertInput.trim()) return;

    const codeClean = adminCertInput.trim().toUpperCase();
    setAdminSearchedCode(codeClean);

    // List of valid certificates
    const defaultValidCerts = [
      {
        code: "CERT-LKMB-2024-0891",
        title: "Sertifikat Latihan Kepemimpinan Mahasiswa Berprestasi (LKMB)",
        author: "SEMADIKSI Divisi Keorganisasian",
        hash: "e566c805ba07b8c6869e1f37847d0287",
        date: "2024-11-16 09:12:05",
        signatories: ["Dr. Ir. Wahyu Utomo, M.Si. (Pembina SEMADIKSI)", "Muhammad Fatih (Ketua Umum SEMADIKSI)"]
      },
      {
        code: "CERT-VOL-2024-1102",
        title: "Sertifikat Volunteer Mengajar Pesisir - SEMADIKSI Berbagi",
        author: "SEMADIKSI Divisi Pengabdian Masyarakat",
        hash: "8c7a6e112d88f6c99c5d01243170e881",
        date: "2024-10-13 14:35:10",
        signatories: ["Dr. Ir. Wahyu Utomo, M.Si. (Pembina SEMADIKSI)", "Fauzi Rahmat (Ketua Divisi Pengabdian)"]
      },
      {
        code: "CERT-WD-2024-0345",
        title: "Sertifikat Workshop Web Development Modern dengan Next.js",
        author: "SEMADIKSI Divisi IPTEK & Humas",
        hash: "f566c805ba07b8c6869e1f37847d0345",
        date: "2024-09-05 16:40:02",
        signatories: ["Dr. Ir. Wahyu Utomo, M.Si. (Pembina SEMADIKSI)", "Ferdian W. (Senior Frontend Engineer / Pemateri)"]
      }
    ];

    let found = defaultValidCerts.find(c => c.code === codeClean);
    if (found) {
      setAdminMatchedCert(found);
      setAdminCertValid(true);
      return;
    }

    // Check localStorage admin certs
    const storedCertsStr = localStorage.getItem("semadiksi_certificates_admin");
    if (storedCertsStr) {
      try {
        const storedCerts = JSON.parse(storedCertsStr);
        const adminCert = storedCerts.find((c: any) => c.code.toUpperCase() === codeClean);
        if (adminCert) {
          setAdminMatchedCert({
            code: adminCert.code,
            title: `Sertifikat Kegiatan: ${adminCert.activityTitle}`,
            author: "SEMADIKSI Panitia Pelaksana",
            hash: `h${adminCert.id.replace("cert-", "")}8e1f37847d0287`,
            date: `${adminCert.dateUploaded} 17:00:00`,
            signatories: ["Dr. Ir. Wahyu Utomo, M.Si. (Pembina SEMADIKSI)", "Muhammad Fatih (Ketua Umum SEMADIKSI)"]
          });
          setAdminCertValid(true);
          return;
        }
      } catch (err) {}
    }

    setAdminMatchedCert(null);
    setAdminCertValid(false);
  };

  const handleAdminSimulateScan = () => {
    setAdminScanning(true);
    setTimeout(() => {
      const codes = ["CERT-LKMB-2024-0891", "CERT-VOL-2024-1102", "CERT-WD-2024-0345"];
      const randomCode = codes[Math.floor(Math.random() * codes.length)];
      setAdminCertInput(randomCode);
      setAdminScanning(false);
      
      // Auto trigger search
      setAdminSearchedCode(randomCode);
      const defaultValidCerts = [
        {
          code: "CERT-LKMB-2024-0891",
          title: "Sertifikat Latihan Kepemimpinan Mahasiswa Berprestasi (LKMB)",
          author: "SEMADIKSI Divisi Keorganisasian",
          hash: "e566c805ba07b8c6869e1f37847d0287",
          date: "2024-11-16 09:12:05",
          signatories: ["Dr. Ir. Wahyu Utomo, M.Si. (Pembina SEMADIKSI)", "Muhammad Fatih (Ketua Umum SEMADIKSI)"]
        },
        {
          code: "CERT-VOL-2024-1102",
          title: "Sertifikat Volunteer Mengajar Pesisir - SEMADIKSI Berbagi",
          author: "SEMADIKSI Divisi Pengabdian Masyarakat",
          hash: "8c7a6e112d88f6c99c5d01243170e881",
          date: "2024-10-13 14:35:10",
          signatories: ["Dr. Ir. Wahyu Utomo, M.Si. (Pembina SEMADIKSI)", "Fauzi Rahmat (Ketua Divisi Pengabdian)"]
        },
        {
          code: "CERT-WD-2024-0345",
          title: "Sertifikat Workshop Web Development Modern dengan Next.js",
          author: "SEMADIKSI Divisi IPTEK & Humas",
          hash: "f566c805ba07b8c6869e1f37847d0345",
          date: "2024-09-05 16:40:02",
          signatories: ["Dr. Ir. Wahyu Utomo, M.Si. (Pembina SEMADIKSI)", "Ferdian W. (Senior Frontend Engineer / Pemateri)"]
        }
      ];
      setAdminMatchedCert(defaultValidCerts.find(c => c.code === randomCode) || null);
      setAdminCertValid(true);
    }, 2500);
  };

  // --- JUDGING LOGIC ---
  const handleScoreChange = (id: string, value: string) => {
    setTempScores({
      ...tempScores,
      [id]: value,
    });
  };

  const saveScore = (id: string) => {
    const rawScore = tempScores[id];
    if (rawScore === undefined || rawScore.trim() === "") {
      alert("Harap masukkan nilai terlebih dahulu!");
      return;
    }

    const scoreNum = parseInt(rawScore, 10);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      alert("Nilai harus berupa angka di antara 0 - 100!");
      return;
    }

    const updated = submissions.map((sub) =>
      sub.id === id ? { ...sub, score: scoreNum } : sub
    );
    setSubmissions(updated);
    localStorage.setItem("semadiksi_submissions", JSON.stringify(updated));
    alert("Nilai dari juri berhasil disimpan!");
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-primary font-bold">Memuat Dashboard Admin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-on-surface bg-background flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="w-full top-0 sticky shadow-[0px_4px_20px_0px_rgba(27,109,36,0.05)] bg-surface flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop z-40">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[14px] font-bold">
            A
          </span>
          <span className="font-display text-lg font-extrabold text-primary">
            SEMADIKSI ADMIN PORTAL
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-label-md text-label-md text-on-surface font-semibold hidden sm:inline">
            Administrator Utama
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-error-container/10 text-error hover:bg-error-container/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Keluar</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Navigation Drawer */}
        <aside className="h-screen w-64 fixed left-0 top-0 bg-surface shadow-md z-30 pt-20 flex flex-col justify-between border-r border-surface-variant/20 hidden lg:flex">
          <nav className="flex flex-col gap-1 px-2">
            {[
              { id: "beranda", label: "Beranda", icon: "dashboard" },
              { id: "kegiatan", label: "CRUD Kegiatan", icon: "event_note" },
              { id: "antrean_kip", label: "Antrean KIP-K", icon: "assignment_turned_in" },
              { id: "pengguna", label: "Kelola Pengguna", icon: "group_add" },
              { id: "sertifikat", label: "Upload Sertifikat", icon: "upload_file" },
              { id: "validasi_sertifikat", label: "Validasi Sertifikat", icon: "qr_code_scanner" },
              { id: "lomba", label: "Penjurian & Karya Lomba", icon: "rate_review" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 flex items-center gap-4 rounded-full transition-all active:scale-98 duration-150 cursor-pointer text-left ${
                  activeTab === tab.id
                    ? "bg-primary text-white font-bold"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
                <span className="font-label-md text-label-md">{tab.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-surface-variant/30 text-center text-[10px] text-outline">
            SEMADIKSI Admin Panel v1.0
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-grow lg:ml-64 bg-background min-h-screen p-6 md:p-8 space-y-md relative overflow-hidden pb-12">
          {/* Mobile Navigation bar */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-surface-variant/30 lg:hidden scrollbar-none mb-4">
            {[
              { id: "beranda", label: "Beranda", icon: "dashboard" },
              { id: "kegiatan", label: "Kegiatan", icon: "event_note" },
              { id: "antrean_kip", label: "Antrean", icon: "assignment_turned_in" },
              { id: "pengguna", label: "Pengguna", icon: "group_add" },
              { id: "sertifikat", label: "Sertifikat", icon: "upload_file" },
              { id: "validasi_sertifikat", label: "Validasi", icon: "qr_code_scanner" },
              { id: "lomba", label: "Lomba", icon: "rate_review" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 flex items-center gap-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 0: BERANDA */}
          {activeTab === "beranda" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Welcome Banner */}
              <div className="bg-primary-container/10 border border-primary/20 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="z-10 space-y-1">
                  <h2 className="font-display text-2xl font-extrabold text-primary">Selamat Datang di Portal Admin SEMADIKSI</h2>
                  <p className="text-sm text-on-surface-variant">Anda masuk sebagai Administrator Utama. Berikut ringkasan portal hari ini.</p>
                </div>
                <div className="z-10 px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-full">
                  Sesi Aktif
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                  <span className="material-symbols-outlined text-primary text-3xl">groups</span>
                  <p className="text-[10px] text-outline uppercase font-semibold mt-2">Total Mahasiswa</p>
                  <h3 className="text-xl font-bold text-on-surface mt-1">{users.length} Orang</h3>
                </div>
                <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                  <span className="material-symbols-outlined text-tertiary text-3xl">verified</span>
                  <p className="text-[10px] text-outline uppercase font-semibold mt-2">Terverifikasi KIP-K</p>
                  <h3 className="text-xl font-bold text-on-surface mt-1">
                    {users.filter(u => u.kipStatus === "KIP" && u.verificationStatus === "Verified").length} Orang
                  </h3>
                </div>
                <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                  <span className="material-symbols-outlined text-secondary-container text-3xl text-on-secondary-container">event</span>
                  <p className="text-[10px] text-outline uppercase font-semibold mt-2">Total Kegiatan</p>
                  <h3 className="text-xl font-bold text-on-surface mt-1">{activities.length} Agenda</h3>
                </div>
                <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                  <span className="material-symbols-outlined text-outline text-3xl">rate_review</span>
                  <p className="text-[10px] text-outline uppercase font-semibold mt-2">Karya Lomba</p>
                  <h3 className="text-xl font-bold text-on-surface mt-1">{submissions.length} Kelompok</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending KIP-K Validations Queue Widget */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-on-surface">Antrean Validasi KIP-K</h3>
                    <span className="px-2.5 py-1 bg-secondary-container/20 text-on-secondary-container border border-secondary-container/30 text-xs font-bold rounded-full">
                      {users.filter(u => u.kipStatus === "KIP" && u.verificationStatus === "Pending").length} Tertunda
                    </span>
                  </div>

                  <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-4 shadow-sm space-y-4">
                    {users.filter(u => u.kipStatus === "KIP" && u.verificationStatus === "Pending").length > 0 ? (
                      <div className="divide-y divide-surface-variant/20">
                        {users.filter(u => u.kipStatus === "KIP" && u.verificationStatus === "Pending").slice(0, 3).map((usr) => (
                          <div key={usr.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="space-y-1">
                              <p className="font-bold text-sm text-on-surface">{usr.name}</p>
                              <p className="text-xs text-on-surface-variant">{usr.email} • {usr.university}</p>
                              <button
                                onClick={() => {
                                  alert(`Menampilkan berkas pendukung KIP-K milik ${usr.name}:\n- Kartu KIP-K: KIP-K-${usr.id.toUpperCase()}-2024.pdf\n- SKTM (Surat Keterangan Tidak Mampu): SKTM-${usr.id.toUpperCase()}.pdf`);
                                }}
                                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-[14px]">visibility</span> Lihat Berkas Pendukung KIP-K
                              </button>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => validateKipUser(usr.id, "Verified")}
                                className="px-3.5 py-2 bg-primary text-on-primary hover:brightness-110 rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-all shadow-sm"
                              >
                                Setujui KIP-K
                              </button>
                              <button
                                onClick={() => validateKipUser(usr.id, "Rejected")}
                                className="px-3.5 py-2 bg-error text-on-error hover:brightness-110 rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-all shadow-sm"
                              >
                                Tolak KIP-K
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <span className="material-symbols-outlined text-primary text-4xl mb-2">done_all</span>
                        <p className="text-sm font-bold text-on-surface-variant">Antrean Bersih!</p>
                        <p className="text-xs text-outline mt-0.5">Semua permohonan status KIP-K mahasiswa telah divalidasi.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="lg:col-span-1 space-y-4">
                  <h3 className="font-bold text-lg text-on-surface">Aksi Cepat</h3>
                  <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-4 shadow-sm flex flex-col gap-2.5">
                    <button
                      onClick={() => openActivityModal(null)}
                      className="w-full flex items-center gap-3 p-3 bg-surface hover:bg-surface-variant/20 rounded-xl transition-all cursor-pointer text-left border border-surface-variant/10"
                    >
                      <span className="material-symbols-outlined text-primary">add_circle</span>
                      <div>
                        <p className="text-xs font-bold text-on-surface">Tambah Kegiatan</p>
                        <p className="text-[10px] text-outline">Publikasikan agenda beasiswa</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("sertifikat");
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-surface hover:bg-surface-variant/20 rounded-xl transition-all cursor-pointer text-left border border-surface-variant/10"
                    >
                      <span className="material-symbols-outlined text-primary">verified</span>
                      <div>
                        <p className="text-xs font-bold text-on-surface">Terbitkan Sertifikat</p>
                        <p className="text-[10px] text-outline">Kirim e-sertifikat ke mahasiswa</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("antrean_kip");
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-surface hover:bg-surface-variant/20 rounded-xl transition-all cursor-pointer text-left border border-surface-variant/10"
                    >
                      <span className="material-symbols-outlined text-primary">assignment_turned_in</span>
                      <div>
                        <p className="text-xs font-bold text-on-surface">Antrean KIP-K</p>
                        <p className="text-[10px] text-outline">Tinjau dan validasi status beasiswa</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: CRUD KEGIATAN */}
          {activeTab === "kegiatan" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-on-surface">Manajemen Kegiatan</h2>
                  <p className="text-xs text-on-surface-variant mt-1">Buat, edit, dan hapus kegiatan atau agenda beasiswa.</p>
                </div>
                <button
                  onClick={() => openActivityModal(null)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary hover:brightness-110 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>Tambah Kegiatan</span>
                </button>
              </div>

              {/* Table */}
              <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-surface-variant/30 text-on-surface-variant font-bold text-xs uppercase">
                      <th className="p-4 w-20">Gambar</th>
                      <th className="p-4">Nama Kegiatan</th>
                      <th className="p-4 w-32">Kategori</th>
                      <th className="p-4 w-40">Tanggal</th>
                      <th className="p-4 w-32">Biaya</th>
                      <th className="p-4 w-28 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-variant/20 text-sm">
                    {activities.map((act) => (
                      <tr key={act.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                        <td className="p-4">
                          <img className="w-12 h-12 object-cover rounded-lg shadow-sm" alt={act.title} src={act.img} />
                        </td>
                        <td className="p-4 font-bold text-on-surface">
                          {act.title}
                          {act.latest && <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-bold">Terbaru</span>}
                          {act.closed && <span className="ml-2 px-2 py-0.5 bg-surface-variant text-outline text-[10px] rounded-full font-bold">Tutup</span>}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-surface-container-high rounded-full text-xs font-semibold text-on-surface-variant">
                            {act.category}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-semibold text-on-surface-variant">{act.date}</td>
                        <td className="p-4 font-bold text-primary">{act.price}</td>
                        <td className="p-4">
                          <div className="flex justify-center items-center gap-1">
                            <button
                              onClick={() => openActivityModal(act)}
                              className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button
                              onClick={() => deleteActivity(act.id)}
                              className="p-2 hover:bg-error-container/10 text-error rounded-lg transition-colors cursor-pointer"
                              title="Hapus"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ANTREAN DEDIKASI KIP-K */}
          {activeTab === "antrean_kip" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-on-surface">Antrean Validasi KIP-K</h2>
                  <p className="text-xs text-on-surface-variant mt-1">Tinjau berkas beasiswa KIP-K mahasiswa dan ubah status verifikasinya.</p>
                </div>
                <div className="flex gap-2 text-xs font-bold bg-surface-container rounded-xl p-1 shrink-0 self-start sm:self-center">
                  {(["Pending", "Verified", "Rejected", "Semua"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setKipStatusFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                        kipStatusFilter === filter
                          ? "bg-primary text-white"
                          : "text-on-surface-variant hover:bg-surface-variant/20"
                      }`}
                    >
                      {filter === "Pending" ? "Antrean" : filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Widget */}
              <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-4 shadow-sm">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Cari nama mahasiswa, email, atau asal universitas..."
                    value={kipSearchQuery}
                    onChange={(e) => setKipSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-surface-container border border-surface-variant/20 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm text-on-surface"
                  />
                </div>
              </div>

              {/* Applicants List Grid */}
              <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-surface-variant/30 text-on-surface-variant font-bold text-xs uppercase">
                      <th className="p-4">Nama Mahasiswa</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Universitas</th>
                      <th className="p-4 w-32 text-center">Status Verifikasi</th>
                      <th className="p-4 w-48 text-center">Berkas Pendukung</th>
                      <th className="p-4 w-44 text-center">Aksi Validasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-variant/20 text-sm">
                    {users
                      .filter((usr) => usr.kipStatus === "KIP")
                      .filter((usr) => {
                        // Status filter
                        if (kipStatusFilter !== "Semua" && usr.verificationStatus !== kipStatusFilter) {
                          return false;
                        }
                        // Search filter
                        if (kipSearchQuery.trim() !== "") {
                          const query = kipSearchQuery.toLowerCase();
                          return (
                            usr.name.toLowerCase().includes(query) ||
                            usr.email.toLowerCase().includes(query) ||
                            usr.university.toLowerCase().includes(query)
                          );
                        }
                        return true;
                      }).length > 0 ? (
                        users
                          .filter((usr) => usr.kipStatus === "KIP")
                          .filter((usr) => {
                            if (kipStatusFilter !== "Semua" && usr.verificationStatus !== kipStatusFilter) {
                              return false;
                            }
                            if (kipSearchQuery.trim() !== "") {
                              const query = kipSearchQuery.toLowerCase();
                              return (
                                usr.name.toLowerCase().includes(query) ||
                                usr.email.toLowerCase().includes(query) ||
                                usr.university.toLowerCase().includes(query)
                              );
                            }
                            return true;
                          })
                          .map((usr) => (
                            <tr key={usr.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                              <td className="p-4 font-bold text-on-surface">{usr.name}</td>
                              <td className="p-4 text-xs font-semibold text-on-surface-variant">{usr.email}</td>
                              <td className="p-4 text-xs font-semibold text-on-surface-variant">{usr.university}</td>
                              <td className="p-4 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                  usr.verificationStatus === "Verified" ? "bg-primary-container/10 text-primary" :
                                  usr.verificationStatus === "Pending" ? "bg-secondary-container/20 text-on-secondary-container" :
                                  "bg-error-container/10 text-error"
                                }`}>
                                  {usr.verificationStatus}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => {
                                    alert(`Menampilkan berkas pendukung KIP-K milik ${usr.name}:\n- Kartu KIP-K: KIP-K-${usr.id.toUpperCase()}-2024.pdf\n- SKTM (Surat Keterangan Tidak Mampu): SKTM-${usr.id.toUpperCase()}.pdf`);
                                  }}
                                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1.5 mx-auto"
                                >
                                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                                  <span>Lihat Berkas (PDF)</span>
                                </button>
                              </td>
                              <td className="p-4">
                                {usr.verificationStatus === "Pending" ? (
                                  <div className="flex gap-2 justify-center">
                                    <button
                                      onClick={() => validateKipUser(usr.id, "Verified")}
                                      className="px-3.5 py-1.5 bg-primary text-on-primary text-[10px] font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-sm"
                                    >
                                      Setujui
                                    </button>
                                    <button
                                      onClick={() => validateKipUser(usr.id, "Rejected")}
                                      className="px-3.5 py-1.5 bg-error text-on-error text-[10px] font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-sm"
                                    >
                                      Tolak
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex justify-center gap-2">
                                    <button
                                      onClick={() => validateKipUser(usr.id, usr.verificationStatus === "Verified" ? "Rejected" : "Verified")}
                                      className="px-3 py-1.5 bg-surface-container hover:bg-surface-variant/30 text-on-surface-variant text-[10px] font-bold rounded-lg transition-all cursor-pointer border border-surface-variant/20"
                                    >
                                      Ubah Status
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-outline italic">
                            Tidak ada antrean validasi KIP-K yang cocok dengan pencarian / filter Anda.
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: KELOLA PENGGUNA */}
          {activeTab === "pengguna" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-on-surface">Manajemen Pengguna</h2>
                <p className="text-xs text-on-surface-variant mt-1">Kelola hak akses login, profil, dan hapus/blokir akun pengguna.</p>
              </div>

              {/* Table */}
              <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-surface-variant/30 text-on-surface-variant font-bold text-xs uppercase">
                      <th className="p-4">Nama Lengkap</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Asal Universitas</th>
                      <th className="p-4 w-28">Status KIP</th>
                      <th className="p-4 w-32">Verifikasi</th>
                      <th className="p-4 w-16 text-center">Hapus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-variant/20 text-sm">
                    {users.map((usr) => (
                      <tr key={usr.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                        <td className="p-4 font-bold text-on-surface">{usr.name}</td>
                        <td className="p-4 text-xs font-semibold text-on-surface-variant">{usr.email}</td>
                        <td className="p-4 text-xs font-semibold text-on-surface-variant">{usr.university}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${usr.kipStatus === "KIP" ? "bg-primary-container/20 text-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                            {usr.kipStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            usr.verificationStatus === "Verified" ? "bg-primary-container/10 text-primary" :
                            usr.verificationStatus === "Pending" ? "bg-secondary-container/20 text-on-secondary-container" :
                            "bg-error-container/10 text-error"
                          }`}>
                            {usr.verificationStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => deleteUser(usr.id, usr.email)}
                              className="p-2 hover:bg-error-container/10 text-error rounded-lg transition-colors cursor-pointer"
                              title="Hapus / Blokir Akun"
                            >
                              <span className="material-symbols-outlined text-[18px]">person_remove</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: UPLOAD SERTIFIKAT */}
          {activeTab === "sertifikat" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
              {/* Form Upload */}
              <div className="lg:col-span-1 bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm space-y-md h-fit">
                <div>
                  <h3 className="font-display text-lg font-bold text-on-surface">Penerbitan Sertifikat</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">Terbitkan sertifikat elektronik resmi untuk mahasiswa.</p>
                </div>

                <form onSubmit={handleUploadCertificate} className="space-y-md">
                  {/* Select User */}
                  <div className="space-y-sm">
                    <label className="font-label-md text-label-md text-on-surface-variant block font-semibold">Nama Mahasiswa</label>
                    <input
                      type="text"
                      placeholder="Contoh: Ahmad Fauzan"
                      value={certUser}
                      onChange={(e) => setCertUser(e.target.value)}
                      className="w-full p-3 bg-surface-container border border-surface-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface"
                      required
                    />
                  </div>

                  {/* Select Activity */}
                  <div className="space-y-sm">
                    <label className="font-label-md text-label-md text-on-surface-variant block font-semibold">Nama Kegiatan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Latihan Kepemimpinan Mahasiswa Berprestasi (LKMB)"
                      value={certActivity}
                      onChange={(e) => setCertActivity(e.target.value)}
                      className="w-full p-3 bg-surface-container border border-surface-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface"
                      required
                    />
                  </div>

                  {/* Serial Code */}
                  <div className="space-y-sm">
                    <label className="font-label-md text-label-md text-on-surface-variant block font-semibold">Nomor Seri Sertifikat</label>
                    <input
                      type="text"
                      placeholder="Contoh: CERT-LKMB-2024-0891"
                      value={certCode}
                      onChange={(e) => setCertCode(e.target.value)}
                      className="w-full p-3 bg-surface-container border border-surface-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface"
                      required
                    />
                  </div>

                  {/* File Upload (Mock) */}
                  <div className="space-y-sm">
                    <label className="font-label-md text-label-md text-on-surface-variant block font-semibold">Lampiran Berkas Sertifikat (Mock)</label>
                    <div className="border-2 border-dashed border-surface-variant/50 rounded-xl p-4 text-center cursor-pointer hover:bg-surface-container transition-all">
                      <span className="material-symbols-outlined text-outline text-3xl">upload_file</span>
                      <p className="text-xs text-on-surface-variant mt-1">Seret berkas PDF di sini atau klik untuk mencari</p>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={uploadingCert}
                    className="w-full bg-primary text-on-primary font-bold py-3.5 rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:bg-gray-300"
                  >
                    {uploadingCert ? "Menerbitkan..." : "Terbitkan Sertifikat"}
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </button>
                </form>
              </div>

              {/* List generated certificates */}
              <div className="lg:col-span-2 space-y-md">
                <div>
                  <h3 className="font-display text-lg font-bold text-on-surface">Daftar Sertifikat Terbit</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">Sertifikat elektronik yang telah dikirimkan ke mahasiswa.</p>
                </div>

                <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-surface-variant/30 text-on-surface-variant font-bold text-xs uppercase">
                        <th className="p-4">Mahasiswa</th>
                        <th className="p-4">Kegiatan</th>
                        <th className="p-4 w-44">No Seri</th>
                        <th className="p-4 w-28">Tanggal Terbit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-variant/20 text-xs">
                      {certificates.map((c) => (
                        <tr key={c.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                          <td className="p-4 font-bold text-on-surface">{c.userName}</td>
                          <td className="p-4 text-on-surface-variant font-semibold">{c.activityTitle}</td>
                          <td className="p-4 font-mono font-bold text-stone-700">{c.code}</td>
                          <td className="p-4 text-outline font-semibold">{c.dateUploaded}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VALIDASI SERTIFIKAT */}
          {activeTab === "validasi_sertifikat" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-on-surface">Validasi Sertifikat Elektronik</h2>
                <p className="text-xs text-on-surface-variant mt-1">Verifikasi keaslian dokumen sertifikat digital SEMADIKSI dengan nomor seri atau pemindaian QR code.</p>
              </div>

              {/* Validation Search & Scan UI inside Admin */}
              <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm space-y-md">
                <form onSubmit={handleAdminCertSearch} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                      qr_code_scanner
                    </span>
                    <input
                      type="text"
                      placeholder="Masukkan Nomor Seri Sertifikat (contoh: CERT-LKMB-2024-0891)"
                      value={adminCertInput}
                      onChange={(e) => setAdminCertInput(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-surface-container border border-surface-variant/20 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-mono tracking-wide text-on-surface"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-primary text-on-primary font-bold text-sm rounded-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      Verifikasi
                    </button>
                    <button
                      type="button"
                      onClick={handleAdminSimulateScan}
                      disabled={adminScanning}
                      className="px-4 py-3 bg-secondary-container text-on-secondary-container font-bold text-sm rounded-xl hover:brightness-95 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 disabled:bg-gray-300"
                    >
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                      {adminScanning ? "Scanning..." : "Simulasi Scan QR"}
                    </button>
                  </div>
                </form>

                {/* Scanner animation simulation */}
                {adminScanning && (
                  <div className="w-full max-w-sm mx-auto aspect-video rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center text-white">
                    <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500 shadow-[0_0_10px_2px_rgba(16,185,129,0.5)] animate-pulse"></div>
                    <span className="material-symbols-outlined text-4xl text-emerald-400 animate-bounce">qr_code_2</span>
                    <p className="text-[10px] tracking-wider uppercase font-semibold text-emerald-300 mt-2">Membuka Kamera QR Scanner...</p>
                  </div>
                )}
              </div>

              {/* Result Area */}
              {adminSearchedCode && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {adminCertValid && adminMatchedCert ? (
                    <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm space-y-6">
                      <div>
                        <h3 className="text-xs font-bold text-outline uppercase tracking-widest text-center border-b border-surface-variant/20 pb-2 mb-4">
                          Informasi Dokumen
                        </h3>
                        
                        <div className="divide-y divide-surface-variant/10 text-sm">
                          <div className="grid grid-cols-3 py-3 items-center">
                            <span className="text-on-surface-variant">STATUS</span>
                            <div className="col-span-2 flex items-center gap-1.5">
                              <span className="text-primary font-extrabold tracking-wider uppercase text-sm">VALID</span>
                              <span className="material-symbols-outlined text-primary text-[18px] font-bold">check_circle</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 py-3 items-center">
                            <span className="text-on-surface-variant">Hash Dokumen</span>
                            <span className="col-span-2 font-mono text-xs text-on-surface break-all bg-surface-container p-1.5 rounded border border-surface-variant/20">
                              {adminMatchedCert.hash}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 py-3">
                            <span className="text-on-surface-variant">Judul Dokumen</span>
                            <span className="col-span-2 font-bold text-on-surface">{adminMatchedCert.title}</span>
                          </div>

                          <div className="grid grid-cols-3 py-3">
                            <span className="text-on-surface-variant">Author Dokumen</span>
                            <span className="col-span-2 text-on-surface-variant">{adminMatchedCert.author}</span>
                          </div>

                          <div className="grid grid-cols-3 py-3 items-center">
                            <span className="text-on-surface-variant">File Dokumen</span>
                            <div className="col-span-2">
                              <button
                                onClick={() => alert(`Mengunduh berkas sertifikat asli:\nNomor Seri: ${adminMatchedCert.code}`)}
                                className="px-4 py-2 bg-primary text-on-primary hover:brightness-110 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow"
                              >
                                <span className="material-symbols-outlined text-[14px]">download</span> Download PDF
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Signatures Table */}
                      <div>
                        <h3 className="text-xs font-bold text-outline uppercase tracking-widest text-center border-b border-surface-variant/20 pb-2 mb-4">
                          Informasi Penandatanganan (TTE)
                        </h3>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-surface-container-low text-on-surface-variant font-bold border-b border-surface-variant/20">
                                <th className="p-3 w-10 text-center">NO</th>
                                <th className="p-3 w-20 text-center">REQUEST</th>
                                <th className="p-3">NAMA PENANDATANGAN</th>
                                <th className="p-3 w-44">TANGGAL</th>
                                <th className="p-3 w-20 text-center">CERTIFIED</th>
                                <th className="p-3 w-20 text-center">VALIDITY</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-variant/10">
                              {adminMatchedCert.signatories.map((sig: string, idx: number) => (
                                <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors">
                                  <td className="p-3 text-center">{idx + 1}</td>
                                  <td className="p-3 text-center font-bold text-outline bg-surface-container/30">TTE</td>
                                  <td className="p-3 text-on-surface font-bold">{sig}</td>
                                  <td className="p-3 text-on-surface-variant flex items-center gap-1">
                                    <span>{adminMatchedCert.date}</span>
                                    <span className="material-symbols-outlined text-primary text-[14px] font-bold">check</span>
                                  </td>
                                  <td className="p-3 text-center">
                                    <span className="material-symbols-outlined text-primary font-bold text-[18px]">done</span>
                                  </td>
                                  <td className="p-3 text-center">
                                    <span className="material-symbols-outlined text-primary font-bold text-[18px]">done</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Invalid Alert
                    <div className="bg-error-container/10 border border-error/20 rounded-2xl p-6 text-center space-y-3">
                      <span className="material-symbols-outlined text-error text-5xl font-bold animate-pulse">warning</span>
                      <h3 className="text-lg font-bold text-error uppercase tracking-wide">STATUS: DOKUMEN TIDAK VALID / PALSU</h3>
                      <p className="text-sm text-on-error-container max-w-lg mx-auto">
                        Dokumen dengan nomor seri <strong className="font-mono text-error font-extrabold bg-error-container/20 px-2 py-0.5 rounded border border-error/20">{adminSearchedCode}</strong> tidak ditemukan di database portal.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PENJURIAN & KARYA LOMBA */}
          {activeTab === "lomba" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-on-surface">Penjurian &amp; Pengumpulan Karya</h2>
                <p className="text-xs text-on-surface-variant mt-1">Pantau karya lomba yang dikumpulkan dan masukkan nilai juri.</p>
              </div>

              {/* Table */}
              <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-surface-variant/30 text-on-surface-variant font-bold text-xs uppercase">
                      <th className="p-4">Nama Kelompok</th>
                      <th className="p-4">Ketua Kelompok</th>
                      <th className="p-4 w-40">Kategori Lomba</th>
                      <th className="p-4">Lampiran Karya</th>
                      <th className="p-4 w-28 text-center">Nilai Saat Ini</th>
                      <th className="p-4 w-48 text-center">Beri / Update Nilai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-variant/20 text-sm">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                        <td className="p-4 font-bold text-on-surface">{sub.groupName}</td>
                        <td className="p-4 text-xs font-semibold text-on-surface-variant">{sub.leaderName}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-secondary-container/20 text-on-secondary-container rounded text-xs font-semibold border border-secondary-container/20">
                            {sub.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => alert(`Mengunduh berkas karya: ${sub.documentName}`)}
                            className="flex items-center gap-1.5 text-primary hover:underline font-bold text-xs cursor-pointer text-left leading-normal"
                          >
                            <span className="material-symbols-outlined text-[16px]">attachment</span>
                            <span>{sub.documentName}</span>
                          </button>
                        </td>
                        <td className="p-4 text-center font-extrabold text-base">
                          {sub.score === "Belum Dinilai" ? (
                            <span className="text-error font-normal text-xs italic">Belum Dinilai</span>
                          ) : (
                            <span className="text-primary">{sub.score} / 100</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 items-center justify-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="0-100"
                              value={tempScores[sub.id] || ""}
                              onChange={(e) => handleScoreChange(sub.id, e.target.value)}
                              className="w-20 p-2 bg-surface-container border border-surface-variant/20 rounded-lg text-center font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <button
                              onClick={() => saveScore(sub.id)}
                              className="px-3 py-2 bg-primary text-on-primary rounded-lg font-bold text-xs cursor-pointer active:scale-95 transition-all shadow"
                            >
                              Simpan
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL FORM: CRUD KEGIATAN */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-surface-variant/30 mb-6">
              <div>
                <h3 className="font-bold text-xl text-on-surface">
                  {currentActivity ? "Edit Informasi Kegiatan" : "Upload Kegiatan Baru"}
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">Lengkapi form di bawah untuk mempublikasikan agenda.</p>
              </div>
              <button
                onClick={closeActivityModal}
                className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-variant/30 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={saveActivity} className="space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-sm">
                  <label className="font-label-md text-label-md text-on-surface-variant block font-semibold">Nama Kegiatan</label>
                  <input
                    type="text"
                    value={actTitle}
                    onChange={(e) => setActTitle(e.target.value)}
                    placeholder="Contoh: Seminar Kewirausahaan KIP"
                    className="w-full p-3 bg-surface-container border border-surface-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-sm">
                  <label className="font-label-md text-label-md text-on-surface-variant block font-semibold">Kategori</label>
                  <select
                    value={actCategory}
                    onChange={(e) => setActCategory(e.target.value)}
                    className="w-full p-3 bg-surface-container border border-surface-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm cursor-pointer"
                    required
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Sosial">Sosial</option>
                    <option value="Lomba">Lomba</option>
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-sm">
                  <label className="font-label-md text-label-md text-on-surface-variant block font-semibold">Tanggal Pelaksanaan</label>
                  <input
                    type="text"
                    value={actDate}
                    onChange={(e) => setActDate(e.target.value)}
                    placeholder="Contoh: 15 Januari 2025"
                    className="w-full p-3 bg-surface-container border border-surface-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    required
                  />
                </div>

                {/* Price */}
                <div className="space-y-sm">
                  <label className="font-label-md text-label-md text-on-surface-variant block font-semibold">Biaya Pendaftaran</label>
                  <input
                    type="text"
                    value={actPrice}
                    onChange={(e) => setActPrice(e.target.value)}
                    placeholder="Contoh: Gratis atau IDR 50.000"
                    className="w-full p-3 bg-surface-container border border-surface-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    required
                  />
                </div>

                {/* Image File Input */}
                <div className="space-y-sm md:col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block font-semibold">Gambar Banner</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setActImg(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full p-3 bg-surface-container border border-surface-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm cursor-pointer"
                    />
                    {actImg && (
                      <div className="shrink-0 flex items-center gap-2">
                        <span className="text-xs text-on-surface-variant">Pratinjau:</span>
                        <img
                          className="w-16 h-12 object-cover rounded-lg shadow-sm border border-surface-variant/30"
                          alt="Banner Preview"
                          src={actImg}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-sm md:col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block font-semibold">Lokasi Pelaksanaan</label>
                  <input
                    type="text"
                    value={actLocation}
                    onChange={(e) => setActLocation(e.target.value)}
                    placeholder="Contoh: Gedung Auditorium Utama atau Link Zoom Meeting"
                    className="w-full p-3 bg-surface-container border border-surface-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    required
                  />
                </div>

                {/* Speaker */}
                <div className="space-y-sm md:col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block font-semibold">Narasumber / Pengisi Acara</label>
                  <input
                    type="text"
                    value={actSpeaker}
                    onChange={(e) => setActSpeaker(e.target.value)}
                    placeholder="Contoh: Budi Subarjo (CEO Tech) & Tim Mentor"
                    className="w-full p-3 bg-surface-container border border-surface-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    required
                  />
                </div>

                {/* Rundown Textarea */}
                <div className="space-y-sm md:col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block font-semibold">Jadwal Rundown Acara (pisahkan dengan baris baru)</label>
                  <textarea
                    rows={4}
                    value={actRundown}
                    onChange={(e) => setActRundown(e.target.value)}
                    placeholder="Contoh:&#10;08.00 - 09.00 : Registrasi&#10;09.00 - 10.30 : Sesi Materi Utama"
                    className="w-full p-3 bg-surface-container border border-surface-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-mono text-xs"
                    required
                  />
                </div>

                {/* Description Textarea */}
                <div className="space-y-sm md:col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block font-semibold">Deskripsi Kegiatan</label>
                  <textarea
                    rows={4}
                    value={actDesc}
                    onChange={(e) => setActDesc(e.target.value)}
                    placeholder="Tulis ringkasan mengenai program kegiatan..."
                    className="w-full p-3 bg-surface-container border border-surface-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    required
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex gap-4 pt-4 border-t border-surface-variant/30 justify-end">
                <button
                  type="button"
                  onClick={closeActivityModal}
                  className="px-6 py-3 border border-surface-variant text-on-surface-variant hover:bg-surface-variant/15 rounded-full font-bold text-xs cursor-pointer transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary text-on-primary hover:brightness-110 rounded-full font-bold text-xs cursor-pointer shadow-md active:scale-98 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Simpan Publikasi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
