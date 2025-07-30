let artigos = [];
let artigosSelecionados = [];
let currentStep = 0; // Para controlar a etapa atual

// --- Theme Toggle --- 
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  // Opcional: Salvar preferência no localStorage
  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// --- Notification System --- 
const notificationContainer = document.getElementById("notification-container");

function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    
    let iconClass = "fas fa-check-circle"; // Default success
    if (type === "error") {
        iconClass = "fas fa-times-circle";
    } else if (type === "info") {
        iconClass = "fas fa-info-circle";
    }

    notification.innerHTML = `
        <i class="${iconClass}"></i>
        <span>${message}</span>
    `;
    notificationContainer.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.classList.add("show");
    }, 10); // Small delay to allow CSS transition

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        notification.classList.remove("show");
        // Remove from DOM after transition ends
        notification.addEventListener("transitionend", () => {
            notification.remove();
        });
    }, 5000);
}


// Aplicar tema salvo ao carregar
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark"); 
  }
  // Inicia na tela inicial
  document.getElementById("tela-inicial").style.display = "flex"; 
  document.getElementById("main-content").style.display = "none";

  // Popular checkboxes estáticos (Atenuantes e Direitos)
  populateStaticCheckboxes();
});

// --- Funções da Calculadora --- 

async function carregarArtigos() {
  try {
    const resposta = await fetch("artigos.json");
    if (!resposta.ok) {
        throw new Error(`HTTP error! status: ${resposta.status}`);
    }
    artigos = await resposta.json();
    mostrarArtigos(artigos);
    atualizarTabela(); 
  } catch (error) {
      console.error("Erro ao carregar artigos.json:", error);
      showNotification("Erro ao carregar lista de artigos.", "error");
      const container = document.getElementById("lista-artigos");
      container.innerHTML = "<p style=\"color: var(--danger-color);\">Erro ao carregar artigos. Verifique o console.</p>";
  }
}

function iniciar() {
  document.getElementById("tela-inicial").style.display = "none";
  document.getElementById("main-content").style.display = "flex"; 
  document.getElementById("etapa1").style.display = "block"; 
  currentStep = 1;
  updateProgressBar();
}

function voltarTelaInicial() {
    document.getElementById("main-content").style.display = "none";
    document.getElementById("tela-inicial").style.display = "flex";
    // location.reload(); // Recarrega a página para resetar tudo
}

function updateProgressBar() {
  const steps = document.querySelectorAll(".progress-step");
  const lines = document.querySelectorAll(".progress-line");

  steps.forEach((step, index) => {
    const stepNumber = parseInt(step.dataset.step);
    step.classList.remove("active", "completed");
    if (stepNumber < currentStep) {
      step.classList.add("completed");
    } else if (stepNumber === currentStep) {
      step.classList.add("active");
    }
  });

  lines.forEach((line, index) => {
      line.classList.remove("active");
      if (index < currentStep - 1) {
          line.classList.add("active");
      }
  });
}

function proximaEtapa(numero) {
  // Esconde todas as etapas
  for (let i = 1; i <= 5; i++) {
    const etapa = document.getElementById("etapa" + i);
    if (etapa) etapa.style.display = "none";
  }

  // Mostra a etapa desejada
  const proxima = document.getElementById("etapa" + numero);
  if (proxima) {
    proxima.style.display = "block";
    currentStep = numero;
    updateProgressBar();

    // Ações específicas da etapa
    if (numero === 2 && artigos.length === 0) { 
        carregarArtigos();
    }
    if (numero === 5) {
        gerarResumo();
    }

    // Scroll to top of step card on navigation
    proxima.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } else {
      console.error("Etapa " + numero + " não encontrada.");
      showNotification("Erro interno: Etapa não encontrada.", "error");
  }
}

// Função para popular checkboxes estáticos (Atenuantes, Direitos)
function populateStaticCheckboxes() {
    const atenuantesContainer = document.querySelector("#etapa2 .atenuantes");
    const direitosContainer = document.querySelector("#etapa3 .check-group");

    atenuantesContainer.innerHTML = `
        <label class="custom-checkbox">
            <input type="checkbox" class="atenuante" value="advogado" onchange="atualizarTotais()">
            <span class="checkbox-visual"></span>
            <span class="checkbox-label">Advogado Constituído (30%)</span>
        </label>
        <label class="custom-checkbox">
            <input type="checkbox" class="atenuante" value="primario" onchange="atualizarTotais()">
            <span class="checkbox-visual"></span>
            <span class="checkbox-label">Réu Primário (20%)</span>
        </label>
        <label class="custom-checkbox">
            <input type="checkbox" class="atenuante" value="confesso" onchange="atualizarTotais()">
            <span class="checkbox-visual"></span>
            <span class="checkbox-label">Réu Confesso (20%)</span>
        </label>
    `;

    const agravantesContainer = document.querySelector("#etapa2 .agravantes");
    agravantesContainer.innerHTML = `
        <label class="custom-checkbox">
            <input type="checkbox" class="agravante" value="reincidente" onchange="atualizarTotais()">
            <span class="checkbox-visual"></span>
            <span class="checkbox-label">Réu Reincidente (20%)</span>
        </label>
    `;

    direitosContainer.innerHTML = `
        <label class="custom-checkbox">
            <input type="checkbox" id="porte-arma">
            <span class="checkbox-visual"></span>
            <span class="checkbox-label">Possui Porte de Arma?</span>
        </label>
        <label class="custom-checkbox">
            <input type="checkbox" id="prisao-mandado">
            <span class="checkbox-visual"></span>
            <span class="checkbox-label">Prisão por Mandado?</span>
        </label>
    `;
}


function mostrarArtigos(lista) {
  const container = document.getElementById("lista-artigos");
  container.innerHTML = "";

  if (!lista || lista.length === 0) {
      container.innerHTML = "<p>Nenhum artigo encontrado.</p>";
      return;
  }

  lista.forEach(art => {
    const isChecked = artigosSelecionados.some(a => a.id === art.id);
    const div = document.createElement("div");
    // Ajustado para colocar checkbox antes
    div.innerHTML = `
        <label class="custom-checkbox">
            <input type="checkbox" onchange="toggleArtigo(${art.id})" ${isChecked ? "checked" : ""}>
            <span class="checkbox-visual"></span>
            <span class="checkbox-label">Art. ${art.id} - ${art.descricao}</span>
        </label>`;
    container.appendChild(div);
  });
}

function filtrarArtigos() {
  const termo = document.getElementById("busca-artigo").value.toLowerCase().trim();
  const filtrados = artigos.filter(art =>
    art.descricao.toLowerCase().includes(termo) ||
    art.id.toString().includes(termo)
  );
  mostrarArtigos(filtrados);
}

function toggleArtigo(id) {
  const artigo = artigos.find(a => a.id === id);
  if (!artigo) return;

  const index = artigosSelecionados.findIndex(a => a.id === id);
  if (index !== -1) {
    artigosSelecionados.splice(index, 1);
  } else {
    artigosSelecionados.push(artigo);
  }

  atualizarTabela();
  atualizarTotais();
}

function removerArtigo(id) {
  artigosSelecionados = artigosSelecionados.filter(a => a.id !== id);
  atualizarTabela();
  atualizarTotais();
  filtrarArtigos(); 
}

function atualizarTabela() {
  const tbody = document.getElementById("tabela-artigos");
  tbody.innerHTML = "";

  if (artigosSelecionados.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 1rem;">Nenhum artigo selecionado.</td></tr>';
      return;
  }

  artigosSelecionados.forEach(art => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${art.id}</td>
      <td>Art. ${art.id}</td>
      <td>${art.descricao}</td>
      <td>${art.pena}</td>
      <td>R$ ${art.multa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
      <td>${art.fianca !== null ? `R$ ${art.fianca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "-"}</td>
      <td><button class="btn btn-danger" onclick="removerArtigo(${art.id})"><i class="fas fa-trash-alt"></i></button></td>
    `;
    tbody.appendChild(row);
  });
}

function atualizarTotais() {
  let totalPena = 0;
  let totalMulta = 0;
  let totalFianca = 0;

  artigosSelecionados.forEach(art => {
    totalPena += art.pena;
    totalMulta += art.multa;
    if (art.fianca !== null) totalFianca += art.fianca;
  });

  // Atenuantes
  let redutor = 0;
  document.querySelectorAll(".atenuante:checked").forEach(cb => {
    if (cb.value === "advogado") redutor += 0.30;
    if (cb.value === "primario") redutor += 0.20;
    if (cb.value === "confesso") redutor += 0.20;
  });

  redutor = Math.min(redutor, 0.7); 
  totalPena = Math.max(0, Math.round(totalPena * (1 - redutor))); 

  // Agravantes
  let acrescimo = 0;
  document.querySelectorAll(".agravante:checked").forEach(cb => {
    if (cb.value === "reincidente") acrescimo += 0.20;
  });

  totalPena = Math.round(totalPena * (1 + acrescimo));
  totalMulta = totalMulta * (1 + acrescimo);
  totalFianca = totalFianca * (1 + acrescimo);

  document.getElementById("total-pena").textContent = totalPena;
  document.getElementById("total-multa").textContent = `R$ ${totalMulta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  document.getElementById("total-fianca").textContent = `R$ ${totalFianca.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

function gerarResumo() {
  const nome = document.getElementById("nome").value || "Não informado";
  const id = document.getElementById("id").value || "Não informado";
  const telefone = document.getElementById("telefone").value || "Não informado";
  const foto = document.getElementById("foto").value; 

  const advogado = document.getElementById("nome-advogado").value || "Não informado";
  const idAdvogado = document.getElementById("id-advogado").value || "Não informado";
  const porte = document.getElementById("porte-arma").checked ? "Sim" : "Não";
  const mandado = document.getElementById("prisao-mandado").checked ? "Sim" : "Não";

  // Obter policiais selecionados ou campos manuais
  const selectedIds = getSelectedOfficersIds();
  const manualIds = getManualOfficersIds();
  
  // Usar selecionados se disponível, senão usar manual
  const mainOfficerId = selectedIds.mainOfficer || manualIds.mainOfficer;
  const auxiliaryIds = selectedIds.auxiliaryOfficers.length > 0 ? selectedIds.auxiliaryOfficers : manualIds.auxiliaryOfficers;
  
  // Gerar texto para exibição
  let policialPrincipalTexto = "Não informado";
  if (selectedMainOfficer) {
    policialPrincipalTexto = `${selectedMainOfficer.displayName} (<@${selectedMainOfficer.id}>)`;
  } else if (mainOfficerId) {
    policialPrincipalTexto = `<@${mainOfficerId}>`;
  }
  
  let auxiliaresTexto = "Nenhum";
  if (selectedAuxiliaryOfficers.length > 0) {
    auxiliaresTexto = selectedAuxiliaryOfficers
      .map(officer => `${officer.displayName} (<@${officer.id}>)`)
      .join(', ');
  } else if (auxiliaryIds.length > 0) {
    auxiliaresTexto = auxiliaryIds.map(id => `<@${id}>`).join(', ');
  }

  const boletim = document.getElementById("boletim").value || "Não informado";
  const itens = document.getElementById("itens").value || "Nenhum";

  let totalPena = document.getElementById("total-pena").textContent;
  let totalMulta = document.getElementById("total-multa").textContent;
  let totalFianca = document.getElementById("total-fianca").textContent;

  const artigosTexto = artigosSelecionados.length > 0
                       ? artigosSelecionados.map(a => `Art. ${a.id} - ${a.descricao}`).join("<br>")
                       : "Nenhum artigo selecionado";

  const resumo = `
    <p><strong>Preso:</strong> ${nome}</p>
    <p><strong>ID:</strong> ${id}</p>
    <p><strong>Telefone:</strong> ${telefone}</p>
    <hr>
    <p><strong>Porte de Arma:</strong> ${porte}</p>
    <p><strong>Mandado:</strong> ${mandado}</p>
    <p><strong>Advogado:</strong> ${advogado}</p>
    <p><strong>ID Advogado:</strong> ${idAdvogado}</p>
    <hr>
    <p><strong>Artigos Selecionados:</strong><br>${artigosTexto}</p>
    <hr>
    <p><strong>Pena Total:</strong> ${totalPena} meses</p>
    <p><strong>Multa Total:</strong> ${totalMulta}</p>
    <p><strong>Fiança Total:</strong> ${totalFianca}</p>
    <hr>
    <p><strong>Policial Principal:</strong> ${policialPrincipalTexto}</p>
    <p><strong>Policiais Auxiliares:</strong> ${auxiliaresTexto}</p>
    <hr>
    <p><strong>Relatório da Ocorrência:</strong><br>${boletim.replace(/\n/g, '<br>')}</p>
    <hr>
    <p><strong>Itens Apreendidos:</strong><br>${itens.replace(/\n/g, '<br>')}</p>
    ${foto ? `<hr><p><strong>Foto do Detento:</strong><br><img src="${foto}" alt="Foto do detento" style="max-width: 100%; border-radius: 6px;"></p>` : ''}
  `;

  document.getElementById("resumo-container").innerHTML = resumo;
}

function finalizarPrisao() {
  const nome = document.getElementById("nome").value || "Não informado";
  const id = document.getElementById("id").value || "Não informado";
  const telefone = document.getElementById("telefone").value || "Não informado";
  const foto = document.getElementById("foto").value;

  const advogado = document.getElementById("nome-advogado").value || "Não informado";
  const idAdvogado = document.getElementById("id-advogado").value || "Não informado";
  const porte = document.getElementById("porte-arma").checked ? "Sim" : "Não";
  const mandado = document.getElementById("prisao-mandado").checked ? "Sim" : "Não";

  // Obter policiais selecionados ou campos manuais
  const selectedIds = getSelectedOfficersIds();
  const manualIds = getManualOfficersIds();
  
  // Usar selecionados se disponível, senão usar manual
  const mainOfficerId = selectedIds.mainOfficer || manualIds.mainOfficer;
  const auxiliaryIds = selectedIds.auxiliaryOfficers.length > 0 ? selectedIds.auxiliaryOfficers : manualIds.auxiliaryOfficers;
  
  // Formatar auxiliares para o Discord
  const auxiliaresFormatado = auxiliaryIds.length > 0 
    ? auxiliaryIds.map(id => `<@${id}>`).join(', ')
    : "Nenhum";

  const boletim = document.getElementById("boletim").value || "Não informado";
  const itens = document.getElementById("itens").value || "Nenhum";

  let totalPena = document.getElementById("total-pena").textContent;
  let totalMulta = document.getElementById("total-multa").textContent.replace("R$ ", "").replace(".", "").replace(",", ".");
  let totalFianca = document.getElementById("total-fianca").textContent.replace("R$ ", "").replace(".", "").replace(",", ".");

  const artigosFormatadosDiscord = artigosSelecionados.length > 0
                                   ? artigosSelecionados.map(a => `> Art. ${a.id} - ${a.descricao}`).join("\n")
                                   : "> Nenhum artigo selecionado";

  // Validação básica
  if (!mainOfficerId) {
      showNotification("Informe o Policial Principal (busca ou ID manual).", "error");
      proximaEtapa(4);
      // Focar no campo apropriado
      if (!selectedMainOfficer) {
        document.getElementById("id-policial-manual")?.focus();
      }
      return;
  }
  if (artigosSelecionados.length === 0) {
      showNotification("Nenhum artigo selecionado.", "error");
      proximaEtapa(2);
      return;
  }

  // --- EMBED ORIGINAL RESTAURADO --- 
  const embed = {
    embeds: [
      {
        title: "REGISTRO DE PRISÃO",
        description: `Detenção e Condições Legais\n\n**1. Dados do Detento**\n─────────────────────────\n👤 **Nome:** ${nome}\n🪪 **ID:** ${id}\n☎️ **Telefone:** ${telefone}\n🔫 **Porte de Arma:** ${porte}\n📜 **Mandado:** ${mandado}\n\n**2. Infração**\n─────────────────────────\n⚖️ **Artigos:**\n${artigosFormatadosDiscord}\n\n**3. Registro de Crime e Apreensão**\n─────────────────────────\n📋 **Boletim de Ocorrência:**\n${boletim}\n\n🎒 **Itens Apreendidos:**\n${itens}\n\n**4. Detalhes Jurídicos e Penais**\n─────────────────────────\n💼 **Advogado:** ${advogado}\n🪪 **ID:** ${idAdvogado}\n\n🔗 **Pena:** ${totalPena} meses\n💵 **Multa:** R$ ${parseFloat(totalMulta).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n💰 **Fiança:** R$ ${parseFloat(totalFianca).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n**5. Responsáveis:**\n─────────────────────────\n👮🏻‍♂️ **Titular:** <@${mainOfficerId}>\n👮🏻‍♂️ **Auxiliares:** ${auxiliaresFormatado}`,
        color: 4429039, // Cor (ou ajuste se necessário)
        image: {
          url: foto || null // Mantém a lógica da foto
        },
        footer: {
          text: `Calculadora Penal • RAMAL SYSTEMS • ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`,
          icon_url: "https://media.discordapp.net/attachments/1399389992790528130/1399390197074100398/LOGO-1.png?ex=6888d32e&is=688781ae&hm=425992a4222f97608e4313ef841233c7559a823746cf4ca03eca17e76efe3bd0&=&format=webp&quality=lossless&width=928&height=928"
        }
      }
    ]
  };
  // --- FIM DO EMBED ORIGINAL --- 

  // Substitua pela URL real do webhook!
  const webhookUrl = "https://discord.com/api/webhooks/1388309962144612372/FHSQqc2TPlrCsnD1CLRnD7wHHtH-szlFTxvAUKYBDW0P_xkzP8bw4v3FK1qpKARCO59X"; // URL de exemplo

  const finalizeButton = document.querySelector('#etapa5 .btn-success');
  const originalButtonText = finalizeButton.innerHTML;
  finalizeButton.disabled = true;
  finalizeButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(embed)
  })
  .then(res => {
    if (res.ok) {
      showNotification("Prisão registrada com sucesso no Discord!", "success");
      document.getElementById('nova-prisao-container').style.display = 'flex'; // Usar flex para centralizar
      finalizeButton.style.display = 'none'; 
      document.querySelector('#etapa5 .btn-secondary').style.display = 'none'; 
    } else {
      showNotification(`Erro ${res.status} ao enviar para o Discord.`, "error");
      console.error('Erro Discord:', res.status, res.statusText);
      res.json().then(errData => console.error('Detalhes do erro:', errData)).catch(() => {}); // Evita erro se não houver JSON
      finalizeButton.disabled = false;
      finalizeButton.innerHTML = originalButtonText;
    }
  })
  .catch(err => {
    console.error('Falha na conexão:', err);
    showNotification("Falha na conexão com o Discord.", "error");
    finalizeButton.disabled = false;
    finalizeButton.innerHTML = originalButtonText;
  });
}



// ==========================================
// FUNCIONALIDADE DE BUSCA DE USUÁRIOS DISCORD
// ==========================================

// Variáveis globais para armazenar seleções
let selectedMainOfficer = null;
let selectedAuxiliaryOfficers = [];
let searchTimeout = null;

// Inicializar eventos de busca quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  initializeUserSearch();
});

function initializeUserSearch() {
  const searchInput = document.getElementById('user-search');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput || !searchResults) return;
  
  // Evento de input com debounce
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    // Limpar timeout anterior
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Se query muito pequena, esconder resultados
    if (query.length < 2) {
      hideSearchResults();
      return;
    }
    
    // Debounce de 300ms
    searchTimeout = setTimeout(() => {
      searchUsers(query);
    }, 300);
  });
  
  // Esconder resultados quando clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-search-wrapper')) {
      hideSearchResults();
    }
  });
}

async function searchUsers(query) {
  const searchResults = document.getElementById('search-results');
  
  try {
    // Mostrar loading
    showSearchLoading();
    
    // Fazer requisição para a API
    const response = await fetch(`/api/search-users?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erro na busca');
    }
    
    // Mostrar resultados
    displaySearchResults(data.data || []);
    
  } catch (error) {
    console.error('Erro na busca de usuários:', error);
    showSearchError(error.message);
  }
}

function showSearchLoading() {
  const searchResults = document.getElementById('search-results');
  searchResults.innerHTML = `
    <div class="search-loading">
      <i class="fas fa-spinner fa-spin"></i>
      <span>Buscando usuários...</span>
    </div>
  `;
  searchResults.style.display = 'block';
}

function showSearchError(message) {
  const searchResults = document.getElementById('search-results');
  searchResults.innerHTML = `
    <div class="search-error">
      <i class="fas fa-exclamation-triangle"></i>
      <span>${message}</span>
    </div>
  `;
  searchResults.style.display = 'block';
}

function displaySearchResults(users) {
  const searchResults = document.getElementById('search-results');
  
  if (users.length === 0) {
    searchResults.innerHTML = `
      <div class="search-error">
        <i class="fas fa-user-slash"></i>
        <span>Nenhum usuário encontrado</span>
      </div>
    `;
    searchResults.style.display = 'block';
    return;
  }
  
  const resultsHTML = users.map(user => `
    <div class="search-result-item" onclick="selectUserFromSearch('${user.id}', '${user.username}', '${user.displayName}', '${user.avatar}', '${JSON.stringify(user.roles).replace(/"/g, '&quot;')}')">
      <img src="${user.avatar}" alt="${user.displayName}" class="search-result-avatar" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzYzNzAiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeD0iOCIgeT0iOCI+CjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K'">
      <div class="search-result-info">
        <div class="search-result-name">${user.displayName}</div>
        <div class="search-result-roles">
          ${user.roles && user.roles.length > 0 ? 
            user.roles.map(role => `<span class="search-result-role">${role}</span>`).join('') : 
            '<span style="font-style: italic;">Sem cargos</span>'
          }
        </div>
      </div>
    </div>
  `).join('');
  
  searchResults.innerHTML = resultsHTML;
  searchResults.style.display = 'block';
}

function selectUserFromSearch(userId, username, displayName, avatar, rolesJson) {
  // Parse dos cargos
  let roles = [];
  try {
    roles = JSON.parse(rolesJson.replace(/&quot;/g, '"'));
  } catch (e) {
    roles = [];
  }
  
  const user = {
    id: userId,
    username: username,
    displayName: displayName,
    avatar: avatar,
    roles: roles
  };
  
  // Mostrar opções de seleção
  showUserSelectionOptions(user);
}

function showUserSelectionOptions(user) {
  // Criar modal ou dropdown para escolher entre Principal ou Auxiliar
  const modal = document.createElement('div');
  modal.className = 'user-selection-modal';
  modal.innerHTML = `
    <div class="user-selection-overlay" onclick="closeUserSelectionModal()"></div>
    <div class="user-selection-content">
      <h4>Selecionar como:</h4>
      <div class="user-selection-preview">
        <img src="${user.avatar}" alt="${user.displayName}" class="selection-preview-avatar">
        <div class="selection-preview-info">
          <div class="selection-preview-name">${user.displayName}</div>
          <div class="selection-preview-roles">
            ${user.roles && user.roles.length > 0 ? 
              user.roles.map(role => `<span class="search-result-role">${role}</span>`).join('') : 
              '<span style="font-style: italic;">Sem cargos</span>'
            }
          </div>
        </div>
      </div>
      <div class="user-selection-buttons">
        <button class="btn btn-primary" onclick="selectAsMainOfficer('${user.id}', '${user.username}', '${user.displayName}', '${user.avatar}', '${JSON.stringify(user.roles).replace(/"/g, '&quot;')}')">
          <i class="fas fa-star"></i> Policial Principal
        </button>
        <button class="btn btn-secondary" onclick="selectAsAuxiliaryOfficer('${user.id}', '${user.username}', '${user.displayName}', '${user.avatar}', '${JSON.stringify(user.roles).replace(/"/g, '&quot;')}')">
          <i class="fas fa-user-plus"></i> Policial Auxiliar
        </button>
        <button class="btn btn-danger" onclick="closeUserSelectionModal()">
          <i class="fas fa-times"></i> Cancelar
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Esconder resultados de busca
  hideSearchResults();
}

function closeUserSelectionModal() {
  const modal = document.querySelector('.user-selection-modal');
  if (modal) {
    modal.remove();
  }
}

function selectAsMainOfficer(userId, username, displayName, avatar, rolesJson) {
  let roles = [];
  try {
    roles = JSON.parse(rolesJson.replace(/&quot;/g, '"'));
  } catch (e) {
    roles = [];
  }
  
  selectedMainOfficer = {
    id: userId,
    username: username,
    displayName: displayName,
    avatar: avatar,
    roles: roles
  };
  
  updateMainOfficerDisplay();
  closeUserSelectionModal();
  clearSearchInput();
  showNotification(`${displayName} selecionado como Policial Principal`, "success");
}

function selectAsAuxiliaryOfficer(userId, username, displayName, avatar, rolesJson) {
  let roles = [];
  try {
    roles = JSON.parse(rolesJson.replace(/&quot;/g, '"'));
  } catch (e) {
    roles = [];
  }
  
  // Verificar se já não está na lista
  if (selectedAuxiliaryOfficers.find(officer => officer.id === userId)) {
    showNotification(`${displayName} já está na lista de auxiliares`, "error");
    closeUserSelectionModal();
    return;
  }
  
  // Verificar se não é o mesmo do principal
  if (selectedMainOfficer && selectedMainOfficer.id === userId) {
    showNotification(`${displayName} já é o Policial Principal`, "error");
    closeUserSelectionModal();
    return;
  }
  
  selectedAuxiliaryOfficers.push({
    id: userId,
    username: username,
    displayName: displayName,
    avatar: avatar,
    roles: roles
  });
  
  updateAuxiliaryOfficersDisplay();
  closeUserSelectionModal();
  clearSearchInput();
  showNotification(`${displayName} adicionado como Policial Auxiliar`, "success");
}

function updateMainOfficerDisplay() {
  const container = document.getElementById('selected-main-officer');
  
  if (selectedMainOfficer) {
    container.className = 'selected-officer has-selection';
    container.innerHTML = `
      <div class="selected-officer-item">
        <img src="${selectedMainOfficer.avatar}" alt="${selectedMainOfficer.displayName}" class="selected-officer-avatar" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iMTgiIGZpbGw9IiM2MzYzNzAiLz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeD0iOCIgeT0iOCI+CjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K'">
        <div class="selected-officer-info">
          <div class="selected-officer-name">${selectedMainOfficer.displayName}</div>
          <div class="selected-officer-roles">
            ${selectedMainOfficer.roles && selectedMainOfficer.roles.length > 0 ? 
              selectedMainOfficer.roles.map(role => `<span class="selected-officer-role">${role}</span>`).join('') : 
              '<span style="font-style: italic;">Sem cargos</span>'
            }
          </div>
        </div>
        <button class="remove-officer-btn" onclick="removeMainOfficer()" title="Remover">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  } else {
    container.className = 'selected-officer';
    container.innerHTML = `
      <div class="no-selection">
        <i class="fas fa-user-plus"></i>
        <span>Nenhum policial principal selecionado</span>
      </div>
    `;
  }
}

function updateAuxiliaryOfficersDisplay() {
  const container = document.getElementById('selected-auxiliary-officers');
  
  if (selectedAuxiliaryOfficers.length > 0) {
    container.className = 'selected-officers-list has-selection';
    container.innerHTML = selectedAuxiliaryOfficers.map((officer, index) => `
      <div class="selected-officer-item">
        <img src="${officer.avatar}" alt="${officer.displayName}" class="selected-officer-avatar" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iMTgiIGZpbGw9IiM2MzYzNzAiLz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeD0iOCIgeT0iOCI+CjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K'">
        <div class="selected-officer-info">
          <div class="selected-officer-name">${officer.displayName}</div>
          <div class="selected-officer-roles">
            ${officer.roles && officer.roles.length > 0 ? 
              officer.roles.map(role => `<span class="selected-officer-role">${role}</span>`).join('') : 
              '<span style="font-style: italic;">Sem cargos</span>'
            }
          </div>
        </div>
        <button class="remove-officer-btn" onclick="removeAuxiliaryOfficer(${index})" title="Remover">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
  } else {
    container.className = 'selected-officers-list';
    container.innerHTML = `
      <div class="no-selection">
        <i class="fas fa-users"></i>
        <span>Nenhum policial auxiliar selecionado</span>
      </div>
    `;
  }
}

function removeMainOfficer() {
  selectedMainOfficer = null;
  updateMainOfficerDisplay();
  showNotification("Policial Principal removido", "info");
}

function removeAuxiliaryOfficer(index) {
  const officer = selectedAuxiliaryOfficers[index];
  selectedAuxiliaryOfficers.splice(index, 1);
  updateAuxiliaryOfficersDisplay();
  showNotification(`${officer.displayName} removido dos auxiliares`, "info");
}

function hideSearchResults() {
  const searchResults = document.getElementById('search-results');
  if (searchResults) {
    searchResults.style.display = 'none';
  }
}

function clearSearchInput() {
  const searchInput = document.getElementById('user-search');
  if (searchInput) {
    searchInput.value = '';
  }
}

// Função para obter IDs dos policiais selecionados (para usar no embed)
function getSelectedOfficersIds() {
  const mainOfficerId = selectedMainOfficer ? selectedMainOfficer.id : null;
  const auxiliaryIds = selectedAuxiliaryOfficers.map(officer => officer.id);
  
  return {
    mainOfficer: mainOfficerId,
    auxiliaryOfficers: auxiliaryIds
  };
}

// Função para obter IDs dos campos manuais (fallback)
function getManualOfficersIds() {
  const mainOfficerId = document.getElementById('id-policial-manual')?.value?.trim() || null;
  const auxiliaryIdsInput = document.getElementById('ids-auxiliares-manual')?.value?.trim() || '';
  const auxiliaryIds = auxiliaryIdsInput
    .split(',')
    .map(id => id.trim())
    .filter(id => id);
  
  return {
    mainOfficer: mainOfficerId,
    auxiliaryOfficers: auxiliaryIds
  };
}

