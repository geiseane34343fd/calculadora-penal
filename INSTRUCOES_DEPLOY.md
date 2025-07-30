# 🚀 INSTRUÇÕES DE DEPLOY - CALCULADORA PENAL + DISCORD

## ✅ IMPLEMENTAÇÕES REALIZADAS

### 🆕 Novas Funcionalidades Adicionadas:
1. **Busca de Usuários do Discord**: Campo de busca que permite encontrar membros do servidor por nome ou apelido
2. **Seleção Visual**: Interface intuitiva para escolher policial principal e auxiliares
3. **Menção Automática**: IDs são automaticamente inseridos no embed do Discord
4. **Fallback Manual**: Campos manuais mantidos como alternativa
5. **Notificações**: Feedback visual para o usuário sobre as ações realizadas

### 🔧 Arquivos Modificados/Criados:
- `server.js` - Servidor Express principal
- `package.json` - Dependências do projeto
- `api/searchUsers.js` - API de busca de usuários
- `utils/discordClient.js` - Cliente Discord
- `index.html` - Interface atualizada com componente de busca
- `script.js` - Lógica JavaScript atualizada
- `style.css` - Estilos para os novos componentes
- `.env` - Variáveis de ambiente
- `.env.example` - Exemplo de configuração

## 🛠️ CONFIGURAÇÃO INICIAL

### 1. Dependências Instaladas:
```json
{
  "express": "^4.18.2",
  "discord.js": "^14.14.1",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5"
}
```

### 2. Estrutura de Arquivos:
```
calculadora-penal/
├── api/
│   └── searchUsers.js      # Rotas da API
├── assets/
│   └── images/             # Imagens existentes
├── utils/
│   └── discordClient.js    # Cliente Discord
├── index.html              # Interface principal
├── script.js               # Lógica frontend
├── style.css               # Estilos
├── server.js               # Servidor
├── artigos.json           # Base de artigos
├── package.json           # Dependências
├── .env                   # Configurações (NÃO COMMITAR)
├── .env.example           # Exemplo de configuração
└── README.md              # Documentação
```

## 🔑 CONFIGURAÇÃO DO DISCORD BOT

### 1. Criar Bot no Discord:
1. Acesse https://discord.com/developers/applications
2. Clique em "New Application"
3. Dê um nome ao seu bot
4. Vá para "Bot" no menu lateral
5. Clique em "Add Bot"
6. Copie o token do bot

### 2. Configurar Permissões:
O bot precisa das seguintes permissões:
- `View Channels`
- `Read Message History`
- `View Server Members`

### 3. Adicionar Bot ao Servidor:
1. Vá para "OAuth2" > "URL Generator"
2. Selecione "bot" em Scopes
3. Selecione as permissões necessárias
4. Use a URL gerada para adicionar o bot ao servidor

## ⚙️ CONFIGURAÇÃO DO PROJETO

### 1. Configurar Variáveis de Ambiente:
Renomeie `.env.example` para `.env` e configure:

```env
# Token do bot Discord
DISCORD_BOT_TOKEN=seu_token_aqui

# ID do servidor Discord
DISCORD_SERVER_ID=123456789012345678

# ID do canal onde serão enviados os embeds
DISCORD_CHANNEL_ID=123456789012345678

# Porta do servidor (opcional)
PORT=3000
```

### 2. Configurar Webhook:
No arquivo `script.js`, linha 463, substitua pela URL do seu webhook:
```javascript
const webhookUrl = "https://discord.com/api/webhooks/SEU_WEBHOOK_AQUI";
```

## 🚀 DEPLOY NO RENDER

### 1. Preparar Repositório:
```bash
git init
git add .
git commit -m "Calculadora Penal com busca Discord"
git remote add origin SEU_REPOSITORIO
git push -u origin main
```

### 2. Configurar no Render:
1. Acesse https://render.com
2. Conecte seu repositório GitHub
3. Crie um novo "Web Service"
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

### 3. Variáveis de Ambiente no Render:
Adicione no painel do Render:
- `DISCORD_BOT_TOKEN`
- `DISCORD_SERVER_ID`
- `DISCORD_CHANNEL_ID`

### 4. Deploy:
O Render fará o deploy automaticamente após a configuração.

## 🧪 TESTE LOCAL

### 1. Instalar Dependências:
```bash
npm install
```

### 2. Configurar .env:
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

### 3. Executar:
```bash
npm start
```

### 4. Acessar:
http://localhost:3000

## 🎯 COMO USAR A NOVA FUNCIONALIDADE

### 1. Busca de Usuários:
- Na Etapa 4, use o campo "Buscar Policial"
- Digite pelo menos 2 caracteres
- Clique no usuário desejado nos resultados

### 2. Seleção:
- Escolha "Policial Principal" ou "Policial Auxiliar"
- Para principal: apenas 1 seleção permitida
- Para auxiliares: múltiplas seleções permitidas

### 3. Remoção:
- Clique no botão "×" para remover seleções

### 4. Fallback Manual:
- Use os campos "Inserção Manual" se a busca não funcionar
- Insira IDs do Discord diretamente

## 🔍 SOLUÇÃO DE PROBLEMAS

### Bot não conecta:
- Verifique se o token está correto
- Confirme se o bot está no servidor
- Verifique as permissões do bot

### Busca não funciona:
- Confirme o DISCORD_SERVER_ID
- Verifique se o bot tem permissão "View Server Members"
- Use a opção manual como alternativa

### Embed não é enviado:
- Verifique a URL do webhook no script.js
- Confirme se o webhook está ativo
- Verifique o console do navegador

## 📝 NOTAS IMPORTANTES

- **NUNCA** commite o arquivo `.env` para repositórios públicos
- O bot precisa estar no servidor para buscar membros
- A busca é limitada a 10 resultados por performance
- Em modo de teste (token inválido), dados fictícios são retornados
- A funcionalidade original da calculadora foi preservada integralmente

## 🆘 SUPORTE

Para suporte técnico, entre em contato através do Discord: https://discord.gg/AfhFb6ZNju

---

**✅ IMPLEMENTAÇÃO CONCLUÍDA COM SUCESSO**
**Desenvolvido por RAMAL SYSTEMS**

