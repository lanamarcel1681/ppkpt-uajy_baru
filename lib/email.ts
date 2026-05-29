import nodemailer from "nodemailer";

export const sendNotificationEmail = async (
  to: string,
  namaPelapor: string,
  rolePelapor: string,
  kronologi: string,
) => {
  // Cek apakah konfigurasi email sudah diatur di .env
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(
      "Menjalankan form tanpa notifikasi email. Konfigurasi EMAIL_USER/EMAIL_PASS belum diatur.",
    );
    return false; // Lewati pengiriman email secara diam-diam
  }

  // Ganti dengan konfigurasi SMTP Anda
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // misal: emailkita@gmail.com
      pass: process.env.EMAIL_PASS, // password aplikasi (App Password)
    },
  });

  const mailOptions = {
    from: `"PPKPT UAJY" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "Pemberitahuan Laporan PPKPT UAJY",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #245399;">Halo ${namaPelapor},</h2>
        <p>Terima kasih telah berpartisipasi sebagai <strong>${rolePelapor}</strong> dan melaporkan kejadian ke PPKPT UAJY.</p>
        <p>Laporan Anda telah kami terima dan saat ini berstatus <strong>Direview</strong>.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #245399; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold;">Ringkasan Kejadian:</p>
          <p style="margin-top: 5px;">${kronologi.length > 150 ? kronologi.substring(0, 150) + "..." : kronologi}</p>
        </div>
        <p>Tim kami akan segera memproses laporan ini. Anda akan mendapatkan pemberitahuan selanjutnya mengenai perkembangan penanganan tim PPKPT dari kasus yang dilaporkan.</p>
        <br/>
        <p>Salam,<br/><strong>Tim Satgas PPKPT UAJY</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email pemberitahuan berhasil dikirim ke", to);
    return true;
  } catch (error) {
    console.error("Gagal mengirim email:", error);
    return false;
  }
};

export const sendStatusUpdateEmail = async (
  to: string,
  namaPelapor: string,
  statusLaporan: string,
) => {
  // Cek apakah konfigurasi email sudah diatur di .env
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(
      "Menjalankan update tanpa notifikasi email. Konfigurasi belum diatur.",
    );
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"PPKPT UAJY" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: `Update Status Laporan PPKPT UAJY: ${statusLaporan}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #245399;">Halo ${namaPelapor},</h2>
        <p>Kami ingin menginformasikan bahwa status laporan Anda di sistem PPKPT UAJY telah diperbarui.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #245399; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold;">Status Saat Ini:</p>
          <p style="margin-top: 5px; font-size: 16px;"><strong>${statusLaporan}</strong></p>
        </div>
        <p>Anda dapat mengecek detail lebih lanjut mengenai penanganan kasus ini dengan mengontak atau menghubungi tim kami, atau menunggu pembaruan selanjutnya dari kami.</p>
        <br/>
        <p>Salam,<br/><strong>Tim Satgas PPKPT UAJY</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email update status berhasil dikirim ke", to);
    return true;
  } catch (error) {
    console.error("Gagal mengirim email update status:", error);
    return false;
  }
};
