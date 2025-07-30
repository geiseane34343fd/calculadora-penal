const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initializeDiscordClient } = require('./utils/discordClient');
const searchUsersRouter = require('./api/searchUsers');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, ".")));

// Rotas da API
app.use('/api', searchUsersRouter);

// Rota principal para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota de saúde
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
    });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

// Inicializar servidor
async function startServer() {
    try {
        console.log('Iniciando servidor...');
        
        // Tentar inicializar cliente Discord apenas se o token for válido
        if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_BOT_TOKEN !== 'test_token_123456789') {
            console.log('Conectando ao Discord...');
            await initializeDiscordClient();
            console.log('Cliente Discord inicializado com sucesso!');
        } else {
            console.log('Modo de teste - Discord desabilitado');
        }
        
        // Iniciar servidor HTTP
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Acesse: http://localhost:${PORT}`);
        });
        
    } catch (error) {
        console.error('Erro ao iniciar servidor:', error);
        
        // Em modo de teste, continuar sem Discord
        if (process.env.DISCORD_BOT_TOKEN === 'test_token_123456789') {
            console.log('Continuando em modo de teste sem Discord...');
            app.listen(PORT, '0.0.0.0', () => {
                console.log(`Servidor rodando na porta ${PORT} (modo teste)`);
                console.log(`Acesse: http://localhost:${PORT}`);
            });
        } else {
            process.exit(1);
        }
    }
}

// Tratamento de sinais para encerramento gracioso
process.on('SIGINT', () => {
    console.log('Encerrando servidor...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Encerrando servidor...');
    process.exit(0);
});

// Iniciar servidor
startServer();

