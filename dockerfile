FROM node:lts

RUN mkdir -p /root/build

WORKDIR /root/build

COPY src /root/build/src
COPY package.json /root/build/package.json
COPY tsconfig.json /root/build/tsconfig.json

RUN npm install && npm run build

FROM node:lts
WORKDIR /root/build
COPY --from=0 /root/build/dist /root/build/dist
COPY --from=0 /root/build/package.json /root/build/package.json
COPY --from=0 /root/build/node_modules /root/build/node_modules
COPY tsconfig.json /root/build/tsconfig.json
COPY .env.sample /root/build/.env

EXPOSE 8888
ENTRYPOINT ["npm", "run", "start"]