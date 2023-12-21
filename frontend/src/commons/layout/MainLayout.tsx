import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import { useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

const MainLayout: React.FC = () => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header />
      <div className={`flex-grow ${isHomePage ? 'pt-0' : 'pt-16'}`}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
