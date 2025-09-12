# Usar uma imagem base leve do Nginx
FROM nginx:alpine

# Remover a configuração padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copiar nosso arquivo de configuração personalizado
COPY nginx.conf /etc/nginx/conf.d/