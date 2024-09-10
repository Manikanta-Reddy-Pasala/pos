FROM node:16.13.0-buster-slim AS build-step

ENV NODE_ENV production

RUN mkdir /app
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --production
COPY . /app
RUN yarn build

FROM nginx:1.21.0-alpine as production

ENV NODE_ENV production

COPY --from=build-step /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]