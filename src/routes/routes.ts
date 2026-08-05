export const ROUTES = {
  // Rutas públicas
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/sobre-patagonix',

  // Rutas de cliente (requieren sesión)
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  FAVORITES: '/favorites',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',

  // Rutas de administrador (requieren rol admin)
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_NEW: '/admin/products/new',
  ADMIN_PRODUCT_EDIT: '/admin/products/:id/edit',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_USERS: '/admin/users',
  ADMIN_INVENTORY: '/admin/inventory',
  ADMIN_SETTINGS: '/admin/settings',
} as const