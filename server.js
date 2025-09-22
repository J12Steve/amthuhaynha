const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (HTML, CSS)

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'plament294@gmail.com', // Replace with your Gmail address
        pass: 'tranthuthuy' // Replace with your Gmail App Password
    }
});

// Email sending endpoint
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    // Email options
    const mailOptions = {
        from: email,
        to: 'plament294@gmail.com',
        subject: `Tin nhắn từ ${name} qua Ẩm Thực Vui`,
        text: `Họ và Tên: ${name}\nEmail: ${email}\nTin nhắn: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Tin nhắn đã được gửi thành công!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Không thể gửi tin nhắn. Vui lòng thử lại!' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});