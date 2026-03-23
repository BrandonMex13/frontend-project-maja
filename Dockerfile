FROM node:22-alpine AS nodeProject
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NG_API_URL=http://localhost:3000
RUN cp src/environments/environment.docker.ts src/environments/environment.ts \
  && sed -i "s|__NG_API_URL__|${NG_API_URL}|g" src/environments/environment.ts

RUN npm run build -- --configuration production

RUN if [ -f dist/frontend-project-maja/browser/index.csr.html ]; then \
      cp dist/frontend-project-maja/browser/index.csr.html dist/frontend-project-maja/browser/index.html; \
    fi

FROM nginx:1.27-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=nodeProject /app/dist/frontend-project-maja/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
