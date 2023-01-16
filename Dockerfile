FROM node:19
RUN npm install -g nodemon
WORKDIR /inventaristesting
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm","run","devcont"]