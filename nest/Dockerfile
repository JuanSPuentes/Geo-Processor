FROM node:20-alpine
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build
ENV NODE_ENV=production
ENV PYTHON_SERVICE_URL=http://fastapi:8000
ENV PORT=3001
EXPOSE 3001
CMD ["npm", "run", "start"] 