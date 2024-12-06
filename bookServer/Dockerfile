FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
# COPY *.js ./
# COPY middleware/ ./middleware/
# COPY models/ ./models/
# COPY routes/ ./routes/
# COPY views/ ./views/

EXPOSE 3000

CMD ["node", "index.js"]