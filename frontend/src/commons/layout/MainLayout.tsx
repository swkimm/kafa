import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import { Outlet } from 'react-router-dom'

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header />
      <div className="pt-15 flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
