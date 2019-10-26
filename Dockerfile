FROM node:12

# Create app directory
RUN mkdir -p /webapp/backend
WORKDIR /webapp/backend

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /webapp/backend/

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /webapp/backend/

EXPOSE 3000

CMD [ "npm", "start" ]