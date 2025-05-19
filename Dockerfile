FROM node:20-alpine as build

WORKDIR /app

# Definindo argumentos que podem ser passados durante o build
ARG REACT_APP_API_URL
ARG REACT_APP_USE_MOCKS

# Configurando variáveis de ambiente
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_USE_MOCKS=${REACT_APP_USE_MOCKS}

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# Mostrar as variáveis de ambiente no build para verificação
RUN echo "Building with API URL: $REACT_APP_API_URL"
RUN echo "Using mocks: $REACT_APP_USE_MOCKS"

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Copia a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 