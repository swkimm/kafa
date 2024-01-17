import Sidebar from '@/components/sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

const ConsoleLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full bg-gray-100/90">
      <Sidebar>
        <Outlet />
      </Sidebar>
    </div>
  )
}

export default ConsoleLayout
