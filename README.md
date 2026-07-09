# Patagonix E-Commerce

Plataforma de e-commerce desarrollada como Proyecto Integrador del Módulo 5 - Especialización Frontend en Henry.

## Contexto del proyecto

Patagonix Tech es una software factory especializada en aplicaciones web para retail. Este proyecto implementa una plataforma de e-commerce que permite a usuarios finales comprar productos online, con un panel de administración robusto para gestionar catálogo y órdenes.

La aplicación soporta dos tipos de usuarios:
- **Clientes**: navegan el catálogo, agregan productos al carrito, marcan favoritos y realizan compras
- **Administradores**: gestionan productos y órdenes desde un panel protegido

## 🚀 Demo en producción

**URL**: [https://patagonix-ecommerce.vercel.app](https://patagonix-ecommerce.vercel.app)

## 🔑 Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | test@test.com | 123456 |
| Cliente | Registrarse normalmente desde la app | |

## 🛠️ Stack tecnológico

### Frontend
- React 18 + TypeScript + Vite
- React Router (navegación)
- TailwindCSS v4 (estilos)
- Context API + useReducer (estado global)
- lucide-react (iconografía)

### Backend / Servicios
- Firebase Authentication (registro, login, roles)
- Firebase Firestore (base de datos NoSQL, con `FirestoreDataConverter` para tipado de lectura/escritura)
- AWS S3 (almacenamiento de imágenes)
- Vercel Serverless Functions (generación de presigned URLs)

### Testing
- Vitest (test runner)
- React Testing Library

### Deployment
- Vercel (hosting + CI/CD)
- GitHub (control de versiones)

## 🏗️ Decisiones arquitectónicas

### Estructura de carpetas por capas técnicas
src/

├── components/     # Componentes reutilizables (common/ y layout/)

├── contexts/       # Estado global: auth, cart, favorites, products, toast

├── layouts/        # MainLayout y AdminLayout

├── pages/          # Páginas por dominio (admin, auth, cart, checkout, etc.)

├── routes/         # AppRouter, ProtectedRoute y constantes de rutas

├── services/       # Comunicación con Firebase y AWS (única capa que habla con externos)

│   └── converters/ # FirestoreDataConverter para tipado completo

├── test/           # Utilidades de testing: fixtures, mocks, helpers

├── types/          # Interfaces TypeScript de todas las entidades del negocio

└── utils/          # Utilidades: mensajes de error, seed de productos

Se eligió estructura por capas técnicas sobre feature-based por claridad didáctica y alineación con la guía de la cátedra. Cada capa tiene una responsabilidad única: `services/` es la única capa que habla con Firebase y AWS, `contexts/` maneja el estado global, `pages/` orquesta la UI.

### Context API + useReducer para el carrito
El carrito usa `useReducer` en lugar de `useState` porque maneja 5 acciones distintas con lógica interdependiente (`ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`, `LOAD_FROM_STORAGE`). El reducer es una función pura — dado el mismo estado y la misma acción, siempre devuelve el mismo resultado — lo que lo hace predecible y fácil de testear de forma aislada sin renderizar componentes.

### Contextos separados por responsabilidad
- `AuthContext` — identidad del usuario y rol
- `CartContext` — carrito con useReducer y persistencia en localStorage
- `FavoritesContext` — favoritos persistidos en Firestore
- `ProductsContext` — catálogo con paginación, filtros y debounce
- `ToastContext` — notificaciones globales

### Paginación con cursor de Firestore
En lugar de paginación por offset, se implementó paginación con cursor usando `limit()` + `startAfter()`. El último documento de cada página se guarda como cursor en un `useRef` (sin disparar re-renders). Cuando el usuario hace click en "Cargar más", la siguiente query parte desde ese cursor. Esto es más eficiente porque Firestore no re-lee documentos anteriores.

### Snapshot de items en órdenes
Las órdenes guardan un snapshot completo de cada item (nombre, precio, imagen) al momento de la compra, no una referencia al producto. Esto garantiza que el historial de órdenes siempre muestre el precio y descripción correctos, incluso si el producto fue modificado o eliminado después.

## 🎨 Identidad visual

La paleta de la app se construye sobre un degradé de marca (violeta atardecer → naranja arcilla → grafito), inspirado en la luz del amanecer sobre la cordillera patagónica. Este degradé se repite de forma consistente en:

- El fondo del **Hero** de la home, superpuesto sobre una fotografía real de montaña (banco de imágenes libre, Unsplash) con animación de estrellas titilando.
- Las pantallas de **Login y Register**, con un tratamiento *glassmorphism* (tarjeta semi-transparente con `backdrop-blur`) sobre la misma fotografía.
- Acentos puntuales, como el botón "Agregar al carrito" en las tarjetas de producto, que usa un degradé con los mismos dos colores extremos del Hero para mantener coherencia visual en toda la app.

Esta decisión busca que la identidad de marca no viva solo en el logo, sino que se sienta en cada punto de contacto — login, home y catálogo — sin depender de una sola paleta plana de colores sólidos.

## 🔐 Flujo de autenticación y roles

1. El usuario se registra con email/password o Google
2. `AuthProvider` crea un documento en Firestore `users/{uid}` con `role: 'customer'`
3. Al iniciar sesión, `onAuthStateChanged` lee ese documento para obtener el rol
4. `ProtectedRoute` verifica autenticación y rol antes de mostrar cada página
5. Para hacer a alguien admin: cambiar `role` a `'admin'` directamente en Firestore

## 📦 Flujo de upload de imágenes a S3

Las credenciales de AWS **nunca llegan al frontend**. El flujo es:
Frontend → solicita presigned URL → Vercel Serverless Function

Vercel Function → genera URL temporal firmada con credenciales AWS → devuelve al frontend

Frontend → sube imagen directamente a S3 usando la presigned URL

S3 → devuelve URL pública de la imagen → se guarda en Firestore

Una presigned URL es una URL temporal (5 minutos de expiración) que autoriza una operación específica (PUT de un archivo) sin compartir las credenciales de AWS. La Serverless Function vive en `api/get-presigned-url.ts`.

## 🧪 Testing

41 tests distribuidos en:

| Archivo | Tests | Qué cubre |
|---|---|---|
| `cartReducer.test.ts` | 10 | Cada acción del reducer |
| `useCart.test.tsx` | 5 | Hook con renderHook |
| `useAuth.test.tsx` | 5 | Hook con renderHook |
| `ProductCard.test.tsx` | 6 | Componente reutilizable |
| `CartPage.test.tsx` | 4 | Página con integración |
| `CheckoutPage.test.tsx` | 1 | Prevención de doble submit |
| `smoke.test.tsx` | 4 | Render sin errores |
| `checkoutFlow.test.tsx` | 6 | Flujo de checkout |

Firebase está mockeado con `vi.mock()` — los tests no hacen llamadas reales. Se creó un wrapper `AllProviders` en `test-utils.tsx` que envuelve con todos los contexts necesarios.

## ⚙️ Variables de entorno

### `.env` (desarrollo local — no subir al repo)
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
```

Las variables con prefijo `VITE_` son accesibles desde el frontend. Las variables de AWS **no llevan prefijo** porque solo se usan en las Vercel Serverless Functions — nunca llegan al navegador.

## 🚀 Instalación y configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/NadiaStarna/patagonix-ecommerce.git
cd patagonix-ecommerce
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Firebase
1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Authentication (Email/Password + Google)
3. Crear base de datos Firestore
4. Copiar credenciales del proyecto a `.env`

### 4. Configurar AWS S3
1. Crear bucket en AWS S3
2. Configurar CORS en el bucket
3. Crear usuario IAM con permisos de S3
4. Copiar credenciales a `.env`

### 5. Configurar variables de entorno en Vercel
- Las variables `VITE_*` van en el entorno de producción
- Las variables de AWS van como variables de entorno de las Serverless Functions

### 6. Correr en desarrollo
```bash
npm run dev
```

### 7. Correr tests
```bash
npm run test
```

## 🔏 Seguridad

- `.env` está en `.gitignore` — nunca se sube al repositorio
- Las credenciales de AWS solo existen en las Vercel Serverless Functions
- Las reglas de Firestore validan roles del lado del servidor
- Las rutas protegidas validan rol tanto en el frontend (`ProtectedRoute`) como en Firestore

## 📊 Extra Credit

✅ **Paginación de productos** — implementada con cursor de Firestore (`limit()` + `startAfter()`), cargando 8 productos por página.

## 🤖 Bitácora de uso de IA

Ver [docs/uso-de-ia/README.md](./docs/uso-de-ia/README.md)

## 👤 Autora

Nadia Starna - 