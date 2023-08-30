# Use a imagem base desejada
FROM node:latest

# Define as variáveis de ambiente
ENV NODE_ENV $NODE_ENV
ENV TAG $TAG
ENV PORT $PORT
ENV LOG_IN_FILE $LOG_IN_FILE
ENV LOG_LEVEL $LOG_LEVEL
ENV APPLICATIONINSIGHTS_CONNECTION_STRING $APPLICATIONINSIGHTS_CONNECTION_STRING
ENV URL $URL
ENV APP_KEY $APP_KEY
ENV CC_REPORT_REFRESH_TIME $CC_REPORT_REFRESH_TIME
ENV MAIL_HOST $MAIL_HOST
ENV MAIL_PORT $MAIL_PORT
ENV MAIL_USER $MAIL_USER
ENV MAIL_PASS $MAIL_PASS
ENV MAIL_TO $MAIL_TO
ENV MAIL_FROM $MAIL_FROM

# Copie o código-fonte da aplicação
COPY . /app

# Defina o diretório de trabalho
WORKDIR /app

# Instale as dependências usando Yarn
RUN yarn install

# Execute o processo de build
RUN yarn build

# Inicie o aplicativo
CMD ["yarn", "start"]