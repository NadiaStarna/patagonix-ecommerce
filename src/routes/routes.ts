export const ROUTES = {
  // Rutas públicas
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // Rutas de cliente (requieren sesión)
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',

  // Rutas de administrador (requieren rol admin)
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_NEW: '/admin/products/new',
  ADMIN_PRODUCT_EDIT: '/admin/products/:id/edit',
  ADMIN_ORDERS: '/admin/orders',
} as const