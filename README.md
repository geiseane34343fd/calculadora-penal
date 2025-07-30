# Calculadora Penal + Discord

Sistema de calculadora penal integrado com Discord para facilitar o registro de prisões com busca automática de usuários do servidor.

## 🚀 Funcionalidades

### ✅ Funcionalidades Existentes
- Calculadora penal completa com artigos do código penal
- Sistema de atenuantes e agravantes
- Geração automática de embeds para Discord
- Interface responsiva com tema claro/escuro
- Validações e notificações

### 🆕 Novas Funcionalidades
- **Busca de usuários do Discord**: Busque policiais por nome ou apelido
- **Seleção visual**: Interface intuitiva para selecionar policial principal e auxiliares
- **Menção automática**: IDs são automaticamente inseridos no embed
- **Fallback manual**: Opção de inserir IDs manualmente como alternativa

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- Bot Discord configurado
- Webhook do Discord configurado

## 🛠️ Instalação

1. **Clone ou extraia o projeto**
   ```bash
   cd calculadora-penal
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   DISCORD_BOT_TOKEN=seu_token_do_bot
   DISCORD_SERVER_ID=id_do_seu_servidor
   DISCORD_CHANNEL_ID=id_do_canal_destino
   PORT=3000
   ```

4. **Configure o webhook no código**
   
   Edite o arquivo `script.js` na linha 463 e substitua pela URL do seu webhook:
   ```javascript
   const webhookUrl = "https://discord.com/api/webhooks/SEU_WEBHOOK_AQUI";
   ```

## 🚀 Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 📦 Deploy no Render

1. **Conecte seu repositório ao Render**

2. **Configure as variáveis de ambiente no painel do Render:**
   - `DISCORD_BOT_TOKEN`
   - `DISCORD_SERVER_ID` 
   - `DISCORD_CHANNEL_ID`
   - `PORT` (opcional, Render define automaticamente)

3. **Configure o comando de build:**
   ```
   npm install
   ```

4. **Configure o comando de start:**
   ```
   npm start
   ```

## 🎯 Como Usar

### Busca de Usuários
1. Na **Etapa 4 - Boletim de Ocorrência**, use o campo "Buscar Policial"
2. Digite pelo menos 2 caracteres do nome ou apelido
3. Clique no usuário desejado nos resultados
4. Escolha se será "Policial Principal" ou "Policial Auxiliar"
5. Repita para adicionar mais auxiliares

### Opção Manual (Fallback)
- Use os campos "Inserção Manual" caso a busca não funcione
- Insira os IDs do Discord diretamente

### Finalização
- O embed será enviado automaticamente com as menções corretas
- Os usuários selecionados serão mencionados no Discord

## 🔧 Estrutura do Projeto

```
calculadora-penal/
├── api/
│   └── searchUsers.js      # Rotas da API de busca
├── assets/
│   └── images/             # Imagens e ícones
├── bot/                    # (Reservado para futuras funcionalidades)
├── utils/
│   └── discordClient.js    # Cliente Discord
├── index.html              # Interface principal
├── script.js               # Lógica do frontend
├── style.css               # Estilos
├── server.js               # Servidor Express
├── artigos.json           # Base de dados dos artigos
├── package.json           # Dependências
├── .env                   # Variáveis de ambiente
└── README.md              # Este arquivo
```

## 🐛 Solução de Problemas

### Bot não conecta
- Verifique se o `DISCORD_BOT_TOKEN` está correto
- Certifique-se de que o bot tem as permissões necessárias
- Verifique se o bot está no servidor especificado

### Busca não funciona
- Confirme se o `DISCORD_SERVER_ID` está correto
- Verifique se o bot tem permissão para ler membros do servidor
- Use a opção manual como alternativa

### Embed não é enviado
- Verifique se a URL do webhook está correta no `script.js`
- Confirme se o webhook está ativo
- Verifique o console do navegador para erros

## 📝 Notas Importantes

- **Não subir o arquivo `.env`** para repositórios públicos
- O bot precisa estar no servidor para buscar membros
- As permissões do bot devem incluir "Read Message History" e "View Server Members"
- A busca é limitada a 10 resultados por performance

## 🆘 Suporte

Para suporte, entre em contato com **RAMAL SYSTEMS** através do Discord: https://discord.gg/AfhFb6ZNju

---

**Desenvolvido por RAMAL SYSTEMS**

