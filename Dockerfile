FROM node:20

WORKDIR /app

# Copia los archivos de package y el .env
COPY package*.json ./
COPY .env ./

# Copia todo el código fuente en la carpeta src
COPY ./src ./src  

# Si se necesitan instalar paquetes del sistema se debe de usar la línea de abajo
# RUN apt-get update && apt-get install -y 

# Instalación de dependencias
RUN npm install

# Comando para ejecutar la aplicación con nodemon
CMD ["npx", "nodemon", "./src/app.js"]
