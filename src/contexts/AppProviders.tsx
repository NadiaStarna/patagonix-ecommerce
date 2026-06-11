import { AuthProvider } from './auth'

interface AppProvidersProps {
  children: React.ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}