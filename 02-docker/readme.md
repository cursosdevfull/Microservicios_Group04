## Comandos de Docker

```
docker run hello-world
```

## Docker Mongo

```
docker run -d --name=mongo-server -p 27017:27017 -v mongo-data:/data/db -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=ElMund03sanch0 mongo
```
