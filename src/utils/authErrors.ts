export const getAuthErrorMessage = (code: string): string => {
  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
    'auth/invalid-credential': 'Email o contraseña incorrectos.',
    'auth/wrong-password': 'Email o contraseña incorrectos.',
    'auth/user-not-found': 'Email o contraseña incorrectos.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-email': 'El formato del email no es válido.',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intentá más tarde.',
    'auth/network-request-failed': 'Error de conexión. Verificá tu internet e intentá de nuevo.',
    'auth/popup-closed-by-user': 'Se cerró la ventana antes de completar el login.',
    'auth/account-exists-with-different-credential':
      'Ya existe una cuenta con ese email usando otro método de login.',
  }

  // Si el código no está mapeado, mostramos un mensaje genérico
  // en lugar de exponer el código técnico al usuario
  return messages[code] ?? 'Ocurrió un error inesperado. Intentá de nuevo.'
}