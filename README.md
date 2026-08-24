# "The Knife"

The Knife es una plataforma de gestión de restaurantes que nace de la necesidad que tuvimos sus desarrolladores como ex-hosteleros en sitios donde hemos trabajado anteriormente. Los problemas que solucionamos han sido vividos en nuestras carnes intensamente, por lo que tenemos una amplia visión para ofrecer unas eficaces medidas de acción.
SPA en React (frontend) más una API REST en Flask (backend), con PostgreSQL como base de datos vía SQLAlchemy. El idioma de la interfaz es español.

La aplicación define seis roles de usuario, cada uno con su propio login y dashboard privado:

- **Manager**: administración de la plataforma (alta de restaurantes, CRUD genérico de todas las entidades).
- **Chef**: dueño/responsable de un restaurante — gestiona su carta, recetas, ingredientes, mesas, y da de alta a su equipo (camareros, cocineros, host).
- **Cook** (Cocinero): visualiza y actualiza el estado de los pedidos en cocina.
- **Waiter** (Camarero): gestiona mesas y cierra pedidos en el salón.
- **Host**: gestiona el libro de reservas del restaurante.
- **Client** (Cliente): cuenta pública para comensales — busca restaurantes cercanos y crea reservas.

## Stack tecnológico

**Frontend**
- React 18 (SPA) + Vite como bundler/dev server
- React Router v6 (`createBrowserRouter`) para el ruteo y los guards por rol
- Estado global con React Context + `useReducer` (store propio en `store.js`, sin Redux/Zustand)
- `@vis.gl/react-google-maps` (Google Maps JS API) para geolocalización de restaurantes y búsqueda por cercanía
- Cloudinary (`@cloudinary/react`, `@cloudinary/url-gen`) para subida de imágenes directamente desde el navegador
- ESLint para linting

**Backend**
- Python 3.13 + Flask, organizado en Blueprints por dominio (`src/api/routes/*.py`)
- SQLAlchemy + Flask-SQLAlchemy como ORM, Flask-Migrate/Alembic para migraciones
- PostgreSQL como base de datos (vía `psycopg2-binary`)
- Autenticación con JWT (`flask-jwt-extended`), un token por rol
- Flask-CORS, Flask-Admin, Flask-Swagger
- Integración con la API de Anthropic (Claude) para generar recetas a partir de una foto de un plato y estimar sus calorías (`src/api/routes/ai_recipe.py`)
- Cloudinary (SDK de Python) y Gunicorn para producción

**Infraestructura / herramientas**
- Pipenv para la gestión de dependencias de Python
- `.env` para variables de entorno (ver sección de instalación)
- Pensado para desplegar en Render.com

## Instalación

> Si usas Github Codespaces (recomendado) o Gitpod, el entorno ya viene con Python, Node y PostgreSQL instalados. Si trabajas en local, asegúrate de instalar Python 3.13 y Node 20.

Se recomienda instalar primero el backend. Asegúrate de tener Python 3.13, Pipenv y PostgreSQL.

1. Instala los paquetes de Python: `$ pipenv install`
2. Crea un archivo `.env` a partir de `.env.example`: `$ cp .env.example .env`
3. Completa las variables de entorno necesarias en `.env`:

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL, ej. `postgres://username:password@localhost:5432/example` |
| `JWT_SECRET_KEY` | Clave secreta para firmar los tokens JWT (`flask_jwt_extended`) |
| `ANTHROPIC_API_KEY` | API key de Anthropic, usada por `src/api/routes/ai_recipe.py` para generar recetas y estimar calorías con Claude |
| `VITE_BACKEND_URL` | URL del backend que consume el frontend (sin esta variable, la app muestra una pantalla de error en vez del sitio) |
| `VITE_GOOGLE_MAPS_API_KEY` | API key de Google Maps JS (selector de ubicación del restaurante, búsqueda de restaurantes cercanos) |
| `VITE_CLOUD_NAME` | Cloud name de Cloudinary (subida de imágenes desde el navegador, `upload_preset` sin firmar) |

4. Genera las migraciones si modificaste `./src/api/models.py`: `$ pipenv run migrate`
5. Aplica las migraciones: `$ pipenv run upgrade`
6. Levanta el backend: `$ pipenv run start` (queda escuchando en el puerto 3001)

> Nota: en Codespaces puedes conectarte a psql con: `psql -h localhost -U gitpod example`

### Deshacer una migración

```sh
$ pipenv run downgrade
```

### Poblar la tabla de usuarios (datos de prueba)

```sh
$ flask insert-test-users 5
```

Verás un mensaje como:

```
  Creating test users
  test_user1@test.com created.
  test_user2@test.com created.
  test_user3@test.com created.
  test_user4@test.com created.
  test_user5@test.com created.
  Users created successfully!
```

Para poblar otras entidades de prueba (restaurantes, recetas, etc.), edita la función `insert_test_data` en `src/api/commands.py` y luego ejecuta `$ pipenv run insert-test-data`.

### **Nota importante sobre la base de datos**

Cada entorno de Github Codespace tiene **su propia base de datos**: si trabajan varias personas, cada una tendrá registros distintos, y esos datos **se perderán** al cerrar el entorno. Evita perder tiempo creando registros a mano; automatiza la carga de datos de prueba editando `commands.py` como se indica arriba.

### Instalación manual del frontend

- Asegúrate de usar Node 20 y de haber instalado y levantado el backend antes.

1. Instala los paquetes: `$ npm install`
2. Levanta el servidor de desarrollo de Vite: `$ npm run dev` (puerto 3000)

Otros comandos útiles del frontend:

- `$ npm run build` — build de producción en `dist/`
- `$ npm run lint` — ESLint (`.js`/`.jsx`, cero warnings permitidos)

## Despliegue

El proyecto está pensado para desplegarse en [Render.com](https://4geeks.com/docs/start/deploy-to-render-com).

### Créditos

CocinApp está construido sobre el [boilerplate de React/Flask de 4Geeks Academy](https://github.com/4geeksacademy/), creado originalmente por [Alejandro Sanchez](https://twitter.com/alesanchezr) y colaboradores del [Coding Bootcamp](https://4geeksacademy.com/us/coding-bootcamp) de 4Geeks Academy.
