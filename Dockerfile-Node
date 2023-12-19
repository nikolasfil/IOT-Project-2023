# Base image
FROM node:18.16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./



# Install dependencies
RUN npm ci


COPY controllers controllers  
COPY model model         
COPY public public     
COPY routes routes   
COPY views views
COPY index.js .



# Expose port
EXPOSE 8080

# Run app
CMD ["npm", "start"]

# docker build -t bilbo .

# docker run -d -p 8080:8080 bilbo

# docker exec -it container_id /bin/sh
