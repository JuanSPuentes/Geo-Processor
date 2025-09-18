FROM node:20-alpine
WORKDIR /app
COPY package.json next.config.js ./
RUN npm install --omit=dev
COPY app ./app
RUN npm run build
ENV NODE_ENV=production
ENV NEST_URL=http://nest:3001
EXPOSE 3000
CMD ["npm", "run", "start"]