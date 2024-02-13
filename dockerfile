FROM node:20-alpine

WORKDIR /app

# Copy package.json and yarn.lock separately to leverage Docker layer caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn

# Copy the rest of the application code
COPY . .

# Initialize TypeScript configuration and compile TypeScript files
RUN yarn && \
    yarn tsc --init && \
    yarn tsc

CMD ["yarn", "dev"]

EXPOSE 3000

