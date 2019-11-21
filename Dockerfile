FROM nginx
RUN mkdir /usr/share/nginx/dist
COPY ./dist /usr/share/nginx/dist
EXPOSE 80 443