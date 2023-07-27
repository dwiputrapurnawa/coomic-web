FROM node:18

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENV PORT=3000
ENV MONGODB_URI=mongodb://db:27017/coomicDB
ENV SESSION_SECRET=!BWPWI%ry-;z14~LW~uF/r2rp=*T@7

VOLUME [ "/app/uploads/comics" ]
VOLUME [ "/app/uploads/thumbnails" ]

EXPOSE 3000

CMD ["npm", "start"]