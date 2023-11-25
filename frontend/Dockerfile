FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build

# Expose the port on which the Node.js application will run
EXPOSE 3011

# Command to start the Node.js application
CMD [ "npm", "run", "start" ]
