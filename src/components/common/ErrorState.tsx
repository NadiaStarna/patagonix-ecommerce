interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export const ErrorState = ({ message = 'Ocurrió un error.', onRetry }: ErrorStateProps) => {
  return (
    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="text-red-700 font-medium hover:underline text-xs">
          Reintentar
        </button>
      )}
    </div>
  )
}