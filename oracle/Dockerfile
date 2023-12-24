FROM node:18.10.0-alpine3.15

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache python3 make g++

RUN yarn && yarn add bcrypt --force

# setting env to prod removes cli for mikroorm
#TODO CIBUILD SHOULD do w/ env production
#ENV NODE_ENV=production
COPY . .

EXPOSE 3000

#ENTRYPOINT npm run start:dev
CMD ls -al && npx mikro-orm migration:up && yarn build && yarn start:prod