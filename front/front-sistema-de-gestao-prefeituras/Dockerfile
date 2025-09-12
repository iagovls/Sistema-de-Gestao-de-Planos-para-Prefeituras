# Etapa 1: A etapa de "Build" (Construtor)
# Usamos uma imagem node mais específica e baseada em Alpine para ser mais leve
FROM node:20-alpine AS builder

# Define o ambiente de trabalho
WORKDIR /app

# Variáveis de ambiente de build (para Next.js injetar no bundle)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copia os arquivos de definição de pacotes
COPY package*.json ./

# Instala TODAS as dependências (incluindo as de desenvolvimento)
RUN npm install

# Copia o resto do código-fonte da aplicação
# (O .dockerignore vai garantir que arquivos desnecessários não entrem)
COPY . .

# Executa o build de produção do Next.js
RUN npm run build


# Etapa 2: A etapa de "Produção" (Final)
# Começamos de uma imagem limpa e muito leve
FROM node:20-alpine

# Define o ambiente de trabalho
WORKDIR /app

# Define a variável de ambiente para produção, o que desativa otimizações do Next.js
ENV NODE_ENV=production

# (Opcional) Disponibiliza a mesma variável no runtime do servidor Next.js
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copia os arquivos de definição de pacotes novamente
COPY package*.json ./

# Instala APENAS as dependências de produção
RUN npm install --production --ignore-scripts --prefer-offline

# Copia os arquivos construídos da etapa "builder"
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expõe a porta que a aplicação vai usar
EXPOSE 3000

# O comando para iniciar a aplicação em produção
CMD ["npm", "start"]
