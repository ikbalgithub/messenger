FROM node:18
WORKDIR /app
COPY . .
RUN npm install
Run npm run build
CMD ["ng", "serve"]