// server.js (versão modificada e mais robusta)

const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// --- Middlewares ---
app.use(cors());
app.use(bodyParser.json());

// --- Conexão com o MongoDB ---
const mongoUri = "mongodb+srv://acaciofariav:ACACIOFARIAVICENTETXOBOY63@cluster0.ju4k6xu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoUri)
    .then(() => console.log('✅ Conectado ao MongoDB!'))
    .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// --- Configuração do Nodemailer ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'seu-email-aqui@gmail.com', // 👈 SEU E-MAIL DO GMAIL
        pass: 'sua-senha-de-app-aqui'       // 👈 SUA SENHA DE APP GERADA
    },
    tls: {
        rejectUnauthorized: false
    }
});

// --- NOVA ROTA: Enviar um único e-mail ---
app.post('/send-single-email', async (req, res) => {
    const { email, subject, message, fromName } = req.body;

    if (!email || !subject || !message) {
        return res.status(400).json({ error: 'Dados insuficientes para o envio.' });
    }

    const mailOptions = {
        from: `"${fromName || 'Meu App de Disparo'}" <seu-email-aqui@gmail.com>`, // Permite nome do remetente customizado
        to: email,
        subject: subject,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</div>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail enviado para: ${email}`);
        res.status(200).json({ success: `E-mail enviado com sucesso para ${email}` });
    } catch (error) {
        console.error(`Falha ao enviar para ${email}:`, error);
        res.status(500).json({ error: `Falha ao enviar para ${email}`, details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor robusto rodando na porta ${PORT}`);
});
