# 🤖 Documentación del Uso de IA y Bitácora

A lo largo del desarrollo se utilizó IA (Claude, de Anthropic) como apoyo para arquitectura, debugging y generación de tests. Cada recomendación fue evaluada críticamente antes de implementarse; el objetivo fue aprender los conceptos, no solo copiar código.

---

## 1. Decisión de arquitectura: estructura de carpetas

**Contexto**: Al iniciar el proyecto había varias formas válidas de organizar el código (por capas, por features, o híbrida).

**Consulta**: Ventajas y desventajas de cada enfoque comparado con la estructura sugerida por la cátedra.

**Aprendizaje**: La estructura por capas es más simple para proyectos de aprendizaje; feature-based escala mejor pero agrega complejidad innecesaria al inicio. Se adoptó la estructura por capas por claridad didáctica.

[Ver captura: Decisión de arquitectura](./capturas/01-arquitectura.png)

---

## 2. useReducer vs useState para el carrito

**Contexto**: El carrito necesitaba manejar múltiples acciones (agregar, eliminar, actualizar cantidad, limpiar).

**Consulta**: Por qué usar `useReducer` en lugar de múltiples `useState` para este caso.

**Aprendizaje**: `useReducer` centraliza la lógica en una función pura, haciendo el código más predecible y fácil de testear sin renderizar componentes. Se implementó `cartReducer` con acciones `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`.

[Ver captura: useReducer vs useState](./capturas/02-usereducer.png)

---

## 3. Flujo de presigned URLs para S3

**Contexto**: La consigna requería subir imágenes a AWS S3 sin exponer credenciales en el frontend.

**Consulta**: Qué son las presigned URLs y por qué son más seguras que subir directamente desde el cliente.

**Aprendizaje**: Una presigned URL es generada por el servidor (que tiene las credenciales) y autoriza una operación específica con expiración. Se implementó via Vercel Serverless Function (`api/get-presigned-url.ts`) con URLs de 5 minutos de vida.

[Ver captura: Presigned URLs](./capturas/03-presigned-urls.png)

---

## 4. Debugging: el carrito se vaciaba antes de redirigir al detalle de la orden

**Contexto**: Al confirmar una compra, la orden se creaba en Firestore pero la app redirigía al carrito vacío.

**Consulta**: Se describió el síntoma y se pidió ayuda para identificar la causa.

**Aprendizaje**: `clearCart()` se ejecutaba antes que `navigate()`, causando un re-render con `items.length === 0` que redirigía al carrito. La solución fue invertir el orden: primero `navigate()`, después `clearCart()`.

[Ver captura: Debugging checkout](./capturas/04-debugging-checkout.png)

---

## 5. Mockear Firebase para tests deterministas

**Contexto**: Los componentes dependían de Firebase Auth, lo que complicaba testear sin conexión real.

**Consulta**: Cómo testear hooks que usan `useAuth`/`useCart` sin Firebase real, y qué es `renderHook`.

**Aprendizaje**: Se usó `vi.mock()` para reemplazar módulos de Firebase y se creó un wrapper reutilizable (`test-utils.tsx`) con providers mockeados. Los 41 tests corren rápido, de forma determinista y sin internet.

[Ver captura: Mocks de Firebase](./capturas/05-mocks-firebase.png)

---

## 6. Diagnóstico de índices compuestos faltantes en Firestore

**Contexto**: La búsqueda por prefijo en el catálogo fallaba silenciosamente mostrando "no se encontraron productos" sin error visible.

**Consulta**: Se describió el síntoma (categoría funciona, búsqueda no) y se pidió ayuda para diagnosticar.

**Aprendizaje**: Revisando la pestaña Network y agregando `console.error` en el `catch` se expuso el error real: faltaban índices compuestos para `category + nameLower`. Se crearon 3 índices en Firebase Console y se corrigieron productos que no tenían el campo `nameLower`. Un `catch` genérico puede ocultar información crítica.

[Ver captura: Diagnóstico de índices Firestore](./capturas/06-indices-compuestos.png)

---

## 7. Bug de closure obsoleto al revisar `error` del Context tras un `await`

**Contexto**: El patrón `await login(...); if (!error) navigate(...)` a veces navegaba cuando fallaba, o no navegaba cuando era exitoso.

**Consulta**: Por qué revisar el estado `error` del Context justo después de un `await` daba resultados inconsistentes.

**Aprendizaje**: `error` es una variable capturada en el closure del render anterior; `setState` no la actualiza sincrónicamente tras el `await`. La solución fue hacer que `login`/`register` relancen el error con `throw` y manejar la navegación con `try/catch` local, sin depender del estado del Context.

[Ver captura: Bug de closure obsoleto](./capturas/07-closure-bug.png)

---

## 8. Rediseño visual completo: paleta, tipografía y Hero

**Contexto**: La app funcionaba pero tenía un diseño genérico que no transmitía la identidad de una tienda outdoor patagónica.

**Consulta**: Cómo definir una paleta coherente con el concepto "Patagonia/atardecer de montaña" usando variables CSS de Tailwind v4, y cómo estructurar un Hero sin imágenes externas.

**Aprendizaje**: Se usó el bloque `@theme` de Tailwind v4 para definir tokens de diseño como variables CSS reutilizables. El Hero se implementó con un degradado SVG de cordillera dibujado con `<polygon>`, 18 estrellas animadas con `@keyframes twinkle` y tipografía Fraunces (Google Fonts), garantizando carga instantánea. Para la migración de paleta se aprendió a usar `grep` sistemático para no dejar clases huérfanas.

[Ver captura: Rediseño visual](./capturas/08-rediseno-visual.png)