FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

COPY bun.lockb ./

# Install project dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Expose the port on which the Node.js application will run
EXPOSE 3011

# Command to start the Node.js application
CMD [ "bun", "dev" ]
