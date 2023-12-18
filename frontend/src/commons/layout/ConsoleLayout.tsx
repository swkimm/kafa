// ConsoleLayout.tsx
import Sidebar from '@/components/\bsidebar/Sidebar'
import ConsoleHeader from '@/components/header/ConsoleHeader'
import { Outlet } from 'react-router-dom'

const ConsoleLayout: React.FC = () => {
  return (
    <div className="flex h-screen">
      <ConsoleHeader />
      <div className="w-1/5 border-r border-gray-200 bg-white">
        <Sidebar />
      </div>
      <div className="w-4/5 bg-gray-100 p-10">
        <Outlet />
      </div>
    </div>
  )
}

export default ConsoleLayout
