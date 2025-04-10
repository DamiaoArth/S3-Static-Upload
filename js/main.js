/**
 * Kardappio - Sistema de Cardápio Digital
 * main.js - Script principal
 */

// Carrega os dados dos restaurantes do arquivo JSON
async function carregarRestaurantes() {
    try {
        // Ajusta o caminho relativo com base na página atual
        const path = window.location.pathname;
        const basePath = path.includes('/pages/') ? '../' : '';
        
        const response = await fetch(`${basePath}data/restaurantes.json`);
        const data = await response.json();
        console.log('Dados dos restaurantes carregados:', data); // Log para debug
        return data.restaurantes;
    } catch (error) {
        console.error('Erro ao carregar os restaurantes:', error);
        console.error('URL tentada:', `${window.location.pathname.includes('/pages/') ? '../' : ''}data/restaurantes.json`);
        return [];
    }
}

// Renderiza os cards dos restaurantes em destaque na página inicial
function renderizarRestaurantes(restaurantes) {
    const container = document.getElementById('lista-restaurantes');
    container.innerHTML = '';

    // Filtra apenas restaurantes em destaque para mostrar na página inicial
    const restaurantesDestaque = restaurantes.filter(r => r.destaque);
    
    // Se não houver restaurantes em destaque, mostra os 3 primeiros
    const restaurantesParaMostrar = restaurantesDestaque.length > 0 ? 
                                  restaurantesDestaque : 
                                  restaurantes.slice(0, 3);

    restaurantesParaMostrar.forEach(restaurante => {
        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="card h-100 shadow-sm restaurant-card">
                <img src="${restaurante.imagem}" class="card-img-top" alt="${restaurante.nome}">
                <div class="card-img-overlay d-flex flex-column justify-content-end">
                    <h5 class="card-title">${restaurante.nome}</h5>
                    <p class="card-text">${restaurante.tipo}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <i class="fas fa-star text-warning"></i>
                            <span class="text-white">${restaurante.avaliacao}</span>
                        </div>
                        <a href="pages/restaurante.html?id=${restaurante.id}" class="btn btn-light btn-sm">Ver Cardápio</a>
                    </div>
                </div>
                ${restaurante.destaque ? '<span class="badge bg-warning restaurant-badge">Destaque</span>' : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

// Função removida: gerarQRCode

// Carrega os detalhes de um restaurante específico
async function carregarRestaurante(id) {
    try {
        const restaurantes = await carregarRestaurantes();
        return restaurantes.find(r => r.id === id) || null;
    } catch (error) {
        console.error('Erro ao carregar o restaurante:', error);
        return null;
    }
}

// Carrega o cardápio de um restaurante específico
async function carregarCardapio(restauranteId) {
    try {
        // Ajusta o caminho relativo com base na página atual
        const path = window.location.pathname;
        const basePath = path.includes('/pages/') ? '../' : '';
        
        const response = await fetch(`${basePath}data/cardapios/${restauranteId}.json`);
        const data = await response.json();
        console.log(`Cardápio carregado para ${restauranteId}:`, data); // Log para debug
        return data;
    } catch (error) {
        console.error('Erro ao carregar o cardápio:', error);
        console.error('URL tentada:', `${window.location.pathname.includes('/pages/') ? '../' : ''}data/cardapios/${restauranteId}.json`);
        return { categorias: [] };
    }
}

// Renderiza o cardápio na página do restaurante
function renderizarCardapio(cardapio) {
    const categoriasList = document.getElementById('categorias-lista');
    const itensContainer = document.getElementById('itens-cardapio');
    
    if (!categoriasList || !itensContainer) return;
    
    categoriasList.innerHTML = '';
    itensContainer.innerHTML = '';
    
    // Renderiza as categorias
    cardapio.categorias.forEach((categoria, index) => {
        const li = document.createElement('li');
        li.className = `menu-category ${index === 0 ? 'active' : ''}`;
        li.setAttribute('data-categoria', categoria.id);
        li.innerHTML = `
            <i class="${categoria.icone}"></i> ${categoria.nome}
        `;
        li.addEventListener('click', () => {
            document.querySelectorAll('.menu-category').forEach(el => el.classList.remove('active'));
            li.classList.add('active');
            mostrarItensCategoria(cardapio, categoria.id);
        });
        categoriasList.appendChild(li);
    });
    
    // Mostra os itens da primeira categoria por padrão
    if (cardapio.categorias.length > 0) {
        mostrarItensCategoria(cardapio, cardapio.categorias[0].id);
    }
}

// Esta função foi removida pois o tratamento de erro de imagem é feito diretamente no atributo onerror do elemento img

// Mostra os itens de uma categoria específica
function mostrarItensCategoria(cardapio, categoriaId) {
    const itensContainer = document.getElementById('itens-cardapio');
    itensContainer.innerHTML = '';
    
    const categoria = cardapio.categorias.find(c => c.id === categoriaId);
    if (!categoria) return;
    
    // Ajusta o caminho base das imagens com base na página atual
    const path = window.location.pathname;
    const basePath = path.includes('/pages/') ? '../' : '';
    
    // Cria um array para armazenar as promessas de carregamento de imagens
    const imageLoadPromises = [];
    
    // Primeiro, cria todos os cards sem as imagens
    categoria.itens.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'col menu-item animate-fade-in';
        
        // Cria o caminho correto para a imagem com base na página atual
        const imagemPath = `${basePath}${item.imagem}`;
        
        // Cria um ID único para o elemento de imagem
        const imgId = `img-${categoriaId}-${item.id}`;
        
        // Monta o HTML do card com um placeholder para a imagem
        itemCard.innerHTML = `
            <div class="card h-100 border-0 shadow-sm">
                <div class="position-relative" style="height: 200px;">
                    <div id="spinner-${imgId}" class="spinner-border text-primary position-absolute top-50 start-50 translate-middle" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                    <img 
                        id="${imgId}" 
                        class="card-img-top menu-item-img" 
                        alt="${item.nome}" 
                        style="height: 200px; object-fit: cover; display: none;" 
                        onload="this.style.display='block'; document.getElementById('spinner-${imgId}').style.display='none';" 
                        onerror="this.onerror=null; this.style.display='block'; document.getElementById('spinner-${imgId}').style.display='none'; this.style.backgroundColor='#f8f9fa'; this.style.objectFit='contain';">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${item.nome}</h5>
                    <p class="card-text small">${item.descricao}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="menu-item-price">R$ ${item.preco.toFixed(2)}</span>
                        ${item.destaque ? '<span class="badge bg-warning">Destaque</span>' : ''}
                    </div>
                </div>
            </div>
        `;
        itensContainer.appendChild(itemCard);
        
        // Cria uma promessa para carregar a imagem
        const promise = fetch(imagemPath)
            .then(response => response.text())
            .then(dataUrl => {
                // Verifica se o conteúdo é um Data URL
                if (dataUrl.startsWith('data:')) {
                    // É um Data URL, usa diretamente
                    const imgElement = document.getElementById(imgId);
                    if (imgElement) {
                        imgElement.src = dataUrl;
                        imgElement.style.display = 'block';
                        const spinner = document.getElementById(`spinner-${imgId}`);
                        if (spinner) spinner.style.display = 'none';
                    }
                } else {
                    // Não é um Data URL, usa o caminho do arquivo
                    const imgElement = document.getElementById(imgId);
                    if (imgElement) {
                        imgElement.src = imagemPath;
                        imgElement.style.display = 'block';
                        const spinner = document.getElementById(`spinner-${imgId}`);
                        if (spinner) spinner.style.display = 'none';
                    }
                }
            })
            .catch(error => {
                console.error(`Erro ao carregar imagem ${imagemPath}:`, error);
                // Em caso de erro, mostra o placeholder
                const imgElement = document.getElementById(imgId);
                if (imgElement) {
                    imgElement.src = `${basePath}img/pao-de-queijo.jpg`; // Usa uma imagem existente como padrão
                    imgElement.style.display = 'block';
                    const spinner = document.getElementById(`spinner-${imgId}`);
                    if (spinner) spinner.style.display = 'none';
                }
            });
        
        imageLoadPromises.push(promise);
    });
    
    // Aguarda todas as imagens serem carregadas
    Promise.all(imageLoadPromises)
        .then(() => console.log('Todas as imagens foram carregadas'))
        .catch(error => console.error('Erro ao carregar algumas imagens:', error));
}

// Renderiza a lista completa de restaurantes no modal
function renderizarListaRestaurantes(restaurantes) {
    const container = document.getElementById('lista-todos-restaurantes');
    if (!container) {
        console.error('Elemento lista-todos-restaurantes não encontrado');
        return;
    }
    
    // Limpa o conteúdo atual do container
    container.innerHTML = '';
    
    // Verifica se há restaurantes para exibir
    if (!restaurantes || restaurantes.length === 0) {
        container.innerHTML = '<div class="alert alert-warning">Nenhum restaurante disponível no momento.</div>';
        return;
    }
    
    console.log('Renderizando lista de restaurantes:', restaurantes.length); // Log para debug
    
    // Ordena os restaurantes por nome
    const restaurantesOrdenados = [...restaurantes].sort((a, b) => a.nome.localeCompare(b.nome));
    
    restaurantesOrdenados.forEach(restaurante => {
        const item = document.createElement('a');
        item.className = 'list-group-item list-group-item-action';
        
        // Ajusta o caminho relativo com base na página atual
        const path = window.location.pathname;
        const basePath = path.includes('/pages/') ? '' : 'pages/';
        item.href = `${basePath}restaurante.html?id=${restaurante.id}`;
        
        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="mb-1">${restaurante.nome}</h5>
                    <p class="mb-1">${restaurante.tipo}</p>
                    <small>
                        <i class="fas fa-star text-warning"></i> ${restaurante.avaliacao} · 
                        <i class="fas fa-map-marker-alt text-danger"></i> ${restaurante.endereco}
                    </small>
                </div>
                <span class="btn btn-outline-primary btn-sm">Ver Cardápio</span>
            </div>
        `;
        
        container.appendChild(item);
    });
}

// Inicializa a página com base na URL atual
async function inicializar() {
    const path = window.location.pathname;
    
    // Página inicial
    if (path === '/' || path.includes('index.html')) {
        const restaurantes = await carregarRestaurantes();
        console.log('Restaurantes carregados:', restaurantes); // Log para debug
        renderizarRestaurantes(restaurantes);
        
        // Pré-carrega os dados no modal para evitar problemas de carregamento
        renderizarListaRestaurantes(restaurantes);
        
        // Configura o botão para abrir o modal com a lista de restaurantes
        const btnListarTodos = document.getElementById('btn-listar-todos');
        if (btnListarTodos) {
            btnListarTodos.addEventListener('click', () => {
                // Certifica-se de que os dados estão atualizados antes de mostrar o modal
                renderizarListaRestaurantes(restaurantes);
                
                // Usa o objeto Modal do Bootstrap para abrir o modal
                const modalElement = document.getElementById('restaurantesModal');
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            });
        }
    }
    
    // Página de restaurante específico
    if (path.includes('restaurante.html')) {
        const params = new URLSearchParams(window.location.search);
        const restauranteId = params.get('id');
        
        if (restauranteId) {
            const restaurante = await carregarRestaurante(restauranteId);
            const cardapio = await carregarCardapio(restauranteId);
            
            if (restaurante) {
                // Atualiza os detalhes do restaurante na página
                document.getElementById('restaurante-nome').textContent = restaurante.nome;
                document.getElementById('restaurante-nome-titulo').textContent = restaurante.nome; // Atualiza o título principal
                document.getElementById('restaurante-tipo').textContent = restaurante.tipo;
                document.getElementById('restaurante-avaliacao').textContent = restaurante.avaliacao;
                document.getElementById('restaurante-endereco').textContent = restaurante.endereco;
                document.getElementById('restaurante-telefone').textContent = restaurante.telefone;
                document.getElementById('restaurante-horario').textContent = restaurante.horario;
                
                // Renderiza o cardápio
                renderizarCardapio(cardapio);
                
                // A lógica de QR Code foi removida
            } else {
                // Restaurante não encontrado
                document.getElementById('conteudo-restaurante').innerHTML = `
                    <div class="alert alert-warning">
                        Restaurante não encontrado. <a href="../index.html">Voltar para a página inicial</a>
                    </div>
                `;
            }
        }
    }
}

// Inicia o aplicativo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializar);
