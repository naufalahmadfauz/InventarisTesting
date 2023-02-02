FROM node
#RUN npm install -g npm
#RUN npm install -g nodemon
WORKDIR /inventaristesting
COPY package.json .
RUN npm install
COPY . .
EXPOSE 80
CMD ["npm","start"]