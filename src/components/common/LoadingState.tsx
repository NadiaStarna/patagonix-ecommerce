interface LoadingStateProps {
  message?: string
}

export const LoadingState = ({ message = 'Cargando...' }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  )
}