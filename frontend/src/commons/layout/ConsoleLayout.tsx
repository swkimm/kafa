// ConsoleLayout.tsx
import ConsoleHeader from '@/components/header/ConsoleHeader'
import Sidebar from '@/components/sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

const ConsoleLayout: React.FC = () => {
  return (
    <div className="flex h-screen">
      <ConsoleHeader />
      <div className="w-1/5 border-r border-gray-200 bg-white">
        <Sidebar />
      </div>
      <div className="w-4/5 bg-gray-100 pt-16">
        <Outlet />
      </div>
    </div>
  )
}

export default ConsoleLayout
