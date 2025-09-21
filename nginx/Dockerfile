# Usar uma imagem base leve do Nginx
FROM nginx:alpine

# Define a configuração padrão como desenvolvimento
# Pode ser sobrescrita via build args ou variáveis de ambiente
ARG ENVIRONMENT=dev
# Copia apenas a configuração correspondente ao ambiente para a pasta ativa do Nginx
COPY nginx.${ENVIRONMENT}.conf /etc/nginx/conf.d/default.conf