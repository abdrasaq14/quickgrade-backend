FROM node:20-alpine

WORKDIR /app

COPY ./ ./

RUN yarn

RUN yarn tsc --init

CMD ["yarn", "dev"]

EXPOSE 3000

