// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// --- Middlewares ---
app.use(cors()); // Permite que o frontend acesse a API
app.use(bodyParser.json());

// --- Conexão com o MongoDB ---
const mongoUri = "mongodb+srv://acaciofariav:ACACIOFARIAVICENTETXOBOY63@cluster0.ju4k6xu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUri)
    .then(() => console.log('✅ Conectado ao MongoDB!'))
    .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// --- Configuração do Nodemailer (Transportador de E-mail) ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'heltonrodriques770@gmail.com', // 👈 SEU E-MAIL DO GMAIL
        pass: 'ldso wpdd hsuk pqgj'    // 👈 SUA SENHA DE APP GERADA
    },
    // Habilitar o suporte a TLS para evitar erros de "self signed certificate" em alguns ambientes
    tls: {
        rejectUnauthorized: false
    }
});


// --- Rota da API para Enviar E-mails ---
app.post('/send-emails', async (req, res) => {
    const { emails, subject, message } = req.body;

    // Validação básica
    if (!emails || !subject || !message) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const emailList = emails.split(/[\n,]/).map(email => email.trim()).filter(email => email);

    if (emailList.length === 0) {
        return res.status(400).json({ error: 'Nenhum e-mail válido fornecido.' });
    }

    const mailOptions = {
        from: '"Meu App de Disparo" <seu-email-aqui@gmail.com>', // 👈 SEU NOME E E-MAIL
        subject: subject,
        html: `<p>${message.replace(/\n/g, '<br>')}</p>` // Converte quebras de linha em <br> para HTML
    };

    try {
        for (const email of emailList) {
            await transporter.sendMail({ ...mailOptions, to: email });
            console.log(`E-mail enviado para: ${email}`);
        }
        res.status(200).json({ success: `E-mails enviados com sucesso para ${emailList.length} destinatários.` });
    } catch (error) {
        console.error('❌ Erro no envio de e-mails:', error);
        res.status(500).json({ error: 'Falha ao enviar os e-mails.' });
    }
});

// --- Iniciar o Servidor ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});