const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// --- Configuração Inicial ---
const app = express();
const PORT = 3000;

// --- Middlewares ---
// Habilita a comunicação entre o frontend e o backend
app.use(cors()); 
// Habilita o parsing de dados JSON no corpo das requisições
app.use(bodyParser.json());

// --- Conexão com o Banco de Dados MongoDB ---
// A URI de conexão que você forneceu
const mongoUri = "mongodb+srv://acaciofariav:ACACIOFARIAVICENTETXOBOY63@cluster0.ju4k6xu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUri)
    .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
    .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// --- Configuração do Transportador de E-mail (Nodemailer) ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // IMPORTANTE: Substitua com suas credenciais reais
        user: 'heltonrodriques770@gmail.com', // 👈 Coloque seu e-mail do Gmail aqui
        pass: 'ldso wpdd hsuk pqgj'    // 👈 Coloque sua Senha de App de 16 dígitos aqui
    },
    tls: {
        // Opção para evitar erros em alguns ambientes de rede
        rejectUnauthorized: false
    }
});

// --- Rota da API para Enviar um Único E-mail Estilizado ---
app.post('/send-single-email', async (req, res) => {
    // Extrai os dados enviados pelo frontend
    const { email, subject, message, fromName } = req.body;

    // 'message' agora contém o HTML completo vindo do editor TinyMCE

    // Validação dos dados recebidos
    if (!email || !subject || !message) {
        return res.status(400).json({ error: 'Dados insuficientes para o envio do e-mail.' });
    }

    // Configura as opções do e-mail
    const mailOptions = {
        from: `"${fromName || 'Meu App de Disparo'}" <seu-email-aqui@gmail.com>`, // Permite um nome de remetente customizado
        to: email, // O destinatário único
        subject: subject, // O assunto do e-mail
        html: message // Usa o conteúdo HTML diretamente do editor, preservando toda a estilização
    };

    // Tenta enviar o e-mail
    try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail enviado com sucesso para: ${email}`);
        // Retorna uma resposta de sucesso para o frontend
        res.status(200).json({ success: `E-mail enviado com sucesso para ${email}` });
    } catch (error) {
        console.error(`Falha ao enviar e-mail para ${email}:`, error);
        // Retorna uma resposta de erro para o frontend
        res.status(500).json({ error: `Falha ao enviar e-mail para ${email}`, details: error.message });
    }
});

// --- Inicia o Servidor ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});
