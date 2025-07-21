FROM node:22-alpine AS build
WORKDIR /app
COPY ./ /app/
RUN npm install
ARG API_URL=http://localhost:8080/api
RUN sed -i "s|API_URL|${API_URL}|g" src/environments/environment.ts
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/idsa/browser /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# docker build -f Dockerfile --build-arg API_URL=http://localhost:7070/api -t idsa-front .
# docker run -d -p 80:80 --name idsa-app-web idsa-front