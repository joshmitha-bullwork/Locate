# Use a Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker's cache
COPY package.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port Next.js runs on (default is 3000)
EXPOSE 3000

# Command to start the Next.js development server
CMD ["npm", "run", "dev"]