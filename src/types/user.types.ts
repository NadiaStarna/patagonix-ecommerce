export type UserRole = 'customer' | 'admin'

export interface AppUser {
  uid: string        
  email: string        
  displayName: string  
  role: UserRole       
  createdAt: Date       
}