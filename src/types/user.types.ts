// Roles posibles en la aplicación
export type UserRole = 'customer' | 'admin'

// Interface del usuario en nuestra app (extiende lo que da Firebase)
export interface AppUser {
  uid: string           // ID único de Firebase Auth
  email: string         // Email del usuario
  displayName: string   // Nombre para mostrar
  role: UserRole        // Rol asignado (lo guardamos en Firestore)
  createdAt: Date       // Fecha de registro
}