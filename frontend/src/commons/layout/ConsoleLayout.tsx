import Sidebar from '@/components/sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

const ConsoleLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full">
      <Sidebar>
        <Outlet />
      </Sidebar>
    </div>
  )
}

export default ConsoleLayout
