# Kardappio

Sistema de cardápio digital acessível via QR Code para restaurantes.

## Sobre o Projeto

O Kardappio é uma solução que permite aos clientes de restaurantes acessarem o cardápio digital através da leitura de QR Codes disponíveis nas mesas. O sistema é totalmente estático e hospedado no Amazon S3.

## Estrutura do Projeto

- `index.html`: Página inicial com lista de restaurantes
- `css/`: Estilos do projeto
- `js/`: Scripts JavaScript
- `img/`: Imagens utilizadas no projeto
- `data/`: Dados dos restaurantes e cardápios em formato JSON
- `pages/`: Páginas adicionais (cardápio, sobre, etc.)

## Como Usar

### Executando Localmente

1. Clone o repositório para sua máquina local
2. Navegue até a pasta do projeto
3. Inicie um servidor local. Você pode usar qualquer um dos seguintes métodos:

   **Usando Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Usando Node.js (com http-server):**
   ```bash
   # Instale o http-server globalmente (caso ainda não tenha)
   npm install -g http-server
   # Execute o servidor
   http-server -p 8000
   ```

   **Usando PHP:**
   ```bash
   php -S localhost:8000
   ```

4. Acesse a aplicação no navegador através do endereço: `http://localhost:8000`

### Hospedagem no AWS S3

1. Crie um bucket no Amazon S3
2. Configure o bucket para hospedagem de site estático
3. Faça upload de todos os arquivos do projeto para o bucket
4. Configure as permissões do bucket para acesso público
5. Acesse o site através da URL fornecida pelo S3


1. Escaneie o QR Code disponível na mesa do restaurante
2. Acesse o cardápio digital do restaurante
3. Navegue pelas categorias e itens disponíveis

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5
- Font Awesome
- JSON para armazenamento de dados

## Hospedagem

O projeto é hospedado no Amazon S3 como um site estático.
