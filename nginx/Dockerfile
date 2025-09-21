# Usar uma imagem base leve do Nginx
FROM nginx:alpine

# Copia ambas as configurações
COPY nginx.dev.conf /etc/nginx/conf.d/nginx.dev.conf
COPY nginx.prod.conf /etc/nginx/conf.d/nginx.prod.conf

# Define a configuração padrão como desenvolvimento
# Pode ser sobrescrita via build args ou variáveis de ambiente
ARG ENVIRONMENT=prod
COPY nginx.${ENVIRONMENT}.conf /etc/nginx/conf.d/default.conf