FROM node:8

# Create app directory
WORKDIR /usr/src/letter-of-support

# Bundle app source
COPY static static
COPY *.js *.json ./

# Install app dependencies
RUN npm install --production --quiet

EXPOSE 4001

CMD [ "node", "index.js" ]