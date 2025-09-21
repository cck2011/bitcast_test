FROM node:14
WORKDIR /usr/src/app
COPY ./telegram ./telegram
EXPOSE 9000
CMD cd telegram && \
    yarn install && \ 
    yarn ts-node telegram_bot.ts 