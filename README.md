# Deploy de Aplicação Estática na AWS S3 🌐☁️

## 💡 Contexto

Nesse processo, eu trabalhei com uma aplicação **estática**, composta apenas por arquivos **HTML, CSS e JavaScript puro**, ou seja, sem frameworks ou build tools (como React ou Vue). O objetivo foi **publicar essa aplicação na nuvem** usando o **Amazon S3**, transformando o bucket em um **servidor web estático**.

---
# Configuração Via Terminal

## 📦 Criação da Conta AWS

Antes de tudo, precisei criar uma conta na AWS. Isso envolveu:

- Acesso ao site: [aws.amazon.com](https://aws.amazon.com/)
- Preenchimento dos dados pessoais e de contato
- **Cadastro de um cartão de crédito ou débito** (obrigatório, mesmo para o plano gratuito)
- Escolha do plano gratuito (Free Tier), que já inclui **5 GB de armazenamento S3**

Depois disso, a conta passou por uma verificação automática e foi ativada após alguns minutos.

---

## 🪣 Criação do Bucket S3

Com a conta criada e o AWS CLI configurado, criei um bucket para receber os arquivos do projeto.

Passos no console da AWS (via navegador):

1. Acesse o serviço **S3**
2. Clique em **"Create bucket"**
3. Defina um nome único global, como `kardappio-menu`
4. Região: selecionei `South America (São Paulo)` (`sa-east-1`)
5. Desmarquei a opção **"Block all public access"** (isso é necessário pra que os arquivos sejam acessíveis via navegador)
6. Ativei a opção de **Static website hosting** mais tarde nas propriedades

---

## 🛠️ Etapas do Deploy

### 1. **Clonei o repositório da aplicação**

```bash
git clone https://github.com/janpereira82/FullStack.git
cd FullStack/Kardappio
```

### 2. **Verifiquei que o projeto era estático**

A pasta `Kardappio` continha apenas arquivos `index.html`, `.css` e `.js`. Por isso, **não foi necessário nenhum build com npm**.

---

### 3. **Configurei o CLI da AWS**

Rodei no terminal:

```bash
aws configure
```

Preenchi com:
- Access Key ID
- Secret Access Key
- Região (`sa-east-1`)
- Output format: `json`

---

### 4. **Subi os arquivos para o S3**

Dentro da pasta do projeto:

```bash
aws s3 sync . s3://kardappio --delete
```

Esse comando sincroniza todos os arquivos da pasta atual com o bucket `kardappio`, deletando do bucket qualquer arquivo que não esteja mais localmente.

---

### 5. **Configurei o bucket como site**

No painel da AWS:
- Abri o bucket `kardappio`
- Aba **Properties**
- Ativei a opção **Static website hosting**
- Configurei:
  - `index.html` como documento principal
  - (opcional) `404.html` como documento de erro

---

### 6. **Acesso final**

A URL gerada pela AWS foi algo como:

```
http://kardappio.s3-website-sa-east-1.amazonaws.com
```

A partir disso, a aplicação ficou **100% online**, hospedada direto no S3, acessível de qualquer lugar.

---

# Configuração via Plataforma AWS

## Passo 1 - Acessar o Console da AWS

Acesse [https://aws.amazon.com/](https://aws.amazon.com/) e faça login. Se ainda não tem uma conta, crie uma.  
Dica: ative alertas de gastos para evitar surpresas.

![Passo 1](aws_prints/stp1.png)

---

## Passo 2 - Acessar o Serviço S3

No console da AWS, procure por **S3** e clique para acessar o serviço.

![Passo 2](aws_prints/stp2.png)

---

## Passo 3 - Criar um Bucket

Clique no botão **Create bucket** para iniciar a criação do bucket.

![Passo 3](aws_prints/stp3.png)

---

## Passo 4 - Configurar Nome e Acesso Público

Escolha um nome único para o bucket (somente letras minúsculas, `.` e `-` permitidos).  
Depois, desça até a seção **Block Public Access settings**, desmarque as opções e confirme que entende os riscos.

![Passo 4](aws_prints/stp4.png)

---

## Passo 5 - Finalizar Criação

Clique em **Create bucket** para concluir a criação.

![Passo 5](aws_prints/stp5.png)

---

## Passo 6 - Fazer Upload dos Arquivos

Clique no nome do bucket criado, depois clique em **Upload**.  
Envie os arquivos do seu site estático (ex: `index.html`, `style.css`, etc). O `index.html` precisa estar na raiz.

![Passo 6](aws_prints/stp6.png)

---

## Passo 7 - Definir Permissões Públicas

Vá na aba **Permissions** do bucket, clique em **Edit** na seção **Bucket policy** e adicione a seguinte política (substitua `nomedoseubucket` pelo nome real do seu bucket):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::nomedoseubucket/*"
      ]
    }
  ]
}
```

Depois, clique em **Save changes**.

![Passo 7](aws_prints/stp7.png)

---

## Passo 8 - Ativar Static Website Hosting

Na aba **Properties**, role até encontrar a opção **Static website hosting** e clique em **Edit**.

![Passo 8](aws_prints/stp8.png)

---

## Passo 9 - Configurar o Hosting

Marque a opção para ativar o hosting, defina a página inicial (ex: `index.html`) e clique em **Save changes**.

![Passo 9](aws_prints/stp9.png)

---

## Passo 10 - Acessar seu Site Estático

Após salvar, uma URL será gerada. Use ela para acessar seu site estático direto do navegador.

![Passo 10](aws_prints/stp10.png)

---

Pronto! Seu site estático está publicado no S3! 🚀

---

## ✅ Conclusão

Esse processo comprovou minha capacidade de:

- Criar e configurar buckets na AWS
- Lidar com permissões e configurações públicas de acesso
- Usar o AWS CLI pra sincronizar arquivos com o S3
- Trabalhar com deploy de aplicações estáticas
- Configurar **Static Website Hosting** corretamente

Esse tipo de operação é essencial pra qualquer dev que queira ter autonomia no deploy de aplicações web!
