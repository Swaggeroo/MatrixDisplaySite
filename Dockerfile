FROM node:24.14.0 AS build
LABEL authors="swaggeroo"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
RUN npx svelte-kit sync
RUN npm run build


FROM node:24.14.0
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/build ./build

RUN npm ci --omit dev

EXPOSE 3000

CMD ["node", "build"]