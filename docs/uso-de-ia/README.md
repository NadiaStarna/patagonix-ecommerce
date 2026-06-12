# 🤖 Documentación del Uso de IA y Bitácora

A lo largo del desarrollo del Proyecto Integrador se utilizó IA (Claude, de Anthropic) como herramienta de apoyo para planificación de arquitectura, validación de decisiones técnicas, debugging y generación de tests.

Es importante destacar que:
- La IA no tomó las decisiones finales por sí sola.
- Cada recomendación fue evaluada críticamente antes de implementarse.
- El objetivo fue aprender los conceptos, no solo copiar código.

A continuación se documentan 5 momentos clave del desarrollo.

---

## 1. Decisión de arquitectura: estructura de carpetas

**Contexto**: Al iniciar el proyecto, existían varias formas válidas de organizar el código (por capas técnicas, por features, o híbrida).

**Consulta realizada**: Se consultó sobre las ventajas y desventajas de cada enfoque, comparando con la estructura sugerida por la cátedra.

**Aprendizaje y decisión**: Se entendió que la estructura por capas técnicas es más simple de navegar para un proyecto de aprendizaje, mientras que feature-based escala mejor en proyectos grandes pero agrega complejidad innecesaria al inicio. Se adoptó la estructura por capas siguiendo el criterio de la cátedra, priorizando claridad didáctica.

**Captura**:

`![Decisión de arquitectura](./capturas/01-arquitectura.png)`

---

## 2. useReducer vs useState para el carrito

**Contexto**: El carrito de compras necesita manejar múltiples acciones (agregar, eliminar, actualizar cantidad, limpiar).

**Consulta realizada**: Se preguntó por qué usar `useReducer` en lugar de múltiples `useState`, y qué ventajas ofrece para este caso específico.

**Aprendizaje y decisión**: Se comprendió que `useReducer` centraliza la lógica en una función pura (mismo input → mismo output), lo que hace el código más predecible y mucho más fácil de testear de forma aislada, sin necesidad de renderizar componentes. Se implementó el `cartReducer` con un switch para cada acción (`ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`).

**Captura**:

`![useReducer vs useState](./capturas/02-usereducer.png)`

---

## 3. Flujo de presigned URLs para S3

**Contexto**: La consigna requería subir imágenes de productos a AWS S3 sin exponer las credenciales de AWS en el frontend.

**Consulta realizada**: Se solicitó una explicación del concepto de presigned URLs y por qué este enfoque es más seguro que subir la imagen directamente desde el cliente.

**Aprendizaje y decisión**: Se entendió que una presigned URL es una URL temporal firmada por el servidor (que sí tiene las credenciales) que autoriza una operación específica (PUT) sin compartir esas credenciales. El frontend solo recibe esa URL temporal y sube el archivo directamente a S3. Esto se implementó mediante una Vercel Serverless Function (`api/get-presigned-url.ts`) que usa `@aws-sdk/s3-request-presigner`, generando URLs con expiración de 5 minutos.

**Captura**:

`![Presigned URLs](./capturas/03-presigned-urls.png)`

---

## 4. Debugging: el carrito se vaciaba antes de redirigir al detalle de la orden

**Contexto**: Al confirmar una compra, la orden se creaba correctamente en Firestore, pero la app redirigía al carrito vacío en lugar de mostrar el detalle de la orden recién creada.

**Consulta realizada**: Se describió el síntoma (la orden existía en Firestore pero la UI mostraba "carrito vacío") y se pidió ayuda para identificar la causa.

**Aprendizaje y decisión**: Se identificó que `clearCart()` se ejecutaba antes que `navigate()`, provocando que React re-renderizara el componente con `items.length === 0` y redirigiera al carrito antes de completar la navegación a `/orders/:id`. La solución fue reordenar las llamadas: primero `navigate()`, después `clearCart()`. Esto enseñó la importancia del orden de las actualizaciones de estado y la navegación en React.

**Captura**:

`![Debugging checkout](./capturas/04-debugging-checkout.png)`

---

## 5. Mockear Firebase para tests deterministas

**Contexto**: Los componentes y hooks dependían de Firebase (`AuthProvider` se conecta a Firebase Auth al montarse), lo que complicaba testear sin conexión real.

**Consulta realizada**: Se preguntó cómo testear componentes que usan `useAuth`/`useCart` sin que los tests dependan de Firebase real, y qué es `renderHook`.

**Aprendizaje y decisión**: Se aprendió a usar `vi.mock()` para reemplazar los módulos de `firebase/auth` y `firebase/firestore` con funciones falsas, y se creó un wrapper de providers reutilizable (`test-utils.tsx`) que envuelve los componentes con `AuthProvider` y `CartProvider` mockeados. Esto permitió que los 21 tests de la suite corran de forma rápida, determinista y sin conexión a internet.

**Captura**:

`![Mocks de Firebase](./capturas/05-mocks-firebase.png)`