# taller-docker-file
# Actividad: Contenedores Docker
### Universidad de San Carlos de Guatemala
**Facultad de Ingeniería — Escuela de Ingeniería en Ciencias y Sistemas**
Prácticas Iniciales 2026 ·

---

## Descripción

Este proyecto implementa una aplicación cliente-servidor contenerizada con Docker, que incluye:

- **Servidor**: API REST con Node.js y Express que realiza un CRUD completo de usuarios
- **Cliente**: Aplicación React servida con Nginx
- **Base de datos**: MySQL 8.4 obtenida desde DockerHub

---

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Docker Desktop | Plataforma de contenedores |
| Docker Compose | Orquestación de múltiples contenedores |
| Node.js + Express | Servidor API REST |
| React + Vite | Aplicación cliente |
| Nginx | Servidor HTTP para el cliente |
| MySQL 8.4 | Base de datos relacional |

---

## Estructura del proyecto

```
actividad-docker/
├── server/
│   ├── index.js          # API REST con CRUD de usuarios
│   ├── package.json      # Dependencias del servidor
│   └── Dockerfile        # Imagen del servidor
├── client/
│   ├── src/
│   │   └── App.jsx       # Componente principal React
│   ├── nginx.conf        # Configuración del servidor HTTP
│   ├── Dockerfile        # Imagen del cliente (multi-stage)
│   └── .env              # Variables de entorno del cliente
└── docker-compose.yml    # Orquestación de los 3 servicios
```

---

## Requisitos previos

- Docker Desktop instalado y corriendo
- Node.js y npm instalados
- Cuenta en DockerHub

---

## Instrucciones de uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/actividad-docker.git
cd actividad-docker
```

### 2. Levantar todos los contenedores

```bash
docker compose up -d --build
```

### 3. Verificar que los contenedores están corriendo

```bash
docker compose ps
```

Resultado esperado:

```
actividad-docker-db-1       mysql:8.4    Up    3306/tcp
actividad-docker-server-1   ...server    Up    0.0.0.0:5000->5000/tcp
actividad-docker-client-1   ...client    Up    0.0.0.0:8080->80/tcp
```

### 4. Acceder a la aplicación

| Servicio | URL |
|---|---|
| Cliente React | http://localhost:8080 |
| API Servidor | http://localhost:5000 |
| Health check | http://localhost:5000/health |

---

## Endpoints de la API

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /health | Verificar que el servidor está activo |
| GET | /users | Obtener todos los usuarios |
| GET | /users/:id | Obtener un usuario por ID |
| POST | /users | Crear un nuevo usuario |
| PUT | /users/:id | Actualizar un usuario |
| DELETE | /users/:id | Eliminar un usuario |

### Ejemplo de uso

```bash
# Obtener todos los usuarios
curl.exe http://localhost:5000/users

# Crear un usuario
curl.exe -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Juan Lopez\",\"email\":\"juan@mail.com\"}"
```

---

## Imágenes en DockerHub

Las imágenes están publicadas en DockerHub y pueden descargarse con:

```bash
docker pull tu-usuario/actividad-server:1.0
docker pull tu-usuario/actividad-client:1.0
```

---

## Comandos útiles

```bash
# Apagar los contenedores (mantiene datos)
docker compose down

# Apagar y borrar datos de MySQL
docker compose down -v

# Ver logs del servidor
docker compose logs -f server

# Verificar MySQL desde dentro del contenedor
docker compose exec db mysql -uroot -proot -D dockerdb -e "SELECT * FROM users;"
```

---

## Detener solo algunos contenedores

```bash
# Detener server y client (MySQL sigue corriendo)
docker stop actividad-docker-server-1 actividad-docker-client-1

# Volver a iniciarlos
docker start actividad-docker-server-1 actividad-docker-client-1
```
