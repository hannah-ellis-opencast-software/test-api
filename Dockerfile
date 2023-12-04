FROM node:current-alpine

COPY package.json .
RUN npm i

COPY tsconfig.json .
COPY src ./src
RUN npx tsc

COPY keys.json .
COPY employees.json .

CMD node dist/main.js