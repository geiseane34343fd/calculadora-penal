const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Criar cliente Discord com as intenções necessárias
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// Variável para controlar se o cliente está pronto
let isReady = false;

// Evento quando o bot está pronto
client.once('ready', () => {
    console.log(`Bot Discord conectado como ${client.user.tag}`);
    isReady = true;
});

// Função para inicializar o cliente
async function initializeDiscordClient() {
    if (!process.env.DISCORD_BOT_TOKEN) {
        throw new Error('DISCORD_BOT_TOKEN não encontrado no arquivo .env');
    }
    
    try {
        await client.login(process.env.DISCORD_BOT_TOKEN);
        
        // Aguardar até o cliente estar pronto
        while (!isReady) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        return client;
    } catch (error) {
        console.error('Erro ao conectar o bot Discord:', error);
        throw error;
    }
}

// Função para buscar membros do servidor
async function searchGuildMembers(query) {
    if (!isReady) {
        throw new Error('Cliente Discord não está pronto');
    }
    
    const serverId = process.env.DISCORD_SERVER_ID;
    if (!serverId) {
        throw new Error('DISCORD_SERVER_ID não encontrado no arquivo .env');
    }
    
    try {
        const guild = client.guilds.cache.get(serverId);
        if (!guild) {
            throw new Error(`Servidor com ID ${serverId} não encontrado`);
        }
        
        // Buscar todos os membros do servidor (cache)
        await guild.members.fetch();
        
        const members = guild.members.cache;
        const searchTerm = query.toLowerCase();
        
        // Filtrar membros que correspondem à busca
        const matchingMembers = members
            .filter(member => {
                const username = member.user.username.toLowerCase();
                const displayName = member.displayName.toLowerCase();
                const nickname = member.nickname ? member.nickname.toLowerCase() : '';
                
                return username.includes(searchTerm) || 
                       displayName.includes(searchTerm) || 
                       nickname.includes(searchTerm);
            })
            .map(member => ({
                id: member.user.id,
                username: member.user.username,
                displayName: member.displayName,
                nickname: member.nickname,
                avatar: member.user.displayAvatarURL({ dynamic: true, size: 64 }),
                roles: member.roles.cache
                    .filter(role => role.name !== '@everyone')
                    .map(role => role.name)
                    .slice(0, 3) // Limitar a 3 cargos principais
            }))
            .slice(0, 10); // Limitar a 10 resultados
        
        return matchingMembers;
    } catch (error) {
        console.error('Erro ao buscar membros:', error);
        throw error;
    }
}

module.exports = {
    client,
    initializeDiscordClient,
    searchGuildMembers
};

