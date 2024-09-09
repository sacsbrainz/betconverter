FROM node:18

# Set the working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Install project dependencies
RUN npm install

RUN npm run build

# Expose the port on which the Node.js application will run
EXPOSE 3010

# Command to start the Node.js application
CMD [ "npm", "run", "start" ]
