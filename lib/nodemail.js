import dotenv from 'dotenv';
import nodemailer from "nodemailer";
dotenv.config();
console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "Loaded" : "Not Loaded");
let transporter;

if (process.env.SMTP_EMAIL && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  console.warn("SMTP not configured. Using JSON transport (emails will not be sent).");
  transporter = nodemailer.createTransport({ jsonTransport: true });
}

export { transporter };

const sendMail = async (toEmail, subject, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_EMAIL || 'no-reply@example.com',
      to: toEmail,
      subject: subject,

      html: `
      <div style="
        max-width:600px;
        margin:auto;
        font-family:'Segoe UI',sans-serif;
        background:#ffffff;
        border-radius:20px;
        overflow:hidden;
        box-shadow:0 10px 30px rgba(0,0,0,0.1);
      ">

        <div style="
          background:linear-gradient(135deg,#4f46e5,#7c3aed);
          padding:30px;
          text-align:center;
          color:white;
        ">
          <h1>Expense Tracker</h1>
          <p>Secure Login Verification</p>
        </div>

        <div style="padding:40px;">
          <h2>Hello 👋</h2>

          <p>
            We received a login request for your account.
            Use the OTP below to continue.
          </p>

          <div style="text-align:center;margin:30px 0;">
            <span style="
              background:#eef2ff;
              color:#4f46e5;
              padding:18px 35px;
              border-radius:15px;
              font-size:34px;
              font-weight:bold;
              letter-spacing:8px;
            ">
              ${otp}
            </span>
          </div>

          <p style="color:red;font-weight:bold;">
            OTP expires in 5 minutes
          </p>

          <p>
            If you didn't request this login,
            please ignore this email.
          </p>
        </div>

        <div style="
          background:#f9fafb;
          text-align:center;
          padding:20px;
          color:#888;
        ">
          © 2026 Expense Tracker
        </div>

      </div>
      `,
    });

    console.log("Mail Sent:", info.messageId || info);
  } catch (err) {
    console.error("Error sending mail:", err);
    throw err;
  }
};

export default sendMail;
 