FROM node:24-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev
RUN npm install -D tailwindcss @tailwindcss/postcss

COPY public ./public
COPY app ./app
COPY tsconfig.json ./tsconfig.json
COPY next.config.js ./next.config.js
COPY postcss.config.mjs ./postcss.config.mjs
COPY components ./components
COPY lib ./lib

RUN npm run build

ENV NEST_URL=http://nest:3001
EXPOSE 3000
ENV NODE_ENV=development

CMD ["npm", "run", "start"]