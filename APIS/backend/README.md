API Endpoints Documentation

# Autenticación y Registro de Operarios (Todos las URL de acá son tipo `auth/login`)
--------------------------------------
1. **Registrar un Operario**
  - **URL:** `/register-operator`
  - **Método:** `POST`
  - **Descripción:** Permite registrar un nuevo operario.
  - **Cuerpo de la solicitud:**
  ```json
  {
      "OperatorName": "Nombre",
      "OperatorEmail": "email@ejemplo.com",
      "OperatorPass": "password"
  }
  ```

2. **Login de Operario**
  - **URL:** `/login-operator`
  - **Método:** `POST`
  - **Descripción:** Permite a los operarios autenticarse y recibir un token JWT.
  - **Cuerpo de la solicitud:**
  ```json
  {
      "OperatorEmail": "email@ejemplo.com",
      "OperatorPass": "password"
  }
  ```

# Manejo de Cuenta de Usuario
---------------------------
1. **Eliminar Cuenta de Usuario**
  - **URL:** `/delete-account`
  - **Método:** `DELETE`
  - **Descripción:** Permite al usuario autenticado eliminar su cuenta después de verificar su contraseña.
  - **Requiere Token JWT**

2. **Cambiar Contraseña**
  - **URL:** `/change-password`
  - **Método:** `PUT`
  - **Descripción:** Permite al usuario autenticado actualizar su contraseña.
  - **Requiere Token JWT**

3. **Cambiar Email**
  - **URL:** `/change-email`
  - **Método:** `PUT`
  - **Descripción:** Permite al usuario cambiar su email después de verificar la contraseña actual.
  - **Requiere Token JWT**

# Gestión de Estacionamiento
--------------------------
1. **Obtener Espacios Disponibles**
  - **URL:** `/available-spots`
  - **Método:** `GET`
  - **Descripción:** Retorna el número de espacios de estacionamiento disponibles.

2. **Actualizar Estado de Estacionamiento**
  - **URL:** `/update-parking/:id`
  - **Método:** `PUT`
  - **Descripción:** Cambia el estado de ocupación de un estacionamiento específico.

# Gestión de Vehículos
--------------------
1. **Modificar Vehículo**
  - **URL:** `/updateauto/:id`
  - **Método:** `PUT`
  - **Descripción:** Permite al usuario autenticado modificar los detalles de un vehículo.

2. **Eliminar Vehículo**
  - **URL:** `/deleteauto/:id`
  - **Método:** `DELETE`
  - **Descripción:** Permite al usuario autenticado eliminar un vehículo registrado.

3. **Obtener Vehículos**
  - **URL:** `/getautos`
  - **Método:** `GET`
  - **Descripción:** Retorna todos los vehículos del usuario autenticado.

4. **Agregar Vehículo**
  - **URL:** `/addauto`
  - **Método:** `POST`
  - **Descripción:** Permite al usuario agregar un nuevo vehículo a su cuenta.

# Actualización del Perfil y Plan
-------------------------------
1. **Actualizar Plan de Usuario**
  - **URL:** `/updateplan`
  - **Método:** `PUT`
  - **Descripción:** Permite al usuario autenticado actualizar su plan.
  - **Requiere Token JWT**

2. **Subir Imagen de Perfil o Vehículo**
  - **URL:** `/upload/:type/:vehiculoId?`
  - **Método:** `POST`
  - **Descripción:** Permite subir una imagen de perfil o de vehículo a Cloudinary.
  - **Requiere Token JWT**

3. **Obtener Imagen de Perfil**
  - **URL:** `auth/profile-image`
  - **Método:** `GET`
  - **Descripción:** Retorna la URL de la imagen de perfil del usuario autenticado.

4. **Actualizar Perfil de Usuario**
  - **URL:** `auth/profile`
  - **Método:** `PUT`
  - **Descripción:** Permite al usuario autenticado actualizar su perfil.

# Autenticación y Registro de Usuarios Generales
----------------------------------------------
1. **Registro de Usuario**
  - **URL:** `auth/register`
  - **Método:** `POST`
  - **Descripción:** Permite registrar un nuevo usuario.

2. **Login de Usuario**
  - **URL:** `auth/login`
  - **Método:** `POST`
  - **Descripción:** Permite a los usuarios autenticarse y recibir un token JWT.

# Obtener Perfil de Usuario
-------------------------
1. **Obtener Perfil de Usuario**
  - **URL:** `auth/profile`
  - **Método:** `GET`
  - **Descripción:** Retorna los datos del usuario autenticado, excluyendo la contraseña.

-------------------------
### Endpoints en ParkingRoutes.js Estos utilizan la ruta de `parking/`

1. **Obtener Todas las Reservas (`GET /reservations`)**
   - **Método**: `GET`
   - **URL**: `/reservations`
   - **Descripción**: Obtiene una lista de todas las reservas registradas.
   - **Autorización**: Solo operarios autorizados pueden acceder.
   
2. **Cancelar una Reserva (`PUT /cancel-reservation/:id`)**
   - **Método**: `PUT`
   - **URL**: `/cancel-reservation/:id`
   - **Descripción**: Permite a un operario cancelar una reserva específica cambiando su estado a "cancelada".
   - **Autorización**: Requiere autorización de operario.

3. **Crear una Nueva Reserva (`POST /reservas`)**
   - **Método**: `POST`
   - **URL**: `/reservas`
   - **Descripción**: Crea una nueva reserva con los detalles proporcionados, como la sección, número de espacio, y fechas de reserva.

4. **Obtener Reservas del Usuario (`GET /reservas`)**
   - **Método**: `GET`
   - **URL**: `/reservas`
   - **Descripción**: Retorna las reservas hechas por el usuario autenticado, filtradas por su ID de usuario.
   
5. **Actualizar una Reserva (`PUT /reservas/:id`)**
   - **Método**: `PUT`
   - **URL**: `/reservas/:id`
   - **Descripción**: Actualiza los detalles de una reserva específica si el usuario tiene permiso sobre ella.

6. **Eliminar una Reserva (`DELETE /reservas/:id`)**
   - **Método**: `DELETE`
   - **URL**: `/reservas/:id`
   - **Descripción**: Elimina una reserva específica si pertenece al usuario autenticado.

7. **Obtener Todos los Estacionamientos (`GET /parkings`)**
   - **Método**: `GET`
   - **URL**: `/parkings`
   - **Descripción**: Devuelve una lista de todos los estacionamientos.

8. **Obtener Espacios Disponibles (`GET /available-spots`)**
   - **Método**: `GET`
   - **URL**: `/available-spots`
   - **Descripción**: Calcula y devuelve el número de espacios disponibles (no ocupados).

9. **Actualizar Estado de un Estacionamiento (`PUT /update-parking/:id`)**
   - **Método**: `PUT`
   - **URL**: `/update-parking/:id`
   - **Descripción**: Alterna el estado de ocupación de un estacionamiento específico y emite una actualización en tiempo real a los clientes conectados.

### Emisión en Tiempo Real
- **emitirActualizacionEstacionamientos**: Esta función emite actualizaciones del número de espacios disponibles usando Socket.IO, permitiendo a los clientes conectados recibir información en tiempo real cuando se modifica el estado de un estacionamiento.