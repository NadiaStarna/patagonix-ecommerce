import type { LucideIcon } from 'lucide-react'

interface AdminPlaceholderPageProps {
  icon: LucideIcon
  title: string
  description: string
}

export const AdminPlaceholderPage = ({ icon: Icon, title, description }: AdminPlaceholderPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-2xl shadow-sm">
      <div className="w-14 h-14 rounded-full bg-fog flex items-center justify-center mb-4">
        <Icon size={24} className="text-glacier" />
      </div>
      <h1 className="text-xl font-bold text-stone mb-2">{title}</h1>
      <p className="text-sm text-gray-500 max-w-sm">{description}</p>
      <span className="mt-4 text-xs text-gray-400 bg-fog px-3 py-1 rounded-full">Próximamente</span>
    </div>
  )
}