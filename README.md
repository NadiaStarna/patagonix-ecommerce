# Patagonix E-Commerce

Plataforma de e-commerce desarrollada como Proyecto Integrador del Módulo 5 - Especialización Frontend en Henry.

## Contexto del proyecto

Patagonix Tech es una software factory especializada en aplicaciones web para retail. Este proyecto implementa una plataforma de e-commerce que permite a usuarios finales comprar productos online, con un panel de administración robusto para gestionar catálogo y órdenes.

La aplicación soporta dos tipos de usuarios:
- **Clientes**: navegan el catálogo, agregan productos al carrito y realizan compras
- **Administradores**: gestionan productos y órdenes desde un panel protegido

## 🚀 Demo en producción

**URL**: [https://patagonix-ecommerce.vercel.app](https://patagonix-ecommerce.vercel.app)

## 🛠️ Stack tecnológico

### Frontend
- React 18 + TypeScript + Vite
- React Router (navegación)
- TailwindCSS v4 (estilos)
- Context API + useReducer (estado global)

### Backend / Servicios
- Firebase Authentication (registro, login, roles)
- Firebase Firestore (base de datos NoSQL)
- AWS S3 (almacenamiento de imágenes)
- Vercel Serverless Functions (generación de presigned URLs)

### Testing
- Vitest (test runner)
- React Testing Library

### Deployment
- Vercel (hosting + CI/CD)
- GitHub (control de versiones)

## 🏗️ Decisiones arquitectónicas

### Estructura por capas técnicas

Se eligió organizar el proyecto por capas técnicas en lugar de por features:
src/
├── components/     → componentes reutilizables (ui, layout, common)
├── pages/          → vistas completas organizadas por dominio
├── contexts/       → estado global (auth, cart)
├── hooks/          → custom hooks
├── services/       → comunicación con Firebase, AWS y APIs
├── routes/         → configuración de navegación
├── layouts/        → estructuras visuales (MainLayout, AdminLayout)
└── types/          → interfaces TypeScript del dominio

**¿Por qué esta estructura?** Es más simple de entender para un proyecto de aprendizaje, facilita ubicar rápidamente cada responsabilidad y permite explicar el propósito del proyecto con solo mirar la estructura de carpetas.

### Context API + useReducer para el carrito

El carrito de compras usa `useReducer` en lugar de `useState` porque maneja múltiples acciones (agregar, eliminar, actualizar cantidad, limpiar) que requieren lógica centralizada y predecible. El reducer es una función pura, lo que lo hace fácil de testear de forma aislada.

Auth y Cart están en **contextos separados** para mantener responsabilidades claras: uno maneja la sesión del usuario, el otro el estado de compra.

### AWS S3 con presigned URLs

Las imágenes de productos se almacenan en S3 en lugar de Firestore porque Firestore no está pensado para almacenar archivos binarios grandes. El upload se realiza mediante presigned URLs generadas por una Vercel Serverless Function, de modo que las credenciales de AWS nunca se exponen en el frontend.

## 📂 Estructura de carpetas completa
patagonix-ecommerce/
├── api/
│   └── get-presigned-url.ts       → Serverless Function para S3
├── src/
│   ├── components/
│   │   ├── common/                → ProductCard, etc.
│   │   └── layout/                → Navbar
│   ├── contexts/
│   │   ├── auth/                  → AuthContext, AuthProvider, useAuth
│   │   ├── cart/                  → CartContext, CartProvider, useCart, cartReducer
│   │   └── AppProviders.tsx
│   ├── hooks/
│   │   └── useProducts.ts
│   ├── layouts/
│   │   ├── MainLayout.tsx
│   │   └── AdminLayout.tsx
│   ├── pages/
│   │   ├── auth/                  → LoginPage, RegisterPage
│   │   ├── products/              → ProductsPage, ProductDetailPage
│   │   ├── cart/                  → CartPage
│   │   ├── checkout/              → CheckoutPage
│   │   ├── orders/                → OrdersPage, OrderDetailPage
│   │   └── admin/                 → AdminProductsPage, AdminOrdersPage, ProductFormPage
│   ├── routes/
│   │   ├── AppRouter.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── routes.ts
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── products.service.ts
│   │   ├── orders.service.ts
│   │   └── upload.service.ts
│   ├── test/
│   │   ├── setup.ts
│   │   ├── test-utils.tsx
│   │   └── mocks/firebase.ts
│   └── types/                     → interfaces TypeScript del dominio
├── .env.example
├── vercel.json
└── vite.config.ts

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/NadiaStarna/patagonix-ecommerce.git
cd patagonix-ecommerce
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiá `.env.example` a `.env` y completá los valores:

```bash
cp .env.example .env
```

#### Obtener credenciales de Firebase

1. Entrá a [console.firebase.google.com](https://console.firebase.google.com)
2. Creá un proyecto nuevo
3. Activá **Authentication** (Email/Password y Google)
4. Creá una base de datos **Firestore** en modo de prueba
5. En **Configuración del proyecto → Tus aplicaciones**, registrá una app web
6. Copiá los valores de `firebaseConfig` a las variables `VITE_FIREBASE_*`

#### Configurar bucket de AWS S3

1. Creá un bucket en S3 (región recomendada: `us-east-2`)
2. Desactivá el bloqueo de acceso público
3. Configurá CORS para permitir `PUT`, `POST`, `GET` desde cualquier origen
4. Configurá una política de bucket que permita lectura pública (`s3:GetObject`)
5. Creá un usuario IAM con permisos `AmazonS3FullAccess` y generá un Access Key

### 4. Variables de entorno necesarias

```env
# Firebase (frontend - prefijo VITE_ requerido)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# AWS (solo backend - sin prefijo VITE_)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
```

⚠️ **Importante**: las variables de AWS nunca llevan prefijo `VITE_` porque no deben ser accesibles desde el navegador.

### 5. Correr el proyecto

```bash
npm run dev
```

## 📤 Flujo de upload de imágenes a S3

El admin selecciona una imagen en el formulario de producto
El frontend solicita una presigned URL a /api/get-presigned-url (Vercel Function)
La Function genera la URL usando las credenciales de AWS (almacenadas en el servidor)
La Function devuelve la presigned URL + la URL pública final
El frontend sube el archivo DIRECTAMENTE a S3 usando la presigned URL (PUT)
El frontend guarda la URL pública del producto en Firestore


Las credenciales de AWS (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) **solo existen en la Serverless Function** y nunca se exponen al navegador. La presigned URL expira a los 5 minutos y solo autoriza la subida de ese archivo específico.

## 🧪 Testing

```bash
npm run test
```

Suite de tests implementada:

| Archivo | Qué testea |
|---------|-----------|
| `cartReducer.test.ts` | Función pura del reducer (6 tests) |
| `useCart.test.tsx` | Custom hook con renderHook (5 tests) |
| `ProductCard.test.tsx` | Componente con providers (6 tests) |
| `CartPage.test.tsx` | Flujo de integración (4 tests) |

Firebase y AWS están mockeados (`src/test/mocks/firebase.ts`) para que los tests sean deterministas y no dependan de servicios externos.

## 🚀 Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run test      # Correr tests con Vitest
npm run preview   # Preview del build de producción
```

## 📦 Deploy

El proyecto está desplegado en Vercel con integración continua desde GitHub. Cada push a `main` dispara un nuevo deploy automático.

El archivo `vercel.json` configura un rewrite para que todas las rutas redirijan a `index.html`, permitiendo que React Router maneje la navegación de la SPA correctamente incluso al recargar rutas internas.

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 🤖 Uso de IA en el desarrollo

Durante el desarrollo se utilizó IA (Claude) como herramienta de apoyo para planificación de arquitectura, validación de decisiones técnicas, debugging y generación de tests.

📄 **[Ver Documentación completa del Uso de la IA y Bitácora](./docs/uso-de-ia/README.md)**

La documentación incluye 5 entradas detalladas con el contexto, las consultas realizadas y las decisiones tomadas a partir de cada interacción, junto con capturas de pantalla del proceso.

### 5. Mockear Firebase para tests deterministas

**Contexto**: Los componentes y hooks dependían de Firebase (`AuthProvider` se conecta a Firebase Auth al montarse), lo que complicaba testear sin conexión real.

**Prompt/consulta**: Se preguntó cómo testear componentes que usan `useAuth`/`useCart` sin que los tests dependan de Firebase real, y qué es `renderHook`.

**Aprendizaje y decisión**: Se aprendió a usar `vi.mock()` para reemplazar los módulos de `firebase/auth` y `firebase/firestore` con funciones falsas, y se creó un wrapper de providers reutilizable (`test-utils.tsx`) que envuelve los componentes con `AuthProvider` y `CartProvider` mockeados. Esto permitió que los 21 tests de la suite corran de forma rápida, determinista y sin conexión a internet.

## 👤 Autora

Nadia Starna - Proyecto Integrador Módulo 5 - Henry