interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  cta?: React.ReactNode
}

export const EmptyState = ({ icon = '📦', title, description, cta }: EmptyStateProps) => {
  return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="text-lg font-medium">{title}</p>
      {description && <p className="text-sm">{description}</p>}
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  )
}