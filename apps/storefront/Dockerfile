FROM node:22-alpine AS build
ARG VITE_API_BASE_URL=http://localhost:8080/api/v1
ARG VITE_STRIPE_ENABLED=false
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_STRIPE_ENABLED=$VITE_STRIPE_ENABLED
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/storefront/package.json apps/storefront/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN npm ci

COPY . .
RUN npm run build --workspace=apps/storefront

FROM nginx:1.27-alpine
COPY apps/storefront/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/storefront/dist /usr/share/nginx/html

EXPOSE 80
