/**
 * Kardappio - Sistema de Cardápio Digital
 * qrcodes.js - Script para a página de QR Codes
 */

// Carrega os dados dos restaurantes do arquivo JSON
async function carregarRestaurantes() {
    try {
        const response = await fetch('../data/restaurantes.json');
        const data = await response.json();
        console.log('Dados dos restaurantes carregados:', data);
        return data.restaurantes;
    } catch (error) {
        console.error('Erro ao carregar os restaurantes:', error);
        return [];
    }
}

// Renderiza os QR Codes de todos os restaurantes
async function renderizarQRCodes() {
    const container = document.getElementById('qrcodes-container');
    if (!container) {
        console.error('Elemento qrcodes-container não encontrado');
        return;
    }
    
    // Limpa o conteúdo atual do container
    container.innerHTML = '';
    
    // Carrega os restaurantes
    const restaurantes = await carregarRestaurantes();
    
    // Verifica se há restaurantes para exibir
    if (!restaurantes || restaurantes.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-warning">Nenhum restaurante disponível no momento.</div></div>';
        return;
    }
    
    // Ordena os restaurantes por nome
    const restaurantesOrdenados = [...restaurantes].sort((a, b) => a.nome.localeCompare(b.nome));
    
    // Renderiza os QR Codes para cada restaurante
    restaurantesOrdenados.forEach(restaurante => {
        const col = document.createElement('div');
        col.className = 'col';
        
        // Gera a URL completa para o restaurante
        const url = `${window.location.origin}/pages/restaurante.html?id=${restaurante.id}&showQR=true`;
        
        // Cria o card com o QR Code
        col.innerHTML = `
            <div class="card h-100 shadow-sm text-center">
                <div class="card-body">
                    <h5 class="card-title">${restaurante.nome}</h5>
                    <p class="card-text text-muted">${restaurante.tipo}</p>
                    <div class="qr-code-container my-3">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}" 
                             alt="QR Code para ${restaurante.nome}" 
                             class="img-fluid">
                    </div>
                    <a href="${url}" class="btn btn-outline-primary" target="_blank">
                        <i class="fas fa-external-link-alt me-2"></i>Abrir Cardápio
                    </a>
                </div>
                <div class="card-footer text-muted">
                    <small><i class="fas fa-map-marker-alt me-1"></i>${restaurante.endereco}</small>
                </div>
            </div>
        `;
        
        container.appendChild(col);
    });
}

// Inicializa a página quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', renderizarQRCodes);
