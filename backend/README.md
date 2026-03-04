# Backend - Platform Management System

Este é o backend do sistema de Gerenciamento de Plataformas. O projeto utiliza Node.js, Express, e [Prisma](https://www.prisma.io/) como ORM conectado a um banco de dados PostgreSQL hospedado no [Supabase](https://supabase.com/).

## 🛠 Configuração do Banco de Dados (Supabase)

Durante o desenvolvimento, foi identificado que conexões diretas via **IPv6** (porta `5432`) no Supabase podem falhar em redes locais que suportam apenas IPv4. 

Para contornar esse problema e garantir que o Prisma consiga conectar e realizar as migrações de forma correta, adotamos a estratégia de utilizar o **Connection Pooler** do Supabase (para rotinas e consultas da aplicação) usando a flag `?pgbouncer=true` com `connection_limit=1` no Pooler IPv4, junto do modo de conexão direta (`DIRECT_URL`) utilizando IPv4.

### Exemplo de `.env`

O arquivo `.env` deve ser configurado da seguinte maneira para suportar o IPv4 Connection Pooling do Supabase Serverless:

```env
# Banco de dados transacional usando Pooler IPv4 (Porta 6543)
DATABASE_URL="postgresql://[USER]:[URL-ENCODED-PASSWORD]@[POOLER-SUBDOMAIN].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Conexão direta utilizando o IPv4 Pooler (Porta 5432) essencial para o Prisma CLI realizar as Migrations / Introspections
DIRECT_URL="postgresql://[USER]:[URL-ENCODED-PASSWORD]@[POOLER-SUBDOMAIN].pooler.supabase.com:5432/postgres"

PORT=3000
JWT_SECRET=suachavesecreta
```

**⚠️ Observação Importante sobre Senhas:**
Se a sua senha de banco de dados conter caracteres especiais (como o arroba `@`), certifique-se de realizar o **URL-Encode** do caractere. Exemplo: a senha `service@track26` deve ser preenchida na URL de conexão como `service%40track26`.

## 🚀 Como Rodar o Servidor

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Crie e preencha as variáveis de ambiente no arquivo `.env`.

3. Gere os artefatos do Prisma:
   ```bash
   npx prisma generate
   ```

4. Aplique as migrações do banco (caso necessário):
   ```bash
   npx prisma db push --accept-data-loss
   # ou
   npx prisma migrate dev
   ```

5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
O servidor estará rodando, por padrão, na porta `3000`.
