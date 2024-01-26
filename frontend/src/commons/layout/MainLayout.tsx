import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

const MainLayout: React.FC = () => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <div className={`flex-grow ${isHomePage ? 'pt-0' : 'pt-16 lg:pt-20'}`}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
