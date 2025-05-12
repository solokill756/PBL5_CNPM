import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Đọc biến môi trường từ .env

// Cấu hình transporter để gửi email qua Gmail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER, // Gmail của bạn
    pass: process.env.SMTP_PASS, // App Password từ Google
  },
});

// Hàm gửi email yêu cầu từ vựng mới đến host với giao diện hiện đại
export const sendRequestNewVocabularyEmail = async (word: string, email: string , comment: string) => {
  try {
    // Tạo template HTML hiện đại
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Yêu Cầu Từ Vựng Mới</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          background-color: #4F46E5;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
          border-left: 1px solid #e0e0e0;
          border-right: 1px solid #e0e0e0;
        }
        .info-box {
          background-color: white;
          border-left: 4px solid #4F46E5;
          padding: 15px;
          margin: 15px 0;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .footer {
          text-align: center;
          padding: 15px;
          font-size: 14px;
          color: #666;
          background-color: #f1f1f1;
          border-radius: 0 0 5px 5px;
        }
        .button {
          display: inline-block;
          background-color: #4F46E5;
          color: white !important;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 15px;
        }
        .highlight {
          font-weight: bold;
          color: #4F46E5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Yêu Cầu Từ Vựng Mới</h1>
        </div>
        <div class="content">
          <p>Xin chào, ITKOTOBA</p>
          <p>Có một yêu cầu thêm từ vựng mới từ người dùng.</p>
          
          <div class="info-box">
            <p><strong>Từ vựng yêu cầu:</strong> <span class="highlight">${word}</span></p>
            <p><strong>Email người dùng:</strong> <span class="highlight">${email}</span></p>
            <p><strong>Thời gian yêu cầu:</strong> ${new Date().toLocaleString('vi-VN')}</p>
            <p><strong>Ý kiến:</strong> <span class="highlight">${comment}</span></p>
          </div>
          
          <p>Vui lòng xem xét thêm từ vựng này vào hệ thống khi có thể.</p>
          
          <p>Trân trọng,<br>Hệ thống quản lý từ vựng</p>
          
          <a href="mailto:${email}" class="button">Trả lời người dùng</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} - Hệ thống học từ vựng</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `Yêu cầu từ vựng mới: ${word}`,
      html: htmlContent,
      replyTo: email,
    };
    
    await transporter.sendMail(mailOptions);
    console.log("Email yêu cầu từ vựng mới đã được gửi thành công!");
  } catch (error) {
    console.error("Lỗi khi gửi email yêu cầu từ vựng mới:", error);
  }
};