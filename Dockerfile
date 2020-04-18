FROM node:12
ENV HOME /github/workspace

COPY entrypoint.sh /entrypoint.sh
COPY oddish.ts /oddish.ts
COPY package.json /package.json
COPY tsconfig.json /tsconfig.json

RUN npm install
RUN npm run build

ENTRYPOINT ["/entrypoint.sh"]
