FROM node:22-alpine AS build
WORKDIR /app
COPY ./ /app/
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/dist/idsa/browser /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# docker build -t idsa-front .
# docker run -d -p 80:80 --name idsa-app-web idsa-front