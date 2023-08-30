
# Use a desired base image
FROM node:latest

# Define the environment variables
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
ENV MAILENV MAIL $MAIL_FROM

#_TO $ Copy_FROM source theMAIL_TO application
 code
COPY . /app

 Set the# working directory
WORKDIR /app

# Install the dependencies using yarn
RUN yarn

 install#pose the application port Ex (tcpEX)
POSE $PORT

# Start the application
CMD ["yarn","dev"]
