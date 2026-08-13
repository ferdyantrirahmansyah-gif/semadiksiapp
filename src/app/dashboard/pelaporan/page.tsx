"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ReportFile {
  id: string;
  title: string;
  description: string;
  status: "Disetujui" | "Perlu Perbaikan" | "Belum Ada Berkas" | "Menunggu Review";
  fileName: string;
  score: number;
  notes?: string;
  downloadTemplate?: string;
}

export default function PelaporanPage() {
  const [files, setFiles] = useState<ReportFile[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [queueNumber, setQueueNumber] = useState<string | null>(null);
  const [queueTime, setQueueTime] = useState<string | null>(null);
  const [selectedFileForUpload, setSelectedFileForUpload] = useState<{ [key: string]: string }>({});
  const [weights, setWeights] = useState<{ [key: string]: number }>({
    "Keaktifan Ormawa": 25,
    "Kegiatan Webinar Soft Skill": 25,
    "Keikutsertaan Kompetisi": 25,
    "Kegiatan Semadiksi": 25
  });

  const defaultFiles: ReportFile[] = [
    {
      id: "ormawa",
      title: "Keaktifan Ormawa",
      description: "Upload SK Kepengurusan atau Surat Tanda Aktif Ormawa.",
      status: "Disetujui",
      fileName: "SK_BEM_2026.pdf",
      score: 90,
      notes: "Berkas sesuai.",
      downloadTemplate: "#"
    },
    {
      id: "webinar",
      title: "Kegiatan Webinar Soft Skill",
      description: "Upload Sertifikat keikutsertaan webinar.",
      status: "Perlu Perbaikan",
      fileName: "Sertifikat_Webinar.jpg",
      score: 40,
      notes: "Sertifikat buram/tidak terbaca. Harap scan ulang dengan resolusi lebih tinggi."
    },
    {
      id: "kompetisi",
      title: "Keikutsertaan Kompetisi",
      description: "Upload Sertifikat juara atau peserta kompetisi.",
      status: "Belum Ada Berkas",
      fileName: "",
      score: 0
    },
    {
      id: "semadiksi",
      title: "Kegiatan Semadiksi",
      description: "Upload Sertifikat kegiatan Semadiksi KIPK.",
      status: "Menunggu Review",
      fileName: "Sertifikat_Semadiksi_Maba.pdf",
      score: 100,
      notes: "Menunggu review admin."
    }
  ];

  useEffect(() => {
    // Load current user
    const userStr = localStorage.getItem("semadiksi_current_user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {}
    }

    // Load report files status
    const storedFiles = localStorage.getItem("semadiksi_report_files");
    if (storedFiles) {
      try {
        setFiles(JSON.parse(storedFiles));
      } catch (e) {
        setFiles(defaultFiles);
      }
    } else {
      setFiles(defaultFiles);
      localStorage.setItem("semadiksi_report_files", JSON.stringify(defaultFiles));
    }

    // Load saved queue number
    const storedQueue = localStorage.getItem("semadiksi_user_queue_number");
    const storedQueueTime = localStorage.getItem("semadiksi_user_queue_time");
    if (storedQueue) {
      setQueueNumber(storedQueue);
      setQueueTime(storedQueueTime);
    }

    // Load category weights from localStorage
    const storedWeights = localStorage.getItem("semadiksi_category_weights");
    if (storedWeights) {
      try {
        const parsed = JSON.parse(storedWeights);
        if (parsed["Keaktifan Ormawa"] !== undefined) {
          setWeights(parsed);
        }
      } catch (err) {}
    }
  }, []);

  const handleFileChange = (id: string, name: string) => {
    setSelectedFileForUpload({
      ...selectedFileForUpload,
      [id]: name
    });
  };

  const handleRemoveFile = (id: string) => {
    const updated = files.map((f) => {
      if (f.id === id) {
        return {
          ...f,
          fileName: "",
          status: "Belum Ada Berkas" as const,
          score: 0,
          notes: undefined
        };
      }
      return f;
    });
    setFiles(updated);
    localStorage.setItem("semadiksi_report_files", JSON.stringify(updated));

    setSelectedFileForUpload({
      ...selectedFileForUpload,
      [id]: ""
    });
  };

  const handleUpload = (id: string) => {
    const fileName = selectedFileForUpload[id];
    if (!fileName) {
      alert("Silakan pilih file terlebih dahulu!");
      return;
    }

    // Simulate different upload responses to allow user to easily pass the 80% mark
    const updated = files.map((f) => {
      if (f.id === id) {
        // If they upload to "Kompetisi", let's auto approve with 90% score to help them reach 80% avg!
        if (id === "kompetisi") {
          return {
            ...f,
            fileName: fileName,
            status: "Disetujui" as const,
            score: 90,
            notes: "Berkas kompetisi valid dan diverifikasi otomatis."
          };
        }
        // If they upload to "Webinar" to fix it, auto approve with 95% score!
        if (id === "webinar") {
          return {
            ...f,
            fileName: fileName,
            status: "Disetujui" as const,
            score: 95,
            notes: "Perbaikan berkas disetujui."
          };
        }
        // General fallback
        return {
          ...f,
          fileName: fileName,
          status: "Menunggu Review" as const,
          score: 100,
          notes: "Menunggu review panitia pelaksana."
        };
      }
      return f;
    });

    setFiles(updated);
    localStorage.setItem("semadiksi_report_files", JSON.stringify(updated));
    alert(`Berkas untuk '${files.find(f => f.id === id)?.title}' berhasil diajukan!`);
  };

  const calculateWeightedScore = (currentFiles: ReportFile[]) => {
    if (currentFiles.length === 0) return 0;
    const totalWeighted = currentFiles.reduce((acc, f) => {
      let w = 25;
      if (f.id === "ormawa") w = weights["Keaktifan Ormawa"] !== undefined ? weights["Keaktifan Ormawa"] : 25;
      if (f.id === "webinar") w = weights["Kegiatan Webinar Soft Skill"] !== undefined ? weights["Kegiatan Webinar Soft Skill"] : 25;
      if (f.id === "kompetisi") w = weights["Keikutsertaan Kompetisi"] !== undefined ? weights["Keikutsertaan Kompetisi"] : 25;
      if (f.id === "semadiksi") w = weights["Kegiatan Semadiksi"] !== undefined ? weights["Kegiatan Semadiksi"] : 25;
      return acc + (f.score * (w / 100));
    }, 0);
    return Math.round(totalWeighted);
  };

  const handleGetQueueNumber = () => {
    const avgScore = calculateWeightedScore(files);
    if (avgScore < 80) {
      alert("Gagal mengambil nomor antrean! Akumulasi skor penilaian Anda di bawah 80%.");
      return;
    }

    const num = `KIP-${Math.floor(100 + Math.random() * 900)}`;
    const timeStr = new Date().toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    setQueueNumber(num);
    setQueueTime(timeStr);
    localStorage.setItem("semadiksi_user_queue_number", num);
    localStorage.setItem("semadiksi_user_queue_time", timeStr);

    // Sync to user session
    if (currentUser) {
      const updatedUser = { ...currentUser, queueNumber: num };
      setCurrentUser(updatedUser);
      localStorage.setItem("semadiksi_current_user", JSON.stringify(updatedUser));

      // Sync to global user list
      const storedUsers = localStorage.getItem("semadiksi_users");
      if (storedUsers) {
        try {
          const usersList = JSON.parse(storedUsers);
          const updatedList = usersList.map((u: any) => u.id === currentUser.id ? { ...u, queueNumber: num } : u);
          localStorage.setItem("semadiksi_users", JSON.stringify(updatedList));
        } catch (err) {}
      }
    }

    alert(`Sukses mengambil nomor antrean: ${num}`);
  };

  const handleCancelQueue = () => {
    if (confirm("Apakah Anda yakin ingin membatalkan nomor antrean saat ini?")) {
      setQueueNumber(null);
      setQueueTime(null);
      localStorage.removeItem("semadiksi_user_queue_number");
      localStorage.removeItem("semadiksi_user_queue_time");

      // Sync to user session
      if (currentUser) {
        const updatedUser = { ...currentUser };
        delete updatedUser.queueNumber;
        setCurrentUser(updatedUser);
        localStorage.setItem("semadiksi_current_user", JSON.stringify(updatedUser));

        // Sync to global user list
        const storedUsers = localStorage.getItem("semadiksi_users");
        if (storedUsers) {
          try {
            const usersList = JSON.parse(storedUsers);
            const updatedList = usersList.map((u: any) => {
              if (u.id === currentUser.id) {
                const copy = { ...u };
                delete copy.queueNumber;
                return copy;
              }
              return u;
            });
            localStorage.setItem("semadiksi_users", JSON.stringify(updatedList));
          } catch (err) {}
        }
      }
    }
  };

  const avgScore = calculateWeightedScore(files);
  const canGetQueue = avgScore >= 80;

  if (currentUser && currentUser.kipStatus !== "KIP UNUSA") {
    return (
      <div className="max-w-md mx-auto px-margin-mobile md:px-margin-desktop py-16 text-center space-y-md flex flex-col items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined text-error text-6xl">warning</span>
        <h2 className="text-2xl font-bold text-on-surface">Akses Terbatas</h2>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">
          Halaman unggah berkas pelaporan ini khusus bagi mahasiswa penerima beasiswa KIP-K UNUSA.
        </p>
        <div className="pt-2">
          <Link href="/dashboard" className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-full text-xs shadow-md active:scale-95 transition-all">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-lg relative">
      {/* Header */}
      <section className="space-y-md">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface leading-tight">
            Upload Berkas Pelaporan
          </h2>
          <p className="text-on-surface-variant mt-2 font-body-md text-base">
            Unggah sertifikat/surat keterangan untuk mengklaim poin keaktifan non-akademik beasiswa KIP-K.
          </p>
        </div>
      </section>

      {/* Queue Number Panel */}
      <section className="bg-surface-container-lowest border border-surface-variant/30 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">assignment_turned_in</span>
              <span>Nomor Antrean Verifikasi KIP-K</span>
            </h3>
            <p className="text-xs text-on-surface-variant max-w-xl">
              Mahasiswa wajib memiliki akumulasi skor penilaian kelayakan berkas laporan keaktifan **minimal 80%** untuk dapat mengambil nomor antrean wawancara fisik KIP-K.
            </p>
          </div>
          <div className="flex flex-col items-center p-3 rounded-2xl bg-surface-container-low border border-surface-variant/20 shadow-inner shrink-0 w-full md:w-44 text-center">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Akumulasi Nilai</span>
            <span className={`text-3xl font-extrabold mt-1 block ${canGetQueue ? "text-primary" : "text-error"}`}>
              {avgScore}%
            </span>
            <span className={`text-[10px] mt-1 font-bold ${canGetQueue ? "text-primary" : "text-error"}`}>
              {canGetQueue ? "Syarat Terpenuhi" : "Syarat < 80% Belum Terpenuhi"}
            </span>
          </div>
        </div>

        {queueNumber ? (
          /* Active Queue Slip */
          <div className="border border-primary/30 rounded-2xl bg-primary/5 p-6 flex flex-col items-center justify-center space-y-4 max-w-md mx-auto relative overflow-hidden shadow-md">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
            <span className="font-mono text-[9px] tracking-widest text-primary font-bold uppercase">ANTREAN VERIFIKASI AKTIF</span>
            
            <div className="text-center">
              <h4 className="text-4xl font-black text-primary tracking-wide">{queueNumber}</h4>
              <p className="text-[10px] text-on-surface-variant mt-1">Dibuat pada: {queueTime}</p>
            </div>

            <div className="w-full text-xs space-y-2 border-t border-b border-primary/20 py-4 my-2 text-on-surface-variant">
              <div className="flex justify-between">
                <span>Nama Mahasiswa:</span>
                <strong className="text-on-surface">{currentUser?.name || "Ahmad Fauzan"}</strong>
              </div>
              <div className="flex justify-between">
                <span>Program Studi:</span>
                <strong className="text-on-surface">S1 Sistem Informasi</strong>
              </div>
              <div className="flex justify-between">
                <span>Lokasi Loket:</span>
                <strong className="text-on-surface">Ruang Rektorat, Kampus B UNUSA</strong>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-primary text-on-primary hover:brightness-110 rounded-xl text-xs font-bold transition-all shadow cursor-pointer text-center"
              >
                Cetak Slip
              </button>
              <button
                onClick={handleCancelQueue}
                className="flex-1 py-2 border border-error text-error hover:bg-error/10 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                Batalkan Antrean
              </button>
            </div>
          </div>
        ) : (
          /* Locked / Unlocked Button */
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined text-3xl ${canGetQueue ? "text-primary" : "text-error"}`}>
                {canGetQueue ? "lock_open" : "lock"}
              </span>
              <div>
                <p className="text-sm font-bold text-on-surface">
                  {canGetQueue ? "Tombol Antrean Terbuka!" : "Tombol Antrean Terkunci"}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {canGetQueue 
                    ? "Nilai Anda sudah mencapai syarat. Silakan ambil nomor antrean Anda sekarang." 
                    : "Silakan perbaiki berkas yang dinilai rendah atau lengkapi berkas kosong untuk menaikkan nilai."}
                </p>
              </div>
            </div>

            <button
              disabled={!canGetQueue}
              onClick={handleGetQueueNumber}
              className={`px-6 py-3 rounded-full font-bold text-xs shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer
                ${canGetQueue 
                  ? "bg-primary text-on-primary hover:brightness-110" 
                  : "bg-surface-variant text-on-surface-variant/50 cursor-not-allowed shadow-none"}`}
            >
              Ambil Nomor Antrean
            </button>
          </div>
        )}
      </section>

      {/* Upload Categories Grid */}
      <section className="space-y-4">
        {files.map((file) => {
          const colors: { [key: string]: string } = {
            "Disetujui": "bg-primary/10 border-primary text-primary",
            "Perlu Perbaikan": "bg-error/10 border-error text-error",
            "Menunggu Review": "bg-secondary-container/30 border-secondary-container text-on-secondary-container",
            "Belum Ada Berkas": "bg-surface-variant/20 border-surface-variant/40 text-on-surface-variant"
          };

          const isApproved = file.status === "Disetujui";
          const isPending = file.status === "Menunggu Review";
          const isRejected = file.status === "Perlu Perbaikan";

          return (
            <div
              key={file.id}
              className={`bg-surface-container-lowest border rounded-3xl p-5 md:p-6 shadow-sm space-y-4 transition-all hover:shadow-md
                ${isApproved ? "border-primary/20" : isRejected ? "border-error/20" : isPending ? "border-secondary-container/20" : "border-surface-variant/30"}`}
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-on-surface flex items-center gap-2">
                    <span>{file.title}</span>
                    <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold ${colors[file.status]}`}>
                      {file.status}
                    </span>
                  </h4>
                  <p className="text-xs text-on-surface-variant">{file.description}</p>
                  {file.downloadTemplate && (
                    <a
                      href={file.downloadTemplate}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline mt-1"
                    >
                      <span className="material-symbols-outlined text-[12px]">download</span>
                      Download Template Surat Tanda Aktif
                    </a>
                  )}
                </div>

                {/* File Upload Selector Column */}
                <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                  <div className="flex gap-2 w-full sm:w-auto">
                    {/* File input trigger */}
                    <div className="relative overflow-hidden flex-1 sm:flex-none">
                      <button className="w-full sm:w-auto px-4 py-2 border border-surface-variant text-on-surface-variant hover:bg-surface-variant/15 rounded-xl font-bold text-xs flex items-center gap-1.5 justify-center cursor-pointer transition-all">
                        <span className="material-symbols-outlined text-[16px]">folder_open</span>
                        <span>Pilih Berkas</span>
                      </button>
                      <input
                        type="file"
                        onChange={(e) => {
                          const fileObj = e.target.files?.[0];
                          if (fileObj) {
                            handleFileChange(file.id, fileObj.name);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>

                    {file.fileName && (
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="px-3.5 py-2 border border-error text-error hover:bg-error/10 rounded-xl cursor-pointer flex items-center justify-center transition-all"
                        title="Hapus Berkas"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    )}
                  </div>

                  {/* Selected / Current File Name */}
                  <span className="text-[11px] text-on-surface-variant italic truncate max-w-[200px]">
                    {selectedFileForUpload[file.id] ? (
                      <span className="text-primary font-bold">Terpilih: {selectedFileForUpload[file.id]}</span>
                    ) : file.fileName ? (
                      <span>File saat ini: {file.fileName}</span>
                    ) : (
                      "Belum ada file dipilih"
                    )}
                  </span>
                </div>
              </div>

              {/* Progress score bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant">
                  <span>SKOR PENILAIAN</span>
                  <span className={isApproved ? "text-primary" : isRejected ? "text-error" : "text-outline"}>
                    {file.score}%
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/50">
                  <div
                    className={`h-full rounded-full transition-all duration-500
                      ${isApproved ? "bg-primary" : isRejected ? "bg-error" : "bg-primary/50"}`}
                    style={{ width: `${file.score}%` }}
                  />
                </div>
              </div>

              {/* Catatan Admin */}
              {file.notes && (
                <div className={`p-3 rounded-2xl text-xs space-y-1 border flex items-start gap-2
                  ${isApproved ? "bg-primary/5 border-primary/20 text-on-surface" : isRejected ? "bg-error/5 border-error/20 text-on-surface" : "bg-neutral-50 border-neutral-100 text-on-surface-variant"}`}>
                  <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">comment</span>
                  <div>
                    <strong className="block font-bold">Catatan Admin:</strong>
                    <p className="mt-0.5">{file.notes}</p>
                  </div>
                </div>
              )}

              {/* Submit File Button */}
              {selectedFileForUpload[file.id] && (
                <div className="flex justify-end animate-in fade-in slide-in-from-top-1 duration-200">
                  <button
                    onClick={() => handleUpload(file.id)}
                    className="px-5 py-2.5 bg-primary text-on-primary hover:brightness-110 rounded-xl font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span>Ajukan Berkas</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
