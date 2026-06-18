interface LoadingStateProps {
  message?: string
}

export const LoadingState = ({ message = 'Cargando...' }: LoadingStateProps) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-glacier border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  )
}