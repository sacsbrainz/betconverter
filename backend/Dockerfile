FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Install project dependencies
RUN bun install

# Expose the port on which the Node.js application will run
EXPOSE 3011

# Command to start the Node.js application
CMD [ "bun", "dev" ]
