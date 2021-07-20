## RBAC

### Instalar OpenSSL

- Descargarlo desde http://openssl.org

### Generar la llave local

```
openssl genrsa -out sergiohidalgo.key 2048
```

### Generar el CSR

```
openssl req -new -key sergiohidalgo.key -out sergiohidalgo.csr -subj "/CN=sergiohidalgo/O=dev"
```

### Generar el CRT

```
openssl req -x509 -new -nodes -key sergiohidalgo.key -subj "/CN=sergio" -days 10000 -out sergiohidalgo.crt
```

### Registrar el usuario con su certificado

```
kubectl config set-credentials sergiohidalgo --client-certificate=$HOME/.kube/ssl/sergiohidalgo.crt --client-key=$HOME/.kube/ssl/sergiohidalgo.key
```
