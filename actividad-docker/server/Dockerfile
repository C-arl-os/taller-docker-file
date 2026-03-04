FROM node:20-alpine
WORKDIR /app
copy package*.json ./
RUN npm install
COPY index.js .
expose 5000
CMD ["node", "index.js"]