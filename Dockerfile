FROM node:18-alpine

# Create app directory
WORKDIR /dev7r4nquocbao/backend

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# RUN npm install -g @babel/core @babel/cli
COPY . .
# RUN npm run compress
CMD [ "npm","run","start" ]