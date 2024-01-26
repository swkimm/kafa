import Sidebar from '@/components/sidebar/Sidebar'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

const ConsoleLayout: React.FC = () => {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return (
    <div className="flex min-h-screen w-full bg-gray-100/90">
      <Sidebar>
        <Outlet />
      </Sidebar>
    </div>
  )
}

export default ConsoleLayout
