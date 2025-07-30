const express = require('express');
const { searchGuildMembers } = require('../utils/discordClient');

const router = express.Router();

// Rota para buscar usuários do Discord
router.get('/search-users', async (req, res) => {
    try {
        const { query } = req.query;
        
        // Validar se a query foi fornecida
        if (!query || query.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Query deve ter pelo menos 2 caracteres'
            });
        }
        
        // Modo de teste - retornar dados fictícios
        if (process.env.DISCORD_BOT_TOKEN === 'test_token_123456789') {
            const mockUsers = [
                {
                    id: '123456789012345678',
                    username: 'carlos_ramal',
                    displayName: 'Carlos Ramal',
                    nickname: 'Comandante',
                    avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
                    roles: ['Comandante', 'Policial']
                },
                {
                    id: '987654321098765432',
                    username: 'joao_silva',
                    displayName: 'João Silva',
                    nickname: 'Recruta João',
                    avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
                    roles: ['Recruta']
                },
                {
                    id: '456789123456789123',
                    username: 'maria_santos',
                    displayName: 'Maria Santos',
                    nickname: 'Sargento Maria',
                    avatar: 'https://cdn.discordapp.com/embed/avatars/2.png',
                    roles: ['Sargento', 'Instrutor']
                }
            ];
            
            const searchTerm = query.toLowerCase();
            const filteredUsers = mockUsers.filter(user => 
                user.username.toLowerCase().includes(searchTerm) ||
                user.displayName.toLowerCase().includes(searchTerm) ||
                (user.nickname && user.nickname.toLowerCase().includes(searchTerm))
            );
            
            return res.json({
                success: true,
                data: filteredUsers,
                count: filteredUsers.length
            });
        }
        
        // Buscar membros no Discord (modo produção)
        const members = await searchGuildMembers(query.trim());
        
        res.json({
            success: true,
            data: members,
            count: members.length
        });
        
    } catch (error) {
        console.error('Erro na busca de usuários:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Rota para obter informações de um usuário específico
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'ID do usuário é obrigatório'
            });
        }
        
        // Buscar usuário específico
        const members = await searchGuildMembers('');
        const user = members.find(member => member.id === userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        res.json({
            success: true,
            data: user
        });
        
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;

